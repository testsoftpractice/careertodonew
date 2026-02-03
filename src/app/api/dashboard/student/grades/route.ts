import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/student/grades - Get student's grades and GPA
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

    // Get user's score breakdown
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        executionScore: true,
        collaborationScore: true,
        leadershipScore: true,
        ethicsScore: true,
        reliabilityScore: true
      }
    })

    // Get education records
    const education = await db.education.findMany({
      where: { userId: decoded.userId },
      orderBy: { startDate: 'desc' },
      take: 5
    })

    const overallGPA = education.reduce((sum, edu) => sum + (edu.gpa || 0), 0) / education.length
    const currentGPA = education[0]?.gpa || 0

    // Calculate individual scores
    const breakdown = {
      execution: user?.executionScore || 0,
      collaboration: user?.collaborationScore || 0,
      leadership: user?.leadershipScore || 0,
      ethics: user?.ethicsScore || 0,
      reliability: user?.reliabilityScore || 0
    }

    const overallRating = Object.values(breakdown).reduce((sum, val) => sum + val, 0) / 5

    // Generate grades from education records
    const grades = education.map(edu => ({
      id: edu.id,
      courseCode: `CRS${edu.id.substring(0, 6)}`,
      courseName: edu.fieldOfStudy || edu.degree,
      grade: edu.gpa ? (edu.gpa >= 3.7 ? 'A' : edu.gpa >= 3.0 ? 'B' : edu.gpa >= 2.0 ? 'C' : 'D') : 'N/A',
      credits: 3,
      semester: new Date(edu.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      year: new Date(edu.startDate).getFullYear(),
      gpa: edu.gpa || 0
    }))

    const totalCredits = grades.length * 3

    return NextResponse.json({
      success: true,
      data: {
        grades,
        currentGPA: currentGPA || 0,
        cumulativeGPA: overallGPA || 0,
        totalCredits,
      overallRating: overallRating.toFixed(1),
        breakdown
      }
    })
  } catch (error: any) {
    console.error('Get student grades error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch grades' },
      { status: 500 }
    )
  }
}
