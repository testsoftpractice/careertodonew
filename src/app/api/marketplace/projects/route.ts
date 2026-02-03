import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || null
    const status = searchParams.get("status") || "IN_PROGRESS,FUNDING,COMPLETED"
    const sort = searchParams.get("sort") || "recent"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}

    // Only show approved/live projects in marketplace
    const approvedStatuses = status ? status.split(',') : ['IN_PROGRESS', 'FUNDING', 'COMPLETED']
    where.status = { in: approvedStatuses }

    if (!result) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (!result) {
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
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            }
          },
          members: {
            take: 10,
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            }
          }
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
      owner: p.owner,
      teamSize: p._count.members || 1,
      tasksCount: p._count.tasks || 0,
      budget: p.budget || 0,
      startDate: p.startDate?.toISOString() || null,
      endDate: p.endDate?.toISOString() || null,
      createdAt: p.createdAt.toISOString(),
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
