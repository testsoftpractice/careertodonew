import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VerificationStatus } from '@prisma/client'

// GET /api/universities - List universities with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'rankingPosition'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    const where: any = {}

    if (status && status !== 'all') {
      where.verificationStatus = status as VerificationStatus
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ]
    }

    const universities = await db.university.findMany({
      where,
      include: {
        students: {
          select: {
            id: true,
            name: true,
            role: true,
            progressionLevel: true,
          },
          take: 5,
        },
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
          },
          take: 5,
        },
        _count: {
          select: {
            students: true,
            projects: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
      },
      take: 50,
    })

    // Calculate reputation scores for each university
    const universitiesWithStats = universities.map(univ => {
      const students = univ.students || []
      const avgReputation = students.length > 0
        ? students.reduce((sum, s) => sum + s.executionScore + s.collaborationScore + s.leadershipScore, 0) / students.length / 3
        : 0

      return {
        id: univ.id,
        name: univ.name,
        code: univ.code,
        description: univ.description,
        logo: univ.logo,
        website: univ.website,
        location: univ.location,
        verificationStatus: univ.verificationStatus,
        rankingScore: univ.rankingScore,
        rankingPosition: univ.rankingPosition,
        totalStudents: univ._count.students,
        totalProjects: univ._count.projects,
        avgReputation: parseFloat(avgReputation.toFixed(2)),
        recentStudents: students.slice(0, 3),
      }
    })

    return NextResponse.json({ universities: universitiesWithStats })
  } catch (error) {
    console.error('Get universities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
        logo,
        website,
        location,
        verificationStatus: VerificationStatus.PENDING,
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
