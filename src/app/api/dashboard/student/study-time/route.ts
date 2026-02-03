import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/student/study-time - Get student's study time tracking
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

    // Get work sessions as study time
    const workSessions = await db.workSession.findMany({
      where: { userId: decoded.userId },
      orderBy: { startTime: 'desc' },
      take: 20
    })

    // Calculate study statistics
    const sessions = workSessions.map(session => ({
      id: session.id,
      date: session.startTime.toISOString(),
      duration: Math.round(((session.endTime?.getTime() || Date.now()) - session.startTime.getTime()) / 3600000 * 10) / 10,
      subject: 'Project Work',
      focusScore: 85 + Math.random() * 15 // Mock focus score
    }))

    const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0)
    const todayHours = sessions
      .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
      .reduce((sum, s) => sum + s.duration, 0)

    const weeklyHours = sessions
      .filter(s => {
        const sessionDate = new Date(s.date)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return sessionDate >= weekAgo
      })
      .reduce((sum, s) => sum + s.duration, 0)

    const weeklyGoal = 20 // Mock weekly goal
    const streakDays = Math.min(sessions.length, 7) // Mock streak

    return NextResponse.json({
      success: true,
      data: {
        totalHours,
        weeklyGoal,
        weeklyHours,
        todayHours,
        sessions,
        streakDays
      }
    })
  } catch (error: any) {
    console.error('Get study time error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch study time' },
      { status: 500 }
    )
  }
}
