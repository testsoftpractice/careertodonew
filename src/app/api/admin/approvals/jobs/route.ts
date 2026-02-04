import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, getUserFromRequest } from '@/lib/api/auth-middleware'
import { JobApprovalStatus } from '@prisma/client'
import { successResponse, errorResponse, forbidden, notFound } from '@/lib/api-response'

// GET /api/admin/approvals/jobs - List all jobs pending approval
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('status' in auth) return auth

    const user = getUserFromRequest(request)
    if (!user || user.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only platform admins can access this endpoint')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as JobApprovalStatus | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    // Build where clause
    const where: any = {}

    if (status) {
      where.approvalStatus = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { type: { contains: search } },
        { department: { contains: search } },
      ]
    }

    // Get jobs with approval status
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
            location: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            description: true,
            industry: true,
            location: true,
            website: true,
          },
        },
        applications: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        approvals: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Get counts
    const totalCount = await db.job.count({ where })
    const pendingCount = await db.job.count({
      where: { approvalStatus: 'PENDING' }
    })
    const underReviewCount = await db.job.count({
      where: { approvalStatus: 'UNDER_REVIEW' }
    })
    const approvedCount = await db.job.count({
      where: { approvalStatus: 'APPROVED' }
    })

    return successResponse({
      jobs,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        pending: pendingCount,
        underReview: underReviewCount,
        approved: approvedCount,
        total: totalCount,
      },
    })
  } catch (error: any) {
    console.error('Get job approvals error:', error)
    return errorResponse('Failed to fetch job approvals', 500)
  }
}
// POST /api/admin/approvals/jobs - Approve a job
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('status' in auth) return auth

    const user = getUserFromRequest(request)
    if (!user || user.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only platform admins can approve jobs')
    }

    const body = await request.json()
    const { jobId, comments } = body

    if (!jobId) {
      return errorResponse('Job ID is required', 400)
    }

    // Check if job exists
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        business: true,
      },
    })

    if (!job) {
      return notFound('Job not found')
    }

    // Update job approval status
    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: user.id,
        reviewComments: comments || null,
        rejectionReason: null,
        status: 'ACTIVE',
      },
    })

    // Create approval record
    const approval = await db.jobApproval.create({
      data: {
        jobId: jobId,
        adminId: user.id,
        status: 'APPROVED',
        comments: comments || null,
      },
    })

    // Create notification for business
    if (job.businessId) {
      await db.notification.create({
        data: {
          userId: job.business.userId,
          type: 'JOB_APPROVAL',
          title: '🎉 Job Approved!',
          message: `Your job "${job.title}" has been approved and published.`,
          link: `/jobs/${jobId}`,
        },
      })
    }

    return successResponse(
      {
        job: updatedJob,
        approval,
      },
      'Job approved successfully'
    )
  } catch (error: any) {
    console.error('Approve job error:', error)
    return errorResponse('Failed to approve job', 500)
  }
}
