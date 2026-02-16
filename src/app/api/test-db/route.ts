import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('[TEST] Testing direct database connection...')
    console.log('[TEST] DATABASE_URL:', process.env.DATABASE_URL)
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('[TEST] Raw query result:', result)
    
    // Test university count
    const count = await prisma.university.count()
    console.log('[TEST] University count:', count)
    
    // Test finding universities
    const universities = await prisma.university.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        code: true
      }
    })
    console.log('[TEST] Universities found:', universities.length)
    
    return NextResponse.json({
      success: true,
      count,
      universities: universities.map(u => ({ id: u.id, name: u.name, code: u.code }))
    })
  } catch (error) {
    console.error('[TEST] Database error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}