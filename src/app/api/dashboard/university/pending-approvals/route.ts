import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/university/pending-approvals - Get pending project approvals
export async function GET(request: NextRequest) {
  const auth = requireRole(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if (auth instanceof NextResponse) return auth
  
  const user = auth.user
  const universityId = user.universityId

  if (!universityId && user.role !== 'PLATFORM_ADMIN') {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const status = (searchParams.get('status') as string) || 'PENDING'

  try {
    const whereClause: Record<string, unknown> = {}

    // Filter by university if not platform admin
    if (user.role !== 'PLATFORM_ADMIN' && universityId) {
      whereClause.universityId = universityId
    }

    // Add status filter if provided and valid
    if (status && ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
      whereClause.approvalStatus = status
    }

    const projects = await db.project.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            major: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true,
                location: true,
              },
            },
          },
        },
        university: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
          },
        },
        members: {
          include: {
            user: {
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
            members: true,
            tasks: true,
            milestones: true,
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
      owner: project.owner ? {
        id: project.owner.id,
        name: project.owner.name,
        email: project.owner.email,
        avatar: project.owner.avatar,
        university: project.owner.university,
      } : null,
      university: project.university,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      members: project._count.members,
      tasks: project._count.tasks,
      milestones: project._count.milestones,
      status: project.status,
      stage: project.stage,
      approvalStatus: project.approvalStatus,
      progress: project.progress || 0,
      seekingInvestment: project.category?.toLowerCase().includes('investment') || false,
      investmentGoal: null,
      investmentRaised: 0,
      teamSizeMin: project._count.members || 0,
      teamSizeMax: project._count.members || 0,
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
