import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const [portfolio, totalInvestments, totalAmount, opportunities] = await Promise.all([
      db.investment.findMany({
        where: { userId },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              status: true,
              description: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      db.investment.count({ where: { userId } }),
      db.investment.aggregate({
        where: { userId, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      db.project.findMany({
        where: { status: "IN_PROGRESS" },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const totalInvestedAmount = totalAmount._sum.amount || 0

    return NextResponse.json({
      success: true,
      data: {
        portfolio,
        totalInvestments,
        totalInvestedAmount,
        opportunities,
      },
    })
  } catch (error: any) {
    console.error("Get investor stats error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch statistics" }, { status: 500 })
  }
}
