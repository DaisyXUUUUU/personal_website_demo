import { NextRequest, NextResponse } from 'next/server'
import { clearAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  clearAdminSession(response)
  return response
}
