import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/utils/jwt'
import { hasImmersionAccess } from '@/lib/utils/immersion-access'

const PROTECTED_ROUTES = ['/dashboard', '/learning-path', '/hiragana', '/katakana', '/vocabulary', '/kanji', '/grammar', '/immersion', '/settings', '/onboarding', '/help']
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

    if (pathname.startsWith('/immersion') && !hasImmersionAccess(payload.email)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
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
  matcher: ['/dashboard/:path*', '/learning-path/:path*', '/hiragana/:path*', '/katakana/:path*', '/vocabulary/:path*', '/kanji/:path*', '/grammar/:path*', '/immersion/:path*', '/settings/:path*', '/onboarding/:path*', '/help/:path*', '/login', '/register', '/reset-password'],
}
