import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50")
    const sort = request.nextUrl.searchParams.get("sort") || "desc"

    const logs = await db.auditLog.findMany({
      orderBy: {
        createdAt: sort as 'asc' | 'desc',
      },
      take: limit,
    })

    const totalCount = await db.auditLog.count()

    return NextResponse.json({
      success: true,
      data: {
        logs: logs.map(log => ({
          id: log.id,
          action: log.action,
          userId: log.userId,
          timestamp: log.createdAt.toISOString(),
          entity: log.entity,
          entityId: log.entityId,
          details: log.details,
        })),
        totalCount,
        currentPage: 1,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error: any) {
    console.error("Get audit logs error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}
