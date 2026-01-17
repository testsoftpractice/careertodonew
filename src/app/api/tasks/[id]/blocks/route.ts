import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { canPerformAction } from '@/lib/models/project-roles'
import { isFeatureEnabled, TASK_MANAGEMENT } from '@/lib/features/flags'

// Validation schemas
const blockTaskSchema = z.object({
  taskId: z.string(),
  reason: z.string().min(10).max(500),
})

// POST /api/tasks/[id]/blocks - Block task (prevent work)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { taskId, id } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = blockTaskSchema.parse(body)

    // Check if user has permission to block task
    // Only project lead, department heads, or mentors can block tasks
    if (!canPerformAction({ user, action: 'manage' })) {
      return NextResponse.json({ error: 'Forbidden - Only project leads, department heads, or mentors can block tasks' }, { status: 403 })
    }

    // Get task
    const task = await db.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if task belongs to same project
    const project = await db.project.findUnique({
      where: { id },
      select: { projectLeadId: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user can block this task
    const projectMember = await db.projectMember.findFirst({
      where: {
        projectId: project.id,
        userId: user.id,
        role: ['PROJECT_LEAD', 'DEPARTMENT_HEAD', 'TEAM_LEAD', 'MENTOR'],
      },
    })

    if (!projectMember && user.userRole !== 'PLATFORM_ADMIN') {
      return NextResponse.json({ error: 'Forbidden - No access to this task' }, { status: 403 })
    }

    // Check if user has higher role than task assignee
    const taskAssignee = await db.projectMember.findFirst({
      where: {
        projectId: project.id,
        userId: task.assignedTo,
      },
    })

    const roleHierarchy: Record<string, number> = {
      'PROJECT_LEAD': 9,
      'CO_LEAD': 8,
      'DEPARTMENT_HEAD': 8,
      'TEAM_LEAD': 7,
      'MENTOR': 5,
      'SENIOR_CONTRIBUTOR': 6,
      'CONTRIBUTOR': 4,
      'JUNIOR_CONTRIBUTOR': 3,
      'GUEST': 1,
    }

    if (taskAssignee && roleHierarchy[taskAssignee.role] >= roleHierarchy[projectMember.role]) {
      return NextResponse.json({ error: 'Forbidden - Cannot block task assigned to higher or equal role' }, { status: 403 })
    }

    // Block task (add blocking dependency)
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        blockedBy: id,
        blockedAt: new Date(),
        status: 'BLOCKED',
        blockReason: validatedData.reason,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: updatedTask.id,
          title: updatedTask.title,
          status: updatedTask.status,
          blockedBy: {
            id: user.id,
            name: user.name,
          },
          blockedAt: updatedTask.blockedAt,
          blockReason: validatedData.reason,
        },
        message: `Task blocked successfully by ${user.name}`,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Block task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
