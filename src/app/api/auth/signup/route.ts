import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole, VerificationStatus } from '@prisma/client'
import { hashPassword, generateToken } from '@/lib/auth/jwt'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

// Password validation helper
function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+\\-=\\[\\]{}|;:\'",.<>\\/?)')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// POST /api/auth/signup - Simple user registration
export async function POST(request: NextRequest) {
  try {
    console.log('[SIGNUP] =============== START ===============')

    const body = await request.json()
    console.log('[SIGNUP] Received body:', JSON.stringify(body, null, 2))

    const { email, password, firstName, lastName, mobileNumber, role = 'STUDENT', universityId } = body

    console.log('[SIGNUP] Email:', email)
    console.log('[SIGNUP] Original role:', role)
    console.log('[SIGNUP] University ID:', universityId)

    // Normalize/validate role - map invalid values to valid ones
    const validRoles = ['STUDENT', 'EMPLOYER', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN']
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

    // Email validation
    if (!emailRegex.test(email)) {
      console.log('[SIGNUP] ERROR: Invalid email format')
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Password validation
    if (!password) {
      console.log('[SIGNUP] ERROR: Password is missing')
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      console.log('[SIGNUP] ERROR: Password validation failed:', passwordValidation.errors)
      return NextResponse.json(
        { success: false, error: passwordValidation.errors.join('; '), details: passwordValidation.errors },
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

    // Handle university association
    let finalUniversityId = null

    if (universityId) {
      console.log('[SIGNUP] Looking up university with ID:', universityId)
      const universityData = await db.university.findUnique({
        where: { id: universityId }
      })

      if (!universityData) {
        console.log('[SIGNUP] ERROR: University not found with ID:', universityId)
        return NextResponse.json(
          { success: false, error: 'University not found with the provided ID' },
          { status: 400 }
        )
      }

      finalUniversityId = universityData.id
      console.log('[SIGNUP] University found:', universityData.name)

      // If UNIVERSITY_ADMIN and university already has an admin, reject
      if (normalizedRole === 'UNIVERSITY_ADMIN') {
        const existingAdmin = await db.user.findFirst({
          where: {
            universityId: finalUniversityId,
            role: UserRole.UNIVERSITY_ADMIN,
            verificationStatus: { in: [VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW, VerificationStatus.VERIFIED] }
          }
        })

        if (existingAdmin) {
          console.log('[SIGNUP] ERROR: University already has an admin')
          return NextResponse.json(
            { success: false, error: 'This university already has a registered admin' },
            { status: 400 }
          )
        }

        // Update university status to UNDER_REVIEW when claimed
        console.log('[SIGNUP] Updating university status to UNDER_REVIEW')
        await db.university.update({
          where: { id: finalUniversityId },
          data: { verificationStatus: VerificationStatus.UNDER_REVIEW }
        })
      }
    }

    // Create user - only required fields
    console.log('[SIGNUP] Creating user in database...')
    const user = await db.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role: normalizedRole as UserRole,
        verificationStatus: VerificationStatus.PENDING,
        password: hashedPassword,
        mobileNumber: mobileNumber || null,
        ...(finalUniversityId && { universityId: finalUniversityId }),
      },
    })
    console.log('[SIGNUP] User created successfully. ID:', user.id)
    console.log('[SIGNUP] User email:', user.email)
    console.log('[SIGNUP] User name:', user.name)
    console.log('[SIGNUP] User role:', user.role)
    if (finalUniversityId) {
      console.log('[SIGNUP] User linked to university')
    }

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
    console.error('[SIGNUP] =============== ERROR ===============')
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
