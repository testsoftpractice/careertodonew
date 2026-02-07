import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, getUserFromRequest } from '@/lib/api/auth-middleware'
import { successResponse, errorResponse, forbidden } from '@/lib/api-response'

// PATCH /api/projects/[id]/publish - Publish a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request)
    if ('status' in auth) return auth

    const user = getUserFromRequest(request)
    const { id } = await params

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,
        name: true,
        published: true,
        status: true,
        approvalStatus: true,
      },
    })

    if (!project) {
      return errorResponse('Project not found', 404)
    }

    // Check if user is the project owner
    if (user.id !== project.ownerId && user.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only project owner can publish the project')
    }

    // Check if project is already published
    if (project.published) {
      return errorResponse('Project is already published', 400)
    }

    // Update project to published
    const updatedProject = await db.project.update({
      where: { id },
      data: {
        published: true,
        publishedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create notification for project owner
    await db.notification.create({
      data: {
        userId: project.ownerId,
        type: 'PROJECT_PUBLISHED',
        title: '📢 Project Published!',
        message: `Your project "${project.name}" has been published and is now visible to others.`,
        link: `/projects/${id}`,
      },
    })

    return successResponse(
      {
        project: updatedProject,
        message: 'Project published successfully',
      },
      'Project published successfully'
    )
  } catch (error: any) {
    console.error('Publish project error:', error)
    return errorResponse('Failed to publish project', 500)
  }
}

// DELETE /api/projects/[id]/publish - Unpublish a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request)
    if ('status' in auth) return auth

    const user = getUserFromRequest(request)
    const { id } = await params

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,
        name: true,
        published: true,
      },
    })

    if (!project) {
      return errorResponse('Project not found', 404)
    }

    // Check if user is the project owner
    if (user.id !== project.ownerId && user.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only project owner can unpublish the project')
    }

    // Check if project is not published
    if (!project.published) {
      return errorResponse('Project is not published', 400)
    }

    // Update project to unpublished
    const updatedProject = await db.project.update({
      where: { id },
      data: {
        published: false,
        publishedAt: null,
      },
    })

    return successResponse(
      {
        project: updatedProject,
        message: 'Project unpublished successfully',
      },
      'Project unpublished successfully'
    )
  } catch (error: any) {
    console.error('Unpublish project error:', error)
    return errorResponse('Failed to unpublish project', 500)
  }
}
