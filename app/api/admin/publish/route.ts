import { createHash, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { publishFilesToGitHub } from '@/lib/github-content'
import { validateSiteContent } from '@/lib/site-content'

export const runtime = 'nodejs'

type UploadManifestItem = {
  field: string
  targetPath: string
}

type Attempt = { count: number; resetAt: number }
const attemptStore = globalThis as typeof globalThis & { ziyuePublishAttempts?: Map<string, Attempt> }
attemptStore.ziyuePublishAttempts ??= new Map()

function commandMatches(command: string) {
  const expected = process.env.ADMIN_PUBLISH_COMMAND_HASH?.trim().toLowerCase()
  if (!expected && process.env.NODE_ENV !== 'production' && process.env.ADMIN_DEV_BYPASS === 'true') return command.length > 0
  if (!expected || !/^[a-f0-9]{64}$/.test(expected)) return false
  const actual = createHash('sha256').update(command).digest('hex')
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
}

function isRateLimited(key: string, succeeded: boolean) {
  const now = Date.now()
  const current = attemptStore.ziyuePublishAttempts!.get(key)
  if (succeeded) {
    attemptStore.ziyuePublishAttempts!.delete(key)
    return false
  }
  if (!current || current.resetAt <= now) {
    attemptStore.ziyuePublishAttempts!.set(key, { count: 1, resetAt: now + 15 * 60_000 })
    return false
  }
  current.count += 1
  return current.count > 5
}

function validTargetPath(path: string) {
  return /^public\/uploads\/(projects|hobbies)\/[a-z0-9][a-z0-9._-]*\.(png|jpe?g|webp|gif)$/i.test(path)
}

function contentHasTemporaryImages(value: unknown) {
  return JSON.stringify(value).includes('blob:') || JSON.stringify(value).includes('data:image/')
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })

  const origin = request.headers.get('origin')
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const form = await request.formData()
  const command = form.get('command')
  const rateKey = `${session.login}:${request.headers.get('x-forwarded-for') ?? 'local'}`
  const commandValid = typeof command === 'string' && commandMatches(command)
  if (!commandValid) {
    const limited = isRateLimited(rateKey, false)
    return NextResponse.json(
      { error: limited ? 'Too many attempts. Please wait 15 minutes.' : 'The publish command is not correct.' },
      { status: limited ? 429 : 403 },
    )
  }
  isRateLimited(rateKey, true)

  const rawContent = form.get('content')
  const rawUploads = form.get('uploads')
  if (typeof rawContent !== 'string' || typeof rawUploads !== 'string') {
    return NextResponse.json({ error: 'The publish request is incomplete.' }, { status: 400 })
  }

  let content: unknown
  let uploads: UploadManifestItem[]
  try {
    content = JSON.parse(rawContent)
    uploads = JSON.parse(rawUploads) as UploadManifestItem[]
  } catch {
    return NextResponse.json({ error: 'The draft data could not be read.' }, { status: 400 })
  }

  if (!validateSiteContent(content) || contentHasTemporaryImages(content)) {
    return NextResponse.json({ error: 'The draft contains invalid or temporary content.' }, { status: 400 })
  }
  if (!Array.isArray(uploads) || uploads.length > 10) {
    return NextResponse.json({ error: 'Too many image uploads.' }, { status: 400 })
  }

  const files = [{ path: 'data/site-content.json', content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`) }]
  let totalBytes = 0
  for (const upload of uploads) {
    if (!upload || typeof upload.field !== 'string' || typeof upload.targetPath !== 'string' || !validTargetPath(upload.targetPath)) {
      return NextResponse.json({ error: 'An image target path is invalid.' }, { status: 400 })
    }
    const value = form.get(upload.field)
    if (!(value instanceof File)) return NextResponse.json({ error: 'An uploaded image is missing.' }, { status: 400 })
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(value.type)) {
      return NextResponse.json({ error: `${value.name} is not a supported image.` }, { status: 400 })
    }
    if (value.size > 8 * 1024 * 1024) return NextResponse.json({ error: `${value.name} is larger than 8 MB.` }, { status: 400 })
    totalBytes += value.size
    if (totalBytes > 25 * 1024 * 1024) return NextResponse.json({ error: 'The combined images are larger than 25 MB.' }, { status: 400 })
    files.push({ path: upload.targetPath, content: Buffer.from(await value.arrayBuffer()) })
  }

  try {
    const published = await publishFilesToGitHub(files, `Update portfolio content via admin (${session.login})`)
    return NextResponse.json({ ok: true, commit: published })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'GitHub publishing failed.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
