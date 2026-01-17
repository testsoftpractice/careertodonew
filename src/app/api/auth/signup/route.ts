import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole, VerificationStatus } from '@prisma/client'
import { hashPassword, generateToken } from '@/lib/auth/jwt'
import { signupSchema } from '@/lib/validations/schemas'
import { z } from 'zod'

// POST /api/auth/signup - User registration with password hashing
export async function POST(request: NextRequest) {
  try {
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

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role: role as UserRole,
        bio,
        verificationStatus: VerificationStatus.PENDING,
        password: hashedPassword,
        universityId: university?.id,
        major: role === 'STUDENT' ? major : null,
        graduationYear: role === 'STUDENT' && graduationYear ? parseInt(graduationYear) : null,
      },
    })

    // Create professional record for user registration
    await db.professionalRecord.create({
      data: {
        userId: user.id,
        type: 'SKILL_ACQUIRED',
        title: 'Platform Registration',
        description: `Registered as ${role} on CareerToDo Platform`,
        startDate: new Date(),
        metadata: JSON.stringify({ role, email }),
      },
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    })

    return NextResponse.json(
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return NextResponse.json(
        { success: false, error: 'Validation error', errors: formattedErrors },
        { status: 400 }
      )
    }
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
