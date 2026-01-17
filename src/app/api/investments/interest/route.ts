import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, investmentType, amount, equity, investorId } = body

    const investment = await db.investment.create({
      data: {
        projectId,
        investorId,
        type: investmentType,
        amount,
        equity,
        status: "INTERESTED",
      }
    })

    // Notify project lead
    await db.notification.create({
      data: {
        userId: investment.project?.projectLeadId,
        type: "INVESTMENT",
        title: "Investment Interest Received",
        message: `An investor has expressed interest in your project: ${investment.project?.title}. Investment amount: $${amount.toLocaleString()}, Equity: ${equity}%`,
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
