import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, PROJECT_ROLES } from '@/lib/features/flags'
import { ProjectRole } from '@/lib/models/project-roles'

// Validation schemas
const addMemberSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  role: z.enum(['PROJECT_LEAD', 'CO_LEAD', 'DEPARTMENT_HEAD', 'TEAM_LEAD', 'MENTOR',
                 'SENIOR_CONTRIBUTOR', 'CONTRIBUTOR', 'JUNIOR_CONTRIBUTOR']),
  title: z.string().optional(),
  department: z.string().optional(),
  approvedBy: z.string().optional(),
})

const updateMemberRoleSchema = z.object({
  role: z.enum(['PROJECT_LEAD', 'CO_LEAD', 'DEPARTMENT_HEAD', 'TEAM_LEAD', 'MENTOR',
                 'SENIOR_CONTRIBUTOR', 'CONTRIBUTOR', 'JUNIOR_CONTRIBUTOR']),
  approvedBy: z.string().optional(),
})

const inviteMemberSchema = z.object({
  projectId: z.string(),
  email: z.string().email(),
  role: z.enum(['PROJECT_LEAD', 'CO_LEAD', 'DEPARTMENT_HEAD', 'TEAM_LEAD', 'MENTOR',
                 'SENIOR_CONTRIBUTOR', 'CONTRIBUTOR', 'JUNIOR_CONTRIBUTOR']),
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
  const user = auth.user

  try {
    // Get project
    const project = await db.project.findUnique({
      where: { id },
      select: { projectLeadId: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user has access to project
    const isProjectLead = project.projectLeadId === user.id
    const isUniversityAdmin = user.userRole === 'UNIVERSITY_ADMIN' || user.userRole === 'PLATFORM_ADMIN'
    const hasAccess = isProjectLead || isUniversityAdmin

    if (!hasAccess) {
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
            userRole: true,
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
          projectLeadId: project.projectLeadId,
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
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = addMemberSchema.parse(body)

    // Check if user has permission (project lead or university admin or platform admin)
    if (user.userRole !== 'PLATFORM_ADMIN' && user.userRole !== 'UNIVERSITY_ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Only admins can add members' }, { status: 403 })
    }

    // Get project
    const project = await db.project.findUnique({
      where: { id },
      select: { projectLeadId: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if adding user is already a member
    const existingMember = await db.projectMember.findFirst({
      where: {
        projectId: id,
        userId: validatedData.userId,
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this project' }, { status: 400 })
    }

    // Add team member
    const member = await db.projectMember.create({
      data: {
        projectId: id,
        userId: validatedData.userId,
        role: validatedData.role,
        title: validatedData.title,
        department: validatedData.department,
        approvedBy: validatedData.approvedBy || null,
        joinedAt: new Date(),
        currentLevel: 1, // Start at level 1
        xp: 0,
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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Add team member error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/projects/[id]/members/[memberId] - Update member role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id, memberId } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = updateMemberRoleSchema.parse(body)

    // Get project
    const project = await db.project.findUnique({
      where: { id },
      select: { projectLeadId: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get member
    const member = await db.projectMember.findUnique({
      where: { id: memberId },
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Check if user has permission to update roles
    // Project lead, university admin, platform admin can update any role
    if (user.userRole !== 'PLATFORM_ADMIN' && user.userRole !== 'UNIVERSITY_ADMIN' &&
        project.projectLeadId !== user.id) {
      return NextResponse.json({ error: 'Forbidden - Only project lead or admins can update roles' }, { status: 403 })
    }

    // Update member role
    const updatedMember = await db.projectMember.update({
      where: { id: memberId },
      data: {
        role: validatedData.role,
        approvedBy: validatedData.approvedBy || member.approvedBy,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        member: {
          id: updatedMember.id,
          role: updatedMember.role,
        },
        message: `Member role updated to ${validatedData.role}`,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Update member role error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]/members/[memberId] - Remove member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id, memberId } = await params
  const user = auth.user

  try {
    // Get project
    const project = await db.project.findUnique({
      where: { id },
      select: { projectLeadId: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user has permission to remove members
    // Project lead, university admin, or platform admin can remove members
    if (user.userRole !== 'PLATFORM_ADMIN' && user.userRole !== 'UNIVERSITY_ADMIN' &&
        project.projectLeadId !== user.id) {
      return NextResponse.json({ error: 'Forbidden - Only project lead or admins can remove members' }, { status: 403 })
    }

    // Get member
    const member = await db.projectMember.findUnique({
      where: { id: memberId },
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Delete member
    await db.projectMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({
      success: true,
      data: {
        member: {
          id: memberId,
        },
        message: 'Team member removed successfully',
      },
    })
  } catch (error) {
    console.error('Remove member error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
