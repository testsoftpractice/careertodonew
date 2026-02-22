import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, errorResponse } from '@/lib/api-response'

// GET /api/work-sessions/active - Get active work session for current user
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    // Find the most recent active session (no endTime)
    const activeSession = await db.workSession.findFirst({
      where: {
        userId: currentUser.id,
        endTime: null, // Session is still active
      },
      orderBy: {
        startTime: 'desc', // Get the most recent session
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        Project: {
          select: {
            id: true,
            name: true,
          },
        },
        Task: {
          select: {
            id: true,
            title: true,
            priority: true,
            status: true,
          },
        },
      },
    })

    if (!activeSession) {
      return NextResponse.json({
        success: true,
        data: {
          session: null,
        },
      })
    }

    // Calculate current duration
    const currentDuration = Math.floor((Date.now() - new Date(activeSession.startTime).getTime()) / 1000)

    return NextResponse.json({
      success: true,
      data: {
        session: {
          id: activeSession.id,
          userId: activeSession.userId,
          projectId: activeSession.projectId,
          taskId: activeSession.taskId,
          type: activeSession.type,
          startTime: activeSession.startTime.toISOString(),
          checkInLocation: activeSession.checkInLocation,
          checkOutLocation: activeSession.checkOutLocation,
          notes: activeSession.notes,
          duration: currentDuration, // Current duration in seconds
          project: activeSession.Project,
          task: activeSession.Task,
          user: activeSession.User,
        },
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get active work session error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch active work session',
    }, { status: 500 })
  }
}
