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

    console.log('Project creation request body:', JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({
        success: false,
        error: 'Project name is required'
      }, { status: 400 })
    }

    if (!body.ownerId) {
      console.error('Owner ID missing from request body')
      return NextResponse.json({
        success: false,
        error: 'Owner ID is required. You must be logged in to create a project.'
      }, { status: 400 })
    }

    // Verify owner exists
    const owner = await db.user.findUnique({
      where: { id: body.ownerId }
    })

    console.log('Owner lookup result:', owner ? `Found: ${owner.name} (${owner.id})` : 'Not found')

    if (!owner) {
      console.error('Owner not found for ID:', body.ownerId)
      return NextResponse.json({
        success: false,
        error: 'Owner not found. Please log in and try again.'
      }, { status: 404 })
    }

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
