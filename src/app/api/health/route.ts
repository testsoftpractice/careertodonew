import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/health - Health check for monitoring and load balancers
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`

    // Check environment variables
    const isConfigured = !!(process.env.JWT_SECRET && process.env.DATABASE_URL)

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      requestId,
      environment: process.env.NODE_ENV || 'unknown',
      database: 'connected',
      configured: isConfigured,
      uptime: process.uptime ? `${Math.floor(process.uptime())}s` : undefined
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      requestId,
      environment: process.env.NODE_ENV || 'unknown',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}
