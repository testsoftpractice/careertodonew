import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'
import { sendEmail, getPasswordResetEmailTemplate } from '@/lib/email/service'

// Generate a cryptographically secure password reset token
const generateSecureResetToken = () => {
  return randomBytes(32).toString('hex')
}

// POST /api/auth/forgot-password - Send password reset email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    })

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // Invalidate any existing reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        used: false,
      },
    })

    // Generate a new secure reset token
    const token = generateSecureResetToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiration

    // Store token in database
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Generate reset URL - remove trailing slash from base URL
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.NEXT_PUBLIC_BASE_URL || 
                    'http://localhost:3000').replace(/\/$/, '')
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

    // Get email template
    const { html, text } = getPasswordResetEmailTemplate(resetUrl, user.name)

    // Send email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Reset Your Password - CareerToDo',
      html,
      text,
    })

    // In development, log the reset URL for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset request for:', email)
      console.log('Reset URL (for testing):', resetUrl)
      console.log('Email sent:', emailSent)
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      // Only include reset URL in development for testing
      ...(process.env.NODE_ENV === 'development' && {
        resetUrl,
        emailSent,
        note: emailSent 
          ? 'Email sent successfully via SMTP' 
          : 'SMTP not configured. Check console for reset URL.',
      }),
    })
  } catch (error: unknown) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
