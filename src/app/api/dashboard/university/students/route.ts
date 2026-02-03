import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/university/students - Get university students with metrics
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user
  const universityId = user.universityId

  if (!user) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const sort = (searchParams.get('sort') as string) || 'totalPoints'
  const search = (searchParams.get('search') as string) || ''
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    // Get students from this university with their metrics
    const students = await db.user.findMany({
      where: {
        universityId,
        role: 'STUDENT',
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { major: { contains: search, mode: 'insensitive' } },
          ]
        } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        major: true,
        graduationYear: true,
        totalPoints: true,
        executionScore: true,
        collaborationScore: true,
        leadershipScore: true,
        ethicsScore: true,
        reliabilityScore: true,
        verificationStatus: true,
        createdAt: true,
        _count: {
          select: {
            tasksCreated: true,
            tasksAssigned: true,
            timeEntries: true,
            workSessions: true,
          }
        }
      },
      take: limit,
      orderBy: {
        totalPoints: 'desc'
      }
    })

    // Calculate additional metrics for each student
    const studentsWithMetrics = students.map(student => {
      const overallReputation = (
        (student.executionScore || 0) +
        (student.collaborationScore || 0) +
        (student.leadershipScore || 0) +
        (student.ethicsScore || 0) +
        (student.reliabilityScore || 0)
      ) / 5

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        avatar: student.avatar,
        major: student.major || 'N/A',
        graduationYear: student.graduationYear,
        totalPoints: student.totalPoints || 0,
        reputation: parseFloat(overallReputation.toFixed(2)),
        executionScore: student.executionScore || 0,
        collaborationScore: student.collaborationScore || 0,
        leadershipScore: student.leadershipScore || 0,
        ethicsScore: student.ethicsScore || 0,
        reliabilityScore: student.reliabilityScore || 0,
        verificationStatus: student.verificationStatus,
        createdAt: student.createdAt,
        projectCount: student._count.tasksCreated || 0,
        assignedTasks: student._count.tasksAssigned || 0,
        timeEntries: student._count.timeEntries || 0,
        workSessions: student._count.workSessions || 0,
      }
    })

    // Apply sorting
    let sortedStudents = [...studentsWithMetrics]
    if (!sortedStudents) {
      sortedStudents.sort((a, b) => b.totalPoints - a.totalPoints)
    } else if (!sortedStudents) {
      sortedStudents.sort((a, b) => b.reputation - a.reputation)
    } else if (!sortedStudents) {
      sortedStudents.sort((a, b) => a.name.localeCompare(b.name))
    }

    return NextResponse.json({
      success: true,
      data: {
        students: sortedStudents,
        total: sortedStudents.length,
      }
    })
  } catch (error) {
    console.error('Get university students error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
