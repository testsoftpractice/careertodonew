import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { notFound, forbidden, unauthorized } from '@/lib/api-response'

/**
 * PATCH /api/milestones/[id] - Update a milestone
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
    const { id } = await params

    const body = await request.json()

    // Check if milestone exists
    const existingMilestone = await db.milestone.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    })

    if (!existingMilestone) {
      return notFound('Milestone not found')
    }

    // Check if user has permission to update this milestone
    const isOwner = existingMilestone.project!.ownerId === currentUser.id

    if (!isOwner) {
      return forbidden('You do not have permission to update this milestone')
    }

    const updateData: any = {}

    if (body.title !== undefined) {
      updateData.title = body.title
    }
    if (body.description !== undefined) {
      updateData.description = body.description
    }
    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = new Date(body.dueDate)
    }
    if (body.metrics !== undefined) {
      updateData.metrics = body.metrics
    }

    const updatedMilestone = await db.milestone.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Milestone updated successfully',
      data: updatedMilestone,
    })
  } catch (error) {
    console.error('Update milestone error:', error)

    // Handle AuthError - return proper JSON response
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message || 'Authentication required' },
        { status: error.statusCode || 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/milestones/[id] - Delete a milestone
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
    const { id } = await params

    // Check if milestone exists
    const existingMilestone = await db.milestone.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            ownerId: true,
          },
        },
      },
    })

    if (!existingMilestone) {
      return notFound('Milestone not found')
    }

    // Check if user has permission to delete this milestone
    const isOwner = existingMilestone.project!.ownerId === currentUser.id

    if (!isOwner) {
      return forbidden('You do not have permission to delete this milestone')
    }

    await db.milestone.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Milestone deleted successfully',
    })
  } catch (error) {
    console.error('Delete milestone error:', error)

    // Handle AuthError - return proper JSON response
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message || 'Authentication required' },
        { status: error.statusCode || 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
