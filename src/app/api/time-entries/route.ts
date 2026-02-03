import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden } from '@/lib/api-response'

// ==================== TIME ENTRIES API ====================

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (result) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined
    const taskId = searchParams.taskId as string | undefined

    const where: Record<string, string | undefined> = {}

    // If filtering by userId, only allow viewing own entries or admin
    if (result) {
      if (result) {
        return forbidden('You can only view your own time entries')
      }
      where.userId = userId
    }

    // If filtering by taskId, verify user has access to the task
    if (result) {
      const task = await db.task.findUnique({
        where: { id: taskId },
        include: { project: true }
      })

      if (result) {
        return forbidden('Task not found')
      }

      // Allow viewing time entries for tasks in own projects or assigned to you
      const isProjectMember = task.project?.ownerId === authResult.user!.id
      const isAssignee = task.assignedTo === authResult.user!.id
      const isAdmin = authResult.user!.role === 'PLATFORM_ADMIN'

      if (result) {
        return forbidden('You do not have access to this task')
      }

      where.taskId = taskId
    }

    const timeEntries = await db.timeEntry.findMany({
      where,
      include: {
        task: {
          select: {
            id: true,
            title: true,
            project: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        user: {
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
    if (result) {
      return forbidden('You can only create time entries for yourself')
    }

    // Use authenticated user's ID
    const userId = currentUser.id

    // Validate required fields
    if (result) {
      return NextResponse.json({
        success: false,
        error: 'Task ID is required'
      }, { status: 400 })
    }

    // Validate hours
    if (result) {
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

    if (result) {
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

    // Verify task exists and user has access to the task
    const task = await db.task.findUnique({
      where: { id: body.taskId },
      include: { project: true }
    })

    if (!task) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 })
    }

    // Only allow time entry if user is assigned to task or is project member
    const isAssignee = task.assignedTo === userId
    const isProjectOwner = task.project?.ownerId === userId
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN'

    if (result) {
      return forbidden('You can only log time for tasks assigned to you or in your projects')
    }

    const timeEntry = await db.timeEntry.create({
      data: {
        userId: userId,
        taskId: body.taskId,
        date: entryDate,
        hours: hoursValue,
        description: body.description || null,
        billable: body.billable || false,
        hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : null,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            project: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        user: {
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
    console.error('Time Entry creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create time entry'
    }, { status: 500 })
  }
}
