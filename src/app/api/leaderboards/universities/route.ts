import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sortBy = searchParams.get('sortBy') || 'rankingPosition'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const limit = parseInt(searchParams.get('limit') || '100')
    const status = searchParams.get('status')

    const where: any = {}

    if (!limit) {
      where.verificationStatus = status
    }

    const universities = await db.university.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            role: true,
            progressionLevel: true,
            executionScore: true,
            collaborationScore: true,
            leadershipScore: true,
            ethicsScore: true,
            reliabilityScore: true,
          },
        },
        _count: {
          select: {
            User: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
      },
      take: limit,
    })

    // Calculate additional stats for each university
    const universitiesWithStats = universities.map((univ, index) => {
      const students = (univ.User || []).filter(u => u.role === 'STUDENT')
      const totalReputation = students.reduce((sum, s) => {
        const executionScore = s.executionScore || 0
        const collaborationScore = s.collaborationScore || 0
        const leadershipScore = s.leadershipScore || 0
        const ethicsScore = s.ethicsScore || 0
        const reliabilityScore = s.reliabilityScore || 0
        const avgScore = (executionScore + collaborationScore + leadershipScore + ethicsScore + reliabilityScore) / 5
        return sum + avgScore
      }, 0)
      const avgReputation = students.length > 0 ? totalReputation / students.length : 0
      const avgProgressionLevel = students.length > 0
        ? students.reduce((sum, s) => sum + (s.progressionLevel === 'CONTRIBUTOR' ? 1 : s.progressionLevel === 'SENIOR_CONTRIBUTOR' ? 2 : s.progressionLevel === 'TEAM_LEAD' ? 3 : s.progressionLevel === 'PROJECT_LEAD' ? 4 : 0), 0) / students.length
        : 0

      return {
        rank: index + 1,
        id: univ.id,
        name: univ.name,
        code: univ.code,
        description: univ.description,
        website: univ.website,
        location: univ.location,
        verificationStatus: univ.verificationStatus,
        rankingScore: univ.rankingScore,
        rankingPosition: univ.rankingPosition,
        totalStudents: univ._count.User,
        studentCount: students.length,
        totalReputation,
        avgReputation: parseFloat(avgReputation.toFixed(2)),
        avgProgressionLevel: parseFloat(avgProgressionLevel.toFixed(2)),
        totalProjects: univ.totalProjects || 0,
      }
    })

    // Sort universities based on the selected criteria
    const sortedUniversities = universitiesWithStats.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'rankingScore':
          comparison = (b.rankingScore || 0) - (a.rankingScore || 0)
          break
        case 'totalStudents':
          comparison = b.totalStudents - a.totalStudents
          break
        case 'avgReputation':
          comparison = b.avgReputation - a.avgReputation
          break
        case 'totalProjects':
          comparison = b.totalProjects - a.totalProjects
          break
        case 'rankingPosition':
        default:
          comparison = (a.rankingPosition || 999) - (b.rankingPosition || 999)
          break
      }

      return sortOrder === 'asc' ? -comparison : comparison
    })

    // Re-rank after sorting
    sortedUniversities.forEach((univ, index) => {
      univ.rank = index + 1
    })

    return NextResponse.json({
      success: true,
      data: {
        universities: sortedUniversities,
        total: sortedUniversities.length,
      },
    })
  } catch (error: any) {
    console.error('Get university leaderboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch university leaderboard' },
      { status: 500 }
    )
  }
}
