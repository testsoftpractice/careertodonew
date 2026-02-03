import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ProjectStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || null
    const limit = parseInt(searchParams.get("limit") || "20")

    const where = status ? { status: status as ProjectStatus } : {}

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
        projects: projects.map(p => ({
          id: p.id,
          title: p.name,
          name: p.name,
          description: p.description || "",
          category: p.category || "",
          status: p.status,
          ownerId: p.ownerId,
          university: p.owner.university,
          projectLead: {
            name: p.owner.name,
            email: p.owner.email
          },
          owner: p.owner,
          budget: p.budget,
          submittedAt: p.createdAt.toISOString(),
          lastUpdated: p.updatedAt.toISOString(),
          createdAt: p.createdAt.toISOString(),
        })),
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
