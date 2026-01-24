import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole, VerificationStatus } from '@prisma/client'
import { hashPassword, generateToken } from '@/lib/auth/jwt'

// POST /api/auth/signup - Simple user registration
export async function POST(request: NextRequest) {
  try {
    console.log('[SIGNUP] =============== START ===============')

    const body = await request.json()
    console.log('[SIGNUP] Received body:', JSON.stringify(body, null, 2))

    const { email, password, firstName, lastName, role = 'STUDENT' } = body

    console.log('[SIGNUP] Email:', email)
    console.log('[SIGNUP] Original role:', role)

    // Normalize/validate role - map invalid values to valid ones
    const validRoles = ['STUDENT', 'MENTOR', 'EMPLOYER', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN']
    let normalizedRole = role.toUpperCase()

    // Map common invalid role values to valid ones
    if (normalizedRole === 'UNIVERSITY') {
      normalizedRole = 'UNIVERSITY_ADMIN'
      console.log('[SIGNUP] Mapped role UNIVERSITY -> UNIVERSITY_ADMIN')
    } else if (!validRoles.includes(normalizedRole)) {
      normalizedRole = 'STUDENT' // Default to STUDENT for invalid roles
      console.log('[SIGNUP] Defaulting role to STUDENT')
    }

    console.log('[SIGNUP] Normalized role:', normalizedRole)

    // Basic validation - only check required fields
    if (!email) {
      console.log('[SIGNUP] ERROR: Email is missing')
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!password) {
      console.log('[SIGNUP] ERROR: Password is missing')
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    if (!firstName) {
      console.log('[SIGNUP] ERROR: First name is missing')
      return NextResponse.json(
        { success: false, error: 'First name is required' },
        { status: 400 }
      )
    }

    if (!lastName) {
      console.log('[SIGNUP] ERROR: Last name is missing')
      return NextResponse.json(
        { success: false, error: 'Last name is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    console.log('[SIGNUP] Checking if user exists...')
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('[SIGNUP] ERROR: User already exists')
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    console.log('[SIGNUP] User does not exist, proceeding...')

    // Hash password
    console.log('[SIGNUP] Hashing password...')
    const hashedPassword = await hashPassword(password)
    console.log('[SIGNUP] Password hashed successfully')

    // Create user - only required fields
    console.log('[SIGNUP] Creating user in database...')
    const user = await db.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role: normalizedRole as UserRole,
        verificationStatus: VerificationStatus.PENDING,
        password: hashedPassword,
      },
    })

    console.log('[SIGNUP] User created successfully. ID:', user.id)
    console.log('[SIGNUP] User email:', user.email)
    console.log('[SIGNUP] User name:', user.name)
    console.log('[SIGNUP] User role:', user.role)

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    })

    console.log('[SIGNUP] Token generated')
    console.log('[SIGNUP] =============== SUCCESS ===============')

    // Create response and set httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          verificationStatus: user.verificationStatus,
        },
        token,
      },
      { status: 201 }
    )

    // Set httpOnly cookie for token (XSS protection)
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1, // 1 hour in seconds
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[SIGNUP] =============== ERROR ===============')
    console.error('[SIGNUP] Error type:', error?.constructor?.name)
    console.error('[SIGNUP] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[SIGNUP] Error stack:', error instanceof Error ? error.stack : 'No stack')

    // Check for unique constraint error
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      console.log('[SIGNUP] ERROR: Unique constraint violation')
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check for Prisma validation error
    if (error instanceof Error && error.message.includes('Argument')) {
      console.log('[SIGNUP] ERROR: Prisma validation error')
      return NextResponse.json(
        { success: false, error: 'Validation error: ' + error.message },
        { status: 400 }
      )
    }

    console.log('[SIGNUP] ERROR: Returning 500 error')
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

