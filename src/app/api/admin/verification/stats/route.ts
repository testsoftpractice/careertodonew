import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { VerificationStatus } from '@/lib/constants'
import { getCached, createDashboardStatsKey } from '@/lib/utils/cache'

// GET /api/admin/verification/stats - Get verification statistics
export async function GET(request: NextRequest) {
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

    const cacheKey = 'admin:verification:stats'

    // Use cache with 2 minute TTL
    return await getCached(cacheKey, async () => {
      // Calculate date for recent verifications
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      // Parallelize all independent queries
      const [userStatusCounts, userRoleStatusCounts, businessStatusCounts, universityStatusCounts, totalUsers, totalBusinesses, totalUniversities, recentVerifications, pendingUsers] = await Promise.all([
        db.user.groupBy({
          by: ['verificationStatus'],
          _count: {
            id: true
          }
        }),
        db.user.groupBy({
          by: ['role', 'verificationStatus'],
          _count: {
            id: true
          }
        }),
        db.business.groupBy({
          by: ['status'],
          _count: {
            id: true
          }
        }),
        db.university.groupBy({
          by: ['verificationStatus'],
          _count: {
            id: true
          }
        }),
        db.user.count(),
        db.business.count(),
        db.university.count(),
        db.user.count({
          where: {
            updatedAt: {
              gte: sevenDaysAgo
            }
          }
        }),
        db.user.count({
          where: {
            verificationStatus: {
              in: [VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW]
            }
          }
        })
      ])

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
    }, 120000) // 2 minutes TTL
  } catch (error: any) {
    console.error('Get verification stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch verification statistics' },
      { status: 500 }
    )
  }
}
