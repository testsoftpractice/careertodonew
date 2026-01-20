import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== WORK SESSIONS API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined

    const where: any = {}
    if (userId) where.userId = userId

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

    const totalHours = workSessions.reduce((sum, session) => sum + (session.duration || 0), 0)

    return NextResponse.json({
      success: true,
      data: workSessions,
      count: workSessions.length,
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
    const body = await request.json()

    const workSession = await db.workSession.create({
      data: {
        userId: body.userId,
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
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.id as string

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Work Session ID is required'
      }, { status: 400 })
    }

    const body = await request.json()

    const updateData: any = {
      endTime: new Date(),
    }

    if (body.duration) {
      updateData.duration = parseInt(body.duration)
    }

    const workSession = await db.workSession.update({
      where: { id: sessionId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: workSession
    })
  } catch (error) {
    console.error('Work Session update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update work session'
    }, { status: 500 })
  }
}
