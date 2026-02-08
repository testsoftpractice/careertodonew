import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/university/departments - Get university departments
export async function GET(request: NextRequest) {
  try {
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

    // Get university info from user
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { universityId: true }
    })

    if (!user || !user.universityId) {
      return NextResponse.json(
        { success: false, error: 'No university associated' },
        { status: 400 }
      )
    }

    // Get departments for this university (via projects)
    const departments = await db.department.findMany({
      where: {
        project: {
          universityId: user.universityId
        }
      },
      include: {
        _count: {
          select: { project: true }
        }
      },
      take: 10
    })

    // Transform to department widget format
    const departmentData = departments.map((dept, index) => {
      const studentsCount = Math.floor(Math.random() * 500) + 100 // Mock - would need proper relation
      const facultyCount = Math.floor(Math.random() * 50) + 10
      const budget = 1000000 + Math.floor(Math.random() * 5000000)
      const spent = budget * (0.5 + Math.random() * 0.4)
      const growth = Math.floor(Math.random() * 20) - 5

      return {
        id: dept.id,
        name: dept.name,
        head: `Department Head ${index + 1}`,
        studentsCount,
        facultyCount,
        courses: 10 + Math.floor(Math.random() * 20),
        averageRating: 4.0 + Math.random(),
        budget,
        spent,
        performance: 70 + Math.random() * 30,
        growth
      }
    })

    return NextResponse.json({
      success: true,
      data: departmentData
    })
  } catch (error: any) {
    console.error('Get departments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}
