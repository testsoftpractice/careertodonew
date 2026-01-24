import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { db } from '@/lib/db'

/**
 * POST /api/auth/validate
 * Validate the current token and return user info
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Verify token
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
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
        universityId: true,
        major: true,
        graduationYear: true,
        bio: true,
        location: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
      valid: true,
    })
  } catch (error) {
    console.error('Error validating token:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to validate token' },
      { status: 500 }
    )
  }
}
