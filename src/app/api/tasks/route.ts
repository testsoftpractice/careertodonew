import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TaskStatus, TaskPriority } from '@prisma/client'

// GET /api/tasks - List tasks with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const assigneeId = searchParams.get('assigneeId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const departmentId = searchParams.get('departmentId')

    const where: any = {}

    if (projectId) {
      where.projectId = projectId
    }

    if (assigneeId) {
      where.assigneeId = assigneeId
    }

    if (status && status !== 'all') {
      where.status = status as TaskStatus
    }

    if (priority && priority !== 'all') {
      where.priority = priority as TaskPriority
    }

    if (departmentId) {
      where.departmentId = departmentId
    }

    const tasks = await db.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        subtasks: true,
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 100,
    })

    return NextResponse.json({
      tasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        project: task.project,
        departmentId: task.departmentId,
        department: task.department,
        assigneeId: task.assigneeId,
        assignee: task.assignee,
        creatorId: task.creatorId,
        creator: task.creator,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        completedAt: task.completedAt,
        deliverable: task.deliverable,
        outputUrl: task.outputUrl,
        qualityScore: task.qualityScore,
        feedback: task.feedback,
        subtasks: task.subtasks,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    })
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      projectId,
      departmentId,
      assigneeId,
      creatorId,
      priority,
      dueDate,
      dependsOn,
    } = body

    const task = await db.task.create({
      data: {
        title,
        description,
        projectId,
        departmentId,
        assigneeId,
        creatorId,
        status: TaskStatus.PENDING,
        priority: priority || TaskPriority.MEDIUM,
        dueDate: dueDate ? new Date(dueDate) : null,
        dependsOn,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Create notification for assignee
    if (assigneeId) {
      await db.notification.create({
        data: {
          userId: assigneeId,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: `You have been assigned to task: ${title}`,
          link: `/projects/${projectId}/tasks/${task.id}`,
        },
      })
    }

    return NextResponse.json(
      {
        message: 'Task created successfully',
        task,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
