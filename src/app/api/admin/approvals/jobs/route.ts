import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { JobApprovalStatus } from '@/lib/constants'
import { successResponse, errorResponse, forbidden, notFound } from '@/lib/api-response'

// GET /api/admin/approvals/jobs - List all jobs pending approval
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN') {
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
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            location: true,
          },
        },
        Business: {
          select: {
            id: true,
            name: true,
            description: true,
            industry: true,
            location: true,
            website: true,
          },
        },
        JobApplication: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        JobApproval: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            User: {
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
            JobApplication: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

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
        business: job.Business || { id: '', name: 'Unknown Company', industry: 'N/A', location: 'N/A', description: '', website: '' },
      }
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
    const rejectedCount = await db.job.count({
      where: { approvalStatus: 'REJECTED' }
    })

    return successResponse({
      jobs: parsedJobs,
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
        rejected: rejectedCount,
        total: totalCount,
      },
    })
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get job approvals error:', error)
    return errorResponse('Failed to fetch job approvals', 500)
  }
}
// POST /api/admin/approvals/jobs - Approve a job
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN') {
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
        Business: true,
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
        approvedBy: currentUser.id,
        reviewComments: comments || null,
        rejectionReason: null,
        status: 'ACTIVE',
      },
    })

    // Create approval record
    const approval = await db.jobApproval.create({
      data: {
        jobId: jobId,
        adminId: currentUser.id,
        status: 'APPROVED',
        comments: comments || null,
      },
    })

    // Create notification for business owner
    if (job.businessId && job.Business) {
      await db.notification.create({
        data: {
          userId: job.Business.ownerId,
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
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Approve job error:', error)
    return errorResponse('Failed to approve job', 500)
  }
}
