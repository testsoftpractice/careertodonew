import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden } from '@/lib/api-response'

// ==================== PROJECTS API ====================

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.status as string | undefined
    const ownerId = searchParams.ownerId as string | undefined

    const where: Record<string, string | undefined> = {}

    // If filtering by ownerId, only allow viewing own projects or admin
    if (ownerId) {
      if (ownerId !== authResult.user!.id && authResult.user!.role !== 'PLATFORM_ADMIN') {
        return forbidden('You can only view your own projects')
      }
      where.ownerId = ownerId
    }

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
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const body = await request.json()

    // Users can only create projects for themselves
    if (body.ownerId && body.ownerId !== currentUser.id) {
      return forbidden('You can only create projects for yourself')
    }

    // Use authenticated user's ID
    const ownerId = currentUser.id

    console.log('Project creation request body:', JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({
        success: false,
        error: 'Project name is required'
      }, { status: 400 })
    }

    // Verify owner exists (should exist since they're authenticated)
    const owner = await db.user.findUnique({
      where: { id: ownerId }
    })

    console.log('Owner lookup result:', owner ? `Found: ${owner.name} (${owner.id})` : 'Not found')

    if (!owner) {
      console.error('Owner not found for ID:', ownerId)
      return NextResponse.json({
        success: false,
        error: 'Owner not found. Please log in and try again.'
      }, { status: 404 })
    }

    const project = await db.project.create({
      data: {
        name: body.name,
        description: body.description,
        ownerId: ownerId,
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
