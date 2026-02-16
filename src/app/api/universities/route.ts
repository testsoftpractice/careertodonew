import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UniversityVerificationStatus } from '@/lib/constants'

// GET /api/universities - List universities with filters
export async function GET(request: NextRequest) {
  try {
    console.log('[API] Universities endpoint called')
    console.log('[API] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'rankingPosition'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    console.log('[API] Query params:', { status, search, sortBy, sortOrder })

    const where: any = {}

    if (status) {
      where.verificationStatus = status as UniversityVerificationStatus
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ]
    }

    console.log('[API] About to query database...')
    const universities = await db.university.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            role: true,
            progressionLevel: true,
            executionScore: true,
            collaborationScore: true,
            leadershipScore: true,
          },
          take: 5,
        },
      },
      orderBy: {
        [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
      },
      take: 50,
    })

    console.log('[API] Found universities:', universities.length)

    // Calculate reputation scores for each university
    const universitiesWithStats = universities.map(univ => {
      const students = (univ.User || []).filter(u => u.role === 'STUDENT')
      const avgReputation = students.length > 0
        ? students.reduce((sum, s) => {
            const score = (s.executionScore || 0) + (s.collaborationScore || 0) + (s.leadershipScore || 0)
            return sum + score
          }, 0) / students.length / 3
        : 0

      return {
        id: univ.id,
        name: univ.name,
        code: univ.code,
        description: univ.description,
        website: univ.website,
        location: univ.location,
        verificationStatus: univ.verificationStatus,
        rankingScore: univ.rankingScore,
        rankingPosition: univ.rankingPosition,
        totalStudents: univ.User.length,
        avgReputation: parseFloat(avgReputation.toFixed(2)),
        recentStudents: students.slice(0, 3),
      }
    })

    console.log('[API] Returning universities response')
    return NextResponse.json({ universities: universitiesWithStats })
  } catch (error) {
    console.error('[API] Get universities error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// POST /api/universities - Create a new university
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      code,
      description,
      logo,
      website,
      location,
    } = body

    // Check if university with this code already exists
    const existingUniversity = await db.university.findUnique({
      where: { code },
    })

    if (existingUniversity) {
      return NextResponse.json(
        { error: 'University with this code already exists' },
        { status: 400 }
      )
    }

    const university = await db.university.create({
      data: {
        name,
        code,
        description,
        website,
        location,
        verificationStatus: UniversityVerificationStatus.PENDING,
        totalStudents: 0,
        totalProjects: 0,
        rankingScore: 0,
      },
    })

    return NextResponse.json(
      {
        message: 'University created successfully',
        university,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create university error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
