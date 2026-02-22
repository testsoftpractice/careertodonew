import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth/verify'
import { db } from '@/lib/db'

// GET /api/dashboard/university/projects - Get university projects with metrics
export async function GET(request: NextRequest) {
  const authResult = await getAuthUser(request)
  
  if (!authResult.success || !authResult.dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = authResult.dbUser

  // Only university admins and platform admins can access this endpoint
  if (user.role !== 'UNIVERSITY_ADMIN' && user.role !== 'PLATFORM_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // For university admins, they must have a universityId
  if (user.role === 'UNIVERSITY_ADMIN' && !user.universityId) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const status = (searchParams.get('status') as string) || 'all'
  const search = (searchParams.get('search') as string) || ''

  try {
    // Build where clause
    const where: any = {}

    // If university admin, only show projects from their university
    if (user.role === 'UNIVERSITY_ADMIN' && user.universityId) {
      // Filter by projects where the owner is from this university
      const usersFromUniversity = await db.user.findMany({
        where: { universityId: user.universityId },
        select: { id: true }
      })
      const userIds = usersFromUniversity.map(u => u.id)
      where.ownerId = { in: userIds }
    }

    if (status !== 'all') {
      where.status = status as any
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Get projects
    const projects = await db.project.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            avatar: true,
            major: true,
            universityId: true,
          },
        },
        ProjectMember: {
          select: {
            User: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          }
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

    // Get task and milestone counts separately
    const projectIds = projects.map(p => p.id)
    const tasksByProject = await db.task.groupBy({
      by: ['projectId'],
      where: { projectId: { in: projectIds } },
      _count: true
    })
    
    const tasksByProjectMap = new Map(tasksByProject.map((t: any) => [t.projectId, t._count]))

    const milestonesByProject = await db.milestone.groupBy({
      by: ['projectId'],
      where: { projectId: { in: projectIds } },
      _count: true
    })
    
    const milestonesByProjectMap = new Map(milestonesByProject.map((m: any) => [m.projectId, m._count]))

    // Calculate additional metrics for each project
    const projectsWithMetrics = projects.map(project => {
      const projectWithCount = project as typeof project & { _count?: { Task?: number; Milestone?: number; ProjectMember?: number } }
      
      const totalTasks = tasksByProjectMap.get(project.id) || 0
      const totalMilestones = milestonesByProjectMap.get(project.id) || 0
      const memberCount = projectWithCount._count?.ProjectMember || 0

      return {
        id: project.id,
        title: project.name,
        description: project.description || '',
        status: project.status,
        stage: project.stage,
        progress: project.progress || 0,
        category: project.category || 'General',
        
        // Lead info
        lead: project.User ? {
          id: project.User.id,
          name: project.User.name,
          avatar: project.User.avatar,
          major: project.User.major,
        } : null,

        // Members
        memberCount,
        members: project.ProjectMember.map((m: any) => ({
          id: m.User.id,
          name: m.User.name,
          avatar: m.User.avatar,
        })),

        // Metrics
        totalTasks,
        completedTasks: 0, // Would need separate query
        taskCompletionRate: 0,

        totalMilestones,
        completedMilestones: 0, // Would need separate query
        milestoneCompletionRate: 0,

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
