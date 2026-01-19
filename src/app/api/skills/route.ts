import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== SKILLS API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined
    const category = searchParams.category as string | undefined

    const where: any = {}
    if (userId) where.userId = userId
    if (category) where.category = category

    const skills = await db.skill.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      },
      orderBy: { level: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: skills,
      count: skills.length
    })
  } catch (error) {
    console.error('Skills API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch skills'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const skill = await db.skill.create({
      data: {
        userId: body.userId,
        name: body.name,
        level: body.level || 'INTERMEDIATE',
        category: body.category,
        yearsOfExperience: body.yearsOfExperience ? parseInt(body.yearsOfExperience) : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: skill
    }, { status: 201 })
  } catch (error) {
    console.error('Skill creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create skill'
    }, { status: 500 })
  }
}
