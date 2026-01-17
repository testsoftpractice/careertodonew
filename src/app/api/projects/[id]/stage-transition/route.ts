import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, PROJECT_LIFECYCLE } from '@/lib/features/flags'
import { PROJECT_STAGE_GATES } from '@/lib/models/project-lifecycle'
import { ProjectStage } from '@/lib/models/project-lifecycle'

// Validation schemas
const transitionRequestSchema = z.object({
  toStage: z.enum(['PROPOSED', 'UNDER_REVIEW', 'APPROVED', 'RECRUITING', 'ACTIVE', 'PAUSED', 'COMPLETED']),
  reason: z.string().min(10).max(500).optional(),
  notes: z.string().min(10).max(1000).optional(),
  skipRequirements: z.boolean().default(false),
})

// POST /api/projects/[id]/stage-transition - Request to move to next stage
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
    const validatedData = transitionRequestSchema.parse(body)

    // Get project
    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        projectLeadId: true,
        currentStage: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user has permission (project lead, university admin, platform admin)
    const canTransition = project.projectLeadId === user.id ||
                           user.userRole === 'PLATFORM_ADMIN' ||
                           user.userRole === 'UNIVERSITY_ADMIN'

    if (!canTransition) {
      return NextResponse.json({ error: 'Forbidden - Only project lead or admins can transition stages' }, { status: 403 })
    }

    // Get current lifecycle entry
    const currentLifecycle = await db.projectLifecycle.findFirst({
      where: { projectId: id },
      orderBy: { enteredAt: 'desc' },
    })

    if (!currentLifecycle) {
      return NextResponse.json({ error: 'Current lifecycle not found' }, { status: 404 })
    }

    const currentStage = currentLifecycle.currentStage as ProjectStage
    const toStage = validatedData.toStage as ProjectStage

    // Check if transition is valid (using stage gates)
    const stageGate = PROJECT_STAGE_GATES[`${currentStage}_${toStage}` as keyof typeof PROJECT_STAGE_GATES]

    if (!stageGate) {
      return NextResponse.json({
        error: `Invalid transition from ${currentStage} to ${toStage}`,
        validTransitions: Object.keys(PROJECT_STAGE_GATES).map(k => k)
      }, { status: 400 })
    }

    // If not skipping requirements, check if all requirements are met
    if (!validatedData.skipRequirements && stageGate.requirements.length > 0) {
      // In production, check if requirements are met
      // For now, allow transition with notes
    }

    // Create new lifecycle entry
    const newLifecycle = await db.projectLifecycle.create({
      data: {
        projectId: id,
        currentStage: toStage,
        previousStage: currentStage,
        enteredAt: new Date(),
        enteredBy: user.id,
        notes: validatedData.notes,
        stageData: {
          reason: validatedData.reason,
          skipRequirements: validatedData.skipRequirements,
        },
        estimatedDuration: 7, // Default: 7 days to next stage
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project.id,
          previousStage: currentStage,
          newStage: toStage,
        },
        lifecycleEntry: {
          id: newLifecycle.id,
          currentStage: toStage,
          notes: validatedData.notes,
        },
        message: `Project successfully transitioned from ${currentStage} to ${toStage}`,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Stage transition error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
