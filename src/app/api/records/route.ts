import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { RecordType } from '@prisma/client'
import crypto from 'crypto'

// Helper function to generate content hash
function generateContentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex')
}

// GET /api/records - List records with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const projectId = searchParams.get('projectId')
    const isVerified = searchParams.get('isVerified')

    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (type) {
      where.type = type as RecordType
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (isVerified !== null && isVerified !== undefined) {
      where.isVerified = isVerified === 'true'
    }

    const records = await db.professionalRecord.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({ records })
  } catch (error) {
    console.error('Get records error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/records - Create a new professional record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      type,
      title,
      description,
      projectId,
      roleName,
      department,
      startDate,
      endDate,
      metadata,
    } = body

    // Create immutable content for hashing
    const content = JSON.stringify({
      userId,
      type,
      title,
      description,
      projectId,
      roleName,
      department,
      startDate,
      endDate,
      timestamp: new Date().toISOString(),
    })

    const hash = generateContentHash(content)

    const record = await db.professionalRecord.create({
      data: {
        userId,
        type: type as RecordType,
        title,
        description,
        projectId,
        roleName,
        department,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        hash,
        isVerified: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Professional record created successfully',
        record: {
          ...record,
          hash, // Return hash for verification purposes
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create record error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
