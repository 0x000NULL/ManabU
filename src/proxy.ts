import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/utils/jwt'

const PROTECTED_ROUTES = ['/dashboard', '/learning-path', '/hiragana', '/katakana', '/vocabulary', '/grammar', '/immersion', '/settings']
const AUTH_ROUTES = ['/login', '/register', '/reset-password']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access_token')?.value

  const isProtected = PROTECTED_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + '/')
  )
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route)

  if (isProtected) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const payload = verifyAccessToken(accessToken)
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (isAuthRoute && accessToken) {
    const payload = verifyAccessToken(accessToken)
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/learning-path/:path*', '/hiragana/:path*', '/katakana/:path*', '/vocabulary/:path*', '/grammar/:path*', '/immersion/:path*', '/settings/:path*', '/login', '/register', '/reset-password'],
}
