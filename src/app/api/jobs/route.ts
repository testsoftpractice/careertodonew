import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt-edge'
import { logError, formatErrorResponse, AppError, UnauthorizedError } from '@/lib/utils/error-handler'

// ==================== JOBS API - WITH UNIVERSITY TARGETING ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employerId = searchParams.employerId as string | undefined
    const status = searchParams.status as string | undefined
    const type = searchParams.type as string | undefined
    const remote = searchParams.remote as string | undefined
    const universityId = searchParams.universityId as string | undefined
    const minReputation = searchParams.minReputation as string | undefined

    const where: any = {}

    // Apply filters
    if (employerId) {
      where.employerId = employerId
    }

    if (status) {
      where.status = status as any
    }

    if (type) {
      where.type = type as any
    }

    if (remote) {
      where.remote = remote === 'true'
    }

    if (universityId) {
      where.universityId = universityId
    }

    // Reputation filter
    if (minReputation) {
      // Filter students by minimum reputation score
      // This is implemented in a future enhancement
    }

    const jobs = await db.job.findMany({
      where,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            companyWebsite: true,
            avatar: true,
          },
        },
        university: {
          select: {
            id: true,
            name: true,
            code: true,
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

export async function POST(request: NextRequest) {
  let userId: string | null = null
  try {
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
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        universityId: true,
        university: { select: { id: true, name: true, code: true, location: true } },
      },
    })

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    // Check if user is an employer or platform admin
    if (user.role !== 'EMPLOYER' && user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Only employers and platform admins can create jobs',
      }, { status: 403 })
    }

    const body = await request.json()

    // Create job with university targeting
    const job = await db.job.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        employerId: userId,
        type: body.type,
        salaryMin: body.salaryMin ? parseFloat(body.salaryMin) : null,
        salaryMax: body.salaryMax ? parseFloat(body.salaryMax) : null,
        salaryType: body.salaryType,
        location: body.location,
        remote: body.remote || false,
        requirements: body.requirements || [],
        responsibilities: body.responsibilities || [],
        benefits: body.benefits || [],
        applicationUrl: body.applicationUrl || null,
        positions: body.positions || 1,
        deadline: body.deadline ? new Date(body.deadline) : null,
      }
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
