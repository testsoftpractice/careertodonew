import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const totalUsers = await db.user.count()
    const inProgressProjects = await db.project.count({ where: { status: "IN_PROGRESS" } })
    const underReviewProjects = await db.project.count({ where: { status: "UNDER_REVIEW" } })
    const completedProjects = await db.project.count({ where: { status: "COMPLETED" } })
    const totalProjects = await db.project.count()
    const todayStart = new Date(new Date().setHours(0,0,0,0))
    const todayActive = await db.project.count({ where: { status: "IN_PROGRESS", createdAt: { gte: todayStart } } })
    const todayCompleted = await db.project.count({ where: { status: "COMPLETED", updatedAt: { gte: todayStart } } })
    const todaySubmissions = await db.project.count({ where: { createdAt: { gte: todayStart } } })
    const pendingApprovals = await db.verificationRequest.count({ where: { status: "PENDING" } })
    const cancelledProjects = await db.project.count({ where: { status: "CANCELLED" } })
    const complianceScore = 94
    const systemHealth = "Healthy"
    const lastAudit = new Date().toISOString()

    const stats = {
      totalUsers,
      activeProjects: inProgressProjects,
      pendingProjects: underReviewProjects,
      completedProjects,
      totalProjects,
      todayActive,
      todayCompleted,
      todaySubmissions,
      pendingApprovals,
      rejectedProjects: cancelledProjects,
      complianceScore,
      systemHealth,
      lastAudit,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    console.error("Get admin stats error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin statistics" },
      { status: 500 }
    )
  }
}
