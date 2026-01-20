import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== PROJECTS API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.status as string | undefined
    const ownerId = searchParams.ownerId as string | undefined

    const where: any = {}

    if (status) {
      where.status = status as any
    }

    if (ownerId) {
      where.ownerId = ownerId
    }

    const projects = await db.project.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                major: true,
              }
            }
          },
          take: 10
        },
        tasks: {
          take: 5,
          orderBy: { dueDate: 'asc' }
        },
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length
    })
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch projects'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const project = await db.project.create({
      data: {
        name: body.name,
        description: body.description,
        ownerId: body.ownerId,
        status: 'IDEA',
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        budget: body.budget ? parseFloat(body.budget) : null,
        category: body.category,
      }
    })

    return NextResponse.json({
      success: true,
      data: project
    }, { status: 201 })
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create project'
    }, { status: 500 })
  }
}
