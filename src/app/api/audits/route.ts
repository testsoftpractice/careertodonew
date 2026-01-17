import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/audits - List audit logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')
    const entityType = searchParams.get('entityType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Mock audit data (in production, fetch from database)
    let mockAudits = [
      {
        id: 'audit-1',
        userId: 'user-1',
        userName: 'John Doe',
        action: 'CREATE',
        entityType: 'PROJECT',
        entityId: 'proj-1',
        details: 'Created new project "AI Learning Platform"',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        id: 'audit-2',
        userId: 'user-2',
        userName: 'Jane Smith',
        action: 'UPDATE',
        entityType: 'TASK',
        entityId: 'task-1',
        details: 'Updated task status to "COMPLETED"',
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
      },
      {
        id: 'audit-3',
        userId: 'user-3',
        userName: 'Bob Johnson',
        action: 'DELETE',
        entityType: 'INVESTMENT',
        entityId: 'inv-1',
        details: 'Deleted investment proposal',
        ipAddress: '192.168.1.3',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: 'audit-4',
        userId: 'user-1',
        userName: 'John Doe',
        action: 'LOGIN',
        entityType: 'USER',
        entityId: 'user-1',
        details: 'User logged in successfully',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
      },
      {
        id: 'audit-5',
        userId: 'user-4',
        userName: 'Alice Williams',
        action: 'CREATE',
        entityType: 'JOB_POSTING',
        entityId: 'job-1',
        details: 'Posted new job "Software Engineer Intern"',
        ipAddress: '192.168.1.4',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        id: 'audit-6',
        userId: 'user-2',
        userName: 'Jane Smith',
        action: 'UPDATE',
        entityType: 'PROJECT',
        entityId: 'proj-2',
        details: 'Updated project budget to $150,000',
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
      },
    ]

    // Filter audits
    let filteredAudits = mockAudits

    if (userId) {
      filteredAudits = filteredAudits.filter((a) => a.userId === userId)
    }

    if (action && action !== 'all') {
      filteredAudits = filteredAudits.filter((a) => a.action === action)
    }

    if (entityType && entityType !== 'all') {
      filteredAudits = filteredAudits.filter((a) => a.entityType === entityType)
    }

    // Sort by timestamp (newest first)
    filteredAudits.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    // Paginate
    const startIndex = (page - 1) * limit
    const paginatedAudits = filteredAudits.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      success: true,
      data: {
        audits: paginatedAudits,
        totalCount: filteredAudits.length,
        currentPage: page,
        totalPages: Math.ceil(filteredAudits.length / limit),
      },
    })
  } catch (error: any) {
    console.error('Get audits error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/audits - Create audit log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName, action, entityType, entityId, details } = body

    // Validate input
    if (!userId || !action || !entityType) {
      return NextResponse.json(
        { success: false, error: 'User ID, action, and entity type are required' },
        { status: 400 }
      )
    }

    // Get IP address and user agent from request
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create audit log (mock - in production, save to database)
    const audit = {
      id: `audit-${Date.now()}`,
      userId,
      userName,
      action,
      entityType,
      entityId,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Audit log created successfully',
        data: audit,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create audit error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
