import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProjectStatus } from '@/lib/constants'
import { requireAuth } from '@/lib/auth/verify'

// GET /api/projects/[id] - Get a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await db.project.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        Business: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        ProjectMember: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                progressionLevel: true,
                totalPoints: true,
              },
            },
          },
        },
        Department: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        Task: {
          include: {
            TaskAssignee: {
              include: {
                User: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    email: true,
                  },
                },
              },
              orderBy: { sortOrder: 'asc' },
            },
            SubTask: {
              orderBy: { sortOrder: 'asc' }
            },
          },
          orderBy: {
            dueDate: 'asc',
          },
          take: 20,
        },
        Milestone: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        Vacancy: true,
      },
    })
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: project.id,
        title: project.name,  // Include as 'title' for frontend compatibility
        name: project.name,
        description: project.description,
        category: project.category,
        status: project.status,
        owner: project.User,
        business: project.Business,
        members: project.ProjectMember,
        departments: project.Department,
        tasks: project.Task,
        milestones: project.Milestone,
        vacancies: project.Vacancy,
        startDate: project.startDate,
        endDate: project.endDate,
        budget: project.budget,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        // Computed fields
        completionRate: project.Task && project.Task.length > 0
          ? Math.round((project.Task.filter((t) => t.status === 'DONE').length / project.Task.length) * 100)
          : 0,
        tasksCompleted: project.Task ? project.Task.filter((t) => t.status === 'DONE').length : 0,
        totalPoints: project.ProjectMember?.reduce((sum, m) => sum + (m.User?.totalPoints || 0), 0) || 0,
        projectLead: project.ProjectMember?.find((m) => m.role === 'OWNER' || m.role === 'PROJECT_MANAGER')?.User || project.User,
      },
    })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request)
    const { id } = await params

    // Check if project exists and user has permission
    const existingProject = await db.project.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user is owner or admin
    const isOwner = existingProject.ownerId === authResult.dbUser.id
    const isAdmin = authResult.dbUser.role === 'PLATFORM_ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to update this project' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      status,
      startDate,
      endDate,
      budget,
    } = body

    const project = await db.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status: status as ProjectStatus }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(budget !== undefined && { budget }),
      },
      include: {
        User: true,
        Business: true,
      },
    })

    return NextResponse.json({
      message: 'Project updated successfully',
      project,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request)
    const { id } = await params

    // Check if project exists and user has permission
    const existingProject = await db.project.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user is owner or admin
    const isOwner = existingProject.ownerId === authResult.dbUser.id
    const isAdmin = authResult.dbUser.role === 'PLATFORM_ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this project' },
        { status: 403 }
      )
    }

    await db.project.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Project deleted successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
