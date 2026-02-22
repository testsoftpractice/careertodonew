import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/university/pending-approvals - Get pending project approvals
export async function GET(request: NextRequest) {
  const auth = await requireRole(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if (auth instanceof NextResponse) return auth

  const universityId = auth.universityId

  if (!universityId && auth.role !== 'PLATFORM_ADMIN') {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const status = (searchParams.get('status') as string) || 'PENDING'

  try {
    const whereClause: Record<string, unknown> = {}

    // Filter by university if not platform admin
    if (auth.role !== 'PLATFORM_ADMIN' && universityId) {
      whereClause.universityId = universityId
    }

    // Add status filter if provided and valid
    if (status && ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
      whereClause.approvalStatus = status
    }

    const projects = await db.project.findMany({
      where: whereClause,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            major: true,
            University: {
              select: {
                id: true,
                name: true,
                code: true,
                location: true,
              },
            },
          },
        },
        University: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
          },
        },
        ProjectMember: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                major: true,
              },
            },
          },
          take: 10,
        },
        _count: {
          select: {
            ProjectMember: true,
            Task: true,
            Milestone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedProjects = projects.map(project => ({
      id: project.id,
      title: project.name,
      description: project.description || '',
      category: project.category || 'General',
      owner: project.User ? {
        id: project.User.id,
        name: project.User.name,
        email: project.User.email,
        avatar: project.User.avatar,
        university: project.User.University,
      } : null,
      university: project.University,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      members: project._count.ProjectMember,
      tasks: project._count.Task,
      milestones: project._count.Milestone,
      status: project.status,
      stage: project.stage,
      approvalStatus: project.approvalStatus,
      progress: project.progress || 0,
      seekingInvestment: project.category?.toLowerCase().includes('investment') || false,
      investmentGoal: null,
      investmentRaised: 0,
      teamSizeMin: project._count.ProjectMember || 0,
      teamSizeMax: project._count.ProjectMember || 0,
    }))

    return NextResponse.json({
      success: true,
      data: {
        projects: formattedProjects,
        count: formattedProjects.length,
      }
    })
  } catch (error) {
    console.error('Get pending approvals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
