import { NextRequest, NextResponse } from 'next/server'
import { createOAuthState, OAUTH_STATE_COOKIE } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  if (!clientId) return NextResponse.redirect(new URL('/admin?error=setup', request.url))

  const state = createOAuthState()
  const callback = new URL('/api/admin/auth/callback', process.env.ADMIN_BASE_URL ?? request.nextUrl.origin)
  const authorize = new URL('https://github.com/login/oauth/authorize')
  authorize.searchParams.set('client_id', clientId)
  authorize.searchParams.set('redirect_uri', callback.toString())
  authorize.searchParams.set('scope', 'read:user')
  authorize.searchParams.set('state', state)

  const response = NextResponse.redirect(authorize)
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })
  return response
}
