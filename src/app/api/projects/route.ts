import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProjectCategory, ProjectStatus, UserRole } from '@prisma/client'

// GET /api/projects - List all projects with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const universityId = searchParams.get('universityId')
    const userId = searchParams.get('userId')
    const seekingInvestment = searchParams.get('seekingInvestment')

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status as ProjectStatus
    }

    if (category && category !== 'all') {
      where.category = category as ProjectCategory
    }

    if (universityId) {
      where.universityId = universityId
    }

    if (seekingInvestment === 'true') {
      where.seekingInvestment = true
    }

    if (userId) {
      where.OR = [
        { projectLeadId: userId },
        { members: { some: { userId } } },
      ]
    }

    const projects = await db.project.findMany({
      where,
      include: {
        projectLead: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        university: {
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
              },
            },
          },
        },
        departments: true,
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    // Get total count for pagination
    const totalCount = await db.project.count({ where })

    return NextResponse.json({
      projects: projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        projectLead: project.projectLead,
        university: project.university,
        teamSize: project._count.members,
        taskCount: project._count.tasks,
        completionRate: project.completionRate,
        seekingInvestment: project.seekingInvestment,
        investmentGoal: project.investmentGoal,
        investmentRaised: project.investmentRaised,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      projectLeadId,
      universityId,
      seekingInvestment,
      investmentGoal,
      startDate,
    } = body

    // Create project
    const project = await db.project.create({
      data: {
        title,
        description,
        category: category as ProjectCategory,
        projectLeadId,
        universityId,
        status: ProjectStatus.PROPOSED,
        seekingInvestment: seekingInvestment || false,
        investmentGoal: investmentGoal ? parseFloat(investmentGoal) : null,
        startDate: startDate ? new Date(startDate) : null,
        teamSize: 1,
      },
      include: {
        projectLead: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        university: true,
      },
    })

    // Add project lead as a member
    await db.projectMember.create({
      data: {
        projectId: project.id,
        userId: projectLeadId,
        role: 'PROJECT_LEAD',
        startDate: new Date(),
      },
    })

    return NextResponse.json(
      {
        message: 'Project created successfully',
        project: {
          id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          status: project.status,
          projectLead: project.projectLead,
          university: project.university,
          seekingInvestment: project.seekingInvestment,
          investmentGoal: project.investmentGoal,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
