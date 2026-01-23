import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== TIME ENTRIES API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined
    const taskId = searchParams.taskId as string | undefined

    const where: any = {}
    if (userId) where.userId = userId
    if (taskId) where.taskId = taskId

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
    const body = await request.json()

    // Validate required fields
    if (!body.userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    if (!body.taskId) {
      return NextResponse.json({
        success: false,
        error: 'Task ID is required'
      }, { status: 400 })
    }

    if (!body.hours || parseFloat(body.hours) <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Hours must be greater than 0'
      }, { status: 400 })
    }

    // Verify task exists
    const task = await db.task.findUnique({
      where: { id: body.taskId }
    })

    if (!task) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 })
    }

    const timeEntry = await db.timeEntry.create({
      data: {
        userId: body.userId,
        taskId: body.taskId,
        date: body.date ? new Date(body.date) : new Date(),
        hours: parseFloat(body.hours),
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
