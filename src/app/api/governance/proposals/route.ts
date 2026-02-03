import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, GOVERNANCE_APPROVAL } from '@/lib/features/flags-v2'
import { ProposalType, ProposalStatus, ApprovalPriority, GovernanceProposal } from '@/lib/models/governance'

// Validation schemas
const createProposalSchema = z.object({
  type: z.enum(['PROJECT_APPROVAL', 'CONTENT_REPORT', 'DISPUTE_RESOLUTION', 'POLICY_CHANGE', 'BUDGET_ALLOCATION', 'FEATURE_REQUEST']),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  category: z.string().optional(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  projectId: z.string().optional(),
  studentId: z.string().optional(),
  contentId: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  documents: z.array(z.string()).default([]),
  evidence: z.array(z.string()).default([]),
})

const updateProposalSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  category: z.string().optional(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
})

// POST /api/governance/proposals - Create governance proposal
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(GOVERNANCE_APPROVAL)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = createProposalSchema.parse(body)

    // Check if university ID exists
    if (!user.universityId) {
      return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
    }

    // Validate related entities
    if (validatedData.projectId) {
      const project = await db.project.findUnique({ where: { id: validatedData.projectId } })
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
    }

    if (validatedData.studentId) {
      const student = await db.user.findUnique({ where: { id: validatedData.studentId } })
      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }
    }

    if (validatedData.contentId) {
      const content = await db.content.findUnique({ where: { id: validatedData.contentId } })
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }
    }

    // Create governance proposal
    const proposal = await db.governanceProposal.create({
      data: {
        type: validatedData.type,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        priority: validatedData.priority,
        projectId: validatedData.projectId,
        studentId: validatedData.studentId,
        contentId: validatedData.contentId,
        attachments: validatedData.attachments,
        documents: validatedData.documents,
        evidence: validatedData.evidence,
        status: 'SUBMITTED' as ProposalStatus,
        currentStage: 'SUBMITTED',
        createdBy: user.id,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        proposal,
        message: 'Governance proposal created successfully',
      },
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Create governance proposal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/governance/proposals - Get all governance proposals
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(GOVERNANCE_APPROVAL)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (priority) {
      where.priority = priority
    }

    const proposals = await db.governanceProposal.findMany({
      where,
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        votes: true,
        comments: {
          include: {
            createdByUser: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      data: proposals,
    })
  } catch (error) {
    console.error('Get governance proposals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
