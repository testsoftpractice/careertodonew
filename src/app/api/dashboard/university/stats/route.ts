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

    // Get top students with calculated reputation from individual scores
    const users = await db.user.findMany({
      where: { universityId, role: "STUDENT" },
      select: {
        id: true,
        name: true,
        major: true,
        executionScore: true,
        collaborationScore: true,
        leadershipScore: true,
        ethicsScore: true,
        reliabilityScore: true,
        university: {
          select: {
            name: true,
          },
        },
      },
      take: 10,
    })

    // Calculate overall reputation for each student
    const topStudents = users
      .map(u => {
        const overallReputation =
          (u.executionScore + u.collaborationScore + u.leadershipScore + u.ethicsScore + u.reliabilityScore) / 5

        return {
          id: u.id,
          name: u.name,
          university: u.university?.name || "",
          major: u.major || "",
          overallReputation: Math.round(overallReputation * 10) / 10,
          breakdown: {
            execution: u.executionScore,
            collaboration: u.collaborationScore,
            leadership: u.leadershipScore,
            ethics: u.ethicsScore,
            reliability: u.reliabilityScore,
          },
          projectCount: 0, // Would need to count project memberships
          achievementCount: 0, // Would need to count achievements
        }
      })
      .sort((a, b) => b.overallReputation - a.overallReputation)
      .slice(0, 10)
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }))

    const stats = {
      totalStudents,
      totalProjects,
      activeDepartments,
      topStudents,
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error: any) {
    console.error("Get university stats error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch university statistics" }, { status: 500 })
  }
}
