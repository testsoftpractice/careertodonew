import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const totalUsers = await db.user.count()
    const activeProjects = await db.project.count({ where: { status: "ACTIVE" } })
    const pendingProjects = await db.project.count({ where: { status: "PENDING" } })
    const completedProjects = await db.project.count({ where: { status: "COMPLETED" } })
    const totalProjects = await db.project.count()
    const todayStart = new Date(new Date().setHours(0,0,0,0))
    const todayActive = await db.project.count({ where: { status: "ACTIVE", createdAt: { gte: todayStart } } })
    const todayCompleted = await db.project.count({ where: { status: "COMPLETED", completedAt: { gte: todayStart } } })
    const todaySubmissions = await db.project.count({ where: { createdAt: { gte: todayStart } } })
    const flaggedContent = await db.professionalRecord.count({ where: { flagged: true } })
    const pendingApprovals = await db.verificationRequest.count({ where: { status: "PENDING" } })
    const rejectedProjects = await db.project.count({ where: { status: "CANCELED" } })
    const complianceScore = 94
    const systemHealth = "Healthy"
    const lastAudit = new Date().toISOString()

    const stats = {
      totalUsers,
      activeProjects,
      pendingProjects,
      completedProjects,
      totalProjects,
      todayActive,
      todayCompleted,
      todaySubmissions,
      flaggedContent,
      pendingApprovals,
      rejectedProjects,
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
