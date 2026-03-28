import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/health/db
 * Diagnostic endpoint to check database connection and configuration
 */
export async function GET() {
  const result = {
    databaseConnected: false,
    databaseUrlExists: false,
    directUrlExists: false,
    jwtSecretExists: false,
    tablesExist: false,
    tables: [] as string[],
    error: null as string | null,
    environment: process.env.NODE_ENV || 'unknown',
  }

  // Check environment variables
  result.databaseUrlExists = !!process.env.DATABASE_URL
  result.directUrlExists = !!process.env.DIRECT_URL
  result.jwtSecretExists = !!process.env.JWT_SECRET

  // Try to connect to database
  try {
    // Simple query to test connection
    await db.$queryRaw`SELECT 1`
    result.databaseConnected = true

    // Check if tables exist
    const tables = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    ` as any[]

    result.tables = tables.map(t => t.table_name)
    result.tablesExist = result.tables.length > 0

    // Check for critical tables
    const requiredTables = ['User', 'University', 'Project', 'Task', 'VerificationRequest']
    const missingTables = requiredTables.filter(t => !result.tables.includes(t))

    if (missingTables.length > 0) {
      result.error = `Missing required tables: ${missingTables.join(', ')}`
    }

  } catch (error: any) {
    result.databaseConnected = false
    result.error = error?.message || String(error)
  } finally {
    await db.$disconnect()
  }

  return NextResponse.json(result, {
    status: result.databaseConnected ? 200 : 503,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
