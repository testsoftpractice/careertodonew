import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden, errorResponse } from '@/lib/api-response'

// ==================== TIME ENTRIES API ====================

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') as string | undefined
    const taskId = searchParams.get('taskId') as string | undefined
    const projectId = searchParams.get('projectId') as string | undefined

    const where: Record<string, string | undefined> = {}

    // If filtering by userId, only allow viewing own entries or admin
    if (userId) {
      if (userId !== authResult.user!.id && authResult.user!.role !== 'PLATFORM_ADMIN') {
        return forbidden('You can only view your own time entries')
      }
      where.userId = userId
    } else {
      // Default to current user
      where.userId = authResult.user!.id
    }

    // If filtering by taskId, verify user has access to the task
    if (taskId) {
      const task = await db.task.findUnique({
        where: { id: taskId },
        include: { Project: true }
      })

      if (!task) {
        return forbidden('Task not found')
      }

      // Allow viewing time entries for tasks in own projects or assigned to you
      const isProjectMember = task.Project?.ownerId === authResult.user!.id
      const isAssignee = await db.taskAssignee.findFirst({
        where: { taskId, userId: authResult.user!.id }
      })
      const isAdmin = authResult.user!.role === 'PLATFORM_ADMIN'

      if (!isProjectMember && !isAssignee && !isAdmin) {
        return forbidden('You do not have access to this task')
      }

      where.taskId = taskId
    }

    // If filtering by projectId, verify user has access to the project
    if (projectId) {
      const project = await db.project.findUnique({
        where: { id: projectId },
        include: { ProjectMember: true }
      })

      if (!project) {
        return forbidden('Project not found')
      }

      const isOwner = project.ownerId === authResult.user!.id
      const isMember = project.ProjectMember.some(m => m.userId === authResult.user!.id)
      const isAdmin = authResult.user!.role === 'PLATFORM_ADMIN'

      if (!isOwner && !isMember && !isAdmin) {
        return forbidden('You do not have access to this project')
      }

      where.projectId = projectId
    }

    const timeEntries = await db.timeEntry.findMany({
      where,
      include: {
        Task: {
          select: {
            id: true,
            title: true,
            Project: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0)

    // Map fields to match frontend expectations
    const mappedEntries = timeEntries.map(entry => ({
      ...entry,
      startTime: entry.date,
      endTime: null, // Single entry doesn't have end time
      type: 'TIME_ENTRY',
      duration: entry.hours,
    }))

    return NextResponse.json({
      success: true,
      data: mappedEntries,
      count: mappedEntries.length,
      totalHours
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Time Entries API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch time entries'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const body = await request.json()

    // Users can only create time entries for themselves
    const userId = currentUser.id

    // Validate required fields - at least one of taskId or projectId must be provided
    if (!body.taskId && !body.projectId) {
      return NextResponse.json({
        success: false,
        error: 'Either Task ID or Project ID is required'
      }, { status: 400 })
    }

    // Validate hours
    if (!body.hours) {
      return NextResponse.json({
        success: false,
        error: 'Hours are required'
      }, { status: 400 })
    }

    const hoursValue = parseFloat(body.hours)
    // Validate hours range (0 < hours <= 24)
    if (isNaN(hoursValue) || hoursValue <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Hours must be a positive number'
      }, { status: 400 })
    }

    if (hoursValue > 24) {
      return NextResponse.json({
        success: false,
        error: 'Hours cannot exceed 24'
      }, { status: 400 })
    }

    // Validate date
    const entryDate = body.date ? new Date(body.date) : new Date()
    if (isNaN(entryDate.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Invalid date'
      }, { status: 400 })
    }

    // Date cannot be in the future (unless for planning)
    if (entryDate > new Date()) {
      return NextResponse.json({
        success: false,
        error: 'Date cannot be in the future'
      }, { status: 400 })
    }

    // Verify task exists and user has access if taskId is provided
    if (body.taskId) {
      const task = await db.task.findUnique({
        where: { id: body.taskId },
        include: { Project: true }
      })

      if (!task) {
        return NextResponse.json({
          success: false,
          error: 'Task not found'
        }, { status: 404 })
      }

      // Only allow time entry if user is assigned to task or is project member
      const isAssignee = await db.taskAssignee.findFirst({
        where: { taskId: body.taskId, userId }
      })
      const isProjectOwner = task.Project?.ownerId === userId
      const isAdmin = currentUser.role === 'PLATFORM_ADMIN'

      if (!isAssignee && !isProjectOwner && !isAdmin) {
        return forbidden('You can only log time for tasks assigned to you or in your projects')
      }
    }

    // Verify project exists and user has access if only projectId is provided
    if (!body.taskId && body.projectId) {
      const project = await db.project.findUnique({
        where: { id: body.projectId },
        include: { ProjectMember: true }
      })

      if (!project) {
        return NextResponse.json({
          success: false,
          error: 'Project not found'
        }, { status: 404 })
      }

      const isOwner = project.ownerId === userId
      const isMember = project.ProjectMember.some(m => m.userId === userId)
      const isAdmin = currentUser.role === 'PLATFORM_ADMIN'

      if (!isOwner && !isMember && !isAdmin) {
        return forbidden('You can only log time for projects you own or are a member of')
      }
    }

    const timeEntry = await db.timeEntry.create({
      data: {
        userId: userId,
        taskId: body.taskId || null,
        projectId: body.projectId || null,
        workSessionId: body.workSessionId || null,
        date: entryDate,
        hours: hoursValue,
        description: body.description || null,
        billable: body.billable || false,
        hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : null,
      },
      include: {
        Task: {
          select: {
            id: true,
            title: true,
            Project: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        Project: {
          select: {
            id: true,
            name: true,
          }
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    // Map fields to match frontend expectations
    const mappedEntry = {
      ...timeEntry,
      startTime: timeEntry.date,
      endTime: null,
      type: 'TIME_ENTRY',
      duration: timeEntry.hours,
    }

    return NextResponse.json({
      success: true,
      data: mappedEntry,
      message: 'Time entry created successfully'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Time Entry creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create time entry'
    }, { status: 500 })
  }
}
