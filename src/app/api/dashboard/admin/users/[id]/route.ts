import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { z } from 'zod'

// Validation schema
const updateUserSchema = z.object({
  role: z.enum(['STUDENT', 'EMPLOYER', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN']).optional(),
  verificationStatus: z.enum(['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED']).optional(),
  isBanned: z.boolean().optional(),
  banReason: z.string().optional()
})

// PATCH /api/dashboard/admin/users/[id] - Update user (for admin)
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

    // Prevent admin from changing themselves
    if (decoded.id === userId) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify your own account' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate input
    const validationResult = updateUserSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validationResult.error },
        { status: 400 }
      )
    }

    const { role, verificationStatus, isBanned, banReason } = validationResult.data

    // Build update object
    const updateData: any = {}

    if (role) {
      updateData.role = role
    }

    if (verificationStatus) {
      updateData.verificationStatus = verificationStatus
    }

    if (isBanned !== undefined) {
      if (isBanned) {
        updateData.loginAttempts = 9999 // Effectively ban user
        updateData.verificationStatus = 'BANNED'
        updateData.banReason = banReason || 'Banned by administrator'
      } else {
        updateData.loginAttempts = 0 // Unban user
        updateData.banReason = null
        if (existingUser.verificationStatus === 'BANNED') {
          updateData.verificationStatus = 'PENDING'
        }
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData
    })

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

// DELETE /api/dashboard/admin/users/[id] - Delete user (for admin)
export async function DELETE(
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

    // Prevent admin from deleting themselves
    if (decoded.id === userId) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Delete user (cascade will handle related records)
    await db.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
