import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProjectStatus } from '@prisma/client'

// GET /api/projects/[id] - Get a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        university: true,
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
            department: true,
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
            subtasks: true,
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
        investments: {
          include: {
            investor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        agreements: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        category: project.category,
        status: project.status,
        owner: project.owner,
        university: project.university,
        members: project.members,
        departments: project.departments,
        tasks: project.tasks,
        milestones: project.milestones,
        investments: project.investments,
        agreements: project.agreements,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      status,
      hrLeadId,
      completionRate,
      seekingInvestment,
      investmentGoal,
      investmentRaised,
      startDate,
      endDate,
    } = body

    const project = await db.project.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status: status as ProjectStatus }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: endDate ? new Date(endDate) : null }),
      },
      include: {
        owner: true,
        university: true,
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
  { params }: { params: { id: string } }
) {
  try {
    await db.project.delete({
      where: { id: params.id },
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
