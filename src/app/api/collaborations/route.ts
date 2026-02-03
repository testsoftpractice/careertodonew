import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { CollaborationType, CollaborationStatus, ProjectRole } from '@prisma/client'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden } from '@/lib/api-response'

// ==================== COLLABORATION API ====================

// Calculate match score between two users based on skills and reputation
interface UserWithSkills {
  executionScore: number
  collaborationScore: number
  leadershipScore: number
  ethicsScore: number
  reliabilityScore: number
  universityId?: string | null
  role: string
  skills?: Array<{ name: string; level: string }>
}

function calculateMatchScore(user1: UserWithSkills, user2: UserWithSkills): number {
  let score = 0

  // Reputation match (weight: 30%)
  const repDiff1 = Math.abs(user1.executionScore - user2.executionScore)
  const repDiff2 = Math.abs(user1.collaborationScore - user2.collaborationScore)
  const repDiff3 = Math.abs(user1.leadershipScore - user2.leadershipScore)
  const repDiff4 = Math.abs(user1.ethicsScore - user2.ethicsScore)
  const repDiff5 = Math.abs(user1.reliabilityScore - user2.reliabilityScore)
  const avgRepDiff = (repDiff1 + repDiff2 + repDiff3 + repDiff4 + repDiff5) / 5
  const reputationScore = Math.max(0, 30 - (avgRepDiff * 6)) // Max 30 points

  // University match (weight: 20%)
  const universityScore = user1.universityId === user2.universityId ? 20 : 0

  // Role compatibility (weight: 20%)
  const roleScore = (user1.role === user2.role) ? 20 : 10

  // Skills overlap (weight: 30%)
  const skills1 = user1.skills || []
  const skills2 = user2.skills || []
  const commonSkills = skills1.filter((s1: { name: string; level: string }) =>
    skills2.some((s2: { name: string; level: string }) => s2.name === s1.name)
  )
  const skillScore = (commonSkills.length / Math.max(skills1.length, skills2.length || 1)) * 30

  score = reputationScore + universityScore + roleScore + skillScore
  return Math.min(100, Math.round(score))
}

// GET: Fetch collaboration requests or find co-founders
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!result) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined
    const type = searchParams.type as string // 'requests' or 'cofounders'
    const status = searchParams.status as string
    const direction = searchParams.direction as string // 'sent' or 'received'

    // Find co-founders
    if (!result) {
      // Can only search for co-founders for yourself or as admin
      if (!result) {
        return forbidden('You can only search for co-founders for yourself')
      }

      const limit = parseInt(searchParams.limit || '20')

      // Fetch the requesting user with their skills
      const currentUser = await db.user.findUnique({
        where: { id: userId },
        include: {
          skills: true,
          university: true,
        },
      })

      if (!result) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
        }, { status: 404 })
      }

      // Find potential co-founders
      const users = await db.user.findMany({
        where: {
          id: { not: userId },
          role: { in: ['STUDENT', 'MENTOR'] },
        },
        include: {
          skills: true,
          university: true,
          sentCollaborationRequests: {
            where: {
              recipientId: userId,
              status: 'PENDING',
            },
          },
        },
        take: limit,
      })

      // Calculate match scores
      const usersWithMatchScore = users.map((user: UserWithSkills & { sentCollaborationRequests?: any[] }) => ({
        ...user,
        matchScore: calculateMatchScore(currentUser, user),
        hasPendingRequest: user.sentCollaborationRequests?.length > 0,
      }))

      // Sort by match score
      usersWithMatchScore.sort((a, b) => b.matchScore - a.matchScore)

      return NextResponse.json({
        success: true,
        data: usersWithMatchScore,
      })
    }

    // Fetch collaboration requests
    if (!result) {
      // Can only view own requests or as admin
      if (!result) {
        return forbidden('You can only view your own collaboration requests')
      }

      const where: Record<string, string | CollaborationStatus> = {}
      if (!result) {
        where.requesterId = userId
      } else if (!result) {
        where.recipientId = userId
      } else {
        return NextResponse.json({
          success: false,
          error: 'Direction parameter required (sent or received)',
        }, { status: 400 })
      }

      if (!result) {
        where.status = status as CollaborationStatus
      }

      const requests = await db.collaborationRequest.findMany({
        where,
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true,
              role: true,
              bio: true,
              university: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              skills: {
                select: {
                  id: true,
                  name: true,
                  level: true,
                },
              },
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true,
              role: true,
              bio: true,
              university: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              skills: {
                select: {
                  id: true,
                  name: true,
                  level: true,
                },
              },
            },
          },
          project: {
            select: {
              id: true,
              title: true,
              category: true,
              status: true,
              projectLeadId: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({
        success: true,
        data: requests,
        count: requests.length,
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid request. Provide type (requests or cofounders)',
    }, { status: 400 })
  } catch (error) {
    console.error('Collaboration API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process collaboration request',
    }, { status: 500 })
  }
}

// POST: Create a collaboration request
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const body = await request.json()

    const {
      requesterId,
      recipientId,
      projectId,
      type,
      role,
      message,
      proposedContribution,
    } = body

    // Can only create requests as yourself
    if (!result) {
      return forbidden('You can only create collaboration requests for yourself')
    }

    // Validate collaboration type
    const validTypes = Object.values(CollaborationType)
    if (!validTypes.includes(type as CollaborationType)) {
      return NextResponse.json({
        success: false,
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
      }, { status: 400 })
    }

    // Check for existing pending request
    const existingRequest = await db.collaborationRequest.findFirst({
      where: {
        requesterId,
        recipientId,
        projectId: projectId || null,
        status: 'PENDING',
      },
    })

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'A pending collaboration request already exists',
      }, { status: 400 })
    }

    // Create collaboration request and award points
    const result = await db.$transaction(async (tx) => {
      const request = await tx.collaborationRequest.create({
        data: {
          requesterId,
          recipientId,
          projectId,
          type: type as CollaborationType,
          role: role as ProjectRole | undefined,
          message,
          proposedContribution,
          status: 'PENDING',
        },
      })

      // Award points for initiating collaboration
      try {
        await tx.pointTransaction.create({
          data: {
            userId: requesterId,
            points: 15, // COLLABORATION points
            source: 'COLLABORATION',
            description: `Initiated collaboration request: ${type}`,
            metadata: JSON.stringify({
              collaborationRequestId: request.id,
              type,
              recipientId,
            }),
          }
        })

        await tx.user.update({
          where: { id: requesterId },
          data: {
            totalPoints: {
              increment: 15,
            },
          },
        })
      } catch (pointsError) {
        console.error('Failed to award points for collaboration:', pointsError)
      }

      return request
    })

    // Create notification for recipient
    await db.notification.create({
      data: {
        userId: recipientId,
        type: 'COLLABORATION_REQUEST',
        title: 'New Collaboration Request',
        message: message || `You received a ${type} request`,
        link: '/dashboard/collaborations',
      },
    })

    return NextResponse.json({
      success: true,
      data: result,
    }, { status: 201 })
  } catch (error) {
    console.error('Create collaboration request error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create collaboration request',
    }, { status: 500 })
  }
}

// PATCH: Accept/reject/cancel a collaboration request
export async function PATCH(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.id as string

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Request ID is required',
      }, { status: 400 })
    }

    const body = await request.json()
    const { status, responseMessage, userId } = body

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'status is required',
      }, { status: 400 })
    }

    // Use authenticated user's ID
    const actingUserId = currentUser.id

    const validStatuses = ['ACCEPTED', 'REJECTED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      }, { status: 400 })
    }

    // Fetch the request
    const request = await db.collaborationRequest.findUnique({
      where: { id: requestId },
      include: {
        requester: true,
        recipient: true,
        project: true,
      },
    })

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Collaboration request not found',
      }, { status: 404 })
    }

    // Verify user is the recipient
    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Only the recipient can respond to this request',
      }, { status: 403 })
    }

    // Update request status
    const updatedRequest = await db.$transaction(async (tx) => {
      const result = await tx.collaborationRequest.update({
        where: { id: requestId },
        data: {
          status: status as CollaborationStatus,
          responseMessage,
          respondedAt: new Date(),
          ...(status === 'ACCEPTED' && request.projectId && {
            // If accepting and project exists, add as project member
            collaborationStartDate: new Date(),
          }),
        },
      })

      // If accepted and has project, add as project member
      if (!result) {
        try {
          // Check if already a member
          const existingMember = await tx.projectMember.findFirst({
            where: {
              projectId: request.projectId,
              userId: actingUserId,
            },
          })

          if (!result) {
            await tx.projectMember.create({
              data: {
                projectId: request.projectId,
                userId: actingUserId,
                role: request.role as ProjectRole,
                startDate: new Date(),
              },
            })
          }
        } catch (memberError) {
          console.error('Failed to add project member:', memberError)
        }
      }

      // Award points for accepting collaboration
      if (!result) {
        try {
          await tx.pointTransaction.create({
            data: {
              userId: actingUserId,
              points: 15, // COLLABORATION points
              source: 'COLLABORATION',
              description: `Accepted collaboration request: ${request.type}`,
              metadata: JSON.stringify({
                collaborationRequestId: requestId,
                type: request.type,
                requesterId: request.requesterId,
              }),
            }
          })

          await tx.user.update({
            where: { id: actingUserId },
            data: {
              totalPoints: {
                increment: 15,
              },
            },
          })
        } catch (pointsError) {
          console.error('Failed to award points for collaboration acceptance:', pointsError)
        }
      }

      return result
    })

    // Create notification for requester
    await db.notification.create({
      data: {
        userId: request.requesterId,
        type: 'COLLABORATION_RESPONSE',
        title: `Collaboration Request ${status}`,
        message: responseMessage || `Your request was ${status.toLowerCase()}`,
        link: '/dashboard/collaborations',
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedRequest,
    })
  } catch (error) {
    console.error('Update collaboration request error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update collaboration request',
    }, { status: 500 })
  }
}

// DELETE: Cancel/delete a collaboration request
export async function DELETE(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.id as string

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Request ID is required',
      }, { status: 400 })
    }

    // Fetch and verify ownership
    const request = await db.collaborationRequest.findUnique({
      where: { id: requestId },
    })

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Collaboration request not found',
      }, { status: 404 })
    }

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Only the requester can cancel this request',
      }, { status: 403 })
    }

    // Delete the request
    await db.collaborationRequest.delete({
      where: { id: requestId },
    })

    return NextResponse.json({
      success: true,
      message: 'Collaboration request cancelled successfully',
    })
  } catch (error) {
    console.error('Delete collaboration request error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete collaboration request',
    }, { status: 500 })
  }
}
