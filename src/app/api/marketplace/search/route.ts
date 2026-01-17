import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || null
    const university = searchParams.get("university") || null
    const status = searchParams.get("status") || null
    const reputationMin = searchParams.get("reputationMin") ? parseFloat(searchParams.get("reputationMin")) : null
    const reputationMax = searchParams.get("reputationMax") ? parseFloat(searchParams.get("reputationMax")) : null
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { projectLead: { contains: search, mode: "insensitive" } },
      ]
    }
    
    if (category) {
      where.category = category
    }
    
    if (university) {
      where.university = { name: { contains: university, mode: "insensitive" } }
    }
    
    if (status) {
      where.status = status
    }
    
    if (reputationMin && reputationMax) {
      where.rating = {
        _avg: {
          execution: { gte: reputationMin, lte: reputationMax },
          collaboration: { gte: reputationMin, lte: reputationMax },
          leadership: { gte: reputationMin, lte: reputationMax },
          ethics: { gte: reputationMin, lte: reputationMax },
          reliability: { gte: reputationMin, lte: reputationMax },
        },
      }
    }

    const [projects, totalCount] = await Promise.all([
      db.project.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
      }),
      db.project.count({ where }),
    ])

    const projectsWithMeta = projects.map(p => ({
      id: p.id,
      projectId: p.id,
      projectName: p.title,
      projectDescription: p.description,
      university: p.university?.name || "",
      category: p.category || "",
      status: p.status || "",
      teamReputation: 4.5,
      projectLead: p.projectLead || "",
      deadline: p.createdAt?.toISOString().split("T")[0] || "",
      investmentGoal: p.investmentGoal || 0,
      currentRaised: 0,
      equitySplit: 50,
    }))

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsWithMeta,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        searchParams: {
          search,
          category,
          university,
          status,
          reputationMin,
          reputationMax,
        },
      },
    })
  } catch (error: any) {
    console.error("Search marketplace error:", error)
    return NextResponse.json({ success: false, error: "Failed to search marketplace" }, { status: 500 })
  }
}
