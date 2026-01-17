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
        projectLead: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        hrLead: {
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
            _count: {
              select: {
                members: true,
                tasks: true,
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
            targetDate: 'asc',
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
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        projectLead: project.projectLead,
        hrLead: project.hrLead,
        university: project.university,
        members: project.members,
        departments: project.departments,
        tasks: project.tasks,
        milestones: project.milestones,
        investments: project.investments,
        agreements: project.agreements,
        completionRate: project.completionRate,
        teamSize: project.members.length,
        seekingInvestment: project.seekingInvestment,
        investmentGoal: project.investmentGoal,
        investmentRaised: project.investmentRaised,
        startDate: project.startDate,
        endDate: project.endDate,
        approvalDate: project.approvalDate,
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
        ...(hrLeadId !== undefined && { hrLeadId }),
        ...(completionRate !== undefined && { completionRate: parseFloat(completionRate) }),
        ...(seekingInvestment !== undefined && { seekingInvestment }),
        ...(investmentGoal !== undefined && { investmentGoal: investmentGoal ? parseFloat(investmentGoal) : null }),
        ...(investmentRaised !== undefined && { investmentRaised: investmentRaised ? parseFloat(investmentRaised) : null }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: endDate ? new Date(endDate) : null }),
      },
      include: {
        projectLead: true,
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
