import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VerificationStatus } from '@/lib/constants'

// GET /api/verification/[id] - Get a specific verification request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const verificationRequest = await db.verificationRequest.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      action, // 'approve' or 'reject'
      reviewNote,
    } = body

    const verificationRequest = await db.verificationRequest.findUnique({
      where: { id },
    })

    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      )
    }

    // Only pending requests can be updated
    if (verificationRequest.status !== VerificationStatus.PENDING) {
      return NextResponse.json(
        { error: 'This request has already been processed' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      const updatedRequest = await db.verificationRequest.update({
        where: { id },
        data: {
          status: VerificationStatus.VERIFIED,
          reviewedAt: new Date(),
          reviewNote,
        },
      })

      // Create notification for user
      await db.notification.create({
        data: {
          userId: verificationRequest.userId,
          type: 'VERIFICATION_STATUS',
          title: 'Verification Request Approved',
          message: 'Your verification request has been approved',
          link: `/dashboard/student/verifications/${id}`,
        },
      })

      return NextResponse.json({
        message: 'Verification request approved successfully',
        request: updatedRequest,
      })
    } else if (action === 'reject') {
      const updatedRequest = await db.verificationRequest.update({
        where: { id },
        data: {
          status: VerificationStatus.REJECTED,
          reviewedAt: new Date(),
          reviewNote,
        },
      })

      // Create notification for user
      await db.notification.create({
        data: {
          userId: verificationRequest.userId,
          type: 'VERIFICATION_STATUS',
          title: 'Verification Request Rejected',
          message: `Your verification request was rejected: ${reviewNote || 'No reason provided'}`,
          link: `/dashboard/student/verifications/${id}`,
        },
      })

      return NextResponse.json({
        message: 'Verification request rejected successfully',
        request: updatedRequest,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
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
