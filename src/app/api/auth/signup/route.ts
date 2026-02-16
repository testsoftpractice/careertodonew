import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole, VerificationStatus } from '@/lib/constants'
import { hashPassword, generateToken } from '@/lib/auth/jwt'
import { authRateLimit } from '@/lib/rate-limiter'
import { validateRequest, userSignupSchema } from '@/lib/validation'

// POST /api/auth/signup - Simple user registration
export async function POST(request: NextRequest) {
  try {
    console.log('[SIGNUP] =============== START ===============')

    // Apply rate limiting
    const rateLimitResult = await authRateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const body = await request.json()
    console.log('[SIGNUP] Received body:', JSON.stringify(body, null, 2))

    // Validate input using Zod schema
    const validation = validateRequest(userSignupSchema, body)
    if (!validation.success) {
      console.log('[SIGNUP] ERROR: Validation failed:', validation.error)
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.error.split('; ') },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName, mobileNumber, role, universityId, major, graduationYear, bio } = validation.data

    console.log('[SIGNUP] Email:', email)
    console.log('[SIGNUP] Role:', role)
    console.log('[SIGNUP] University ID:', universityId)

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
    let finalUniversityId: string | null = null

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

      finalUniversityId = universityData.id ?? null
      console.log('[SIGNUP] University found:', universityData.name)

      // If UNIVERSITY_ADMIN and university already has an admin, reject
      if (role === 'UNIVERSITY_ADMIN') {
        const existingAdmin = await db.user.findFirst({
          where: {
            universityId: finalUniversityId!,
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
          where: { id: finalUniversityId! },
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
        role: role,
        verificationStatus: VerificationStatus.PENDING,
        password: hashedPassword,
        mobileNumber: mobileNumber || null,
        ...(finalUniversityId && { universityId: finalUniversityId }),
        ...(major && { major }),
        ...(graduationYear && { graduationYear }),
        ...(bio && { bio }),
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
