import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, investmentType, amount, equity, investorId } = body

    // Get project to find owner for notification
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true, name: true },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const investment = await db.investment.create({
      data: {
        projectId,
        userId: investorId,
        type: investmentType,
        amount,
        equity,
        status: "INTERESTED",
      }
    })

    // Notify project owner
    await db.notification.create({
      data: {
        userId: project.ownerId,
        type: "INVESTMENT",
        title: "Investment Interest Received",
        message: `An investor has expressed interest in your project: ${project.name}. Investment amount: $${amount?.toLocaleString() || 'N/A'}, Equity: ${equity || 'N/A'}%`,
        link: `/marketplace/projects/${projectId}`,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        investmentId: investment.id,
        projectId,
        investmentType,
        amount,
        equity,
        status: "INTERESTED",
        nextStep: "agreement",
      }
    })
  } catch (error: any) {
    console.error("Express investment interest error:", error)
    return NextResponse.json({ success: false, error: "Failed to express interest" }, { status: 500 })
  }
}
