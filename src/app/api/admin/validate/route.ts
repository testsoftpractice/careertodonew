import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { db } from '@/lib/db'

/**
 * GET /api/admin/validate
 * Validate the current admin session token from cookie
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const cookieHeader = request.headers.get('cookie')
    let token: string | null = null

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim())
      const sessionCookie = cookies.find(c => c.startsWith('session='))
      if (sessionCookie) {
        token = decodeURIComponent(sessionCookie.substring(8))
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No session token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if user is a platform admin
    if (payload.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Not authorized as admin' },
        { status: 403 }
      )
    }

    // Fetch user from database
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verificationStatus: true,
        avatar: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
      valid: true,
    })
  } catch (error) {
    console.error('Error validating admin session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to validate admin session' },
      { status: 500 }
    )
  }
}
