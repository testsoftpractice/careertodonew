import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCached, createDashboardStatsKey } from '@/lib/utils/cache'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const cacheKey = createDashboardStatsKey(userId)

    // Fetch data directly (no caching for now to avoid stream issues)
    const [totalProjects, activeProjects, completedProjects, tasksCompleted, tasksPending, tasksInProgress, user, recentActivityCount] = await Promise.all([
      db.project.count({ where: { ownerId: userId } }),
      db.project.count({ where: { ownerId: userId, status: 'IN_PROGRESS' } }),
      db.project.count({ where: { ownerId: userId, status: 'COMPLETED' } }),
      db.task.count({ where: { taskAssignees: { some: { userId } }, status: 'DONE' } }),
      db.task.count({ where: { taskAssignees: { some: { userId } }, status: 'TODO' } }),
      db.task.count({ where: { taskAssignees: { some: { userId } }, status: 'IN_PROGRESS' } }),
      db.user.findUnique({
        where: { id: userId },
        select: {
          executionScore: true,
          collaborationScore: true,
          leadershipScore: true,
          ethicsScore: true,
          reliabilityScore: true,
        }
      }).catch(() => null), // Handle user not found gracefully
      db.notification.count({ where: { userId, read: false } }).catch(() => 0), // Handle count errors gracefully
    ])

      const breakdown = {
        execution: user?.executionScore || 0,
        collaboration: user?.collaborationScore || 0,
        leadership: user?.leadershipScore || 0,
        ethics: user?.ethicsScore || 0,
        reliability: user?.reliabilityScore || 0,
      }

      const stats = {
        totalProjects,
        activeProjects,
        completedProjects,
        tasksCompleted,
        tasksPending,
        tasksInProgress,
        overallRating: ((breakdown.execution + breakdown.collaboration + breakdown.leadership + breakdown.ethics + breakdown.reliability) / 5).toFixed(1),
        breakdown,
        recentActivityCount,
      }

      return NextResponse.json({
        success: true,
        data: stats,
      }, {
        headers: {
          'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60',
        },
      })
  } catch (error) {
    console.error('Get student stats error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch student statistics',
    }, { status: 500 })
  }
}
