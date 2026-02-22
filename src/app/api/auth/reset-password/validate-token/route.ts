import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/auth/reset-password/validate-token - Check token status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token parameter is required' },
        { status: 400 }
      )
    }

    // Find token in database
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    })

    // Check if token exists
    if (!resetToken) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid token',
      })
    }

    // Check if token has been used
    if (resetToken.used) {
      return NextResponse.json({
        valid: false,
        error: 'This reset link has already been used',
      })
    }

    // Check if token has expired
    if (new Date(resetToken.expiresAt) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: 'This reset link has expired',
      })
    }

    return NextResponse.json({
      valid: true,
      message: 'Token is valid',
    })
  } catch (error) {
    console.error('Validate token error:', error)
    return NextResponse.json({
      valid: false,
      error: 'An error occurred while validating token',
    }, { status: 500 })
  }
}

// POST /api/auth/reset-password/validate-token - Validate password reset token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find token in database
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    })

    // Check if token exists
    if (!resetToken) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid token',
      })
    }

    // Check if token has been used
    if (resetToken.used) {
      return NextResponse.json({
        valid: false,
        error: 'This reset link has already been used',
      })
    }

    // Check if token has expired
    if (new Date(resetToken.expiresAt) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: 'This reset link has expired',
      })
    }

    return NextResponse.json({
      valid: true,
      message: 'Token is valid',
    })
  } catch (error) {
    console.error('Validate token error:', error)
    return NextResponse.json({
      valid: false,
      error: 'An error occurred',
    }, { status: 500 })
  }
}
