import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { db } from '@/lib/db'
import { isFeatureEnabled, PROJECT_ROLES } from '@/lib/features/flags'
import { errorResponse, forbidden, notFound, validationError } from '@/lib/api-response'

// Project roles - defined here since they're String in schema, not enum
const PROJECT_ROLES_ENUM = ['OWNER', 'PROJECT_MANAGER', 'TEAM_LEAD', 'TEAM_MEMBER', 'VIEWER'] as const

// Validation schemas
const addMemberSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  role: z.enum(PROJECT_ROLES_ENUM),
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

  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { id } = await params

    // Get project
    const project = await db.project.findUnique({
      where: { id },
      select: { id: true, ownerId: true, name: true },
    })
    if (!project) {
      return notFound('Project not found')
    }

    // Check if user has access to project
    const isOwner = project.ownerId === currentUser.id
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN' || currentUser.role === 'UNIVERSITY_ADMIN'
    const hasAccess = isOwner || isAdmin

    if (!isOwner && !isAdmin) {
      return forbidden('No access to this project')
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
      orderBy: { role: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project.id,
          ownerId: project.ownerId,
          name: project.name,
        },
        members,
        totalMembers: members.length,
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get project members error:', error)
    return errorResponse('Failed to fetch project members', 500)
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

  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { id } = await params

    const body = await request.json()
    const validatedData = addMemberSchema.parse(body)

    // Get project first
    const project = await db.project.findUnique({
      where: { id },
      select: { id: true, ownerId: true, name: true },
    })
    if (!project) {
      return notFound('Project not found')
    }

    // Check if user has permission (project owner or university admin or platform admin)
    const isProjectOwner = project.ownerId === currentUser.id
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN' || currentUser.role === 'UNIVERSITY_ADMIN'

    if (!isProjectOwner && !isAdmin) {
      return forbidden('Only project owner or admins can add members')
    }

    // Check if adding user is already a member
    const existingMember = await db.projectMember.findFirst({
      where: {
        projectId: id,
        userId: validatedData.userId,
      },
    })

    if (existingMember) {
      return errorResponse('User is already a member of this project', 400)
    }

    // Add team member - using only fields that exist in schema
    const member = await db.projectMember.create({
      data: {
        projectId: id,
        userId: validatedData.userId,
        role: validatedData.role,
        accessLevel: validatedData.role === 'OWNER' ? 'OWNER' : 'VIEW',
        joinedAt: new Date(),
      },
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
    })

    // Create notification for added user
    await db.notification.create({
      data: {
        userId: validatedData.userId,
        type: 'PROJECT_UPDATE',
        title: '🎉 Added to Project',
        message: `You have been added to project: ${project.name}`,
        link: `/projects/${id}`,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        member,
        message: `Team member added successfully with role: ${validatedData.role}`,
      },
    })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    if (error instanceof z.ZodError) {
      return validationError(error.issues.map(e => ({ field: e.path.join('.'), message: e.message })))
    }
    console.error('Add team member error:', error)
    return errorResponse('Failed to add team member', 500)
  }
}

// Note: PATCH and DELETE operations should be at /api/projects/[id]/members/[memberId]/route.ts
// Create a new file at src/app/api/projects/[id]/members/[memberId]/route.ts for those operations
