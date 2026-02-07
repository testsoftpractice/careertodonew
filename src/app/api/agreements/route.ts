import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const agreements = await db.agreement.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: agreements.map(agreement => ({
        id: agreement.id,
        title: agreement.title,
        content: agreement.content,
        projectId: agreement.projectId,
        userId: agreement.userId,
        user: agreement.user,
        signed: agreement.signed,
        signedAt: agreement.signedAt?.toISOString() || null,
        createdAt: agreement.createdAt.toISOString(),
        updatedAt: agreement.updatedAt.toISOString(),
      })),
    })
  } catch (error: any) {
    console.error("Get agreements error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch agreements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, projectId, title, content } = body

    if (!userId || !title || !content) {
      return NextResponse.json({ success: false, error: 'User ID, title, and content are required' }, { status: 400 })
    }

    const agreement = await db.agreement.create({
      data: {
        userId,
        projectId: projectId || null,
        title,
        content,
        signed: false,
      },
    })

    return NextResponse.json({
      success: true,
      data: agreement,
    })
  } catch (error: any) {
    console.error("Create agreement error:", error)
    return NextResponse.json({ success: false, error: "Failed to create agreement" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const agreementId = request.nextUrl.searchParams.get("id")
    const body = await request.json()
    const updates: any = {}

    if (body.title) updates.title = body.title
    if (body.content) updates.content = body.content
    if (body.projectId !== undefined) updates.projectId = body.projectId
    if (body.signed !== undefined) {
      updates.signed = body.signed
      if (body.signed) {
        updates.signedAt = new Date()
      }
    }

    const agreement = await db.agreement.update({
      where: { id: agreementId || '' },
      data: updates,
    })

    return NextResponse.json({
      success: true,
      data: agreement,
    })
  } catch (error: any) {
    console.error("Update agreement error:", error)
    return NextResponse.json({ success: false, error: "Failed to update agreement" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const agreementId = request.nextUrl.searchParams.get("id")

    if (!agreementId) {
      return NextResponse.json({ success: false, error: "Agreement ID is required" }, { status: 400 })
    }

    await db.agreement.delete({
      where: { id: agreementId },
    })

    return NextResponse.json({
      success: true,
      message: "Agreement deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete agreement error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete agreement" }, { status: 500 })
  }
}
