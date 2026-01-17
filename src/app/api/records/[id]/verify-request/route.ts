import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recordId = params.id
    const body = await request.json()
    const { employerId, type, purpose, accessDuration, autoAccept } = body

    if (!employerId) {
      return NextResponse.json({ success: false, error: "Employer ID is required" }, { status: 400 })
    }

    // Calculate expiration date
    const accessDurationDays = parseInt(accessDuration) || 7
    const expiresAt = new Date(Date.now() + accessDurationDays * 24 * 60 * 60 * 1000)

    const verificationRequest = await db.verificationRequest.create({
      data: {
        employerId,
        studentId: recordId.split("-")[1], // Extract student ID from record ID
        recordId: recordId,
        type,
        purpose,
        accessDuration,
        autoAccept: autoAccept || false,
        expiresAt,
        status: "PENDING",
      }
    })

    // Notify student
    await db.notification.create({
      data: {
        userId: verificationRequest.studentId,
        type: "VERIFICATION",
        title: "New Verification Request",
        message: `${verificationRequest.employer?.name || "An employer"} has requested to verify your professional record: ${type}`,
        link: `/dashboard/student/verifications/${verificationRequest.id}`,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: verificationRequest.id,
        employerId: verificationRequest.employerId,
        type,
        purpose,
        status: "PENDING",
        expiresAt: expiresAt.toISOString(),
      }
    })
  } catch (error: any) {
    console.error("Create verification request error:", error)
    return NextResponse.json({ success: false, error: "Failed to create verification request" }, { status: 500 })
  }
}
