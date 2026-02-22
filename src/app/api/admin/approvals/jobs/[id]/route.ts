import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { JobApprovalStatus } from '@/lib/constants'
import { successResponse, errorResponse, forbidden, notFound } from '@/lib/api-response'

// GET /api/admin/approvals/jobs/[id] - Get job details for review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only platform admins can access this endpoint')
    }

    const { id } = await params

    // Get job with full details
    const job = await db.job.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            bio: true,
            location: true,
            linkedinUrl: true,
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
            size: true,
          },
        },
        JobApplication: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                University: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
                major: true,
                graduationYear: true,
                totalPoints: true,
              },
            },
          },
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
        JobApproval: {
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
        _count: {
          select: {
            JobApplication: true,
          },
        },
      },
    })

    if (!job) {
      return notFound('Job not found')
    }

    return successResponse(job)
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get job for approval error:', error)
    return errorResponse('Failed to fetch job details', 500)
  }
}
// PATCH /api/admin/approvals/jobs/[id] - Reject a job
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only platform admins can reject jobs')
    }

    const { id } = await params
    const body = await request.json()
    const { rejectionReason, reviewComments } = body

    if (!rejectionReason) {
      return errorResponse('Rejection reason is required', 400)
    }

    // Check if job exists
    const job = await db.job.findUnique({
      where: { id },
      include: {
        Business: true,
      },
    })

    if (!job) {
      return notFound('Job not found')
    }

    // Update job approval status
    const updatedJob = await db.job.update({
      where: { id },
      data: {
        approvalStatus: 'REJECTED',
        rejectionReason: rejectionReason,
        reviewComments: reviewComments || null,
        status: 'CLOSED',
      },
    })

    // Create approval record
    const approval = await db.jobApproval.create({
      data: {
        jobId: id,
        adminId: currentUser.id,
        status: 'REJECTED',
        comments: `${rejectionReason}\n\n${reviewComments || ''}`.trim(),
      },
    })

    // Create notification for business
    if (job.businessId && job.Business) {
      await db.notification.create({
        data: {
          userId: job.Business.ownerId,
          type: 'JOB_APPROVAL',
          title: '❌ Job Not Approved',
          message: `Your job "${job.title}" was not approved. Reason: ${rejectionReason}`,
          link: `/jobs/${id}`,
        },
      })
    }

    return successResponse(
      {
        job: updatedJob,
        approval,
      },
      'Job rejected successfully'
    )
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Reject job error:', error)
    return errorResponse('Failed to reject job', 500)
  }
}
