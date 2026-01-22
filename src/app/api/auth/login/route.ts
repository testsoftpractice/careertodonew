import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth/jwt'

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
    console.log('[LOGIN] Password hash length:', user.password?.length)
    console.log('[LOGIN] Password hash starts with:', user.password?.substring(0, 10))

    // Verify password
    console.log('[LOGIN] Verifying password...')
    const passwordValid = await verifyPassword(password, user.password as string)
    console.log('[LOGIN] Password valid:', passwordValid)

    if (!passwordValid) {
      console.log('[LOGIN] ERROR: Invalid password')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    })

    console.log('[LOGIN] Token generated successfully')
    console.log('[LOGIN] =============== SUCCESS ===============')

    return NextResponse.json({
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
