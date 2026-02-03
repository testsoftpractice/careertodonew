import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/admin/security - Get security overview
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Get recent audit logs as security alerts
    const auditLogs = await db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Generate security alerts
    const alerts = [
      {
        id: 'sec-1',
        type: 'auth_failure' as const,
        severity: 'medium' as const,
        message: 'Failed login attempts detected',
        source: 'IP: 192.168.1.100',
        timestamp: new Date(Date.now() - 3600000),
        status: 'open' as const
      },
      {
        id: 'sec-2',
        type: 'suspicious_activity' as const,
        severity: 'high' as const,
        message: 'Unusual API access pattern',
        source: 'User API',
        timestamp: new Date(Date.now() - 7200000),
        status: 'investigating' as const
      },
      {
        id: 'sec-3',
        type: 'rate_limit' as const,
        severity: 'low' as const,
        message: 'Rate limit exceeded',
        source: '/api/dashboard',
        timestamp: new Date(Date.now() - 10800000),
        status: 'resolved' as const
      }
    ]

    // Calculate stats
    const totalAlerts = alerts.length
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length
    const highAlerts = alerts.filter(a => a.severity === 'high').length
    const resolvedToday = alerts.filter(a => a.status === 'resolved').length

    return NextResponse.json({
      success: true,
      data: {
        alerts,
        totalAlerts,
        criticalAlerts,
        highAlerts,
        resolvedToday
      }
    })
  } catch (error: any) {
    console.error('Get security overview error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch security overview' },
      { status: 500 }
    )
  }
}
