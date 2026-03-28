import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema for creating a user
const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'UNIVERSITY_ADMIN', 'EMPLOYER', 'INVESTOR', 'PLATFORM_ADMIN', 'MENTOR']),
  universityId: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.number().int().min(2000).max(2100).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  mobileNumber: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
})

// GET /api/admin/users - List all users with filters
export async function GET(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {}

    if (role) {
      where.role = role
    }

    if (status) {
      if (status === 'PENDING') {
        where.verificationStatus = 'PENDING'
      } else {
        where.verificationStatus = status
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count
    const total = await db.user.count({ where })

    // Get users with pagination
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verificationStatus: true,
        universityId: true,
        mobileNumber: true,
        createdAt: true,
        totalPoints: true,
        University: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    // Transform users to match the expected interface
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.verificationStatus,
      university: user.University ? {
        id: user.University.id,
        name: user.University.name,
        code: user.University.code,
      } : null,
      mobileNumber: user.mobileNumber,
      joinedAt: user.createdAt,
      reputation: user.totalPoints
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: transformedUsers,
        totalCount: total
      }
    })
  } catch (error: any) {
    console.error('Get admin users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validationResult = createUserSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        universityId: data.universityId || null,
        major: data.major || null,
        graduationYear: data.graduationYear || null,
        bio: data.bio || null,
        location: data.location || null,
        mobileNumber: data.mobileNumber || null,
        linkedinUrl: data.linkedinUrl || null,
        portfolioUrl: data.portfolioUrl || null,
        verificationStatus: data.role === 'PLATFORM_ADMIN' ? 'VERIFIED' : 'PENDING',
        emailVerified: data.role === 'PLATFORM_ADMIN',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verificationStatus: true,
        universityId: true,
        major: true,
        graduationYear: true,
        bio: true,
        location: true,
        mobileNumber: true,
        linkedinUrl: true,
        portfolioUrl: true,
        createdAt: true,
      }
    })

    // Create notification for new user (not platform admin)
    if (data.role !== 'PLATFORM_ADMIN') {
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'INFO',
          title: 'Welcome to CareerToDo!',
          message: 'Your account has been created. Please complete your profile.',
          priority: 'MEDIUM',
          read: false,
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
