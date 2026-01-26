import { NextRequest } from 'next/server'
import { verifyToken, getTokenFromHeaders } from './jwt'
import { db } from '@/lib/db'
import { unauthorized } from './api-response'
import type { User } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  role: string
  verificationStatus: string
}

export interface AuthResult {
  success: boolean
  user?: AuthUser
  dbUser?: User
  error?: string
}

/**
 * Verify authentication token from request headers
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  const token = getTokenFromHeaders(request.headers)

  if (!token) {
    return { success: false, error: 'No authentication token provided' }
  }

  const payload = verifyToken(token)

  if (!payload) {
    return { success: false, error: 'Invalid or expired token' }
  }

  return {
    success: true,
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      verificationStatus: payload.verificationStatus,
    },
  }
}

/**
 * Verify authentication and fetch full user from database
 */
export async function getAuthUser(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)

  if (!authResult.success || !authResult.user) {
    return authResult
  }

  try {
    const user = await db.user.findUnique({
      where: { id: authResult.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verificationStatus: true,
        avatar: true,
        universityId: true,
        major: true,
        graduationYear: true,
        bio: true,
        location: true,
      },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return {
      success: true,
      user: authResult.user,
      dbUser: user,
    }
  } catch (error) {
    return { success: false, error: 'Failed to fetch user' }
  }
}

/**
 * Require authentication - return 401 if not authenticated
 * Use this in API routes that require authentication
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult & { dbUser: User }> {
  const result = await getAuthUser(request)

  if (!result.success || !result.dbUser) {
    throw new AuthError(result.error || 'Unauthorized', 401)
  }

  return result as AuthResult & { dbUser: User }
}

/**
 * Require specific role - return 403 if user doesn't have required role
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<AuthResult & { dbUser: User }> {
  const result = await requireAuth(request)

  if (!allowedRoles.includes(result.dbUser.role)) {
    throw new AuthError('Insufficient permissions', 403)
  }

  return result
}

/**
 * Check if user has specific role (returns boolean, doesn't throw)
 */
export async function hasRole(request: NextRequest, roles: string[]): Promise<boolean> {
  const authResult = await verifyAuth(request)

  if (!authResult.success) {
    return false
  }

  return roles.includes(authResult.user!.role)
}

/**
 * Check if user is owner or has required access level
 */
export async function checkProjectAccess(
  request: NextRequest,
  projectId: string,
  requiredAccess?: string[]
): Promise<boolean> {
  const authResult = await getAuthUser(request)

  if (!authResult.success || !authResult.dbUser) {
    return false
  }

  const user = authResult.dbUser
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        where: { userId: user.id },
      },
    },
  })

  if (!project) {
    return false
  }

  // Owner has full access
  if (project.ownerId === user.id) {
    return true
  }

  // Check member access
  const member = project.members.find(m => m.userId === user.id)
  if (!member) {
    return false
  }

  if (requiredAccess && !requiredAccess.includes(member.accessLevel)) {
    return false
  }

  return true
}

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
    this.statusCode = statusCode
  }

  statusCode: number
}
