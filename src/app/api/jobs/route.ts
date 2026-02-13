import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { logError, formatErrorResponse, AppError, UnauthorizedError } from '@/lib/utils/error-handler'
import { buildJobVisibilityWhereClause } from '@/lib/visibility-controls'

// GET /api/jobs - List jobs with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const published = searchParams.get('published')

    const where: any = {}

    // Apply filters
    if (userId) {
      where.userId = userId
    }

    if (businessId) {
      where.businessId = businessId
    }

    if (published === 'true') {
      where.published = true
    } else if (published === 'false') {
      where.published = false
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    // Get user info for visibility control
    let userRole: string | null = null
    let authUserId: string | null = null

    // Try to get auth info if available
    try {
      const tokenCookie = request.cookies.get('token')
      const token = tokenCookie?.value
      if (token) {
        const decoded = verifyToken(token)
        authUserId = decoded.userId
        userRole = decoded.role
      }
    } catch (e) {
      // Not authenticated - that's fine, will show only approved jobs
    }

    // Apply visibility control
    const visibilityWhere = buildJobVisibilityWhereClause(authUserId, userRole, where)

    const jobs = await db.job.findMany({
      where: visibilityWhere,
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
        applications: {
          select: {
            id: true,
            status: true,
          },
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
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      throw new UnauthorizedError('Authentication required')
    }

    const decoded = verifyToken(token)
    if (!decoded) {
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
      throw new AppError('Job title is required', 'VALIDATION_ERROR', 400)
    }

    // Prepare metadata for additional fields
    const metadata = {
      companyName: body.companyName || null,
      category: body.category || null,
      positions: String(body.positions || '1'),
      requirements: body.requirements || [],
      responsibilities: body.responsibilities || [],
      benefits: body.benefits || [],
      applicationUrl: body.applicationUrl || null,
      isRemote: body.isRemote || false,
      remoteLocations: body.remoteLocations || [],
      universityIds: body.universityIds || [],
      targetByReputation: body.targetByReputation || false,
      minReputation: body.minReputation !== null ? String(body.minReputation) : undefined,
    }

    // Create job with PENDING approval status
    const job = await db.job.create({
      data: {
        userId: userId,
        businessId: body.businessId ?? undefined,
        title: body.title,
        description: body.description ?? undefined,
        type: body.type ?? 'FULL_TIME',
        employmentType: body.employmentType ?? 'FULL_TIME',
        location: body.location ?? undefined,
        salary: body.salary ?? undefined,
        salaryMin: body.salaryRange?.min ? parseFloat(body.salaryRange.min) : undefined,
        salaryMax: body.salaryRange?.max ? parseFloat(body.salaryRange.max) : undefined,
        department: body.department ?? undefined,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        published: false, // Always start as not published
        publishedAt: undefined,
        approvalStatus: 'DRAFT' as any,
        metadata: JSON.stringify(metadata),
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
