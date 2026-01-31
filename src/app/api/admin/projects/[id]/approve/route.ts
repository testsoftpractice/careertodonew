import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth/verify"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication and admin role
    const authResult = await requireAuth(request)
    const user = authResult.dbUser

    // Check if user is platform admin or university admin
    if (user.role !== 'PLATFORM_ADMIN' && user.role !== 'UNIVERSITY_ADMIN') {
      return NextResponse.json({
        success: false,
        error: "Forbidden: Admin access required"
      }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    // Validate status
    const validStatuses = ['UNDER_REVIEW', 'IN_PROGRESS', 'FUNDING', 'COMPLETED', 'ON_HOLD', 'CANCELLED']
    const newStatus = body.status

    if (!newStatus || !validStatuses.includes(newStatus)) {
      return NextResponse.json({
        success: false,
        error: "Invalid status"
      }, { status: 400 })
    }

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({
        success: false,
        error: "Project not found"
      }, { status: 404 })
    }

    // Update project status
    const updatedProject = await db.project.update({
      where: { id },
      data: {
        status: newStatus,
      }
    })

    // Create notification for project owner
    if (project.ownerId) {
      await db.notification.create({
        data: {
          userId: project.ownerId,
          type: newStatus === 'IN_PROGRESS' ? 'SUCCESS' : 'INFO',
          title: 'Project Status Updated',
          message: `Your project "${project.name}" has been ${newStatus === 'IN_PROGRESS' ? 'approved' : 'updated'} and is now ${newStatus.replace(/_/g, ' ')}`,
          priority: 'HIGH',
          read: false,
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: `Project status updated to ${newStatus.replace(/_/g, ' ')}`
    })
  } catch (error: any) {
    console.error("Approve project error:", error)

    // Handle AuthError
    if (error.name === 'AuthError' || error.statusCode) {
      return NextResponse.json({
        success: false,
        error: error.message || 'Authentication required'
      }, { status: error.statusCode || 401 })
    }

    return NextResponse.json({
      success: false,
      error: "Failed to update project status"
    }, { status: 500 })
  }
}
