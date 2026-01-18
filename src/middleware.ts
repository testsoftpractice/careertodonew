import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt-edge'

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/about',
  '/features',
  '/solutions',
  '/contact',
  '/support',
  '/terms',
  '/privacy',
  '/auth',
  '/forgot-password',
  '/reset-password',
  '/admin/login', // Admin login page
]

// API paths that are public (for browsing data)
const publicApiPaths = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/reset-password/validate-token',
  '/api/admin/login', // Admin login API
  '/api/admin/verify', // Admin verify API
  // Removed: Sensitive endpoints that now require authentication
  // '/api/users', - Now protected
  // '/api/projects', - Now protected
  // '/api/leaderboards', - Now protected
  // '/api/universities', - Now protected
  // '/api/jobs', - Now protected
  // '/api/suppliers', - Now protected
  // '/api/needs', - Now protected
  // '/api/marketplace', - Now protected
  // '/api/marketplace/search', - Now protected
]

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // Allow public paths
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next()
  }

  // Allow public API paths
  if (publicApiPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // For API routes, verify JWT token in Authorization header
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // Token is valid, proceed to protected route
    // Add user info to headers for use in API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId)
    requestHeaders.set('x-user-email', decoded.email)
    requestHeaders.set('x-user-role', decoded.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // For protected page routes, check for session cookie
  const sessionToken = request.cookies.get('session')?.value
  if (!sessionToken) {
    // No session, redirect to auth page
    const redirectUrl = new URL('/auth', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Verify session token
  const decoded = verifyToken(sessionToken)
  if (!decoded) {
    // Invalid session, redirect to auth page
    const redirectUrl = new URL('/auth', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Session is valid, proceed to protected route
  // Set secure cookie for the response
  const response = NextResponse.next()
  response.cookies.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
  return response
}

export const config = {
  matcher: [
    // Exclude Next.js internal files, static files, and API routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
