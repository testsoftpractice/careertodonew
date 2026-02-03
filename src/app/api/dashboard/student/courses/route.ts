import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/student/courses - Get student's courses with progress
export async function GET(request: NextRequest) {
  try {
    // Get and verify token
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get student's education records (courses)
    const education = await db.education.findMany({
      where: { userId: decoded.userId },
      include: {
        university: {
          select: { name: true }
        }
      },
      orderBy: { startDate: 'desc' },
      take: 10
    })

    // Transform education records into course data
    const courses = education.map(edu => {
      const progress = edu.endDate
        ? new Date() > new Date(edu.endDate)
          ? 100
          : Math.round(((new Date().getTime() - new Date(edu.startDate).getTime()) / (new Date(edu.endDate).getTime() - new Date(edu.startDate).getTime())) * 100)
        : Math.round(((new Date().getTime() - new Date(edu.startDate).getTime()) / (365 * 24 * 60 * 60 * 1000)) * 100)

      const status = edu.endDate
        ? new Date() > new Date(edu.endDate) ? 'completed' as const : 'in_progress' as const
        : 'in_progress' as const

      return {
        id: edu.id,
        code: `${edu.degree.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000)}`, // Mock course code
        name: edu.degree,
        instructor: 'Instructor Name', // Mock - would need proper data model
        progress: Math.min(Math.max(progress, 0), 100),
        grade: edu.gpa ? (edu.gpa >= 3.7 ? 'A' : edu.gpa >= 3.0 ? 'B' : edu.gpa >= 2.0 ? 'C' : 'D') : undefined,
        credits: edu.fieldOfStudy ? 3 : 0, // Mock credits
        status,
        university: edu.university?.name
      }
    })

    return NextResponse.json({
      success: true,
      data: courses
    })
  } catch (error: any) {
    console.error('Get student courses error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
