import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/student/achievements - Get student's achievements
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (result) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (result) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user's completed projects and tasks as achievements
    const completedProjects = await db.project.findMany({
      where: {
        ownerId: decoded.userId,
        status: 'COMPLETED'
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    })

    const completedTasks = await db.task.findMany({
      where: {
        assigneeId: decoded.userId,
        status: 'DONE'
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    })

    // Generate achievements from completed work
    const achievements = [
      {
        id: 'first-project',
        title: 'First Project',
        description: 'Completed your first project',
        icon: 'star' as const,
        category: 'project' as const,
        unlockedAt: completedProjects[0]?.createdAt || new Date(),
        rarity: 'common' as const
      },
      {
        id: 'task-master',
        title: 'Task Master',
        description: `Completed ${completedTasks.length} tasks`,
        icon: 'award' as const,
        category: 'project' as const,
        unlockedAt: completedTasks[0]?.createdAt || new Date(),
        rarity: completedTasks.length >= 10 ? 'epic' as const : completedTasks.length >= 5 ? 'rare' as const : 'common' as const
      },
      {
        id: 'collaborator',
        title: 'Team Player',
        description: 'Worked on multiple projects',
        icon: 'medal' as const,
        category: 'collaboration' as const,
        unlockedAt: new Date(),
        rarity: completedProjects.length >= 3 ? 'rare' as const : 'common' as const
      },
      {
        id: 'leader',
        title: 'Rising Leader',
        description: 'Led multiple projects to completion',
        icon: 'trophy' as const,
        category: 'leadership' as const,
        unlockedAt: new Date(),
        rarity: completedProjects.length >= 5 ? 'legendary' as const : completedProjects.length >= 2 ? 'epic' as const : 'rare' as const
      },
      {
        id: 'dedication',
        title: 'Dedicated Student',
        description: 'Maintained consistent project participation',
        icon: 'star' as const,
        category: 'milestone' as const,
        unlockedAt: new Date(),
        rarity: 'rare' as const
      },
      {
        id: 'excellence',
        title: 'Excellence Award',
        description: 'Achieved high performance scores',
        icon: 'award' as const,
        category: 'academic' as const,
        unlockedAt: new Date(),
        rarity: 'epic' as const
      }
    ]

    const totalUnlocked = achievements.length
    const totalAvailable = 10 // Mock total achievements

    return NextResponse.json({
      success: true,
      data: {
        achievements,
        totalUnlocked,
        totalAvailable
      }
    })
  } catch (error: any) {
    console.error('Get achievements error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}
