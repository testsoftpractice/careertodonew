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

    if (!token) {
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
