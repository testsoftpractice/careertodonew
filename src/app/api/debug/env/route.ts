import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/verify'

// GET /api/debug/env - Check environment variables (DEV ONLY)
export async function GET(request: NextRequest) {
  // Disable in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  // Require authentication and admin role in development
  try {
    const authResult = await requireAuth(request)
    if (authResult.dbUser.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const envCheck = {
    DATABASE_URL: process.env.DATABASE_URL ? 'SET ✓' : 'NOT SET ✗',
    DIRECT_URL: process.env.DIRECT_URL ? 'SET ✓' : 'NOT SET ✗',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET ✓' : 'NOT SET ✗',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET ✓' : 'NOT SET ✗',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET ✓' : 'NOT SET ✗',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
  }

  // Try database connection
  let dbStatus = 'Unknown'
  let dbError: { message: string; name: string; code: string } | null = null

  try {
    await db.$connect()
    dbStatus = 'Connected ✓'
    await db.$disconnect()
  } catch (error: unknown) {
    dbStatus = 'Failed ✗'
    if (error instanceof Error) {
      dbError = {
        message: error.message || 'Unknown error',
        name: error.name || 'Error',
        code: (error as { code?: string }).code || 'UNKNOWN',
      }
    }
  }

  return NextResponse.json({
    message: 'Environment and Database Debug',
    environment: envCheck,
    database: {
      status: dbStatus,
      error: dbError,
    },
    timestamp: new Date().toISOString(),
  })
}
