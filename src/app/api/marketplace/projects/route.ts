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
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }
    
    if (category) {
      where.category = category
    }
    
    if (status) {
      where.status = status
    }

    const orderBy: any = sort === "recent" 
      ? { createdAt: "desc" }
      : sort === "funding"
      ? { investmentGoal: "desc" }
      : sort === "rating"
      ? { rating: "desc" }
      : { createdAt: "desc" }

    const [projects, totalCount] = await Promise.all([
      db.project.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy,
      }),
      db.project.count({ where }),
    ])

    const projectsWithMeta = projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description || "",
      category: p.category || "",
      university: p.university?.name || "",
      status: p.status || "",
      projectLead: p.projectLead || "",
      projectLeadId: p.projectLeadId || "",
      teamSize: p.team?.length || 1,
      investmentGoal: p.investmentGoal || 0,
      currentRaised: 0,
      seekingInvestment: p.seekingInvestment || false,
      teamReputation: 4.5,
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
