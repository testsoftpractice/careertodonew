import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Generate password reset token
const generateResetToken = (email: string) => {
  const timestamp = Date.now()
  const data = `${email}:${timestamp}`
  const token = Buffer.from(data).toString('base64').slice(0, 32)
  const expiresAt = new Date(timestamp + 24 * 60 * 60 * 1000)
  
  return { token, expiresAt }
}

// POST /api/auth/forgot-password - Send password reset email (placeholder for development)
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

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User with this email does not exist' },
        { status: 404 }
      )
    }

    // Generate reset token
    const { token, expiresAt } = generateResetToken(email)

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`

    console.log('Password reset request for:', email)
    console.log('Generated token:', token)
    console.log('Reset URL (for testing):', resetUrl)

    // In production, store token in database and send email via SendGrid/Mailgun
    // Uncomment this code for production email sending:
    /*
    const sgMail = require('@sendgrid/mail')
    
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@careertodo.com',
      subject: 'Reset Your Password - CareerToDo Platform',
      html: '<!DOCTYPE html><html><body><div style="font-family: Arial, sans-serif; padding: 20px;"><h1>Reset Your Password</h1><p>Click the link below to reset your password:</p><a href="' + resetUrl + '">Reset Password</a></div></body></html>',
    }
    
    await sgMail.send(msg)
    */

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully (development mode - see console for token)',
      resetToken: token,
      resetUrl: resetUrl,
      note: 'In production, actual email would be sent. For development, token and URL are returned in response.'
    })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
