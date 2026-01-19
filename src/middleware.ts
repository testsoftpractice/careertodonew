import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt-edge'

// Define public paths that don't require authentication
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
  '/projects',
  '/marketplace',
  '/leaderboards',
  '/jobs',
  '/suppliers',
  '/needs',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

// Define dashboard paths and their required roles
const dashboardPaths: Record<string, string[]> = {
  '/dashboard/student': ['STUDENT', 'MENTOR', 'PLATFORM_ADMIN'],
  '/dashboard/employer': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/dashboard/investor': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/dashboard/university': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/admin': ['PLATFORM_ADMIN'],
}

// Helper function to check if a path is public
function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => pathname.startsWith(path))
}

// Helper function to get required role for a path
function getRequiredRole(pathname: string): string[] | null {
  for (const [basePath, allowedRoles] of Object.entries(dashboardPaths)) {
    if (pathname.startsWith(basePath)) {
      return allowedRoles
    }
  }
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('[MIDDLEWARE] Request:', pathname)

  // Skip static files
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/debug')
  ) {
    return NextResponse.next()
  }

  // Allow public paths
  if (isPublicPath(pathname)) {
    console.log('[MIDDLEWARE] Public path, allowing access:', pathname)
    return NextResponse.next()
  }

  // For protected routes, check authentication
  try {
    // Get token from cookie (named 'session')
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      console.log('[MIDDLEWARE] No session cookie found, redirecting to auth')
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Verify token and get user info
    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId || !decoded.role) {
      console.log('[MIDDLEWARE] Invalid token, redirecting to auth')
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Get required roles for this path
    const requiredRoles = getRequiredRole(pathname)

    if (requiredRoles) {
      // Check if user's role is allowed
      if (!requiredRoles.includes(decoded.role)) {
        console.log(
          '[MIDDLEWARE] Role mismatch:',
          'User role:',
          decoded.role,
          'Required roles:',
          requiredRoles
        )

        // Redirect to appropriate dashboard based on user's role
        const userRole = decoded.role
        let targetPath = '/'

        if (userRole === 'STUDENT' || userRole === 'MENTOR') {
          targetPath = '/dashboard/student'
        } else if (userRole === 'EMPLOYER') {
          targetPath = '/dashboard/employer'
        } else if (userRole === 'INVESTOR') {
          targetPath = '/dashboard/investor'
        } else if (userRole === 'UNIVERSITY_ADMIN') {
          targetPath = '/dashboard/university'
        } else if (userRole === 'PLATFORM_ADMIN') {
          targetPath = '/admin'
        }

        const url = request.nextUrl.clone()
        url.pathname = targetPath
        return NextResponse.redirect(url)
      }

      console.log('[MIDDLEWARE] Role check passed:', decoded.role, '->', pathname)
    }
  } catch (error) {
    console.error('[MIDDLEWARE] Error:', error)
    // On error, redirect to auth
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // All checks passed, allow access
  console.log('[MIDDLEWARE] Access granted:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
