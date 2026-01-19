import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== TASKS API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.projectId as string | undefined
    const assigneeId = searchParams.assigneeId as string | undefined
    const status = searchParams.status as string | undefined
    const priority = searchParams.priority as string | undefined

    const where: any = {}

    if (projectId) {
      where.projectId = projectId
    }

    if (assigneeId) {
      where.assigneeId = assigneeId
    }

    if (status) {
      where.status = status as any
    }

    if (priority) {
      where.priority = priority as any
    }

    const tasks = await db.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          }
        },
        subtasks: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }]
    })

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length
    })
  } catch (error) {
    console.error('Tasks API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tasks'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const task = await db.task.create({
      data: {
        title: body.title,
        description: body.description,
        projectId: body.projectId,
        assigneeId: body.assigneeId,
        creatorId: body.creatorId,
        departmentId: body.departmentId,
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        deliverable: body.deliverable,
        outputUrl: body.outputUrl,
      }
    })

    return NextResponse.json({
      success: true,
      data: task
    }, { status: 201 })
  } catch (error) {
    console.error('Task creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create task'
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.id as string

    if (!taskId) {
      return NextResponse.json({
        success: false,
        error: 'Task ID is required'
      }, { status: 400 })
    }

    const body = await request.json()

    const updateData: any = {}

    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
    }

    if (body.assigneeId !== undefined) {
      updateData.assigneeId = body.assigneeId
    }

    if (body.priority !== undefined) {
      updateData.priority = body.priority
    }

    if (body.qualityScore !== undefined) {
      updateData.qualityScore = parseFloat(body.qualityScore)
    }

    if (body.feedback !== undefined) {
      updateData.feedback = body.feedback
    }

    const task = await db.task.update({
      where: { id: taskId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: task
    })
  } catch (error) {
    console.error('Task update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update task'
    }, { status: 500 })
  }
}
