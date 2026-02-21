import nodemailer from 'nodemailer'

// Email configuration interface
interface EmailConfig {
  to: string
  subject: string
  html: string
  text?: string
}

// Create transporter based on environment
const createTransporter = () => {
  // Zoho Mail SMTP configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER, // Your Zoho email
      pass: process.env.SMTP_PASSWORD, // Your Zoho password or app-specific password
    },
    tls: {
      // Do not fail on invalid certs (for development)
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  })

  return transporter
}

// Verify SMTP connection
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ SMTP connection verified successfully')
    return true
  } catch (error) {
    console.error('❌ SMTP connection failed:', error)
    return false
  }
}

// Send email function
export async function sendEmail({ to, subject, html, text }: EmailConfig): Promise<boolean> {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('⚠️ SMTP not configured. Email would have been sent to:', to)
      console.log('Email content preview:')
      console.log('Subject:', subject)
      console.log('Body:', text || html.replace(/<[^>]*>/g, ''))
      return false
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'CareerToDo',
        address: process.env.SMTP_USER,
      },
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Plain text fallback
    }

    const info = await transporter.sendMail(mailOptions)

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Email sent successfully:')
      console.log('   To:', to)
      console.log('   Subject:', subject)
      console.log('   Message ID:', info.messageId)
    }

    return true
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    throw error
  }
}

// Password reset email template
export function getPasswordResetEmailTemplate(resetUrl: string, userName?: string) {
  const currentYear = new Date().getFullYear()
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding-right: 10px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#18181b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="#18181b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </td>
                  <td>
                    <h1 style="margin: 0; color: #18181b; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                      Career<span style="color: #6366f1;">ToDo</span>
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #fef3c7; border-radius: 50%; line-height: 64px; text-align: center;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#f59e0b" stroke-width="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#f59e0b" stroke-width="2"/>
                  </svg>
                </div>
              </div>
              
              <h2 style="margin: 0 0 8px 0; color: #18181b; font-size: 28px; font-weight: 700; text-align: center;">
                Reset Your Password
              </h2>
              <p style="margin: 0 0 32px 0; color: #64748b; font-size: 16px; text-align: center;">
                No worries, it happens to the best of us.
              </p>
              
              <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.7;">
                ${userName ? `Hi <strong>${userName}</strong>,` : 'Hello,'}
              </p>
              
              <p style="margin: 0 0 32px 0; color: #475569; font-size: 16px; line-height: 1.7;">
                We received a request to reset your password for your CareerToDo account. Click the button below to create a new password:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px 0;">
                    <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #18181b 0%, #27272a 100%); color: #ffffff; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <div style="margin: 24px 0; padding: 20px; background-color: #f1f5f9; border-radius: 10px; border-left: 4px solid #6366f1;">
                <p style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                  ⏱️ This link will expire in 1 hour
                </p>
                <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                  If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
              </div>
              
              <!-- Fallback Link -->
              <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
                  If the button above doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin: 0; color: #6366f1; font-size: 12px; word-break: break-all; font-family: monospace;">
                  ${resetUrl}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px;">
                      This is an automated message from CareerToDo. Please do not reply to this email.
                    </p>
                    <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 12px;">
                      © ${currentYear} CareerToDo. All rights reserved.
                    </p>
                    <a href="https://careertodo.com" style="color: #6366f1; text-decoration: none; font-size: 13px; font-weight: 500;">
                      careertodo.com
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const text = `
Reset Your Password - CareerToDo

${userName ? `Hi ${userName},` : 'Hello,'}

We received a request to reset your password for your CareerToDo account.

To reset your password, please visit the following link:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

--
CareerToDo
https://careertodo.com
© ${currentYear} CareerToDo. All rights reserved.
  `

  return { html, text }
}

// Welcome email template
export function getWelcomeEmailTemplate(userName: string, loginUrl: string) {
  const currentYear = new Date().getFullYear()
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CareerToDo</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              <h1 style="margin: 0; color: #18181b; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                Career<span style="color: #6366f1;">ToDo</span>
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #dcfce7; border-radius: 50%; line-height: 64px; text-align: center;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <h2 style="margin: 0 0 8px 0; color: #18181b; font-size: 28px; font-weight: 700; text-align: center;">
                Welcome to CareerToDo!
              </h2>
              <p style="margin: 0 0 32px 0; color: #64748b; font-size: 16px; text-align: center;">
                Your account has been created successfully.
              </p>
              
              <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.7;">
                Hi <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 32px 0; color: #475569; font-size: 16px; line-height: 1.7;">
                Thank you for joining CareerToDo! You can now start building your professional portfolio, connecting with opportunities, and tracking your career growth.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px 0;">
                    <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #18181b 0%, #27272a 100%); color: #ffffff; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Features -->
              <div style="margin-top: 24px;">
                <p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; font-weight: 600;">
                  Here's what you can do:
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #475569; font-size: 14px;">
                      ✓ Build your professional portfolio
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #475569; font-size: 14px;">
                      ✓ Join projects and gain real experience
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #475569; font-size: 14px;">
                      ✓ Get verified credentials for your achievements
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #475569; font-size: 14px;">
                      ✓ Connect with employers and opportunities
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 12px;">
                      © ${currentYear} CareerToDo. All rights reserved.
                    </p>
                    <a href="https://careertodo.com" style="color: #6366f1; text-decoration: none; font-size: 13px; font-weight: 500;">
                      careertodo.com
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const text = `
Welcome to CareerToDo!

Hi ${userName},

Thank you for joining CareerToDo! Your account has been created successfully.

Get started here: ${loginUrl}

Here's what you can do:
✓ Build your professional portfolio
✓ Join projects and gain real experience
✓ Get verified credentials for your achievements
✓ Connect with employers and opportunities

--
CareerToDo
https://careertodo.com
© ${currentYear} CareerToDo. All rights reserved.
  `

  return { html, text }
}

// Email verification template
export function getEmailVerificationTemplate(verificationUrl: string, userName?: string) {
  const currentYear = new Date().getFullYear()
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              <h1 style="margin: 0; color: #18181b; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                Career<span style="color: #6366f1;">ToDo</span>
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #dbeafe; border-radius: 50%; line-height: 64px; text-align: center;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <h2 style="margin: 0 0 8px 0; color: #18181b; font-size: 28px; font-weight: 700; text-align: center;">
                Verify Your Email
              </h2>
              <p style="margin: 0 0 32px 0; color: #64748b; font-size: 16px; text-align: center;">
                Confirm your email address to get started.
              </p>
              
              <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.7;">
                ${userName ? `Hi <strong>${userName}</strong>,` : 'Hello,'}
              </p>
              
              <p style="margin: 0 0 32px 0; color: #475569; font-size: 16px; line-height: 1.7;">
                Please verify your email address by clicking the button below:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px 0;">
                    <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #18181b 0%, #27272a 100%); color: #ffffff; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Fallback Link -->
              <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
                  If the button above doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin: 0; color: #6366f1; font-size: 12px; word-break: break-all; font-family: monospace;">
                  ${verificationUrl}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 12px;">
                      © ${currentYear} CareerToDo. All rights reserved.
                    </p>
                    <a href="https://careertodo.com" style="color: #6366f1; text-decoration: none; font-size: 13px; font-weight: 500;">
                      careertodo.com
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const text = `
Verify Your Email - CareerToDo

${userName ? `Hi ${userName},` : 'Hello,'}

Please verify your email address by visiting the following link:
${verificationUrl}

--
CareerToDo
https://careertodo.com
© ${currentYear} CareerToDo. All rights reserved.
  `

  return { html, text }
}
