import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole, VerificationStatus } from '@prisma/client'
import { hashPassword, generateToken } from '@/lib/auth/jwt'
import { signupSchema } from '@/lib/validations/schemas'
import { z } from 'zod'

// POST /api/auth/signup - User registration with password hashing
export async function POST(request: NextRequest) {
  try {
    // Debug: Check environment variables
    if (!process.env.DATABASE_URL) {
      console.error('[SIGNUP ERROR] DATABASE_URL is not set!')
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Database not configured' },
        { status: 500 }
      )
    }

    if (!process.env.JWT_SECRET) {
      console.error('[SIGNUP ERROR] JWT_SECRET is not set!')
      return NextResponse.json(
        { success: false, error: 'Server configuration error: JWT secret not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedData = signupSchema.parse(body)
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      bio,
      universityId,
      major,
      graduationYear,
      universityName,
      universityCode,
      website,
      companyName,
      companyWebsite,
      position,
      firmName,
      investmentFocus,
    } = validatedData

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('[SIGNUP] Hashing password for user:', email)
    const hashedPassword = await hashPassword(password)

    // For university registration, create or find university
    let university = null
    if (role === 'STUDENT' && universityId && universityId !== 'other') {
      university = await db.university.findUnique({
        where: { id: universityId },
      })
    } else if (role === 'UNIVERSITY') {
      // Check if university already exists
      university = await db.university.findUnique({
        where: { code: universityCode },
      })

      if (!university) {
        university = await db.university.create({
          data: {
            name: universityName,
            code: universityCode,
            website,
            verificationStatus: VerificationStatus.PENDING,
          },
        })
      }
    }

    // Convert role to match database enum
    let finalRole: UserRole = role as UserRole
    if (role === 'UNIVERSITY') {
      finalRole = 'UNIVERSITY_ADMIN'
    }

    console.log('[SIGNUP] Creating user in database:', email, 'with role:', finalRole)
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          role: finalRole,
          bio,
          verificationStatus: VerificationStatus.PENDING,
          password: hashedPassword,
          universityId: university?.id,
          major: finalRole === 'STUDENT' ? major : null,
          graduationYear: finalRole === 'STUDENT' && graduationYear ? parseInt(graduationYear) : null,
        },
      })

      // Create professional record for user registration
      await tx.professionalRecord.create({
        data: {
          userId: user.id,
          type: 'SKILL_ACQUIRED',
          title: 'Platform Registration',
          description: `Registered as ${role} on CareerToDo Platform`,
          startDate: new Date(),
          metadata: JSON.stringify({ role, email }),
          hash: `reg-${user.id}-${Date.now()}`, // Generate a simple hash for system records
        },
      })

      return user
    })

    // Generate JWT token
    const token = generateToken({
      userId: result.id,
      email: result.email,
      role: result.role,
      verificationStatus: result.verificationStatus,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          role: result.role,
          verificationStatus: result.verificationStatus,
        },
        token,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[SIGNUP ERROR] Detailed error:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    })

    // Handle Zod validation errors
    if (error && error.name === 'ZodError') {
      const formattedErrors = error.issues?.map((err: any) => ({
        field: err.path?.join('.') || 'unknown',
        message: err.message || 'Validation failed',
      })) || []
      return NextResponse.json(
        { success: false, error: 'Validation error', errors: formattedErrors },
        { status: 400 }
      )
    }

    // Handle Prisma errors
    if (error && error.code && error.code.startsWith('P')) {
      return NextResponse.json(
        { success: false, error: 'Database error. Please try again.' },
        { status: 500 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
