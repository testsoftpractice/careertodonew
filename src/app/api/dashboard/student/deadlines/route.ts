import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/student/deadlines - Get student's upcoming deadlines
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

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user's tasks as deadlines
    const tasks = await db.task.findMany({
      where: {
        taskAssignees: { some: { userId: decoded.userId } },
        status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] }
      },
      include: {
        project: {
          select: { name: true }
        }
      },
      orderBy: { dueDate: 'asc' },
      take: 10
    })

    // Transform tasks to deadlines
    const deadlines = tasks.map(task => {
      const priorityMap = {
        'CRITICAL': 'high' as const,
        'HIGH': 'high' as const,
        'MEDIUM': 'medium' as const,
        'LOW': 'low' as const
      }

      return {
        id: task.id,
        title: task.title,
        type: 'task' as const,
        dueDate: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: priorityMap[task.priority] || 'medium',
        project: task.project?.name || 'Unknown Project',
        status: task.status === 'DONE' ? 'submitted' as const : task.status === 'IN_PROGRESS' ? 'in_progress' as const : 'pending' as const
      }
    })

    return NextResponse.json({
      success: true,
      data: deadlines
    })
  } catch (error: any) {
    console.error('Get deadlines error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deadlines' },
      { status: 500 }
    )
  }
}
