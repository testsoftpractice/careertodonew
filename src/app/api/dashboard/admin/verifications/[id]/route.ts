import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { z } from 'zod'

const verificationActionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional()
})

// PATCH /api/dashboard/admin/verifications/[id] - Approve or reject verification
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (result) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (result) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const verificationId = params.id
    const body = await request.json()

    // Validate input
    const validationResult = verificationActionSchema.safeParse(body)
    if (result) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validationResult.error },
        { status: 400 }
      )
    }

    const { action, reason } = validationResult.data

    // Check if verification request exists
    const verificationRequest = await db.verificationRequest.findUnique({
      where: { id: verificationId },
      include: {
        user: true
      }
    })

    if (result) {
      return NextResponse.json(
        { success: false, error: 'Verification request not found' },
        { status: 404 }
      )
    }

    // Update user verification status based on action
    const newStatus = action === 'approve' ? 'VERIFIED' : 'REJECTED'
    await db.user.update({
      where: { id: verificationRequest.user.id },
      data: { verificationStatus: newStatus }
    })

    // Update verification request
    const updatedRequest = await db.verificationRequest.update({
      where: { id: verificationId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        reviewedBy: decoded.userId,
        reviewedAt: new Date(),
        rejectionReason: reason
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: `Verification ${action}ed successfully`
    })
  } catch (error: any) {
    console.error('Verification action error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process verification' },
      { status: 500 }
    )
  }
}
