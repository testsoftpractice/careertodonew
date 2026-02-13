import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const projectId = id
    
    const departments = await db.department.findMany({
      where: { projectId },
      include: {
        head: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json({
      success: true,
      data: departments,
    })
  } catch (error: any) {
    console.error("Get departments error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch departments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const projectId = id
    const body = await request.json()
    const { name, headId, budget } = body

    const department = await db.department.create({
      data: {
        projectId,
        name,
        headId: headId || null,
      }
    })

    return NextResponse.json({
      success: true,
      data: department,
    })
  } catch (error: any) {
    console.error("Create department error:", error)
    return NextResponse.json({ success: false, error: "Failed to create department" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: departmentId } = await params
    const body = await request.json()
    const updates: any = {}

    if (body.name) updates.name = body.name
    if (body.headId) updates.headId = body.headId

    const department = await db.department.update({
      where: { id: departmentId },
      data: updates
    })

    return NextResponse.json({
      success: true,
      data: department,
    })
  } catch (error: any) {
    console.error("Update department error:", error)
    return NextResponse.json({ success: false, error: "Failed to update department" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: departmentId } = await params

    await db.department.delete({
      where: { id: departmentId }
    })

    return NextResponse.json({
      success: true,
      message: "Department deleted successfully"
    })
  } catch (error: any) {
    console.error("Delete department error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete department" }, { status: 500 })
  }
}
