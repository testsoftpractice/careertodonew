import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const universityId = request.nextUrl.searchParams.get("universityId")
    
    if (!universityId) {
      return NextResponse.json({ success: false, error: "University ID is required" }, { status: 400 })
    }

    const totalStudents = await db.user.count({ where: { universityId, role: "STUDENT" } })
    const totalProjects = await db.project.count({ where: { universityId } })
    const activeDepartments = await db.department.count({ where: { project: { universityId } } })
    const topStudents = await db.user.findMany({
      where: { universityId, role: "STUDENT" },
      orderBy: { reputation: "desc" },
      take: 10,
    })

    const stats = {
      totalStudents,
      totalProjects,
      activeDepartments,
      topStudents: topStudents.map(u => ({
        rank: 0,
        id: u.id,
        name: u.name,
        university: u.university?.name || "",
        major: u.major || "",
        overallReputation: u.reputation || 0,
        breakdown: {
          execution: 4.5,
          collaboration: 4.5,
          leadership: 3.5,
          ethics: 4.5,
          reliability: 5.0,
        },
        projectCount: 0,
        achievementCount: 0,
      })),
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error: any) {
    console.error("Get university stats error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch university statistics" }, { status: 500 })
  }
}
