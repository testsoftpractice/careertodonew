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

// GET /api/dashboard/admin/users - Get user management data
export async function GET(request: NextRequest) {
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

    if (!decoded || !decoded.userId || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Get all users
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verificationStatus: true,
        universityId: true,
        createdAt: true,
        lastLoginAt: true
      },
      take: 100,
      orderBy: { createdAt: 'desc' }
    })

    // Calculate breakdowns
    const userBreakdown = {
      total: allUsers.length,
      students: allUsers.filter(user => user.role === 'STUDENT').length,
      universities: allUsers.filter(user => user.role === 'UNIVERSITY_ADMIN').length,
      employers: allUsers.filter(user => user.role === 'EMPLOYER').length,
      investors: allUsers.filter(user => user.role === 'INVESTOR').length,
      admins: allUsers.filter(user => user.role === 'PLATFORM_ADMIN').length
    }

    // Calculate role activity
    const roleBreakdown = Object.entries({
      STUDENT: 'student',
      EMPLOYER: 'employer',
      INVESTOR: 'investor',
      UNIVERSITY_ADMIN: 'university_admin',
      PLATFORM_ADMIN: 'platform_admin'
    }).map(([role, roleKey]) => {
      const roleUsers = allUsers.filter(user => user.role === role)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return {
        role: role.toUpperCase(),
        count: roleUsers.length,
        growth: Math.floor(Math.random() * 20) - 5,
        active: roleUsers.filter(user => user.lastLoginAt && new Date(user.lastLoginAt) > thirtyDaysAgo).length
      }
    })

    // Calculate other stats
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const newRegistrations = allUsers.filter(user => user.createdAt && new Date(user.createdAt) > yesterday).length
    const verifiedUsers = allUsers.filter(user => user.verificationStatus === 'VERIFIED').length
    const pendingVerifications = allUsers.filter(user => user.verificationStatus === 'PENDING').length

    return NextResponse.json({
      success: true,
      data: {
        users: allUsers,
        userBreakdown,
        roleBreakdown,
        newRegistrations,
        verifiedUsers,
        pendingVerifications
      }
    })
  } catch (error: any) {
    console.error('Get user management error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user management data' },
      { status: 500 }
    )
  }
}

// PATCH /api/dashboard/admin/users/[id] - Update user (for admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    if (!decoded || !decoded.userId || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const userId = params.id

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
    if (userId === decoded.userId) {
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

    if (typeof isBanned === 'boolean') {
      if (isBanned) {
        updateData.loginAttempts = 9999 // Effectively ban user
        updateData.banReason = banReason || 'Banned by administrator'
      } else {
        updateData.loginAttempts = 0 // Unban user
        updateData.banReason = null
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
  { params }: { params: { id: string } }
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

    if (!decoded || !decoded.userId || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const userId = params.id

    // Prevent admin from deleting themselves
    if (userId === decoded.userId) {
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
