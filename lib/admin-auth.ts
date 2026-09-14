import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

const SESSION_COOKIE = 'ziyue_admin_session'
export const OAUTH_STATE_COOKIE = 'ziyue_admin_oauth_state'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

export type AdminSession = {
  login: string
  expiresAt: number
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? ''
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url')
}

export function createOAuthState() {
  return randomBytes(32).toString('base64url')
}

export function createSessionToken(login: string) {
  const payload = Buffer.from(JSON.stringify({ login, expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000 })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function parseSessionToken(token: string | undefined): AdminSession | null {
  if (!token || !getSessionSecret()) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = sign(payload)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AdminSession
    if (!session.login || session.expiresAt <= Date.now()) return null
    return session
  } catch {
    return null
  }
}

export async function getAdminSession() {
  if (process.env.NODE_ENV !== 'production' && process.env.ADMIN_DEV_BYPASS === 'true') {
    return { login: process.env.ADMIN_GITHUB_LOGIN ?? 'local-admin', expiresAt: Date.now() + 3_600_000 }
  }
  const cookieStore = await cookies()
  const session = parseSessionToken(cookieStore.get(SESSION_COOKIE)?.value)
  const allowedLogin = process.env.ADMIN_GITHUB_LOGIN?.toLowerCase()
  if (!session || !allowedLogin || session.login.toLowerCase() !== allowedLogin) return null
  return session
}

export function setAdminSession(response: NextResponse, login: string) {
  response.cookies.set(SESSION_COOKIE, createSessionToken(login), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export function clearAdminSession(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
