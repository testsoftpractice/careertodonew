import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireRole, getUserFromRequest } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/university/students - Get university students with metrics
export async function GET(request: NextRequest) {
  const user = requireRole(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if (user instanceof NextResponse) return user
  const universityId = user?.universityId

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
            { name: { contains: search } },
            { email: { contains: search } },
            { major: { contains: search } },
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
      const studentWithCount = student as typeof student & { _count?: { tasksCreated?: number; tasksAssigned?: number; timeEntries?: number; workSessions?: number } }
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
        projectCount: studentWithCount._count?.tasksCreated || 0,
        assignedTasks: studentWithCount._count?.tasksAssigned || 0,
        timeEntries: studentWithCount._count?.timeEntries || 0,
        workSessions: studentWithCount._count?.workSessions || 0,
      }
    })

    // Apply sorting
    let sortedStudents = [...studentsWithMetrics]
    if (sort === 'reputation') {
      sortedStudents.sort((a, b) => b.reputation - a.reputation)
    } else if (sort === 'name') {
      sortedStudents.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      sortedStudents.sort((a, b) => b.totalPoints - a.totalPoints)
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
