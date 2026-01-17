import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    
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
        completion: m.completion,
        createdAt: m.createdAt.toISOString(),
        completedAt: m.completedAt?.toISOString() || null,
      })),
    })
  } catch (error: any) {
    console.error("Get milestones error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch milestones" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const body = await request.json()
    const { title, description, dueDate } = body

    const milestone = await db.milestone.create({
      data: {
        projectId,
        title,
        description,
        dueDate: new Date(dueDate),
        completion: 0,
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const milestoneId = params.id
    const body = await request.json()
    const updates: any = {}

    if (body.title) updates.title = body.title
    if (body.description) updates.description = body.description
    if (body.dueDate) updates.dueDate = new Date(body.dueDate)
    if (body.completion !== undefined) updates.completion = body.completion
    if (body.completedAt !== undefined && body.completedAt === null) {
      updates.completedAt = new Date()
    }

    const milestone = await db.milestone.update({
      where: { id: milestoneId },
      data: updates
    })

    return NextResponse.json({
      success: true,
      data: milestone,
    })
  } catch (error: any) {
    console.error("Update milestone error:", error)
    return NextResponse.json({ success: false, error: "Failed to update milestone" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const milestoneId = params.id

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
