import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { successResponse, errorResponse, notFound, forbidden } from '@/lib/api-response'
import { ProjectRole } from '@prisma/client'

const inviteByUserIdSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  role: z.nativeEnum(ProjectRole).default('TEAM_MEMBER'),
})

const inviteByEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(ProjectRole).default('TEAM_MEMBER'),
})

// POST /api/projects/[id]/members/invite - Invite member by user ID or email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const user = auth.user
    const { id: projectId } = await params
    const body = await request.json()

    // Get project
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true, name: true },
    })

    if (!project) {
      return notFound('Project not found')
    }

    // Check if user is project owner
    if (project.ownerId !== user.userId) {
      return forbidden('Only project owner can invite members')
    }

    // Determine if inviting by user ID or email
    let targetUser: { id: string; name: string | null; email: string } | null = null
    let role: 'TEAM_MEMBER' | 'PROJECT_MANAGER' | 'TEAM_LEAD' | 'OWNER' | 'VIEWER' = 'TEAM_MEMBER'

    if (body.userId) {
      // Validate and invite by user ID
      const validation = inviteByUserIdSchema.safeParse(body)
      if (!validation.success) {
        return errorResponse(validation.error.issues[0]?.message || 'Invalid input', 400)
      }

      targetUser = await db.user.findUnique({
        where: { id: validation.data.userId },
        select: { id: true, name: true, email: true },
      })

      if (!targetUser) {
        return notFound('User not found')
      }

      role = validation.data.role
    } else if (body.email) {
      // Validate and find user by email
      const validation = inviteByEmailSchema.safeParse(body)
      if (!validation.success) {
        return errorResponse(validation.error.issues[0]?.message || 'Invalid input', 400)
      }

      targetUser = await db.user.findUnique({
        where: { email: validation.data.email },
        select: { id: true, name: true, email: true },
      })

      if (!targetUser) {
        return errorResponse('User with this email not found', 404)
      }

      role = validation.data.role
    } else {
      return errorResponse('Either userId or email is required', 400)
    }

    // Check if user is already a member
    const existingMember = await db.projectMember.findFirst({
      where: {
        projectId,
        userId: targetUser.id,
      },
    })

    if (existingMember) {
      return errorResponse('User is already a member of this project', 400)
    }

    // Add member to project
    const member = await db.projectMember.create({
      data: {
        projectId,
        userId: targetUser.id,
        role,
        joinedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    // Create notification for the invited user
    await db.notification.create({
      data: {
        userId: targetUser.id,
        type: 'PROJECT_UPDATE',
        title: '🎉 Added to Project!',
        message: `You have been added to the project "${project.name}" as a ${role.replace('_', ' ')}.`,
        link: `/projects/${projectId}`,
      },
    })

    return successResponse(
      {
        member,
        user: targetUser,
      },
      `Successfully added ${targetUser.name} to the project`
    )
  } catch (error: unknown) {
    console.error('Invite member error:', error)
    return errorResponse('Failed to invite member', 500)
  }
}
