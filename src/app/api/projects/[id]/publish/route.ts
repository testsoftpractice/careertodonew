import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { successResponse, errorResponse, forbidden, notFound } from '@/lib/api-response'

// PATCH /api/projects/[id]/publish - Publish a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
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
    const isOwner = project.ownerId === currentUser.id
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN'

    if (!isOwner && !isAdmin) {
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
        approvalStatus: 'APPROVED',
        status: 'ACTIVE',
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
        type: 'PROJECT_UPDATE',
        title: '📢 Project Published!',
        message: `Your project "${project.name}" has been published and is now visible to others.`,
        link: `/projects/${id}`,
      },
    })

    // Notify all project members
    const members = await db.projectMember.findMany({
      where: { projectId: id },
      include: { user: true },
    })

    for (const member of members) {
      await db.notification.create({
        data: {
          userId: member.userId,
          type: 'PROJECT_UPDATE',
          title: '📢 Project Published!',
          message: `The project "${project.name}" has been published and is now visible to others.`,
          link: `/projects/${id}`,
        },
      })
    }

    return successResponse(
      {
        project: updatedProject,
        message: 'Project published successfully',
      },
      'Project published successfully'
    )
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
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
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

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
      },
    })

    if (!project) {
      return errorResponse('Project not found', 404)
    }

    // Check if user is the project owner
    const isOwner = project.ownerId === currentUser.id
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN'

    if (!isOwner && !isAdmin) {
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
        approvalStatus: 'PENDING',
        status: 'IDEA',
      },
    })

    // Create notification for project owner
    await db.notification.create({
      data: {
        userId: project.ownerId,
        type: 'PROJECT_UPDATE',
        title: 'Project Unpublished',
        message: `Your project "${project.name}" has been unpublished and is now private.`,
        link: `/projects/${id}`,
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
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Unpublish project error:', error)
    return errorResponse('Failed to unpublish project', 500)
  }
}
