import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logError, formatErrorResponse, AppError, UnauthorizedError, ValidationError, validateEmail, DatabaseError } from "@/lib/utils/error-handler"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    
    if (!userId) {
      throw new UnauthorizedError("User ID is required")
    }

    if (!validateEmail(userId)) {
      throw new ValidationError("Invalid user ID format")
    }

    // Using separate queries to avoid Prisma in operator issues
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      tasksCompleted,
      tasksPending,
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
        select: { completion: true },
      }),
    ])

    const avgCompletion = projectList.length > 0 
      ? projectList.reduce((sum: any, p: any) => sum + (p.completion || 0), 0) / projectList.length 
      : 0
    
    const reputation = await db.rating.aggregate({
      where: { userId },
      _avg: { execution: true, collaboration: true, leadership: true, ethics: true, reliability: true },
    })
    
    const recentActivityCount = await db.notification.count({ where: { userId, read: false } })

    const stats = {
      totalProjects,
      activeProjects,
      completedProjects,
      tasksCompleted,
      tasksPending,
      avgCompletion,
      reputation: {
        execution: Math.round(reputation._avg.execution * 10) / 10 || 0,
        collaboration: Math.round(reputation._avg.collaboration * 10) / 10 || 0,
        leadership: Math.round(reputation._avg.leadership * 10) / 10 || 0,
        ethics: Math.round(reputation._avg.ethics * 10) / 10 || 0,
        reliability: Math.round(reputation._avg.reliability * 10) / 10 || 0,
      },
      recentActivityCount,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    logError(error, 'Get student stats', userId)
    
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
