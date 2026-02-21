import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailConnection, sendEmail } from '@/lib/email/service'

// GET /api/admin/email-test - Verify SMTP connection
export async function GET(request: NextRequest) {
  try {
    const isConnected = await verifyEmailConnection()
    
    return NextResponse.json({
      success: true,
      smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
      connectionVerified: isConnected,
      config: {
        host: process.env.SMTP_HOST || 'smtp.zoho.com',
        port: process.env.SMTP_PORT || '587',
        user: process.env.SMTP_USER ? '***configured***' : 'NOT SET',
        fromName: process.env.EMAIL_FROM_NAME || 'CareerToDo',
      },
    })
  } catch (error: unknown) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify SMTP connection',
    }, { status: 500 })
  }
}

// POST /api/admin/email-test - Send test email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email address is required',
      }, { status: 400 })
    }

    const testHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <h1 style="color: #18181b;">Email Test Successful!</h1>
  <p>This is a test email from CareerToDo.</p>
  <p>If you received this email, your SMTP configuration is working correctly.</p>
  <p>Sent at: ${new Date().toISOString()}</p>
</body>
</html>
    `

    const sent = await sendEmail({
      to: email,
      subject: 'Test Email - CareerToDo SMTP Configuration',
      html: testHtml,
      text: `Email Test Successful!\n\nThis is a test email from CareerToDo.\n\nSent at: ${new Date().toISOString()}`,
    })

    return NextResponse.json({
      success: sent,
      message: sent 
        ? 'Test email sent successfully!' 
        : 'Failed to send email. Check server logs for details.',
    })
  } catch (error: unknown) {
    console.error('Send test email error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send test email',
    }, { status: 500 })
  }
}
