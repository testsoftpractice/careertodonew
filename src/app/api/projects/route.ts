import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProjectCategory, ProjectStatus, UserRole } from '@prisma/client'

// GET /api/projects - List all projects with filters
export async function GET(request: NextRequest) {
  try {
    // Require authentication (any role can view projects)
    const auth = await requireAuth(request)
    if ('status' in auth) return auth
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const universityId = searchParams.get('universityId')
    const userId = searchParams.get('userId')
    const seekingInvestment = searchParams.get('seekingInvestment')

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
      take: 50,
    })

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
    // Require authentication and check role
    const auth = await requireAuth(request)
    if ('status' in auth) return auth

    // Only students, university admins, and mentors can create projects
    const allowedRoles = ['STUDENT', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN', 'MENTOR']
    

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

    // Validate user can only create projects for themselves
    if (projectLeadId !== auth.user.userId && auth.user.userRole !== 'PLATFORM_ADMIN' && auth.user.userRole !== 'UNIVERSITY_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - You can only create projects for yourself' },
        { status: 403 }
      )
    }

    // Validate investment goal is non-negative
    if (investmentGoal && parseFloat(investmentGoal) < 0) {
      return NextResponse.json(
        { error: 'Invalid investment goal - must be 0 or greater' },
        { status: 400 }
      )
    }

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
