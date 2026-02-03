import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== UNIVERSITY PERFORMANCE API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const universityId = searchParams.universityId as string | undefined

    // Calculate performance metrics for all universities
    const universities = await db.university.findMany({
      include: {
        students: {
          include: {
            projectMemberships: {
              include: {
                project: true,
              },
            },
            pointTransactions: true,
            receivedRatings: true,
          },
        },
        projects: {
          include: {
            projectLead: {
              select: {
                id: true,
                name: true,
              },
            },
            members: true,
            milestones: {
              include: {
                project: true,
              },
            },
          },
        },
      },
      orderBy: { rankingScore: 'desc' },
    })

    // Calculate metrics for each university
    const universitiesWithMetrics = universities.map((university: any) => {
      const students = university.students || []

      // Student Metrics
      const totalStudents = students.length

      // Calculate average student metrics
      let totalReputation = 0
      let totalPoints = 0
      let totalProjectsCreated = 0
      let totalMilestones = 0
      let totalTasksCompleted = 0

      students.forEach((student) => {
        // Reputation scores
        totalReputation += (
          student.executionScore +
          student.collaborationScore +
          student.leadershipScore +
          student.ethicsScore +
          student.reliabilityScore
        ) / 5

        // Total points
        totalPoints += student.totalPoints || 0

        // Projects created (as project lead)
        totalProjectsCreated += student.projectLeads?.length || 0

        // Projects participated in
        const projectsParticipated = student.projectMemberships?.length || 0
        totalProjectsCreated += projectsParticipated

        // Tasks completed
        totalTasksCompleted += student.projectMemberships?.reduce((sum: any, pm: any) => {
          return sum + (pm.project?.tasks?.filter((t: any) => t.status === 'COMPLETED')?.length || 0)
        }, 0) || 0

        // Milestones achieved
        totalMilestones += student.projectMemberships?.reduce((sum: any, pm: any) => {
          return sum + (pm.project?.milestones?.filter((m: any) => m.status === 'ACHIEVED')?.length || 0)
        }, 0) || 0
      })

      // University Project Metrics
      const projects = university.projects || []
      const totalProjects = projects.length
      const activeProjects = projects.filter((p: any) => p.status === 'ACTIVE').length
      const completedProjects = projects.filter((p: any) => p.status === 'COMPLETED').length
      const totalMilestonesAll = projects.reduce((sum: any, p: any) => {
        return sum + (p.milestones?.filter((m: any) => m.status === 'ACHIEVED')?.length || 0)
      }, 0)

      // Calculate university score (weighted metrics)
      const avgReputation = totalStudents > 0 ? totalReputation / totalStudents : 0
      const avgPoints = totalStudents > 0 ? totalPoints / totalStudents : 0
      const avgProjectsPerStudent = totalStudents > 0 ? totalProjectsCreated / totalStudents : 0
      const engagementScore = (
        (avgReputation * 0.3) +           // 30% weight
        (avgPoints / 100 * 0.2) +         // 20% weight (max 5000 points = 10)
        (avgProjectsPerStudent * 0.3) +      // 30% weight (3 projects = 9)
        (totalMilestonesAll * 0.2)           // 20% weight
      )

      return {
        id: university.id,
        name: university.name,
        code: university.code,
        logo: university.logo,
        location: university.location,

        // Student Metrics
        totalStudents,
        avgReputation: Math.round(avgReputation * 100) / 100,
        avgPoints: Math.round(avgPoints),
        avgProjectsPerStudent: Math.round(avgProjectsPerStudent * 10) / 10,
        totalTasksCompleted,

        // Project Metrics
        totalProjects,
        activeProjects,
        completedProjects,
        totalMilestones,

        // Rankings
        rankingPosition: universities.findIndex((u: any) => u.id === university.id) + 1,
        rankingScore: Math.round(engagementScore * 100) / 100,
      }
    })

    // Assign ranking positions
    universitiesWithMetrics.sort((a, b) => b.rankingScore - a.rankingScore)
    universitiesWithMetrics.forEach((u, index) => {
      u.rankingPosition = index + 1
    })

    // If specific university requested, return just that university
    if (!result) {
      const specificUniversity = universitiesWithMetrics.find((u: any) => u.id === universityId)
      
      if (!result) {
        return NextResponse.json({
          success: false,
          error: 'University not found',
        }, { status: 404 })
      }

      // Get top students from this university
      const topStudents = await db.user.findMany({
        where: {
          universityId,
          role: { in: ['STUDENT', 'MENTOR'] },
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          totalPoints: true,
          executionScore: true,
          collaborationScore: true,
          leadershipScore: true,
          ethicsScore: true,
          reliabilityScore: true,
        },
        orderBy: { totalPoints: 'desc' },
        take: 10,
      })

      return NextResponse.json({
        success: true,
        data: {
          university: specificUniversity,
          topStudents: topStudents.map((student: any) => ({
            ...student,
            overallReputation: (
              student.executionScore +
              student.collaborationScore +
              student.leadershipScore +
              student.ethicsScore +
              student.reliabilityScore
            ) / 5,
          })),
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: universitiesWithMetrics,
      count: universitiesWithMetrics.length,
    })
  } catch (error) {
    console.error('University Performance API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch university performance metrics',
    }, { status: 500 })
  }
}
