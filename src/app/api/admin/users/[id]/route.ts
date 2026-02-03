import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// PATCH /api/admin/users/[id] - Update user (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

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
    const { verificationStatus, role } = body

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

    // Build update object
    const updateData: any = {}

    if (verificationStatus) {
      updateData.verificationStatus = verificationStatus
    }

    if (role) {
      updateData.role = role
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData
    })

    // Create notification for the user
    if (verificationStatus) {
      await db.notification.create({
        data: {
          userId: userId,
          type: 'INFO',
          title: 'Account Status Updated',
          message: `Your account has been ${verificationStatus.toLowerCase()}`,
          link: '/dashboard'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    })
  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
