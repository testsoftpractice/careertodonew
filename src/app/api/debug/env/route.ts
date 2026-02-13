import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/debug/env - Check environment variables
export async function GET(request: NextRequest) {
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
    console.log('[DEBUG] Testing database connection...')
    await db.$connect()
    dbStatus = 'Connected ✓'
    await db.$disconnect()
  } catch (error: any) {
    dbStatus = 'Failed ✗'
    if (error) {
      dbError = {
        message: error.message || 'Unknown error',
        name: error.name || 'Error',
        code: error.code || 'UNKNOWN',
      }
    }
    console.error('[DEBUG] Database connection failed:', dbError)
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
