import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recordId = params.id
    const body = await request.json()
    const { expires, allowDownload, accessCode } = body

    // Generate share URL with unique token
    const shareToken = Buffer.from(`${recordId}-${Date.now()}-${Math.random().toString(36)}`).toString('base64').substring(0, 32)
    
    // Generate share URL
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/records/${recordId}/share?token=${shareToken}`
    
    // Calculate expiration date (default 30 days)
    const expiresAt = expires ? new Date(expires) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    
    // Update record with share metadata
    await db.professionalRecord.update({
      where: { id: recordId },
      data: {
        shareToken,
        shareUrl,
        shareExpiresAt: expiresAt,
        shareAllowDownload: allowDownload !== false,
        shareAccessCount: { increment: 1 },
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        shareUrl,
        token: shareToken,
        expiresAt: expiresAt.toISOString(),
        daysUntilExpiry: Math.ceil((expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
      }
    })
  } catch (error: any) {
    console.error("Share record error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate share URL" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.nextUrl.searchParams.get("token")
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Share token required" }, { status: 400 })
    }

    const record = await db.professionalRecord.findFirst({
      where: { shareToken: token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          }
        }
      }
    })

    if (!record) {
      return NextResponse.json({ success: false, error: "Invalid or expired share link" }, { status: 404 })
    }

    // Check if share has expired
    if (record.shareExpiresAt && record.shareExpiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "Share link has expired" }, { status: 410 })
    }

    // Update share access count
    await db.professionalRecord.update({
      where: { id: record.id },
      data: { shareAccessCount: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        title: record.title,
        type: record.type,
        description: record.description,
        startDate: record.startDate?.toISOString() || null,
        endDate: record.endDate?.toISOString() || null,
        verified: record.verified,
        user: record.user,
        shareExpiresAt: record.shareExpiresAt?.toISOString() || null,
        shareAllowDownload: record.shareAllowDownload,
        daysUntilExpiry: record.shareExpiresAt ? Math.ceil((record.shareExpiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null,
      }
    })
  } catch (error: any) {
    console.error("Get shared record error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch shared record" }, { status: 500 })
  }
}
