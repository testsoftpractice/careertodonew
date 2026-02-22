/**
 * Edge-safe JWT verification for Middleware
 * 
 * This file uses 'jose' which is compatible with Edge Runtime.
 * DO NOT import jsonwebtoken or bcryptjs here - they are Node.js only!
 */

import { jwtVerify } from 'jose'

// Get JWT secret - must be set in environment
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set')
  }
  return new TextEncoder().encode(secret)
}

export interface EdgeJwtPayload {
  userId: string
  email: string
  role: string
  verificationStatus?: string
  sub?: string
  iat?: number
  exp?: number
}

/**
 * Verify JWT token in Edge Runtime
 * Uses jose instead of jsonwebtoken (which is Node.js only)
 */
export async function verifyEdgeToken(token: string): Promise<EdgeJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as unknown as EdgeJwtPayload
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null
  }
}

/**
 * Decode JWT without verification (for debugging only)
 */
export function decodeEdgeToken(token: string): EdgeJwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}
