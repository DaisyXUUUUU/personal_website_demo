import { NextRequest, NextResponse } from 'next/server'
import { OAUTH_STATE_COOKIE, setAdminSession } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET
  if (!code || !state || !expectedState || state !== expectedState || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/admin?error=oauth', request.url))
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      cache: 'no-store',
    })
    const tokenData = await tokenResponse.json() as { access_token?: string }
    if (!tokenData.access_token) throw new Error('No OAuth token returned')

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${tokenData.access_token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    })
    const user = await userResponse.json() as { login?: string }
    const allowed = process.env.ADMIN_GITHUB_LOGIN
    if (!user.login || !allowed || user.login.toLowerCase() !== allowed.toLowerCase()) {
      return NextResponse.redirect(new URL('/admin?error=forbidden', request.url))
    }

    const response = NextResponse.redirect(new URL('/admin', request.url))
    setAdminSession(response, user.login)
    response.cookies.set(OAUTH_STATE_COOKIE, '', { path: '/', maxAge: 0 })
    return response
  } catch {
    return NextResponse.redirect(new URL('/admin?error=oauth', request.url))
  }
}
