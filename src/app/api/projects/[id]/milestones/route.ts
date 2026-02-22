import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    
    const milestones = await db.milestone.findMany({
      where: { projectId },
      orderBy: {
        dueDate: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      data: milestones.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        dueDate: m.dueDate.toISOString(),
        status: m.status,
        createdAt: m.createdAt.toISOString(),
        completedAt: m.completedAt?.toISOString() || null,
      })),
    })
  } catch (error: any) {
    console.error("Get milestones error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch milestones" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    const { title, description, dueDate } = body

    const milestone = await db.milestone.create({
      data: {
        projectId,
        title,
        description,
        dueDate: new Date(dueDate),
      }
    })

    return NextResponse.json({
      success: true,
      data: milestone,
    })
  } catch (error: any) {
    console.error("Create milestone error:", error)
    return NextResponse.json({ success: false, error: "Failed to create milestone" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: milestoneId } = await params
    const body = await request.json()

    // Fetch existing milestone before updating
    const existingMilestone = await db.milestone.findUnique({
      where: { id: milestoneId },
      select: {
        id: true,
        status: true,
        projectId: true,
        title: true,
        completedAt: true,
      },
    })
    if (!existingMilestone) {
      return NextResponse.json({ success: false, error: "Milestone not found" }, { status: 404 })
    }

    const updates: any = {}

    if (body.title) updates.title = body.title
    if (body.description) updates.description = body.description
    if (body.dueDate) updates.dueDate = new Date(body.dueDate)
    if (body.status && body.status.trim() !== '') {
      updates.status = body.status
      if (body.completedAt && body.completedAt.trim() !== '') {
        updates.completedAt = new Date(body.completedAt)
      }
    }

    const isAchieving = body.status === 'COMPLETED' && existingMilestone.status !== 'COMPLETED'

    // Update milestone in a transaction to also award points
    const updatedMilestone = await db.$transaction(async (tx) => {
      const milestone = await tx.milestone.update({
        where: { id: milestoneId },
        data: updates,
        include: {
          Project: {
            select: {
              id: true,
              name: true,
              ownerId: true,
            },
          },
        },
      })

      // Award points for milestone achievement
      if (body.status && body.status.trim() !== 'COMPLETED') {
        try {
          await tx.pointTransaction.create({
            data: {
              userId: milestone.Project.ownerId,
              points: 25, // MILESTONE_ACHIEVEMENT points
              source: 'MILESTONE_ACHIEVEMENT',
              description: `Achieved milestone: ${milestone.title}`,
              metadata: JSON.stringify({
                milestoneId: milestone.id,
                milestoneTitle: milestone.title,
                projectId: milestone.projectId,
                projectName: milestone.Project.name,
              }),
            }
          })

          // Update user's total points
          await tx.user.update({
            where: { id: milestone.Project.ownerId },
            data: {
              totalPoints: {
                increment: 25,
              },
            },
          })
        } catch (pointsError) {
          console.error('Failed to award points for milestone achievement:', pointsError)
          // Continue even if points awarding fails
        }
      }

      return milestone
    })

    return NextResponse.json({
      success: true,
      data: updatedMilestone,
    })
  } catch (error: any) {
    console.error("Update milestone error:", error)
    return NextResponse.json({ success: false, error: "Failed to update milestone" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: milestoneId } = await params

    await db.milestone.delete({
      where: { id: milestoneId }
    })

    return NextResponse.json({
      success: true,
      message: "Milestone deleted successfully"
    })
  } catch (error: any) {
    console.error("Delete milestone error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete milestone" }, { status: 500 })
  }
}
