import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ProjectStatus } from "@prisma/client"
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

    const searchParams = request.nextUrl.searchParams
    const statusParam = searchParams.get("status") || null
    const limit = parseInt(searchParams.get("limit") || "20")

    // Build where clause based on status filter
    const where: any = {}

    if (statusParam === "PENDING") {
      // For pending projects, filter by approvalStatus instead of status
      where.approvalStatus = "PENDING"
    } else if (statusParam) {
      // Map other status filters
      let status: ProjectStatus
      if (statusParam === "PROPOSED") {
        status = "IDEA" as ProjectStatus
      } else if (statusParam === "UNDER_REVIEW") {
        status = "UNDER_REVIEW" as ProjectStatus
      } else {
        status = statusParam as ProjectStatus
      }
      where.status = status
    }

    const [projects, totalCount] = await Promise.all([
      db.project.findMany({
        where,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              university: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                }
              }
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.project.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        projects: projects.map(p => {
          // Map backend status to frontend-friendly status
          let mappedStatus = p.status
          if (p.status === "UNDER_REVIEW") {
            mappedStatus = "PENDING" as any
          } else if (p.status === "IDEA") {
            mappedStatus = "PROPOSED" as any
          }

          return {
            id: p.id,
            title: p.name,
            name: p.name,
            description: p.description || "",
            category: p.category || "",
            status: mappedStatus,
            approvalStatus: p.approvalStatus,
            ownerId: p.ownerId,
            university: p.owner.university?.name || "No University",
            owner: {
              name: p.owner.name,
              email: p.owner.email
            },
            budget: p.budget,
            submittedAt: p.createdAt.toISOString(),
            lastUpdated: p.updatedAt.toISOString(),
            createdAt: p.createdAt.toISOString(),
          }
        }),
        totalCount,
      },
    })
  } catch (error: any) {
    console.error("Get projects error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch projects",
      status: 500,
    })
  }
}
