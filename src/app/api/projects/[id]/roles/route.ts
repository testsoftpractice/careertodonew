import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, PROJECT_ROLES } from '@/lib/features/flags-v2'

// Validation schemas
const inviteMemberSchema = z.object({
  projectId: z.string(),
  emails: z.array(z.string().email()),
  roles: z.array(z.enum(['PROJECT_LEAD', 'CO_LEAD', 'DEPARTMENT_HEAD', 'TEAM_LEAD', 'MENTOR',
                         'SENIOR_CONTRIBUTOR', 'CONTRIBUTOR'])),
  message: z.string().min(10).max(500).optional(),
  expiresAt: z.string().datetime().optional(),
})

// GET /api/projects/[id]/roles - Get all roles for project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id } = await params
  const user = auth.user

  try {
    // Get all project members
    const members = await db.projectMember.findMany({
      where: { projectId: id },
      select: { role: true },
    })

    // Get unique roles
    const uniqueRoles = [...new Set(members.map(m => m.role))]

    return NextResponse.json({
      success: true,
      data: {
        projectId: id,
        roles: uniqueRoles,
        roleCounts: members.reduce((counts, m) => {
          counts[m.role] = (counts[m.role] || 0) + 1
          return counts
        }, {}),
      },
    })
  } catch (error) {
    console.error('Get project roles error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects/[id]/roles/invite - Invite team members
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = inviteMemberSchema.parse(body)

    // Check if user has permission to invite (project lead or admin)
    const project = await db.project.findUnique({
      where: { id },
      select: { projectLeadId: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const canInvite = project.projectLeadId === user.id ||
                      user.userRole === 'PLATFORM_ADMIN'

    if (!canInvite) {
      return NextResponse.json({ error: 'Forbidden - Only project lead or admins can invite members' }, { status: 403 })
    }

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    for (const email of validatedData.emails) {
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
      }
    }

    // Create invites
    // In production, these would be stored and sent
    const invites = validatedData.emails.map(email => ({
      projectId: id,
      email,
      role: validatedData.roles[0], // Assign first role to all
      message: validatedData.message,
      expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      status: 'PENDING',
      invitedBy: user.id,
      createdAt: new Date(),
    }))

    return NextResponse.json({
      success: true,
      data: {
        invites,
        message: `Invited ${invites.length} member(s) to project`,
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Invite members error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
