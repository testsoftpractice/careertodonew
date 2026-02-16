import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/jwt'

// POST /api/auth/reset-password - Reset password with valid token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Find the reset token in the database
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
      include: { User: true },
    })

    // Check if token exists and is valid
    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // Check if token has been used
    if (resetToken.used) {
      return NextResponse.json(
        { success: false, error: 'This reset link has already been used' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password)

    // Use a transaction to update password and mark token as used
    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: {
          password: hashedPassword,
          lastPasswordChange: new Date(),
        },
      }),
      db.passwordResetToken.update({
        where: { id: resetToken.id },
        data: {
          used: true,
          usedAt: new Date(),
        },
      }),
    ])

    // Invalidate all other reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: {
        userId: resetToken.userId,
        id: { not: resetToken.id },
      },
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset successfully for user:', resetToken.User.email)
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    })
  } catch (error: unknown) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while resetting your password' },
      { status: 500 }
    )
  }
}
