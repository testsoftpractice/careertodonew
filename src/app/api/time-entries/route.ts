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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        task: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: { date: { desc: 'desc' } } as any
    })

    const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0)

    return NextResponse.json({
      success: true,
      data: timeEntries,
      count: timeEntries.length,
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

    const timeEntry = await db.timeEntry.create({
      data: {
        userId: body.userId,
        taskId: body.taskId,
        date: new Date(),
        hours: parseFloat(body.hours),
        description: body.description,
        billable: body.billable || false,
        hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: timeEntry
    }, { status: 201 })
  } catch (error) {
    console.error('Time Entry creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create time entry'
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entryId = searchParams.id as string

    if (!entryId) {
      return NextResponse.json({
        success: false,
        error: 'Time Entry ID is required'
      }, { status: 400 })
    }

    const body = await request.json()

    const timeEntry = await db.timeEntry.update({
      where: { id: entryId },
      data: {
        hours: body.hours ? parseFloat(body.hours) : undefined,
        description: body.description,
      }
    })

    return NextResponse.json({
      success: true,
      data: timeEntry
    })
  } catch (error) {
    console.error('Time Entry update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update time entry'
    }, { status: 500 })
  }
}
