import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { VerificationStatus } from '@prisma/client'

// GET /api/admin/verification/stats - Get verification statistics
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

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Get user counts by status
    const userStatusCounts = await db.user.groupBy({
      by: ['verificationStatus'],
      _count: {
        id: true
      }
    })

    // Get user counts by role and status
    const userRoleStatusCounts = await db.user.groupBy({
      by: ['role', 'verificationStatus'],
      _count: {
        id: true
      }
    })

    // Get business status counts
    const businessStatusCounts = await db.business.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Get university status counts
    const universityStatusCounts = await db.university.groupBy({
      by: ['verificationStatus'],
      _count: {
        id: true
      }
    })

    // Total counts
    const totalUsers = await db.user.count()
    const totalBusinesses = await db.business.count()
    const totalUniversities = await db.university.count()

    // Recent verifications (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentVerifications = await db.user.count({
      where: {
        updatedAt: {
          gte: sevenDaysAgo
        }
      }
    })

    // Pending verifications
    const pendingUsers = await db.user.count({
      where: {
        verificationStatus: {
          in: [VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW]
        }
      }
    })

    // Format user status counts
    const userStats = {
      total: totalUsers,
      byStatus: userStatusCounts.reduce((acc, item) => {
        acc[item.verificationStatus] = item._count.id
        return acc
      }, {} as Record<string, number>),
      byRoleAndStatus: userRoleStatusCounts.reduce((acc, item) => {
        if (!acc[item.role]) {
          acc[item.role] = {}
        }
        acc[item.role][item.verificationStatus] = item._count.id
        return acc
      }, {} as Record<string, Record<string, number>>)
    }

    // Format business status counts
    const businessStats = {
      total: totalBusinesses,
      byStatus: businessStatusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.id
        return acc
      }, {} as Record<string, number>)
    }

    // Format university status counts
    const universityStats = {
      total: totalUniversities,
      byStatus: universityStatusCounts.reduce((acc, item) => {
        acc[item.verificationStatus] = item._count.id
        return acc
      }, {} as Record<string, number>)
    }

    return NextResponse.json({
      success: true,
      data: {
        userStats,
        businessStats,
        universityStats,
        recentVerifications,
        pendingUsers
      }
    })
  } catch (error: any) {
    console.error('Get verification stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch verification statistics' },
      { status: 500 }
    )
  }
}
