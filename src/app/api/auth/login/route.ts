import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth/jwt'
import { checkAndIncrementLoginAttempts, handleFailedLogin, resetLoginAttempts } from '@/lib/auth/account-lockout'

// POST /api/auth/login - Simple user authentication
export async function POST(request: NextRequest) {
  try {
    console.log('[LOGIN] =============== START ===============')

    const body = await request.json()
    console.log('[LOGIN] Received body:', JSON.stringify(body, null, 2))

    const { email, password } = body

    console.log('[LOGIN] Email:', email)

    // Basic validation
    if (!email) {
      console.log('[LOGIN] ERROR: Email is missing')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!password) {
      console.log('[LOGIN] ERROR: Password is missing')
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Find user
    console.log('[LOGIN] Looking up user...')
    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log('[LOGIN] ERROR: User not found')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('[LOGIN] User found. ID:', user.id)
    console.log('[LOGIN] User email:', user.email)
    console.log('[LOGIN] User name:', user.name)

    // Verify password
    console.log('[LOGIN] Verifying password...')
    const passwordValid = await verifyPassword(password, user.password as string)
    console.log('[LOGIN] Password valid:', passwordValid)

    if (!passwordValid) {
      console.log('[LOGIN] ERROR: Invalid password')

      // Handle failed login and check account lockout
      await handleFailedLogin(user.id)
      const lockoutStatus = await checkAndIncrementLoginAttempts(user.id)

      if (lockoutStatus.locked) {
        console.log('[LOGIN] ERROR: Account locked')
        return NextResponse.json(
          {
            error: `Account locked due to too many failed attempts. Try again in ${lockoutStatus.remainingTime} minutes.`,
            locked: true,
            remainingMinutes: lockoutStatus.remainingTime,
          },
          { status: 423 }
        )
      }

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if account is locked before successful login
    const lockoutStatus = await checkAndIncrementLoginAttempts(user.id)
    if (lockoutStatus.locked) {
      console.log('[LOGIN] ERROR: Account locked')
      return NextResponse.json(
        {
          error: `Account locked due to too many failed attempts. Try again in ${lockoutStatus.remainingTime} minutes.`,
          locked: true,
          remainingMinutes: lockoutStatus.remainingTime,
        },
        { status: 423 }
      )
    }

    // Successful login - reset attempts
    await resetLoginAttempts(user.id)

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    })

    console.log('[LOGIN] Token generated successfully')
    console.log('[LOGIN] =============== SUCCESS ===============')

    // Create response and set httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
      token,
    })

    // Set httpOnly cookie for token (XSS protection)
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[LOGIN] =============== ERROR ===============')
    console.error('[LOGIN] Error type:', error?.constructor?.name)
    console.error('[LOGIN] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[LOGIN] Error stack:', error instanceof Error ? error.stack : 'No stack')

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
