import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden, errorResponse } from '@/lib/api-response'
import { buildProjectVisibilityWhereClause } from '@/lib/visibility-controls'

// ==================== PROJECTS API ====================

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as string | undefined
    const ownerId = searchParams.get('ownerId') as string | undefined

    // Get user info for visibility control
    const userId = authResult.dbUser?.id || null
    const userRole = authResult.dbUser?.role || null

    const where: Record<string, string | undefined> = {}

    // If filtering by ownerId, only allow viewing own projects or admin
    if (ownerId) {
      if (userId !== ownerId && userRole !== 'PLATFORM_ADMIN') {
        return forbidden('You can only view your own projects')
      }
      where.ownerId = ownerId
    }

    if (status) {
      where.status = status as any
    }

    // Apply visibility control
    const visibilityWhere = buildProjectVisibilityWhereClause(userId, userRole, where)

    const projects = await db.project.findMany({
      where: visibilityWhere,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
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
              },
            },
          },
          take: 10,
        },
        tasks: {
          take: 5,
          orderBy: { dueDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Projects API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch projects',
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const body = await request.json()

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

    // Create project with owner as member and PENDING approval status
    const project = await db.project.create({
      data: {
        name: body.name,
        description: body.description,
        ownerId: ownerId,
        status: 'IDEA', // Start with IDEA status
        approvalStatus: 'PENDING', // Requires admin approval
        submissionDate: new Date(),
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        budget: body.budget ? parseFloat(body.budget) : null,
        category: body.category,
        seekingInvestment: body.seekingInvestment || false,
        published: body.publishImmediately || false,
        publishedAt: body.publishImmediately ? new Date() : null,
        members: {
          create: {
            userId: ownerId,
            role: 'OWNER',
            accessLevel: 'OWNER',
            joinedAt: new Date(),
          }
        }
      },
      include: {
        members: true,
      }
    })

    return NextResponse.json({
      success: true,
      data: project
    }, { status: 201 })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Project creation error:', error)

    // Handle AuthError - return proper JSON response
    if (error.name === 'AuthError') {
      return NextResponse.json({
        success: false,
        error: error.message || 'Authentication required'
      }, { status: error.statusCode || 401 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create project'
    }, { status: 500 })
  }
}
