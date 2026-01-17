import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, STAGE_MANAGEMENT } from '@/lib/features/flags'

// Validation schemas
const createStageSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  gateRequirements: z.array(z.string()),
  autoAdvance: z.boolean().default(false),
  defaultFor: z.enum(['IDEA', 'DRAFT', 'PROPOSED', 'UNDER_REVIEW', 'APPROVED', 'RECRUITING', 'ACTIVE', 'PAUSED', 'COMPLETED']).optional(),
})

const updateStageSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  gateRequirements: z.array(z.string()).optional(),
  autoAdvance: z.boolean().optional(),
})

// GET /api/stages - Get all stage templates
export async function GET() {
  if (!isFeatureEnabled(STAGE_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const stages = [
    { id: '1', name: 'Idea', description: 'Initial project concept', gateRequirements: ['Title', 'Description', 'Category'], autoAdvance: false, defaultFor: 'IDEA' },
    { id: '2', name: 'Draft', description: 'Working on project details', gateRequirements: ['Title', 'Description', 'Category'], autoAdvance: false, defaultFor: 'DRAFT' },
    { id: '3', name: 'Proposed', description: 'Ready for university review', gateRequirements: ['University approval', 'Risk assessment', 'Budget'], autoAdvance: false, defaultFor: 'PROPOSED' },
    { id: '4', name: 'Under Review', description: 'Governance council reviewing', gateRequirements: ['Review complete', 'Compliance check'], autoAdvance: false, defaultFor: 'UNDER_REVIEW' },
    { id: '5', name: 'Approved', description: 'University approved, can start recruiting', gateRequirements: ['Lead approved', 'University sign-off'], autoAdvance: false, defaultFor: 'APPROVED' },
    { id: '6', name: 'Recruiting', description: 'Actively building team', gateRequirements: ['Team minimum', 'Funding secured'], autoAdvance: false, defaultFor: 'RECRUITING' },
    { id: '7', name: 'Active', description: 'Project is running', gateRequirements: [], autoAdvance: true, defaultFor: 'ACTIVE' },
    { id: '8', name: 'Paused', description: 'Temporarily halted', gateRequirements: [], autoAdvance: true, defaultFor: 'PAUSED' },
    { id: '9', name: 'Completed', description: 'All deliverables submitted', gateRequirements: ['All milestones', 'Final deliverable', 'Project report'], autoAdvance: false, defaultFor: 'COMPLETED' },
    { id: '10', name: 'Archived', description: 'Historical record', gateRequirements: [], autoAdvance: false, defaultFor: 'ARCHIVED' },
  ]

  return NextResponse.json({
    success: true,
    data: { stages },
  })
}

// POST /api/stages - Create custom stage template
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(STAGE_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['PLATFORM_ADMIN', 'UNIVERSITY_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user

  if (user.userRole !== 'PLATFORM_ADMIN' && user.userRole !== 'UNIVERSITY_ADMIN') {
    return NextResponse.json({ error: 'Forbidden - Only admins can create stage templates' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const validatedData = createStageSchema.parse(body)

    // Create custom stage template
    // Note: In production, these would be stored in database
    const stage = {
      id: `custom_${Date.now()}`,
      ...validatedData,
      createdAt: new Date(),
      createdBy: user.id,
    }

    return NextResponse.json({
      success: true,
      data: {
        stage,
        message: 'Stage template created successfully',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Create stage error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/stages/[id] - Update stage template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(STAGE_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const { id } = await params
  const user = auth.user

  try {
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Stage ID is required' }, { status: 400 })
    }

    // Update stage template
    const stage = {
      id,
      ...body,
      updatedAt: new Date(),
      updatedBy: user.id,
    }

    return NextResponse.json({
      success: true,
      data: {
        stage,
        message: 'Stage template updated successfully',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Update stage error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/stages/[id] - Delete stage template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(STAGE_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const { id } = await params
  const user = auth.user

  try {
    // Delete stage template
    // Note: In production, this would delete from database

    return NextResponse.json({
      success: true,
      data: {
        message: 'Stage template deleted successfully',
      },
    })
  } catch (error) {
    console.error('Delete stage error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
