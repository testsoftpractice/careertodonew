import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/verify'
import { unauthorized, forbidden } from '@/lib/api-response'

// ==================== WORK SESSIONS API ====================

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined

    const where: Record<string, string | undefined> = {}

    // If filtering by userId, only allow viewing own sessions or admin
    if (userId) {
      if (userId !== authResult.user!.id && authResult.user!.role !== 'PLATFORM_ADMIN') {
        return forbidden('You can only view your own work sessions')
      }
      where.userId = userId
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
        }
      },
      orderBy: { startTime: 'desc' }
    })

    const totalHours = workSessions.reduce((sum, session) => sum + ((session.duration || 0) / 3600), 0)

    // Map fields to match frontend expectations
    const mappedSessions = workSessions.map(session => ({
      ...session,
      checkInTime: session.startTime,
      checkOutTime: session.endTime,
      checkInLocation: session.user?.location || null,
      notes: session.notes,
      type: session.type,
      duration: session.duration ? (session.duration / 3600) : null,
    }))

    return NextResponse.json({
      success: true,
      data: mappedSessions,
      count: mappedSessions.length,
      totalHours
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

    // Users can only create work sessions for themselves
    const workSession = await db.workSession.create({
      data: {
        userId: currentUser.id,
        taskId: body.taskId,
        projectId: body.projectId,
        type: body.type || 'ONSITE',
        startTime: new Date(),
        checkInLocation: body.checkInLocation,
        notes: body.notes,
      }
    })

    return NextResponse.json({
      success: true,
      data: workSession
    }, { status: 201 })
  } catch (error) {
    console.error('Work Session creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create work session'
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

    const body = await request.json()

    const updateData: {
      endTime?: Date
      duration?: number
      projectId?: string
      type?: string
      notes?: string
      checkOutLocation?: string
    } = {
      endTime: new Date(),
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
      return forbidden('You can only update your own work sessions')
    }

    // Calculate duration if endTime is being set
    const durationSeconds = Math.floor((new Date().getTime() - new Date(existingSession.startTime).getTime()) / 1000)
    updateData.duration = durationSeconds

    // Allow override of duration (frontend sends in hours, convert to seconds)
    if (body.duration) {
      updateData.duration = Math.floor(parseFloat(body.duration) * 3600)
    }

    if (body.projectId) {
      updateData.projectId = body.projectId
    }

    if (body.type) {
      updateData.type = body.type
    }

    if (body.notes) {
      updateData.notes = body.notes
    }

    if (body.checkOutLocation) {
      updateData.checkOutLocation = body.checkOutLocation
    }

    const workSession = await db.workSession.update({
      where: { id: sessionId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: {
        ...workSession,
        checkInTime: workSession.startTime,
        checkOutTime: workSession.endTime,
        checkInLocation: workSession.user?.location || null,
        notes: workSession.notes,
        type: workSession.type,
        duration: workSession.duration ? (workSession.duration / 3600) : null,
      }
    })
  } catch (error) {
    console.error('Work Session update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update work session'
    }, { status: 500 })
  }
}
