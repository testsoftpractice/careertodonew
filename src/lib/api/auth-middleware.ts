import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

// User type for authentication
export interface AuthUser {
  id: string
  email: string
  role: string
  sub: string
}

// Public paths that don't require authentication
const PUBLIC_PATH_PREFIXES = [
  '/',           // Homepage
  '/about',      // About page
  '/features',   // Features page
  '/solutions',  // Solutions page
  '/contact',    // Contact page
  '/terms',      // Terms of service
  '/privacy',    // Privacy policy
  '/auth',       // Auth pages (login, signup, forgot-password)
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some(
    (path) =>
      pathname === path || pathname.startsWith(`${path}/`)
  )
}

/**
 * Extract user from request (from JWT token in cookie or header)
 */
export function getUserFromRequest(request: NextRequest): AuthUser | null {
  try {
    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization')
    let token: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }

    // Try cookie if no header token
    if (!token) {
      token = request.cookies.get('token')?.value || null
    }

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    return {
      id: decoded.userId || decoded.sub,
      email: decoded.email,
      role: decoded.role,
      sub: decoded.sub || decoded.userId,
    }
  } catch (error) {
    return null
  }
}

/**
 * Require authentication - returns user or error response
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | NextResponse> {
  const user = getUserFromRequest(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  return user
}

/**
 * Require specific role - returns user or error response
 */
export async function requireRole(request: NextRequest, allowedRoles: string | string[]): Promise<AuthUser | NextResponse> {
  const user = getUserFromRequest(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  if (!roles.includes(user.role)) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  return user
}

/**
 * Gateway middleware
 * - Public by exception
 * - Everything else requires auth
 * - Runs BEFORE Vercel rewrites
 */
export function gatewayAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🚫 Ignore Next.js internals & static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // images, favicon, etc
  ) {
    return NextResponse.next()
  }

  // ✅ Public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // 🔐 Protected routes
  const user = getUserFromRequest(request)

  if (!user) {
    // Browser navigation → redirect to auth page
    if (request.headers.get('accept')?.includes('text/html')) {
  return NextResponse.redirect(new URL('/auth', request.url))
    }

    // API / fetch
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Optional: forward user context
  const response = NextResponse.next()
  response.headers.set('x-user-id', user.sub)
  response.headers.set('x-user-role', user.role ?? '')

  return response
}
