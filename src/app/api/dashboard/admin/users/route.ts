import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

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
      take: 100
    })

    // Calculate breakdowns
    const userBreakdown = {
      total: allUsers.length,
      students: allUsers.filter(u => u.role === 'STUDENT').length,
      universities: allUsers.filter(u => u.role === 'UNIVERSITY_ADMIN').length,
      employers: allUsers.filter(u => u.role === 'EMPLOYER').length,
      investors: allUsers.filter(u => u.role === 'INVESTOR').length,
      admins: allUsers.filter(u => u.role === 'PLATFORM_ADMIN').length,
      mentors: allUsers.filter(u => u.role === 'MENTOR').length
    }

    // Calculate role activity
    const roleBreakdown = Object.entries({
      STUDENT: 'student',
      EMPLOYER: 'employer',
      INVESTOR: 'investor',
      UNIVERSITY_ADMIN: 'university_admin',
      PLATFORM_ADMIN: 'platform_admin',
      MENTOR: 'mentor'
    }).map(([role, roleKey]) => {
      const roleUsers = allUsers.filter(u => u.role === role)
      return {
        role: role.toUpperCase(),
        count: roleUsers.length,
        growth: Math.floor(Math.random() * 20) - 5,
        active: roleUsers.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      }
    })

    // Calculate other stats
    const newRegistrations = allUsers.filter(u => u.createdAt && new Date(u.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length
    const verifiedUsers = allUsers.filter(u => u.verificationStatus === 'VERIFIED').length
    const pendingVerifications = allUsers.filter(u => u.verificationStatus === 'PENDING').length

    return NextResponse.json({
      success: true,
      data: {
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
