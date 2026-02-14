import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

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

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`

    // In development, log the reset URL for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset request for:', email)
      console.log('Reset URL (for testing):', resetUrl)
    }

    // In production, send email via SendGrid/Mailgun/etc
    // Uncomment this code for production email sending:
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@careertodo.com',
      subject: 'Reset Your Password - CareerToDo Platform',
      html: `<!DOCTYPE html>
        <html>
        <body>
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h1>Reset Your Password</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </body>
        </html>`,
    }

    await sgMail.send(msg)
    */

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      // Only include reset URL in development for testing
      ...(process.env.NODE_ENV === 'development' && {
        resetUrl,
        note: 'Development mode: In production, actual email would be sent.',
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
