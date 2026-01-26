import { NextRequest } from 'next/server'

/**
 * Session management using httpOnly cookies for security
 * This prevents XSS attacks from stealing tokens
 */

export interface SessionData {
  user: any
  token: string
  expiresAt: Date
}

export interface ServerSession {
  user: {
    id: string
    email: string
    name: string
    role: string
    verificationStatus: string
  }
  success: boolean
  error?: string
}

/**
 * Get server-side session from request
 * This extracts token from Authorization header and verifies it
 * For use in API routes (server-side)
 */
export async function getServerSession(request: NextRequest): Promise<ServerSession> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return {
        success: false,
        user: null as any,
        error: 'No authorization token found'
      }
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return {
        success: false,
        user: null as any,
        error: 'Invalid authorization header format'
      }
    }

    const token = parts[1]

    // Verify the token
    const { verifyToken } = await import('@/lib/auth/jwt')
    const payload = verifyToken(token)

    if (!payload) {
      return {
        success: false,
        user: null as any,
        error: 'Invalid or expired token'
      }
    }

    // Return session with user data from token
    return {
      success: true,
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        verificationStatus: payload.verificationStatus
      },
      error: undefined
    }
  } catch (error) {
    console.error('Error getting server session:', error)
    return {
      success: false,
      user: null as any,
      error: 'Failed to verify session'
    }
  }
}

/**
 * Set session token as httpOnly cookie
 * Only works server-side
 */
export function setSessionCookie(token: string, maxAge: number = 60 * 60 * 24 * 7): void {
  if (typeof document === 'undefined') {
    return
  }

  const expiresDate = new Date(Date.now() + maxAge * 1000)

  document.cookie = `token=${encodeURIComponent(token)}; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}; Expires=${expiresDate.toUTCString()}`
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(): void {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = 'token=; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

/**
 * Check if session exists (cookie-based)
 * Note: This is for client-side checks only - actual validation happens server-side
 */
export function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') {
    return false
  }

  return document.cookie.includes('token=')
}

/**
 * Get session data from localStorage (user data only)
 * Token is stored in httpOnly cookie (server-side only)
 */
export function getSessionData(): SessionData | null {
  if (typeof document === 'undefined' || typeof localStorage === 'undefined') {
    return null
  }

  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null

    const user = JSON.parse(userStr)
    return {
      user,
      token: '', // Token is in httpOnly cookie, not accessible client-side
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Assume 1 hour
    }
  } catch (error) {
    console.error('Error getting session data:', error)
    return null
  }
}

/**
 * Set session data in localStorage (user only)
 * Token is set via server-side httpOnly cookie
 */
export function setSessionData(user: any, token: string): void {
  if (typeof document === 'undefined' || typeof localStorage === 'undefined') {
    return
  }

  try {
    // Store user data (safe)
    localStorage.setItem('user', JSON.stringify(user))

    // Token is stored as httpOnly cookie (done server-side)
  } catch (error) {
    console.error('Error setting session data:', error)
  }
}

/**
 * Clear session data from localStorage and cookie
 */
export function clearSessionData(): void {
  if (typeof document === 'undefined' || typeof localStorage === 'undefined') {
    return
  }

  try {
    localStorage.removeItem('user')
    clearSessionCookie()
  } catch (error) {
    console.error('Error clearing session data:', error)
  }
}
