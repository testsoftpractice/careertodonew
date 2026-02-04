import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { CollaborationType, CollaborationStatus } from '@prisma/client'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden } from '@/lib/api-response'

// ==================== COLLABORATION API ====================

// Calculate match score between two users based on skills and reputation
interface UserWithSkills {
  id: string
  executionScore: number | null
  collaborationScore: number | null
  leadershipScore: number | null
  ethicsScore: number | null
  reliabilityScore: number | null
  universityId?: string | null
  role: string
  skills?: Array<{ name: string; level: string }>
  sentCollaborationRequests?: Array<{ toId: string; status: CollaborationStatus }>
}

function calculateMatchScore(user1: UserWithSkills, user2: UserWithSkills): number {
  let score = 0

  // Reputation match (weight: 30%)
  const repDiff1 = Math.abs((user1.executionScore || 0) - (user2.executionScore || 0))
  const repDiff2 = Math.abs((user1.collaborationScore || 0) - (user2.collaborationScore || 0))
  const repDiff3 = Math.abs((user1.leadershipScore || 0) - (user2.leadershipScore || 0))
  const repDiff4 = Math.abs((user1.ethicsScore || 0) - (user2.ethicsScore || 0))
  const repDiff5 = Math.abs((user1.reliabilityScore || 0) - (user2.reliabilityScore || 0))
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

// GET: Fetch collaboration requests or find collaborators
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'requests' or 'collaborators'
    const status = searchParams.get('status')
    const direction = searchParams.get('direction') // 'sent' or 'received'

    // Find collaborators
    if (type === 'collaborators') {
      // Can only search for collaborators for yourself or as admin
      if (!direction) {
        return forbidden('You can only search for collaborators for yourself')
      }

      const limit = parseInt(searchParams.get('limit') || '20')

      // Fetch requesting user with their skills
      const currentUserId = userId || (authResult.user?.id)
      if (!currentUserId) {
        return NextResponse.json({
          success: false,
          error: 'User ID required',
        }, { status: 400 })
      }

      const currentUser = await db.user.findUnique({
        where: { id: currentUserId },
        include: {
          skills: true,
          university: true,
          sentCollaborationRequests: {
            where: {
              toId: currentUserId,
              status: 'PENDING',
            },
          },
        },
      })

      if (!currentUser) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
        }, { status: 404 })
      }

      // Find potential collaborators
      const users = await db.user.findMany({
        where: {
          id: { not: currentUserId },
          role: { in: ['STUDENT', 'INVESTOR'] },
        },
        include: {
          skills: true,
          university: true,
        },
        take: limit,
      })

      // Calculate match scores
      const usersWithMatchScore = users.map((user: UserWithSkills) => ({
        ...user,
        id: user.id,
        matchScore: calculateMatchScore(currentUser, user),
        hasPendingRequest: (currentUser.sentCollaborationRequests || []).some(r => r.toId === user.id),
      }))

      // Sort by match score
      usersWithMatchScore.sort((a, b) => b.matchScore - a.matchScore)

      return NextResponse.json({
        success: true,
        data: usersWithMatchScore,
      })
    }

    // Fetch collaboration requests
    if (type === 'requests') {
      // Can only view own requests or as admin
      if (!direction) {
        return forbidden('You can only view your own collaboration requests')
      }

      const whereClause: Record<string, string | CollaborationStatus> = {}
      const currentUserId = userId || (authResult.user?.id)

      if (!currentUserId) {
        return NextResponse.json({
          success: false,
          error: 'User ID required',
        }, { status: 400 })
      }

      if (direction === 'sent') {
        whereClause.fromId = currentUserId
      } else if (direction === 'received') {
        whereClause.toId = currentUserId
      } else {
        return NextResponse.json({
          success: false,
          error: 'Direction parameter required (sent or received)',
        }, { status: 400 })
      }

      if (status) {
        whereClause.status = status as CollaborationStatus
      }

      const requests = await db.collaborationRequest.findMany({
        where: whereClause,
        include: {
          from: {
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
          to: {
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
      error: 'Invalid request. Provide type (requests or collaborators)',
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
      toId,
      projectId,
      type,
      role,
      message,
      proposedContribution,
    } = body

    // Can only create requests as yourself
    if (toId === currentUser.id) {
      return forbidden('You can only create collaboration requests for others')
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
        fromId: currentUser.id,
        toId,
        projectId: projectId || null,
        status: 'PENDING',
      },
    })

    if (existingRequest) {
      return NextResponse.json({
        success: false,
        error: 'A pending collaboration request already exists',
      }, { status: 400 })
    }

    // Create collaboration request and award points
    const result = await db.$transaction(async (tx) => {
      const collabRequest = await tx.collaborationRequest.create({
        data: {
          fromId: currentUser.id,
          toId,
          projectId,
          type: type as CollaborationType,
          message,
          proposedContribution,
          status: 'PENDING',
        },
      })

      // Award points for initiating collaboration
      try {
        await tx.pointTransaction.create({
          data: {
            userId: currentUser.id,
            points: 15, // COLLABORATION points
            source: 'COLLABORATION',
            description: `Initiated collaboration request: ${type}`,
            metadata: JSON.stringify({
              collaborationRequestId: collabRequest.id,
              type,
              toId,
            }),
          }
        })

        await tx.user.update({
          where: { id: currentUser.id },
          data: {
            totalPoints: {
              increment: 15,
            },
          },
        })
      } catch (pointsError) {
        console.error('Failed to award points for collaboration:', pointsError)
      }

      return collabRequest
    })

    // Create notification for recipient
    await db.notification.create({
      data: {
        userId: toId,
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
    const requestId = searchParams.get('id') as string

    if (!requestId) {
      return NextResponse.json({
        success: false,
        error: 'Request ID is required',
      }, { status: 400 })
    }

    const body = await request.json()
    const { status, responseMessage } = body

    if (!body || !status) {
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

    // Fetch request
    const collabRequest = await db.collaborationRequest.findUnique({
      where: { id: requestId },
      include: {
        from: true,
        to: true,
      },
    })

    if (!collabRequest) {
      return NextResponse.json({
        success: false,
        error: 'Collaboration request not found',
      }, { status: 404 })
    }

    // Verify user is recipient
    if (collabRequest.toId !== actingUserId) {
      return NextResponse.json({
        success: false,
        error: 'Only recipient can respond to this request',
      }, { status: 403 })
    }

    // Update request status
    const updatedRequest = await db.$transaction(async (tx) => {
      const result = await tx.collaborationRequest.update({
        where: { id: requestId },
        data: {
          status: status as CollaborationStatus,
          responseMessage,
          updatedAt: new Date(),
          ...(status === 'ACCEPTED' && collabRequest.projectId && {
            responseMessage: responseMessage || 'Request accepted',
          }),
        },
      })

      // If accepted and has project, add as project member
      if (status === 'ACCEPTED' && collabRequest.projectId) {
        try {
          // Check if already a member
          const existingMember = await tx.projectMember.findFirst({
            where: {
              projectId: collabRequest.projectId,
              userId: actingUserId,
            },
          })

          if (!existingMember) {
            await tx.projectMember.create({
              data: {
                projectId: collabRequest.projectId,
                userId: actingUserId,
                role: 'TEAM_MEMBER',
                joinedAt: new Date(),
              },
            })
          }
        } catch (memberError) {
          console.error('Failed to add project member:', memberError)
        }
      }

      // Award points for accepting collaboration
      if (status === 'ACCEPTED') {
        try {
          await tx.pointTransaction.create({
            data: {
              userId: actingUserId,
              points: 15, // COLLABORATION points
              source: 'COLLABORATION',
              description: `Accepted collaboration request: ${collabRequest.type}`,
              metadata: JSON.stringify({
                collaborationRequestId: requestId,
                type: collabRequest.type,
                fromId: collabRequest.fromId,
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
        userId: collabRequest.fromId,
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
    const requestId = searchParams.get('id') as string

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        error: 'Request ID is required',
      }, { status: 400 })
    }

    // Fetch and verify ownership
    const collabRequest = await db.collaborationRequest.findUnique({
      where: { id: requestId },
    })

    if (!collabRequest) {
      return NextResponse.json({
        success: false,
        error: 'Collaboration request not found',
      }, { status: 404 })
    }

    if (collabRequest.fromId !== currentUser.id) {
      return NextResponse.json({
        success: false,
        error: 'Only requester can cancel this request',
      }, { status: 403 })
    }

    // Delete request
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
