import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateToken, verifyToken } from '@/lib/auth/jwt'
import { generalRateLimit } from '@/lib/rate-limiter'

/**
 * POST /api/auth/refresh-token
 * Refresh the JWT token with latest user data from database
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[REFRESH_TOKEN] =============== START ===============')

    // Apply rate limiting
    const rateLimitResult = await generalRateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    // Get token from cookie or Authorization header
    let token = request.cookies.get('token')?.value
    const authHeader = request.headers.get('authorization')

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }

    if (!token) {
      console.log('[REFRESH_TOKEN] ERROR: No token found')
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify existing token
    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      console.log('[REFRESH_TOKEN] ERROR: Invalid token')
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get fresh user data from database
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
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
        linkedinUrl: true,
        portfolioUrl: true,
        executionScore: true,
        collaborationScore: true,
        leadershipScore: true,
        ethicsScore: true,
        reliabilityScore: true,
        totalPoints: true,
        progressionLevel: true,
        createdAt: true,
        updatedAt: true,
        // Payment verification fields
        transactionId: true,
        paymentVerified: true,
        paymentVerifiedAt: true,
        paymentVerifiedBy: true,
      },
    })

    if (!user) {
      console.log('[REFRESH_TOKEN] ERROR: User not found')
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate new token with fresh data
    const newToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    })

    console.log('[REFRESH_TOKEN] Token refreshed for user:', user.id)
    console.log('[REFRESH_TOKEN] New verificationStatus:', user.verificationStatus)
    console.log('[REFRESH_TOKEN] =============== SUCCESS ===============')

    // Create response with new token and user data
    const response = NextResponse.json({
      success: true,
      user,
      token: newToken,
    })

    // Set new token in cookie
    response.cookies.set({
      name: 'token',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[REFRESH_TOKEN] =============== ERROR ===============')
    console.error('[REFRESH_TOKEN] Error:', error)
    console.error('[REFRESH_TOKEN] =============== ERROR ===============')

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh token',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
