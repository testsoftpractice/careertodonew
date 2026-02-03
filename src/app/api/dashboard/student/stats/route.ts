import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Get counts
    const totalProjects = await db.project.count({ where: { ownerId: userId } })
    const activeProjects = await db.project.count({ where: { ownerId: userId, status: 'IN_PROGRESS' } })
    const completedProjects = await db.project.count({ where: { ownerId: userId, status: 'COMPLETED' } })

    const tasksCompleted = await db.task.count({ where: { assignedTo: userId, status: 'DONE' } })
    const tasksPending = await db.task.count({ where: { assignedTo: userId, status: 'TODO' } })
    const tasksInProgress = await db.task.count({ where: { assignedTo: userId, status: 'IN_PROGRESS' } })

    // Get user with their scores
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        executionScore: true,
        collaborationScore: true,
        leadershipScore: true,
        ethicsScore: true,
        reliabilityScore: true,
      }
    })

    const breakdown = {
      execution: user?.executionScore || 0,
      collaboration: user?.collaborationScore || 0,
      leadership: user?.leadershipScore || 0,
      ethics: user?.ethicsScore || 0,
      reliability: user?.reliabilityScore || 0,
    }

    const recentActivityCount = await db.notification.count({ where: { userId, read: false } })

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
    })
  } catch (error) {
    console.error('Get student stats error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch student statistics',
    }, { status: 500 })
  }
}
