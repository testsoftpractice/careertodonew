import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, AuthError } from "@/lib/auth/verify"
import { errorResponse, forbidden } from "@/lib/api-response"

// PUT /api/projects/[id]/departments/[departmentId]/members - Assign members to department
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; departmentId: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { id: projectId, departmentId } = await params
    const body = await request.json()
    const { memberIds } = body

    if (!Array.isArray(memberIds)) {
      return NextResponse.json(
        { success: false, error: "memberIds must be an array" },
        { status: 400 }
      )
    }

    // Check if user has permission to manage departments
    const projectMember = await db.projectMember.findFirst({
      where: {
        projectId,
        userId: currentUser.id,
        role: { in: ["OWNER", "PROJECT_MANAGER"] }
      }
    })

    const isPlatformAdmin = currentUser.role === "PLATFORM_ADMIN"

    if (!projectMember && !isPlatformAdmin) {
      return forbidden("You don't have permission to manage department members")
    }

    // Verify department exists and belongs to this project
    const department = await db.department.findFirst({
      where: {
        id: departmentId,
        projectId
      }
    })

    if (!department) {
      return NextResponse.json(
        { success: false, error: "Department not found" },
        { status: 404 }
      )
    }

    // Get current members with this department
    const currentMembers = await db.projectMember.findMany({
      where: {
        projectId,
        departmentId
      }
    })

    const currentMemberIds = currentMembers.map(m => m.userId)

    // Members to remove from department
    const membersToRemove = currentMemberIds.filter(id => !memberIds.includes(id))

    // Members to add to department
    const membersToAdd = memberIds.filter(id => !currentMemberIds.includes(id))

    // Remove department from members
    if (membersToRemove.length > 0) {
      await db.projectMember.updateMany({
        where: {
          projectId,
          userId: { in: membersToRemove }
        },
        data: {
          departmentId: null
        }
      })
    }

    // Assign department to new members
    if (membersToAdd.length > 0) {
      // Verify these members exist in the project
      const validMembers = await db.projectMember.findMany({
        where: {
          projectId,
          userId: { in: membersToAdd }
        }
      })

      const validMemberIds = validMembers.map(m => m.userId)

      if (validMemberIds.length > 0) {
        await db.projectMember.updateMany({
          where: {
            projectId,
            userId: { in: validMemberIds }
          },
          data: {
            departmentId
          }
        })
      }
    }

    // Fetch updated department with members
    const updatedDepartment = await db.department.findUnique({
      where: { id: departmentId },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        ProjectMember: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updatedDepartment,
        memberCount: updatedDepartment?.ProjectMember?.length || 0
      },
      message: "Members assigned successfully"
    })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || "Authentication required", error.statusCode || 401)
    }
    console.error("Assign department members error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to assign members to department" },
      { status: 500 }
    )
  }
}
