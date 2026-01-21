import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { logError, formatErrorResponse, AppError, UnauthorizedError } from '@/lib/utils/error-handler'

// GET /api/jobs - List jobs with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}

    // Apply filters
    if (userId) {
      where.userId = userId
    }

    if (businessId) {
      where.businessId = businessId
    }

    if (status === 'published') {
      where.published = true
    }

    if (status === 'draft') {
      where.published = false
    }

    if (type && type !== 'all') {
      where.type = type
    }

    const jobs = await db.job.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            industry: true,
            location: true,
          },
        },
        _count: {
          applications: true,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        count: jobs.length,
      },
    })
  } catch (error) {
    console.error('Jobs API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch jobs',
    }, { status: 500 })
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  let userId: string | null = null
  try {
    // Authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      throw new UnauthorizedError('Authentication required')
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId || !decoded.role) {
      throw new UnauthorizedError('Invalid token')
    }

    userId = decoded.userId

    // Authorization - Check if user can post jobs
    const canPostJobs =
      decoded.role === 'EMPLOYER' ||
      decoded.role === 'PLATFORM_ADMIN' ||
      decoded.role === 'UNIVERSITY_ADMIN'

    if (!canPostJobs) {
      return NextResponse.json({
        success: false,
        error: 'Only employers, university admins, and platform admins can create jobs',
      }, { status: 403 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      throw new AppError('Job title is required', 400)
    }

    // Create job
    const job = await db.job.create({
      data: {
        userId: userId,
        businessId: body.businessId || null,
        title: body.title,
        description: body.description || null,
        type: body.type || 'FULL_TIME',
        location: body.location || null,
        salary: body.salary || null,
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: job,
      message: 'Job created successfully',
    }, { status: 201 })
  } catch (error: any) {
    logError(error, 'Create job', userId || 'unknown')

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create job',
    }, { status: 500 })
  }
}
