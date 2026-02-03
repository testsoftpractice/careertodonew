import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

interface ComplianceItem {
  id: string
  type: string
  category: string
  project: string
  severity: string
  description: string
  status: string
  createdAt: string
}

// GET /api/admin/compliance - Get compliance items
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const severity = searchParams.get('severity')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')

    // For now, return mock data matching the frontend expectations
    // In production, this would query from a ComplianceItem model in the database
    const mockCompliance: ComplianceItem[] = [
      {
        id: '1',
        type: 'Project Approval',
        category: 'Project',
        project: 'Tech Innovation Hub',
        severity: 'Low',
        description: 'Standard project submission requiring approval',
        status: 'Compliant',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'Data Privacy',
        category: 'User',
        project: 'Sarah Johnson',
        severity: 'Medium',
        description: 'Student data privacy review required',
        status: 'Pending Review',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'Content Policy',
        category: 'Content',
        project: 'N/A',
        severity: 'High',
        description: 'Project description violates content policies',
        status: 'Action Required',
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        type: 'Investment Compliance',
        category: 'Financial',
        project: 'Financial Services Platform',
        severity: 'Low',
        description: 'Investment terms and conditions review',
        status: 'Compliant',
        createdAt: new Date().toISOString(),
      },
    ]

    const filteredItems = mockCompliance.filter(item => {
      if (status && item.status !== status) return false
      if (category && item.category !== category) return false
      if (severity && item.severity !== severity) return false
      if (search && !(
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.project.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )) return false
      return true
    })

    return NextResponse.json({
      success: true,
      data: {
        items: filteredItems.slice(0, limit),
        totalCount: mockCompliance.length,
      },
    })
  } catch (error: any) {
    console.error('Get compliance items error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch compliance items' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/compliance/[id] - Update compliance status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, notes } = body

    // Validate action
    const validActions = ['reviewed', 'resolved', 'escalated']
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be reviewed, resolved, or escalated' },
        { status: 400 }
      )
    }

    // In production, update the compliance item in database
    // For now, return success
    return NextResponse.json({
      success: true,
      message: `Compliance item ${action} successfully`,
      data: {
        id: params.id,
        action,
        notes: notes || '',
        updatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Update compliance status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update compliance status' },
      { status: 500 }
    )
  }
}
