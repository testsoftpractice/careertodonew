import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProjectStatus } from '@prisma/client'

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
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                progressionLevel: true,
              },
            },
          },
        },
        departments: {
          include: {
            head: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            subTasks: true,
          },
          orderBy: {
            dueDate: 'asc',
          },
          take: 20,
        },
        milestones: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        vacancies: true,
      },
    })

    if (!result) {
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
        owner: project.owner,
        business: project.business,
        members: project.members,
        departments: project.departments,
        tasks: project.tasks,
        milestones: project.milestones,
        vacancies: project.vacancies,
        startDate: project.startDate,
        endDate: project.endDate,
        budget: project.budget,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        // Computed fields
        completionRate: project.tasks && project.tasks.length > 0
          ? Math.round((project.tasks.filter((t: any) => t.status === 'DONE').length / project.tasks.length) * 100)
          : 0,
        tasksCompleted: project.tasks ? project.tasks.filter((t: any) => t.status === 'DONE').length : 0,
        totalPoints: project.members?.reduce((sum: any, m: any) => sum + (m.user?.totalPoints || 0), 0) || 0,
        projectLead: project.members?.find((m: any) => m.role === 'OWNER' || m.role === 'PROJECT_MANAGER')?.user || project.owner,
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
    const { id } = await params
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
        owner: true,
        business: true,
      },
    })

    return NextResponse.json({
      message: 'Project updated successfully',
      project,
    })
  } catch (error) {
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
    const { id } = await params
    await db.project.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
