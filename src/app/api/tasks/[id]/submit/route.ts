import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id
    const body = await request.json()
    const { description } = body

    const task = await db.task.update({
      where: { id: taskId },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        description,
      }
    })

    return NextResponse.json({
      success: true,
      data: task,
    })
  } catch (error: any) {
    console.error("Submit task error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit task" }, { status: 500 })
  }
}
