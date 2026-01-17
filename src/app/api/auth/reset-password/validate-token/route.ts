import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/auth/reset-password/validate-token - Validate password reset token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // In production, validate token against database
    // const resetToken = await db.passwordResetToken.findUnique({
    //   where: { token },
    // })
    // 
    // if (!resetToken) {
    //   return NextResponse.json(
    //     { success: false, error: 'Invalid or expired token' },
    //     { status: 400 }
    //   )
    // }
    //
    // if (new Date(resetToken.expiresAt) < new Date()) {
    //   return NextResponse.json(
    //     { success: false, error: 'Token has expired' },
    //     { status: 400 }
    //   )
    // }

    // For now, basic validation (token should be 32 chars base64)
    if (typeof token !== 'string' || token.length !== 32) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 400 }
      )
    }

    console.log('Token validated:', token)

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
    })
  } catch (error: any) {
    console.error('Validate token error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    )
  }
}

// GET /api/auth/reset-password/validate-token - Check token status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Token parameter is required' },
      { status: 400 }
    )
  }

  // Validate token format
  if (typeof token !== 'string' || token.length !== 32) {
    return NextResponse.json(
      { success: false, error: 'Invalid token format' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    valid: true,
    message: 'Token is in valid format',
  })
}
