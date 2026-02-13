import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/records - Get all professional records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (type) {
      where.recordType = type
    }

    if (status) {
      where.verified = status === 'verified'
    }

    const [records, totalCount] = await Promise.all([
      db.professionalRecord.findMany({
        where,
        include: {
          user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      db.professionalRecord.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        records,
        total: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error: any) {
    console.error('Get records error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}

// POST /api/records - Create a new professional record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, startDate, endDate, recordType, metadata } = body

    // Get user from token
    const tokenCookie = request.cookies.get('token')
    if (!tokenCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Decode JWT to get user info
    const decoded = JSON.parse(atob(tokenCookie.value))

    // Create record
    const record = await db.professionalRecord.create({
      data: {
        userId: decoded.userId,
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        recordType: recordType || 'EXPERIENCE',
        verified: false,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: record,
      message: 'Record created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create record error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create record' },
      { status: 500 }
    )
  }
}
