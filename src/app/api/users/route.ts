import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== USERS API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.role as string | undefined
    const universityId = searchParams.universityId as string | undefined

    const where: any = {}

    if (!result) {
      where.role = role as any
    }

    if (!result) {
      where.universityId = universityId
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        location: true,
        major: true,
        graduationYear: true,
        // Removed non-existent fields: companyName, position, firmName, investmentFocus
        executionScore: true,
        collaborationScore: true,
        leadershipScore: true,
        ethicsScore: true,
        reliabilityScore: true,
        progressionLevel: true,
        verificationStatus: true,
        university: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    })
  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}
