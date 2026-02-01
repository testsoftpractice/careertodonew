import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden } from '@/lib/api-response'
import { z } from 'zod'

// Validation schemas
const createWorkSessionSchema = z.object({
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  type: z.enum(['ONSITE', 'REMOTE', 'HYBRID', 'BREAK', 'MEETING', 'TRAINING', 'RESEARCH']).default('ONSITE'),
  checkInLocation: z.string().max(200).optional(),
  checkOutLocation: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
})

const updateWorkSessionSchema = z.object({
  endTime: z.date().optional(),
  duration: z.number().min(0).optional(),
  checkOutLocation: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
})

// ==================== WORK SESSIONS API ====================

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.dbUser) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined
    const currentUser = authResult.dbUser

    const where: Record<string, any> = {}

    // If filtering by userId, only allow viewing own sessions or admin
    if (userId) {
      if (userId !== currentUser.id && currentUser.role !== 'PLATFORM_ADMIN') {
        return forbidden('You can only view your own work sessions')
      }
      where.userId = userId
    } else {
      // By default, show current user's sessions
      where.userId = currentUser.id
    }

    const workSessions = await db.workSession.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            location: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        task: {
          select: {
            id: true,
            title: true,
            priority: true,
            status: true,
          }
        }
      },
      orderBy: { startTime: 'desc' }
    })

    const totalHours = workSessions.reduce((sum, session) => sum + ((session.duration || 0) / 3600), 0)

    // Map fields to match frontend expectations
    const mappedSessions = workSessions.map(session => ({
      id: session.id,
      userId: session.userId,
      projectId: session.projectId,
      taskId: session.taskId,
      type: session.type,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime?.toISOString(),
      checkInTime: session.startTime.toISOString(),
      checkOutTime: session.endTime?.toISOString(),
      checkInLocation: session.checkInLocation,
      checkOutLocation: session.checkOutLocation,
      notes: session.notes,
      duration: session.duration ? Math.round(session.duration / 3600 * 100) / 100 : null, // Convert to hours with 2 decimals
      project: session.project,
      task: session.task,
      user: session.user,
    }))

    return NextResponse.json({
      success: true,
      data: mappedSessions,
      count: mappedSessions.length,
      totalHours: Math.round(totalHours * 100) / 100
    })
  } catch (error) {
    console.error('Work Sessions API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch work sessions'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const body = await request.json()

    // Validate request body
    const validation = createWorkSessionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues.map(issue => ({
          field: issue.path[0] || 'unknown',
          message: issue.message
        }))
      }, { status: 400 })
    }

    const data = validation.data!

    // Create work session
    const workSessionData: any = {
      userId: currentUser.id,
      type: data.type || 'ONSITE',
      startTime: new Date(),
      notes: data.notes,
      checkInLocation: data.checkInLocation,
    }

    // Optional: Link to project
    if (data.projectId) {
      workSessionData.projectId = data.projectId
    }

    // Optional: Link to task (either projectId OR taskId can be used, but not both)
    if (data.taskId) {
      workSessionData.taskId = data.taskId
    }

    const workSession = await db.workSession.create({
      data: workSessionData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        task: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: workSession.id,
        userId: workSession.userId,
        projectId: workSession.projectId,
        taskId: workSession.taskId,
        type: workSession.type,
        startTime: workSession.startTime.toISOString(),
        checkInLocation: workSession.checkInLocation,
        checkOutLocation: workSession.checkOutLocation,
        notes: workSession.notes,
        project: workSession.project,
        task: workSession.task,
        user: workSession.user,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Work Session creation error:', error)

    // Handle specific error types
    const errorMessage = error instanceof Error ? error.message : 'Failed to create work session'

    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.id as string

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Work Session ID is required'
      }, { status: 400 })
    }

    // Verify session ownership
    const existingSession = await db.workSession.findUnique({
      where: { id: sessionId }
    })

    if (!existingSession) {
      return NextResponse.json({
        success: false,
        error: 'Work session not found'
      }, { status: 404 })
    }

    // Only allow updating own sessions or admin
    if (existingSession.userId !== currentUser.id && currentUser.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'You can only update your own work sessions'
      }, { status: 403 })
    }

    const body = await request.json()

    // Validate request body
    const validation = updateWorkSessionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues.map(issue => ({
          field: issue.path[0] || 'unknown',
          message: issue.message
        }))
      }, { status: 400 })
    }

    const data = validation.data!

    const updateData: any = {}

    // Calculate duration if endTime is being set
    if (data.endTime) {
      const durationSeconds = Math.floor((data.endTime.getTime() - new Date(existingSession.startTime).getTime()) / 1000)
      updateData.duration = durationSeconds
    }

    if (data.duration) {
      updateData.duration = Math.floor(parseFloat(data.duration) * 3600)
    }

    if (data.checkOutLocation) {
      updateData.checkOutLocation = data.checkOutLocation
    }

    if (data.notes) {
      updateData.notes = data.notes
    }

    const workSession = await db.workSession.update({
      where: { id: sessionId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        task: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: workSession.id,
        userId: workSession.userId,
        projectId: workSession.projectId,
        taskId: workSession.taskId,
        type: workSession.type,
        startTime: workSession.startTime.toISOString(),
        endTime: workSession.endTime?.toISOString(),
        checkInTime: workSession.startTime.toISOString(),
        checkOutTime: workSession.endTime?.toISOString(),
        checkInLocation: workSession.checkInLocation,
        checkOutLocation: workSession.checkOutLocation,
        notes: workSession.notes,
        duration: workSession.duration ? Math.round(workSession.duration / 3600 * 100) / 100 : null,
        project: workSession.project,
        task: workSession.task,
        user: workSession.user,
      }
    })
  } catch (error) {
    // Handle AuthError specifically
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.statusCode })
    }

    console.error('Work Session update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update work session',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
