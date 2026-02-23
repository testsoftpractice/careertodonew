import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || null
    const status = searchParams.get("status") || null
    const sort = searchParams.get("sort") || "recent"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}

    // CRITICAL: Only show APPROVED projects in marketplace
    where.approvalStatus = 'APPROVED'

    // Filter by status if provided (ACTIVE, IN_PROGRESS, FUNDING, COMPLETED, etc.)
    // Default to showing active/funding projects if no status filter
    if (status) {
      const statusList = status.split(',')
      where.status = { in: statusList }
    } else {
      // Default: show projects that are active, in progress, funding, or completed
      where.status = { in: ['ACTIVE', 'IN_PROGRESS', 'FUNDING', 'COMPLETED'] }
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Category filter
    if (category) {
      where.category = category
    }

    const orderBy: any = sort === "recent"
      ? { createdAt: "desc" }
      : sort === "budget"
      ? { budget: "desc" }
      : { createdAt: "desc" }

    const [projects, totalCount] = await Promise.all([
      db.project.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy,
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            }
          },
          University: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
          ProjectMember: {
            take: 10,
          },
        },
      }),
      db.project.count({ where }),
    ])

    const projectsWithMeta = projects.map(p => ({
      id: p.id,
      name: p.name,
      title: p.name, // Keep both for compatibility
      description: p.description || "",
      category: p.category || "",
      status: p.status || "",
      ownerId: p.ownerId,
      owner: p.User,
      university: p.University,
      teamSize: p.ProjectMember?.length || 1,
      tasksCount: 0, // Would need separate query to count tasks
      budget: p.budget || 0,
      investmentGoal: p.investmentGoal || null,
      seekingInvestment: p.seekingInvestment || false,
      startDate: p.startDate?.toISOString() || null,
      endDate: p.endDate?.toISOString() || null,
      createdAt: p.createdAt.toISOString(),
      approvalStatus: p.approvalStatus,
    }))

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsWithMeta,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error: any) {
    console.error("Get marketplace projects error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 })
  }
}
