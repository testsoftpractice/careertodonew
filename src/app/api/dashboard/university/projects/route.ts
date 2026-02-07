import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireRole, getUserFromRequest } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/university/projects - Get university projects with metrics
export async function GET(request: NextRequest) {
  const user = requireRole(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if (user instanceof NextResponse) return user
  const universityId = user?.universityId

  if (!user) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const status = (searchParams.get('status') as string) || 'all'
  const search = (searchParams.get('search') as string) || ''

  try {
    // Get projects owned by students of this university
    const projects = await db.project.findMany({
      where: {
        ownerId: {
          universityId,
        },
        ...(status !== 'all' ? { status: status as any } : {}),
        ...(search ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ]
        } : {})
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            major: true,
          },
        },
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          }
        },
        tasks: {
          select: {
            id: true,
            status: true,
          }
        },
        milestones: {
          select: {
            id: true,
            status: true,
          }
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

    // Calculate additional metrics for each project
    const projectsWithMetrics = projects.map(project => {
      const projectWithCount = project as typeof project & { _count?: { tasks?: number; milestones?: number; members?: number } }
      const totalTasks = projectWithCount._count?.tasks || 0
      const completedTasks = project.tasks?.filter((t: any) => t.status === 'DONE').length || 0
      const totalMilestones = projectWithCount._count?.milestones || 0
      const completedMilestones = project.milestones?.filter((m: any) => m.status === 'COMPLETED').length || 0
      const memberCount = projectWithCount._count?.members || 0

      return {
        id: project.id,
        title: project.name,
        description: project.description || '',
        status: project.status,
        stage: project.stage,
        progress: project.progress || 0,
        category: project.category || 'General',
        
        // Lead info
        lead: project.owner ? {
          id: project.owner.id,
          name: project.owner.name,
          avatar: project.owner.avatar,
          major: project.owner.major,
        } : null,

        // Members
        memberCount,
        members: project.members.map((m: any) => ({
          id: m.user.id,
          name: m.user.name,
          avatar: m.user.avatar,
        })),

        // Metrics
        totalTasks,
        completedTasks,
        taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,

        totalMilestones,
        completedMilestones,
        milestoneCompletionRate: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0,

        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }
    })

    return NextResponse.json({
      success: true,
      data: projectsWithMetrics,
      count: projectsWithMetrics.length,
      statistics: {
        total: projectsWithMetrics.length,
        active: projectsWithMetrics.filter(p => p.status === 'IN_PROGRESS').length,
        completed: projectsWithMetrics.filter(p => p.status === 'COMPLETED').length,
        onHold: projectsWithMetrics.filter(p => p.status === 'ON_HOLD').length,
      }
    })
  } catch (error) {
    console.error('Get university projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
