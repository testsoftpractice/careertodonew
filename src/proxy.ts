import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

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
  '/marketplace/projects',
  '/leaderboards',
  '/jobs',
  '/suppliers',
  '/needs',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

// Define all protected routes with their allowed roles
const protectedRoutes: Record<string, string[]> = {
  // Student routes - only students and platform admins
  '/dashboard/student': ['STUDENT', 'PLATFORM_ADMIN'],
  '/dashboard/student/settings': ['STUDENT', 'PLATFORM_ADMIN'],
  '/dashboard/student/profile': ['STUDENT', 'PLATFORM_ADMIN'],
  '/dashboard/student/projects': ['STUDENT', 'PLATFORM_ADMIN'],
  '/dashboard/student/verifications': ['STUDENT', 'PLATFORM_ADMIN'],

  // For employer routes - only employers and platform admins
  '/dashboard/employer': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/dashboard/employer/settings': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/dashboard/employer/profile': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/dashboard/employer/projects': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/dashboard/employer/jobs': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/dashboard/employer/verification-requests': ['EMPLOYER', 'PLATFORM_ADMIN'],

  // Investor routes - only investors and platform admins
  '/dashboard/investor': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/dashboard/investor/settings': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/dashboard/investor/profile': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/dashboard/investor/projects': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/dashboard/investor/investments': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/dashboard/investor/portfolio': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/dashboard/investor/deals': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/dashboard/investor/proposals': ['INVESTOR', 'PLATFORM_ADMIN'],

  // University routes - only university admins and platform admins
  '/dashboard/university': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/dashboard/university/settings': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/dashboard/university/profile': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/dashboard/university/students': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/dashboard/university/projects': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/dashboard/university/departments': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],

  // Platform admin routes - only platform admins
  '/admin': ['PLATFORM_ADMIN'],
  '/admin/settings': ['PLATFORM_ADMIN'],
  '/admin/projects': ['PLATFORM_ADMIN'],
  '/admin/users': ['PLATFORM_ADMIN'],
  '/admin/compliance': ['PLATFORM_ADMIN'],
  '/admin/governance': ['PLATFORM_ADMIN'],
  '/admin/content': ['PLATFORM_ADMIN'],
  '/admin/audit': ['PLATFORM_ADMIN'],

    // Dashboard notifications - all authenticated users
  '/dashboard/notifications': ['STUDENT', 'EMPLOYER', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],

  // Business routes - employers, students, platform admins
  '/business/create': ['EMPLOYER', 'STUDENT', 'PLATFORM_ADMIN'],
  '/businesses': ['STUDENT', 'EMPLOYER', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],

  // API routes that need protection
  '/api/businesses': ['EMPLOYER', 'STUDENT', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/businesses/[id]': ['EMPLOYER', 'STUDENT', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/businesses/[id]/members': ['EMPLOYER', 'STUDENT', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/businesses/[id]/members/[memberId]': ['EMPLOYER', 'STUDENT', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/student': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/student/stats': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/student/courses': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/student/grades': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/student/schedule': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/student/study-time': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/student/achievements': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/student/skills': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/student/mentors': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/student/deadlines': ['STUDENT', 'PLATFORM_ADMIN'],
  '/api/dashboard/employer': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/api/dashboard/employer/stats': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/api/dashboard/employer/jobs': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/api/dashboard/employer/candidates': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/api/dashboard/employer/pipeline': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/api/dashboard/employer/team': ['EMPLOYER', 'PLATFORM_ADMIN'],
  '/api/dashboard/investor': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/api/dashboard/investor/stats': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/api/dashboard/investor/portfolio': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/api/dashboard/investor/deals': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/api/dashboard/investor/startups': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/api/dashboard/investor/financial': ['INVESTOR', 'PLATFORM_ADMIN'],
  '/api/dashboard/university': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/stats': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/departments': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/research': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/funding': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/students': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/projects': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/activity': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/departments': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/performance': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/dashboard/university/approvals': ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/admin': ['PLATFORM_ADMIN'],
  '/api/admin/users': ['PLATFORM_ADMIN'],
  '/api/admin/projects': ['PLATFORM_ADMIN'],
  '/api/admin/universities': ['PLATFORM_ADMIN'],
  '/api/admin/compliance': ['PLATFORM_ADMIN'],
  '/api/admin/governance': ['PLATFORM_ADMIN'],
  '/api/admin/content': ['PLATFORM_ADMIN'],
  '/api/admin/audit': ['PLATFORM_ADMIN'],
  '/api/dashboard/admin/platform': ['PLATFORM_ADMIN'],
  '/api/dashboard/admin/system': ['PLATFORM_ADMIN'],
  '/api/dashboard/admin/security': ['PLATFORM_ADMIN'],
  '/api/dashboard/admin/users': ['PLATFORM_ADMIN'],
  '/api/investments': ['INVESTOR', 'EMPLOYER', 'STUDENT', 'PLATFORM_ADMIN'],
  '/api/jobs': ['EMPLOYER', 'STUDENT', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/projects': ['EMPLOYER', 'STUDENT', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/tasks': ['EMPLOYER', 'STUDENT', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
  '/api/users': ['EMPLOYER', 'STUDENT', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'],
}

// Helper function to check if a path is public
function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => pathname.startsWith(path))
}

// Helper function to get allowed roles for a path
function getAllowedRoles(pathname: string): string[] | null {
  // Find the most specific matching route
  for (const [basePath, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(basePath)) {
      return allowedRoles
    }
  }
  return null
}

// Helper function to get the appropriate dashboard path for a user role
function getDashboardForRole(role: string): string {
  const roleDashboardMap: Record<string, string> = {
    'STUDENT': '/dashboard/student',
    'EMPLOYER': '/dashboard/employer',
    'INVESTOR': '/dashboard/investor',
    'UNIVERSITY_ADMIN': '/dashboard/university',
    'PLATFORM_ADMIN': '/admin',
  }
  return roleDashboardMap[role] || '/'
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('=== MIDDLEWARE ===')
  console.log('[MIDDLEWARE] Path:', pathname)

  // Skip static files and API routes that don't need protection
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
    console.log('[MIDDLEWARE] ✅ Public path - allowing:', pathname)
    return NextResponse.next()
  }

  // For protected routes, check authentication and authorization
  const allowedRoles = getAllowedRoles(pathname)

  if (allowedRoles) {
    console.log('[MIDDLEWARE] 🔒 Protected route:', pathname)
    console.log('[MIDDLEWARE] Allowed roles:', allowedRoles.join(', '))

    try {
      // Get token from cookie
      const sessionCookie = request.cookies.get('session')
      const token = sessionCookie?.value

      if (!token) {
        console.log('[MIDDLEWARE] ❌ No token - redirecting to auth')
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
      }

      // Verify token
      const decoded = verifyToken(token)

      if (!decoded || !decoded.userId || !decoded.role) {
        console.log('[MIDDLEWARE] ❌ Invalid token - redirecting to auth')
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
      }

      console.log('[MIDDLEWARE] 👤 User:', decoded.userId, 'Role:', decoded.role)

      // Check if user's role is allowed for this route
      if (!allowedRoles.includes(decoded.role)) {
        console.log('[MIDDLEWARE] ❌ ACCESS DENIED - Wrong role')
        console.log('[MIDDLEWARE] User role:', decoded.role)
        console.log('[MIDDLEWARE] Required roles:', allowedRoles.join(', '))

        // Redirect to user's appropriate dashboard
        const targetPath = getDashboardForRole(decoded.role)
        console.log('[MIDDLEWARE] 🔄 Redirecting to:', targetPath)

        const url = request.nextUrl.clone()
        url.pathname = targetPath
        return NextResponse.redirect(url)
      }

      console.log('[MIDDLEWARE] ✅ ACCESS GRANTED:', decoded.role, '->', pathname)
      return NextResponse.next()

    } catch (error) {
      console.error('[MIDDLEWARE] ❌ Error:', error)
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  // For any other path not explicitly defined, require authentication but no specific role check
  console.log('[MIDDLEWARE] ⚠️  Undefined route - requiring auth only')
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      console.log('[MIDDLEWARE] ❌ No token - redirecting to auth')
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      console.log('[MIDDLEWARE] ❌ Invalid token - redirecting to auth')
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    console.log('[MIDDLEWARE] ✅ Auth valid for undefined route')
    return NextResponse.next()

  } catch (error) {
    console.error('[MIDDLEWARE] ❌ Error:', error)
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
