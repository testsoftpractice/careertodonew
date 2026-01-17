import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VerificationRequestStatus } from '@prisma/client'

// GET /api/verification/[id] - Get a specific verification request
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const verificationRequest = await db.verificationRequest.findUnique({
      where: { id: params.id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            university: {
              select: {
                id: true,
                name: true,
              },
            },
            records: {
              orderBy: { createdAt: 'desc' },
              take: 50,
            },
            receivedRatings: {
              include: {
                rater: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
              take: 20,
            },
            projectMemberships: {
              include: {
                project: {
                  select: {
                    id: true,
                    title: true,
                    category: true,
                    status: true,
                  },
                },
              },
              orderBy: { startDate: 'desc' },
            },
          },
        },
      },
    })

    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (verificationRequest.expiresAt && new Date() > verificationRequest.expiresAt) {
      // Update to expired
      await db.verificationRequest.update({
        where: { id: params.id },
        data: { status: VerificationRequestStatus.EXPIRED },
      })
    }

    return NextResponse.json({ request: verificationRequest })
  } catch (error) {
    console.error('Get verification request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/verification/[id] - Update verification request (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      action, // 'approve' or 'reject'
      approvedBy,
      rejectionReason,
      employerRating,
      employerComment,
    } = body

    const verificationRequest = await db.verificationRequest.findUnique({
      where: { id: params.id },
    })

    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      )
    }

    // Only pending requests can be updated
    if (verificationRequest.status !== VerificationRequestStatus.PENDING) {
      return NextResponse.json(
        { error: 'This request has already been processed' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      const updatedRequest = await db.verificationRequest.update({
        where: { id: params.id },
        data: {
          status: VerificationRequestStatus.APPROVED,
          approvedBy,
          approvedAt: new Date(),
          accessedAt: new Date(),
          accessCount: { increment: 1 },
        },
      })

      // Create notification for employer
      await db.notification.create({
        data: {
          userId: verificationRequest.requesterId,
          type: 'VERIFICATION_REQUEST',
          title: 'Verification Request Approved',
          message: `Your verification request for ${verificationRequest.subjectId} has been approved`,
          link: `/dashboard/employer/verification/${params.id}`,
        },
      })

      return NextResponse.json({
        message: 'Verification request approved successfully',
        request: updatedRequest,
      })
    } else if (action === 'reject') {
      const updatedRequest = await db.verificationRequest.update({
        where: { id: params.id },
        data: {
          status: VerificationRequestStatus.REJECTED,
          rejectionReason,
        },
      })

      // Create notification for employer
      await db.notification.create({
        data: {
          userId: verificationRequest.requesterId,
          type: 'VERIFICATION_REQUEST',
          title: 'Verification Request Rejected',
          message: `Your verification request was rejected: ${rejectionReason}`,
          link: `/dashboard/employer/verification/${params.id}`,
        },
      })

      return NextResponse.json({
        message: 'Verification request rejected successfully',
        request: updatedRequest,
      })
    } else if (action === 'rate') {
      // Employer can rate the subject after verification
      const updatedRequest = await db.verificationRequest.update({
        where: { id: params.id },
        data: {
          employerRating: employerRating ? parseFloat(employerRating) : null,
          employerComment,
          ratedAt: new Date(),
        },
      })

      // Create a rating record for the user
      if (employerRating) {
        await db.rating.create({
          data: {
            raterId: verificationRequest.requesterId,
            ratedId: verificationRequest.subjectId,
            dimension: 'EXECUTION', // Default dimension for employer ratings
            source: 'EMPLOYER',
            score: parseFloat(employerRating),
            comment: employerComment,
          },
        })

        // Update user's reputation scores
        const ratings = await db.rating.findMany({
          where: { ratedId: verificationRequest.subjectId },
        })

        const avgExecution = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length

        await db.user.update({
          where: { id: verificationRequest.subjectId },
          data: { executionScore: avgExecution },
        })
      }

      return NextResponse.json({
        message: 'Employer rating submitted successfully',
        request: updatedRequest,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve", "reject", or "rate"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Update verification request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
