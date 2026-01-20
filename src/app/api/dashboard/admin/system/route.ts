import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/admin/system - Get system health status
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

    if (!decoded || !decoded.userId || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Mock system health data
    const uptime = 99.95
    const responseTime = 120 + Math.floor(Math.random() * 50)
    const activeConnections = Math.floor(Math.random() * 500) + 100

    // Determine system status
    const systemStatus = uptime > 99 ? 'operational' as const : uptime > 95 ? 'degraded' as const : 'down' as const

    // Mock resource usage
    const resources = [
      {
        id: 'cpu',
        name: 'CPU Usage',
        type: 'cpu' as const,
        usage: 45 + Math.floor(Math.random() * 30),
        capacity: 100,
        status: Math.random() > 0.8 ? 'warning' as const : 'healthy' as const
      },
      {
        id: 'memory',
        name: 'Memory',
        type: 'memory' as const,
        usage: 60 + Math.floor(Math.random() * 25),
        capacity: 100,
        status: Math.random() > 0.7 ? 'warning' as const : 'healthy' as const
      },
      {
        id: 'storage',
        name: 'Disk Storage',
        type: 'storage' as const,
        usage: 70 + Math.floor(Math.random() * 20),
        capacity: 100,
        status: Math.random() > 0.6 ? 'warning' as const : 'healthy' as const
      },
      {
        id: 'network',
        name: 'Network Bandwidth',
        type: 'network' as const,
        usage: 40 + Math.floor(Math.random() * 35),
        capacity: 100,
        status: Math.random() > 0.85 ? 'critical' as const : 'healthy' as const
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        resources,
        uptime,
        responseTime,
        activeConnections,
        systemStatus
      }
    })
  } catch (error: any) {
    console.error('Get system health error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch system health' },
      { status: 500 }
    )
  }
}
