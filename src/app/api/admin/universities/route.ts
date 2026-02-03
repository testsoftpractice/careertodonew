import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { UniversityVerificationStatus } from '@prisma/client'
import { z } from 'zod'

// Validation schema for creating/updating university
const universitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters'),
  description: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  rankingScore: z.number().optional(),
  rankingPosition: z.number().optional(),
})

// GET /api/admin/universities - List all universities
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

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

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (status) {
      where.verificationStatus = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get universities with counts
    const [universities, totalCount] = await Promise.all([
      db.university.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.university.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        universities,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error: any) {
    console.error('Get universities error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}

// POST /api/admin/universities - Create a new university
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

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
    const validationResult = universitySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validationResult.error },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if university code already exists
    const existingUniversity = await db.university.findUnique({
      where: { code: data.code }
    })

    if (existingUniversity) {
      return NextResponse.json(
        { success: false, error: 'University with this code already exists' },
        { status: 400 }
      )
    }

    // Create university
    const university = await db.university.create({
      data: {
        name: data.name,
        code: data.code.toUpperCase(),
        description: data.description,
        location: data.location,
        website: data.website || null,
        rankingScore: data.rankingScore,
        rankingPosition: data.rankingPosition,
        verificationStatus: UniversityVerificationStatus.PENDING,
        totalStudents: 0,
        totalProjects: 0,
      }
    })

    return NextResponse.json({
      success: true,
      data: university,
      message: 'University created successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create university error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create university' },
      { status: 500 }
    )
  }
}
