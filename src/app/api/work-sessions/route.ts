import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
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
      notes: null,
      type: 'WORK_SESSION',
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

    // Users can only create work sessions for themselves
    const workSession = await db.workSession.create({
      data: {
        userId: currentUser.id,
        startTime: new Date(),
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

    if (body.duration) {
      updateData.duration = parseInt(body.duration)
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
        notes: null,
        type: 'WORK_SESSION',
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
