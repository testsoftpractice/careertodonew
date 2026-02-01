import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
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

    // Validate required fields
    if (!currentUser?.id) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Create work session
    const workSessionData: any = {
      userId: currentUser.id,
      type: body.type || 'WORK_SESSION',
      startTime: new Date(),
      checkInLocation: body.checkInLocation,
      notes: body.notes,
    }

    // Only add projectId if task belongs to a project
    // For personal tasks (no projectId), we don't create a work session
    if (body.projectId) {
      workSessionData.projectId = body.projectId
    }

    const workSession = await db.workSession.create({
      data: workSessionData
    })

    return NextResponse.json({
      success: true,
      data: workSession
    }, { status: 201 })
  } catch (error) {
    console.error('Work Session creation error:', error)
    
    // Handle specific error types
    const errorMessage = error instanceof Error ? error.message : 'Failed to create work session'
    
    // Check for validation errors
    if (error.message?.includes('Unknown argument')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request: taskId is not supported. Please use projectId for project tasks.',
        details: 'For personal tasks, time tracking cannot create a work session.',
      }, { status: 400 })
    }

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
      return NextResponse.json({
        success: false,
        error: 'You can only update your own work sessions'
      }, { status: 403 })
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
