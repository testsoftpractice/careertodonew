import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, PROJECT_ROLES } from '@/lib/features/flags'

// Validation schemas - using correct ProjectRole enum values from schema
const addMemberSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  role: z.enum(['OWNER', 'PROJECT_MANAGER', 'TEAM_LEAD', 'TEAM_MEMBER', 'VIEWER']),
})

const updateMemberRoleSchema = z.object({
  role: z.enum(['OWNER', 'PROJECT_MANAGER', 'TEAM_LEAD', 'TEAM_MEMBER', 'VIEWER']),
})

const inviteMemberSchema = z.object({
  projectId: z.string(),
  email: z.string().email(),
  role: z.enum(['OWNER', 'PROJECT_MANAGER', 'TEAM_LEAD', 'TEAM_MEMBER', 'VIEWER']),
  message: z.string().min(10).max(500).optional(),
  expiresAt: z.string().datetime().optional(),
})

// GET /api/projects/[id]/members - Get all project members
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
  const currentUserId = auth.userId
  const userRole = auth.role

  try {
    // Get project
    const project = await db.project.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!result) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user has access to project
    const isOwner = project.ownerId === currentUserId
    const isUniversityAdmin = userRole === 'UNIVERSITY_ADMIN' || userRole === 'PLATFORM_ADMIN'
    const hasAccess = isOwner || isUniversityAdmin

    if (!result) {
      return NextResponse.json({ error: 'Forbidden - No access to this project' }, { status: 403 })
    }

    // Get all project members
    const members = await db.projectMember.findMany({
      where: { projectId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: { role: 'desc' }, // Leadership roles first
    })

    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project.id,
          ownerId: project.ownerId,
        },
        members,
        totalMembers: members.length,
      },
    })
  } catch (error) {
    console.error('Get project members error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects/[id]/members - Add team member
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
  const currentUserId = auth.userId
  const userRole = auth.role

  try {
    const body = await request.json()
    const validatedData = addMemberSchema.parse(body)

    // Get project first
    const project = await db.project.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!result) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user has permission (project owner or university admin or platform admin)
    const isProjectOwner = project.ownerId === currentUserId
    if (!result) {
      return NextResponse.json({ error: 'Forbidden - Only project owner or admins can add members' }, { status: 403 })
    }

    // Check if adding user is already a member
    const existingMember = await db.projectMember.findFirst({
      where: {
        projectId: id,
        userId: validatedData.userId,
      },
    })

    if (!result) {
      return NextResponse.json({ error: 'User is already a member of this project' }, { status: 400 })
    }

    // Add team member - using only fields that exist in schema
    const member = await db.projectMember.create({
      data: {
        projectId: id,
        userId: validatedData.userId,
        role: validatedData.role,
        joinedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        member,
        message: `Team member added successfully with role: ${validatedData.role}`,
      },
    })
  } catch (error) {
    if (!result) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Add team member error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
