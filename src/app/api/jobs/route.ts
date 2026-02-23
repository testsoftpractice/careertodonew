import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { logError, formatErrorResponse, AppError, UnauthorizedError } from '@/lib/utils/error-handler'

// GET /api/jobs - List jobs with filters
export async function GET(request: NextRequest) {
  try {
    console.log('[JOBS API] =============== START ===============')
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const published = searchParams.get('published')

    console.log('[JOBS API] Query params:', { userId, businessId, status, type, published })

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
        console.log('[JOBS API] Authenticated user:', { authUserId, userRole })
      } else {
        console.log('[JOBS API] No auth token found - showing only approved jobs')
      }
    } catch (e) {
      console.log('[JOBS API] Auth error - treating as unauthenticated:', e)
    }

    // Build where clause
    const where: any = {}

    // Apply filters
    if (userId) {
      where.userId = userId
    }

    if (businessId) {
      where.businessId = businessId
    }

    // Only apply type filter if it's a valid type (not 'all')
    if (type && type !== 'all') {
      where.type = type
    }

    if (status && status !== 'all') {
      where.status = status
    }

    // Platform admins see everything
    if (userRole === 'PLATFORM_ADMIN') {
      console.log('[JOBS API] User is PLATFORM_ADMIN - showing all jobs')
      // Don't add any visibility restrictions
    } else if (!authUserId) {
      // Not logged in - only show APPROVED jobs
      console.log('[JOBS API] Not logged in - filtering for APPROVED jobs only')
      where.approvalStatus = 'APPROVED'
    } else {
      // Logged in user - show APPROVED jobs OR own jobs
      console.log('[JOBS API] Logged in user - showing APPROVED or own jobs')
      where.OR = [
        { approvalStatus: 'APPROVED' },
        { userId: authUserId },
      ]
    }

    console.log('[JOBS API] Final where clause:', JSON.stringify(where, null, 2))

    const jobs = await db.job.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        Business: {
          select: {
            id: true,
            name: true,
            industry: true,
            location: true,
          },
        },
        JobApplication: {
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

    console.log('[JOBS API] Found jobs count:', jobs.length)
    console.log('[JOBS API] Jobs approval statuses:', jobs.map(j => ({ id: j.id, title: j.title, approvalStatus: j.approvalStatus, published: j.published })))

    // Parse metadata and add computed fields
    const parsedJobs = jobs.map(job => {
      let metadata = {}
      try {
        metadata = job.metadata ? JSON.parse(job.metadata) : {}
      } catch (e) {
        console.error('Failed to parse job metadata:', e)
      }

      return {
        ...job,
        companyName: (metadata as any).companyName || job.Business?.name || 'Unknown Company',
        category: (metadata as any).category || null,
        positions: (metadata as any).positions || '1',
        requirements: (metadata as any).requirements || [],
        responsibilities: (metadata as any).responsibilities || [],
        benefits: (metadata as any).benefits || [],
        salaryRange: job.salaryMin && job.salaryMax 
          ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
          : job.salary || 'Not specified',
      }
    })

    console.log('[JOBS API] =============== END ===============')

    return NextResponse.json({
      success: true,
      data: {
        jobs: parsedJobs,
        count: parsedJobs.length,
      },
    })
  } catch (error) {
    console.error('[JOBS API] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch jobs',
    }, { status: 500 })
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  let userId: string = ''
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

    if (!decoded.userId) {
      throw new UnauthorizedError('Invalid user token')
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
        approvalStatus: 'PENDING' as any, // Jobs should be PENDING for admin approval
        submissionDate: new Date(),
        metadata: JSON.stringify(metadata),
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        Business: {
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
