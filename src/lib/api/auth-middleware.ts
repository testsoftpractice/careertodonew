import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JwtPayload } from '@/lib/auth/jwt'

/**
 * Get user information from Authorization header
 * Extracts and verifies JWT token from Bearer token
 */
export function getUserFromRequest(request: NextRequest): JwtPayload | null {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const payload = verifyToken(token)

    return payload
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error)
    return null
  }
}

/**
 * Get user information from request headers (deprecated - kept for compatibility)
 */
export function getUserFromHeaders(request: NextRequest): JwtPayload | null {
  return getUserFromRequest(request)
}

/**
 * Require authentication - returns 401 if no user
 */
export function requireAuth(request: NextRequest): JwtPayload | NextResponse {
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
 * Require specific role - returns 403 if user doesn't have role
 */
export function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): boolean | NextResponse {
  const user = getUserFromRequest(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  return true
}

/**
 * Role permissions - predefined permission groups
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  STUDENT: [
    'projects.create',
    'projects.view',
    'tasks.create',
    'tasks.view',
    'tasks.update',
    'records.view',
    'records.create',
  ],
  UNIVERSITY_ADMIN: [
    'projects.manage',
    'projects.view',
    'students.view',
    'students.tag',
    'students.analytics',
    'governance.view',
    'governance.approve',
    'analytics.view',
  ],
  EMPLOYER: [
    'records.view',
    'records.request',
    'jobs.create',
    'jobs.view',
    'candidates.view',
    'verification.view',
    'verification.create',
  ],
  INVESTOR: [
    'marketplace.view',
    'investments.create',
    'investments.view',
    'proposals.create',
    'proposals.view',
    'deals.view',
    'portfolio.view',
  ],
  PLATFORM_ADMIN: [
    'users.manage',
    'projects.manage',
    'audits.view',
    'audits.export',
    'analytics.view',
    'governance.manage',
    'all',
  ],
}
