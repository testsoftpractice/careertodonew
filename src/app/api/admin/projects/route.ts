import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || null
    const limit = parseInt(searchParams.get("limit") || "20")

    const where = status ? { status } : {}

    const [projects, totalCount] = await Promise.all([
      db.project.findMany({
        where,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.project.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        projects: projects.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          category: p.category || "",
          university: p.project?.university?.name || "",
          status: p.status,
          projectLead: p.projectLead || "",
          riskLevel: "Low",
          investmentStatus: p.seekingInvestment ? "Seeking" : "Not Seeking",
          submittedAt: p.createdAt.toISOString(),
          lastUpdated: p.updatedAt?.toISOString() || null,
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
