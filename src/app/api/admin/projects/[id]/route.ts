import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth/jwt"

// DELETE /api/admin/projects/[id] - Delete a single project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id: projectId } = await params

    // Check if project exists and get details
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        _count: {
          select: {
            ProjectMember: true,
            Task: true,
            Investment: true,
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if project has members or tasks (safety check)
    if ((project._count?.ProjectMember || 0) > 1 ||
        (project._count?.Task || 0) > 0 ||
        (project._count?.Investment || 0) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete project. Project has active members, tasks, or investments.',
          details: {
            members: project._count?.ProjectMember,
            tasks: project._count?.Task,
            investments: project._count?.Investment,
          }
        },
        { status: 400 }
      )
    }

    // Delete project (cascade will handle related records)
    await db.project.delete({
      where: { id: projectId }
    })

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
