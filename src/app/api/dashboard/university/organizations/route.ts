import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dashboard/university/organizations - Get all universities for dropdowns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get('includeAll') === 'true'

    const universities = await db.university.findMany({
      where: includeAll ? {} : { verificationStatus: 'VERIFIED' },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        website: true,
        location: true,
        verificationStatus: true,
      },
      orderBy: { name: 'asc' },
      take: 200,
    })

    return NextResponse.json({
      success: true,
      data: {
        universities,
        total: universities.length,
      },
    })
  } catch (error) {
    console.error('Get universities error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}
