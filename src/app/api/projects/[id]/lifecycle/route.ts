import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/session'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { ProjectLifecycle, ProjectStage } from '@/lib/models/project-lifecycle'
import { isFeatureEnabled, PROJECT_LIFECYCLE } from '@/lib/features/flags'

// Validation schemas
const createLifecycleEntrySchema = z.object({
  stage: z.enum(['IDEA', 'DRAFT', 'PROPOSED', 'UNDER_REVIEW', 'APPROVED', 'RECRUITING', 'ACTIVE', 'PAUSED', 'COMPLETED']),
  notes: z.string().optional(),
  stageData: z.object({
    approvalCriteria: z.array(z.string()).optional(),
    rejectionReason: z.string().optional(),
    recruitingGoals: z.array(z.string()).optional(),
    completionMetrics: z.object({
      milestonesCompleted: z.number(),
      totalMilestones: z.number(),
      satisfactionScore: z.number().min(1).max(10),
    }).optional(),
  }).optional(),
})

const updateLifecycleEntrySchema = z.object({
  stage: z.enum(['IDEA', 'DRAFT', 'PROPOSED', 'UNDER_REVIEW', 'APPROVED', 'RECRUITING', 'ACTIVE', 'PAUSED', 'COMPLETED']),
  notes: z.string().optional(),
  stageData: z.object({
    approvalCriteria: z.array(z.string()).optional(),
    rejectionReason: z.string().optional(),
    recruitingGoals: z.array(z.string()).optional(),
    completionMetrics: z.object({
      milestonesCompleted: z.number(),
      totalMilestones: z.number(),
      satisfactionScore: z.number().min(1).max(10),
    }).optional(),
  }).optional(),
})

// GET /api/projects/[id]/lifecycle - Get project lifecycle history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_LIFECYCLE)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id } = await params
  const user = auth.user

  try {
    // Check if user has access to this project
    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        projectLeadId: true,
        projectMembers: {
          select: { userId: true },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user has access (project lead or member)
    const hasAccess = project.projectLeadId === user.id ||
                       project.projectMembers.some((m: any) => m.userId === user.id)

    if (!hasAccess && user.userRole !== 'PLATFORM_ADMIN' && user.userRole !== 'UNIVERSITY_ADMIN') {
      return NextResponse.json({ error: 'Forbidden - No access to this project' }, { status: 403 })
    }

    // Get lifecycle entries
    const lifecycleEntries = await db.projectLifecycle.findMany({
      where: { projectId: id },
      orderBy: { enteredAt: 'desc' },
    })

    // Get current stage
    const currentEntry = lifecycleEntries[0]

    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project.id,
          currentStage: currentEntry?.currentStage || 'DRAFT',
          stageHistory: lifecycleEntries.map(entry => ({
            id: entry.id,
            stage: entry.currentStage,
            enteredAt: entry.enteredAt,
            enteredBy: entry.enteredBy,
            notes: entry.notes,
            stageData: entry.stageData,
          })),
        },
      },
    })
  } catch (error) {
    console.error('Get project lifecycle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects/[id]/lifecycle - Add lifecycle entry (move to next stage)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_LIFECYCLE)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id } = await params
  const user = auth.user

  try {
    const body = await request.json()

    // Check if user has access (only project lead can change stages)
    const project = await db.project.findUnique({
      where: { id },
      select: { projectLeadId: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const canManageLifecycle = project.projectLeadId === user.id ||
                             user.userRole === 'PLATFORM_ADMIN' ||
                             user.userRole === 'UNIVERSITY_ADMIN'

    if (!canManageLifecycle) {
      return NextResponse.json({ error: 'Forbidden - Only project lead can manage lifecycle' }, { status: 403 })
    }

    // Validate input
    const validatedData = createLifecycleEntrySchema.parse(body)

    // Create lifecycle entry
    const lifecycleEntry = await db.projectLifecycle.create({
      data: {
        projectId: id,
        currentStage: validatedData.stage,
        previousStage: project.projectLeadId === user.id ? project.projectLeadId : 'DRAFT', // Default to DRAFT if not lead
        enteredAt: new Date(),
        enteredBy: user.id,
        notes: validatedData.notes,
        stageData: validatedData.stageData,
        estimatedDuration: 7, // Default: 7 days to next stage
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        lifecycleEntry,
        message: `Project moved to ${validatedData.stage} stage`,
      },
    })
  } catch (error) {
    console.error('Create lifecycle entry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/projects/[id]/lifecycle - Update lifecycle entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_LIFECYCLE)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id } = await params
  const user = auth.user

  try {
    const { lifecycleId } = await request.json()

    if (!lifecycleId) {
      return NextResponse.json({ error: 'Lifecycle entry ID is required' }, { status: 400 })
    }

    // Get lifecycle entry
    const lifecycleEntry = await db.projectLifecycle.findUnique({
      where: { id: lifecycleId },
    })

    if (!lifecycleEntry) {
      return NextResponse.json({ error: 'Lifecycle entry not found' }, { status: 404 })
    }

    // Check ownership
    const project = await db.project.findUnique({
      where: { id: lifecycleEntry.projectId },
      select: { projectLeadId: true },
    })

    const canEdit = project.projectLeadId === user.id ||
                     user.userRole === 'PLATFORM_ADMIN' ||
                     user.userRole === 'UNIVERSITY_ADMIN'

    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate input
    const validatedData = updateLifecycleEntrySchema.parse(await request.json())

    // Update lifecycle entry
    const updatedEntry = await db.projectLifecycle.update({
      where: { id: lifecycleId },
      data: {
        notes: validatedData.notes,
        stageData: validatedData.stageData,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        lifecycleEntry: updatedEntry,
        message: 'Lifecycle entry updated successfully',
      },
    })
  } catch (error) {
    console.error('Update lifecycle entry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]/lifecycle - Delete lifecycle entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_LIFECYCLE)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id } = await params
  const user = auth.user

  try {
    const { lifecycleId } = await request.json()

    if (!lifecycleId) {
      return NextResponse.json({ error: 'Lifecycle entry ID is required' }, { status: 400 })
    }

    // Get lifecycle entry
    const lifecycleEntry = await db.projectLifecycle.findUnique({
      where: { id: lifecycleId },
    })

    if (!lifecycleEntry) {
      return NextResponse.json({ error: 'Lifecycle entry not found' }, { status: 404 })
    }

    // Check ownership
    const project = await db.project.findUnique({
      where: { id: lifecycleEntry.projectId },
      select: { projectLeadId: true },
    })

    const canDelete = project.projectLeadId === user.id ||
                     user.userRole === 'PLATFORM_ADMIN' ||
                     user.userRole === 'UNIVERSITY_ADMIN'

    if (!canDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete lifecycle entry
    await db.projectLifecycle.delete({
      where: { id: lifecycleId },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Lifecycle entry deleted successfully',
      },
    })
  } catch (error) {
    console.error('Delete lifecycle entry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
