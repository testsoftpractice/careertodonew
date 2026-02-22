/**
 * Edge-safe Authentication Middleware
 * 
 * This file runs in Edge Runtime and MUST NOT import:
 * - jsonwebtoken (use jose instead)
 * - bcryptjs (Node.js only)
 * - Prisma/Database (Node.js only)
 * - Any server-only code
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyEdgeToken } from '@/lib/auth/jwt.edge'

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

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

/**
 * Extract user from JWT token (header or cookie)
 * Edge-safe - uses jose for verification
 */
export async function getUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    let token: string | null = null

    // Try Authorization header first
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }

    // Fall back to cookie
    if (!token) {
      token = request.cookies.get('token')?.value || null
    }

    if (!token) return null

    // Verify using Edge-safe method
    const decoded = await verifyEdgeToken(token)
    
    if (!decoded) return null

    return {
      id: decoded.userId || decoded.sub || '',
      email: decoded.email || '',
      role: decoded.role || '',
      sub: decoded.sub || decoded.userId || '',
    }
  } catch (error) {
    return null
  }
}

/**
 * Gateway Middleware
 * - Public by exception
 * - Everything else requires auth
 * - Runs BEFORE Vercel rewrites
 */
export async function gatewayAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🚫 Ignore Next.js internals & static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // images, favicon, etc
  ) {
    return NextResponse.next()
  }

  // ✅ Public routes - no auth required
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // 🔐 Protected routes - require authentication
  const user = await getUserFromRequest(request)

  if (!user) {
    // Browser navigation → redirect to login page
    if (request.headers.get('accept')?.includes('text/html')) {
      const loginUrl = new URL('/auth', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // API / fetch request → return 401
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Forward user context headers (optional, for downstream use)
  const response = NextResponse.next()
  response.headers.set('x-user-id', user.sub)
  response.headers.set('x-user-role', user.role)
  response.headers.set('x-user-email', user.email)

  return response
}
