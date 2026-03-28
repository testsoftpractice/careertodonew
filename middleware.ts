import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

// ONLY these routes are publicly accessible (whitelist)
const publicRoutes = [
  '/',
  '/auth',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/about',
  '/features',
  '/solutions',
  '/contact',
  '/terms',
  '/privacy',
  '/payment-verification',
  '/support',
]

// Routes that should be excluded from middleware (static assets, API, etc.)
const excludedRoutes = [
  '/api',
  '/_next',
  '/favicon',
  '/robots',
  '/sitemap',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is excluded (API routes, static files, etc.)
  if (excludedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if route is exactly a public route or starts with a public route
  const isPublicRoute = publicRoutes.some(route => {
    if (pathname === route) return true
    if (pathname.startsWith(route + '/')) return true
    return false
  })

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // All other routes require authentication
  // Get token from cookie
  const token = request.cookies.get('token')?.value

  if (!token) {
    // User has no account (no token) - redirect to auth page
    // Save the intended destination for after login
    return NextResponse.redirect(new URL('/auth?redirect=' + encodeURIComponent(pathname), request.url))
  }

  try {
    // Verify token to check if user has an account
    const decoded = verifyToken(token)

    // Check if token verification failed
    if (!decoded) {
      // Invalid token - redirect to auth page
      return NextResponse.redirect(new URL('/auth?redirect=' + encodeURIComponent(pathname), request.url))
    }

    // User has an account (token is valid)
    // Check if student is verified
    if (decoded.role === 'STUDENT' && decoded.verificationStatus !== 'VERIFIED') {
      // Student has account but is not verified - redirect to payment verification
      // Don't pass redirect param - they should go to dashboard after verification
      return NextResponse.redirect(new URL('/payment-verification', request.url))
    }

    // User is authenticated and verified (or not a student), allow access
    return NextResponse.next()
  } catch (error) {
    console.error('[Middleware] Token verification error:', error)
    // Invalid token - redirect to auth page
    return NextResponse.redirect(new URL('/auth?redirect=' + encodeURIComponent(pathname), request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
