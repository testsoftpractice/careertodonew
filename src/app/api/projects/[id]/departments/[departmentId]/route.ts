import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, AuthError } from "@/lib/auth/verify"
import { unauthorized, forbidden, notFound } from "@/lib/api-response"

// PATCH /api/projects/[id]/departments/[id] - Update a department
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
    const { id: projectId, id: departmentId } = await params

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return notFound('Project not found')
    }

    // Check if user can manage departments (project owner, project manager, or admin)
    const isProjectOwner = project.ownerId === currentUser.id
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN'

    if (!isProjectOwner && !isAdmin) {
      // Check if user is a project manager or owner in ProjectMember
      const member = await db.projectMember.findFirst({
        where: {
          projectId,
          userId: currentUser.id,
          role: { in: ['OWNER', 'PROJECT_MANAGER'] }
        }
      })

      if (!member) {
        return forbidden('You do not have permission to update departments')
      }
    }

    const body = await request.json()
    const updates: any = {}

    if (body.name) updates.name = body.name
    if (body.headId !== undefined) updates.headId = body.headId || null

    // Verify head exists if provided
    if (updates.headId) {
      const headExists = await db.user.findUnique({
        where: { id: updates.headId }
      })

      if (!headExists) {
        return NextResponse.json({
          success: false,
          error: 'Department head not found'
        }, { status: 404 })
      }

      // Verify head is a member of the project
      const isMember = await db.projectMember.findFirst({
        where: {
          projectId,
          userId: updates.headId
        }
      })

      if (!isMember) {
        return NextResponse.json({
          success: false,
          error: 'Department head must be a project member'
        }, { status: 400 })
      }
    }

    const department = await db.department.update({
      where: { id: departmentId, projectId },
      data: updates,
      include: {
        head: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: department,
    })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message || 'Authentication required'
      }, { status: error.statusCode || 401 })
    }
    console.error("Update department error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to update department"
    }, { status: 500 })
  }
}

// DELETE /api/projects/[id]/departments/[id] - Delete a department
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
    const { id: projectId, id: departmentId } = await params

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return notFound('Project not found')
    }

    // Check if user can manage departments (project owner, project manager, or admin)
    const isProjectOwner = project.ownerId === currentUser.id
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN'

    if (!isProjectOwner && !isAdmin) {
      // Check if user is a project manager or owner in ProjectMember
      const member = await db.projectMember.findFirst({
        where: {
          projectId,
          userId: currentUser.id,
          role: { in: ['OWNER', 'PROJECT_MANAGER'] }
        }
      })

      if (!member) {
        return forbidden('You do not have permission to delete departments')
      }
    }

    await db.department.delete({
      where: { id: departmentId, projectId },
    })

    return NextResponse.json({
      success: true,
      message: "Department deleted successfully"
    })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message || 'Authentication required'
      }, { status: error.statusCode || 401 })
    }
    console.error("Delete department error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to delete department"
    }, { status: 500 })
  }
}
