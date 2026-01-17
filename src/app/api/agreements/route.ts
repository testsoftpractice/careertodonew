import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const agreements = await db.agreement.findMany({
      include: {
        investment: {
          include: {
            project: {
              select: {
                title: true,
                description: true,
              },
            },
            investor: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: agreements.map(agreement => ({
        id: agreement.id,
        investmentId: agreement.investmentId,
        projectName: agreement.investment?.project?.title || "",
        projectDescription: agreement.investment?.project?.description || "",
        investorName: agreement.investment?.investor?.name || "",
        investorEmail: agreement.investment?.investor?.email || "",
        amount: agreement.investment?.amount || 0,
        equity: agreement.investment?.equity || 0,
        terms: agreement.terms || "",
        status: agreement.status || "",
        signedAt: agreement.signedAt?.toISOString() || null,
        expiresAt: agreement.expiresAt?.toISOString() || null,
        createdAt: agreement.createdAt.toISOString(),
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
    const { investmentId, terms, ipProtection, terminationClause } = body

    if (!investmentId) {
      return NextResponse.json({ success: false, error: "Investment ID is required" }, { status: 400 })
    }

    const agreement = await db.agreement.create({
      data: {
        investmentId,
        terms,
        ipProtection: ipProtection || false,
        terminationClause: terminationClause || "",
        status: "DRAFT",
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

    if (body.terms) updates.terms = body.terms
    if (body.ipProtection !== undefined) updates.ipProtection = body.ipProtection
    if (body.terminationClause !== undefined) updates.terminationClause = body.terminationClause
    if (body.status) {
      updates.status = body.status
      if (body.status === "SIGNED" && !updates.signedAt) {
        updates.signedAt = new Date()
      }
      if (body.status === "COMPLETED") {
        const agreement = await db.agreement.findUnique({ where: { id: agreementId } })
        if (agreement?.expiresAt && agreement.expiresAt < new Date()) {
          return NextResponse.json({ success: false, error: "Cannot complete expired agreement" }, { status: 400 })
        }
      }
    }
    if (body.expiresAt !== undefined) updates.expiresAt = new Date(body.expiresAt)

    const agreement = await db.agreement.update({
      where: { id: agreementId },
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
