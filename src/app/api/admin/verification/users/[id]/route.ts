import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { VerificationStatus } from '@prisma/client'

// PATCH /api/admin/verification/users/[id] - Update individual user verification status
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

    const { id: userId } = await params
    const body = await request.json()
    const { status, reason } = body

    if (!status || !Object.values(VerificationStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification status' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user verification status
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        verificationStatus: status as VerificationStatus
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    // Create notification for user
    await db.notification.create({
      data: {
        userId,
        type: 'VERIFICATION_STATUS',
        title: 'Account Verification Status Changed',
        message: `Your account verification status has been updated to ${status}${reason ? `. Reason: ${reason}` : ''}`,
        link: '/dashboard'
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser
    })
  } catch (error: any) {
    console.error('Update user verification status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user verification status' },
      { status: 500 }
    )
  }
}
