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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id: verificationId } = await params
    const body = await request.json()

    // Validate input
    const validationResult = verificationActionSchema.safeParse(body)
    if (!validationResult.success) {
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
        User: true
      }
    })

    if (!verificationRequest) {
      return NextResponse.json(
        { success: false, error: 'Verification request not found' },
        { status: 404 }
      )
    }

    // Update user verification status based on action
    const newStatus = action === 'approve' ? 'VERIFIED' : 'REJECTED'
    await db.user.update({
      where: { id: verificationRequest.User.id },
      data: { verificationStatus: newStatus }
    })

    // Update verification request
    const updatedRequest = await db.verificationRequest.update({
      where: { id: verificationId },
      data: {
        status: action === 'approve' ? 'VERIFIED' : 'REJECTED',
        reviewedAt: new Date(),
        reviewNote: reason
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
