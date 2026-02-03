import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/student/schedule - Get student's schedule
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get student's tasks as schedule items (mock schedule)
    const tasks = await db.task.findMany({
      where: { assigneeId: decoded.userId },
      include: {
        project: {
          select: { name: true }
        }
      },
      orderBy: { dueDate: 'asc' },
      take: 10
    })

    // Transform tasks into schedule items
    const schedule = tasks.map((task, index) => {
      const day = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'][index % 5] as any
      const dueDate = task.dueDate ? new Date(task.dueDate) : new Date()

      return {
        id: task.id,
        courseCode: `CRS${task.project?.name.substring(0, 3).toUpperCase()}${index}`,
        courseName: task.project?.name || 'Project Work',
        day,
        startTime: dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(dueDate.getTime() + 3600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        location: 'Virtual / Remote',
        instructor: 'Project Lead',
        type: 'lecture' as const
      }
    })

    return NextResponse.json({
      success: true,
      data: schedule
    })
  } catch (error: any) {
    console.error('Get student schedule error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}
