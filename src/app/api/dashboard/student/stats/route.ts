import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logError, formatErrorResponse, AppError, UnauthorizedError } from "@/lib/utils/error-handler"

export async function GET(request: NextRequest) {
  let userId: string | null = null
  try {
    userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      throw new UnauthorizedError("User ID is required")
    }

    // Using separate queries to avoid Prisma in operator issues
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      tasksCompleted,
      tasksPending,
      tasksInProgress,
      projectList,
    ] = await Promise.all([
      db.project.count({ where: { projectLeadId: userId } }),
      db.project.count({ where: { projectLeadId: userId, status: "ACTIVE" } }),
      db.project.count({ where: { projectLeadId: userId, status: "COMPLETED" } }),
      db.task.count({ where: { assigneeId: userId, status: "COMPLETED" } }),
      db.task.count({ where: { assigneeId: userId, status: "PENDING" } }),
      db.task.count({ where: { assigneeId: userId, status: "IN_PROGRESS" } }),
      db.project.findMany({
        where: { projectLeadId: userId, status: "COMPLETED" },
        select: { completionRate: true },
      }),
    ])

    const avgCompletion = projectList.length > 0
      ? projectList.reduce((sum: number, p: any) => sum + (p.completionRate || 0), 0) / projectList.length
      : 0

    // Calculate reputation from ratings (ratedId = user being rated)
    const ratings = await db.rating.findMany({
      where: { ratedId: userId },
      select: {
        dimension: true,
        score: true,
      },
    })

    // Group by dimension and calculate averages
    const dimensionScores = {
      execution: [] as number[],
      collaboration: [] as number[],
      leadership: [] as number[],
      ethics: [] as number[],
      reliability: [] as number[],
    }

    ratings.forEach(rating => {
      if (rating.dimension === 'EXECUTION') {
        dimensionScores.execution.push(rating.score)
      } else if (rating.dimension === 'COLLABORATION') {
        dimensionScores.collaboration.push(rating.score)
      } else if (rating.dimension === 'LEADERSHIP') {
        dimensionScores.leadership.push(rating.score)
      } else if (rating.dimension === 'ETHICS') {
        dimensionScores.ethics.push(rating.score)
      } else if (rating.dimension === 'RELIABILITY') {
        dimensionScores.reliability.push(rating.score)
      }
    })

    const calculateAvg = (scores: number[]) => {
      return scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0
    }

    const breakdown = {
      execution: calculateAvg(dimensionScores.execution),
      collaboration: calculateAvg(dimensionScores.collaboration),
      leadership: calculateAvg(dimensionScores.leadership),
      ethics: calculateAvg(dimensionScores.ethics),
      reliability: calculateAvg(dimensionScores.reliability),
    }

    const recentActivityCount = await db.notification.count({ where: { userId, isRead: false } })

    const stats = {
      totalProjects,
      activeProjects,
      completedProjects,
      tasksCompleted,
      tasksPending,
      tasksInProgress,
      avgCompletion,
      breakdown,
      recentActivityCount,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    logError(error, 'Get student stats', userId || 'unknown')

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: "Failed to fetch student statistics",
      code: error.code || 'INTERNAL_ERROR',
    }, { status: 500 })
  }
}
