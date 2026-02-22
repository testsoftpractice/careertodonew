/**
 * Authentication helpers for API Routes
 * 
 * This file is for API routes (Node.js runtime) only.
 * DO NOT import this in middleware - use jwt.edge.ts instead.
 * 
 * These functions use the Node.js JWT implementation which
 * supports both token generation and verification.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

// User type for authentication
export interface AuthUser {
  id: string
  email: string
  role: string
  sub: string
  universityId?: string | null
}

/**
 * Extract user from request (from JWT token in cookie or header)
 * For use in API routes (Node.js runtime)
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
      universityId: decoded.universityId || null,
    }
  } catch (error) {
    return null
  }
}

/**
 * Require authentication - returns user or error response
 * For use in API routes
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
 * For use in API routes
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
