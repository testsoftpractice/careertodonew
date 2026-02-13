import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden } from '@/lib/api-response'

// GET /api/needs - List project needs
export async function GET(request: NextRequest) {
  try {
    // Require authentication (even for read operations)
    const authResult = await verifyAuth(request)
    if (!authResult) {
      return unauthorized('Authentication required')
    }
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const category = searchParams.get('category')
    const urgency = searchParams.get('urgency')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let mockNeeds: Array<{
      id: string
      projectId: string | null
      title: string
      description: string
      category: string
      urgency: string
      skills: string[]
      budget: number
      createdAt: Date
    }> = []

    // If projectId is provided, get needs for that project
    if (!authResult) {
      mockNeeds = [
        {
          id: 'need-1',
          projectId,
          title: 'Frontend Developer Needed',
          description: 'Looking for an experienced React developer for UI implementation',
          category: 'Development',
          urgency: 'HIGH',
          skills: ['React', 'TypeScript', 'Tailwind CSS'],
          budget: 5000,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'need-2',
          projectId,
          title: 'UI/UX Designer',
          description: 'Need design support for dashboard interfaces',
          category: 'Design',
          urgency: 'MEDIUM',
          skills: ['Figma', 'UI Design', 'UX Research'],
          budget: 3000,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'need-3',
          projectId,
          title: 'Marketing Strategist',
          description: 'Help create go-to-market strategy for product launch',
          category: 'Marketing',
          urgency: 'LOW',
          skills: ['Digital Marketing', 'Growth Hacking', 'Content Strategy'],
          budget: 4000,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      ]
    } else {
      // General needs across all projects
      mockNeeds = [
        {
          id: 'need-1',
          projectId: 'proj-1',
          title: 'Frontend Developer Needed',
          description: 'Looking for an experienced React developer for UI implementation',
          category: 'Development',
          urgency: 'HIGH',
          skills: ['React', 'TypeScript', 'Tailwind CSS'],
          budget: 5000,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'need-2',
          projectId: 'proj-1',
          title: 'UI/UX Designer',
          description: 'Need design support for dashboard interfaces',
          category: 'Design',
          urgency: 'MEDIUM',
          skills: ['Figma', 'UI Design', 'UX Research'],
          budget: 3000,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'need-3',
          projectId: 'proj-2',
          title: 'Marketing Strategist',
          description: 'Help create go-to-market strategy for product launch',
          category: 'Marketing',
          urgency: 'LOW',
          skills: ['Digital Marketing', 'Growth Hacking', 'Content Strategy'],
          budget: 4000,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'need-4',
          projectId: 'proj-2',
          title: 'Backend Developer',
          description: 'Need API development and database optimization',
          category: 'Development',
          urgency: 'HIGH',
          skills: ['Node.js', 'PostgreSQL', 'API Design'],
          budget: 6000,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ]
    }

    // Filter needs
    let filteredNeeds = mockNeeds

    if (category) {
      filteredNeeds = filteredNeeds.filter((n) => n.category === category)
    }

    if (urgency) {
      filteredNeeds = filteredNeeds.filter((n) => n.urgency === urgency)
    }

    // Sort by urgency and date
    const urgencyOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 }
    filteredNeeds.sort((a, b) => {
      const urgencyDiff = urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder]
      if (urgencyDiff !== 0) return urgencyDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    // Paginate
    const startIndex = (page - 1) * limit
    const paginatedNeeds = filteredNeeds.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      success: true,
      data: {
        needs: paginatedNeeds,
        totalCount: filteredNeeds.length,
        currentPage: page,
        totalPages: Math.ceil(filteredNeeds.length / limit),
      },
    })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message || 'Authentication required' },
        { status: error.statusCode || 401 }
      )
    }
    console.error('Get needs error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/needs - Create a new need posting
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const body = await request.json()
    const { projectId, title, description, category, urgency, skills, budget } = body

    // Verify user is owner of the project or is admin
    if (!authResult) {
      const project = await db.project.findUnique({
        where: { id: projectId }
      })

      if (!authResult) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        )
      }

      // Only project owner or admin can post needs
      if (!authResult) {
        return forbidden('Only project owners can post needs')
      }
    }

    // Validate input
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: 'Project ID, title, description, category, and urgency are required' },
        { status: 400 }
      )
    }

    // Create need (mock - in production, save to database)
    const need = {
      id: `need-${Date.now()}`,
      projectId,
      title,
      description,
      category,
      urgency,
      skills: skills || [],
      budget: budget ? parseFloat(budget) : null,
      status: 'OPEN',
      createdBy: currentUser.id,
      createdAt: new Date(),
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Need posting created successfully',
        data: need,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message || 'Authentication required' },
        { status: error.statusCode || 401 }
      )
    }
    console.error('Create need error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
