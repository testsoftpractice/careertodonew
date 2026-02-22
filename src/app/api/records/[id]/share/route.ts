import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/records/[id]/share - Create share link for a record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if record exists
    const record = await db.professionalRecord.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      )
    }

    // Generate a simple share token (in production, use a proper JWT or UUID)
    const shareToken = `share_${id}_${Date.now()}`

    // Update record with share info (using metadata field)
    const metadata = record.metadata ? JSON.parse(record.metadata) : {}
    metadata.shareToken = shareToken
    metadata.shareExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    metadata.shareAccessCount = (metadata.shareAccessCount || 0) + 1

    await db.professionalRecord.update({
      where: { id },
      data: {
        metadata: JSON.stringify(metadata),
      },
    })

    const shareUrl = `/records/${id}/share?token=${shareToken}`

    return NextResponse.json({
      success: true,
      data: {
        shareUrl,
        shareToken,
        expiresAt: metadata.shareExpiresAt,
      },
    })
  } catch (error: any) {
    console.error('Create share link error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create share link' },
      { status: 500 }
    )
  }
}

// GET /api/records/[id]/share - Access shared record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.nextUrl.searchParams.get('token')

    // Check if record exists
    const record = await db.professionalRecord.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      )
    }

    // Parse metadata
    const metadata = record.metadata ? JSON.parse(record.metadata) : {}

    // Verify token if provided
    if (token) {
      if (!metadata.shareToken || metadata.shareToken !== token) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired share link' },
          { status: 401 }
        )
      }
    }

    // Return public record data (excluding sensitive info)
    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        title: record.title,
        description: record.description,
        startDate: record.startDate,
        endDate: record.endDate,
        type: record.recordType || 'Professional Record',
        verified: record.verified,
        shareUrl: `/records/${id}/share?token=${metadata.shareToken || ''}`,
        shareExpiresAt: metadata.shareExpiresAt || null,
        shareAccessCount: metadata.shareAccessCount || 0,
        user: {
          name: record.User.name,
          avatar: record.User.avatar,
        },
      },
    })
  } catch (error: any) {
    console.error('Access shared record error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to access shared record' },
      { status: 500 }
    )
  }
}
