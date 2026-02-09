import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth/jwt"

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50")
    const sort = request.nextUrl.searchParams.get("sort") || "desc"
    const actionFilter = request.nextUrl.searchParams.get("action")
    const entityTypeFilter = request.nextUrl.searchParams.get("entityType")
    const startDateStr = request.nextUrl.searchParams.get("startDate")
    const endDateStr = request.nextUrl.searchParams.get("endDate")

    // Build where clause
    const where: any = {}

    if (actionFilter) {
      where.action = actionFilter
    }

    if (entityTypeFilter) {
      where.entity = entityTypeFilter
    }

    if (startDateStr || endDateStr) {
      where.createdAt = {}
      if (startDateStr) {
        where.createdAt.gte = new Date(startDateStr)
      }
      if (endDateStr) {
        where.createdAt.lte = new Date(endDateStr)
      }
    }

    const logs = await db.auditLog.findMany({
      where,
      orderBy: {
        createdAt: sort as 'asc' | 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    const totalCount = await db.auditLog.count({ where })

    return NextResponse.json({
      success: true,
      data: {
        logs: logs.map(log => ({
          id: log.id,
          action: log.action,
          entity: log.entity,
          performedBy: log.user ? { name: log.user.name } : undefined,
          details: log.details,
          createdAt: log.createdAt.toISOString(),
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
