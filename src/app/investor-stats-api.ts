import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const [portfolio, totalInvestments, totalEquity, avgReturn, opportunities] = await Promise.all([
      db.investment.findMany({
        where: { investorId: userId },
        orderBy: { investedAt: "desc" },
        take: 20,
      }),
      db.investment.count({ where: { investorId: userId } }),
      db.investment.aggregate({
        where: { investorId: userId },
        _sum: { equity: true },
      }),
      db.investment.aggregate({
        where: { investorId: userId },
        _avg: { actualReturn: true },
      }),
      db.project.findMany({
        where: { seekingInvestment: true, status: "ACTIVE" },
        take: 20,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        portfolio: portfolio,
        totalInvestments,
        totalEquity,
        averageReturn: avgReturn._avg.actualReturn || 0,
        opportunities,
      },
    })
  } catch (error: any) {
    console.error("Get investor stats error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch statistics" }, { status: 500 })
  }
}
