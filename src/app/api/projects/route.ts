import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden, errorResponse } from '@/lib/api-response'
import { buildProjectVisibilityWhereClause } from '@/lib/visibility-controls'

// ==================== PROJECTS API ====================

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthUser(request)
    if (!authResult.success || !authResult.dbUser) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as string | undefined
    const ownerId = searchParams.get('ownerId') as string | undefined
    const includeMembers = searchParams.get('includeMembers') === 'true'
    const includeTasks = searchParams.get('includeTasks') === 'true'
    const seekingInvestment = searchParams.get('seekingInvestment')
    const approvalStatus = searchParams.get('approvalStatus')

    // Get user info for visibility control
    const userId = authResult.dbUser?.id || null
    const userRole = authResult.dbUser?.role || null
    const userUniversityId = authResult.dbUser?.universityId || null

    const where: Record<string, any> = {}

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

    // Add seekingInvestment filter
    if (seekingInvestment === 'true') {
      where.seekingInvestment = true
    }

    // Add approvalStatus filter
    if (approvalStatus) {
      where.approvalStatus = approvalStatus as any
    }

    // Apply visibility control with university ID
    const visibilityWhere = buildProjectVisibilityWhereClause(userId, userRole, userUniversityId, where)

    // Build optimized include - only include what's requested
    const include: Record<string, any> = {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
        },
      },
    }

    if (includeMembers) {
      include.ProjectMember = {
        select: {
          id: true,
          userId: true,
          role: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        take: 5, // Only fetch first 5 members for performance
      }
    }

    if (includeTasks) {
      include.Task = {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
        take: 3, // Only fetch first 3 tasks for performance
        orderBy: { dueDate: 'asc' },
      }
    }

    const projects = await db.project.findMany({
      where: visibilityWhere,
      include,
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit results for better performance
    })

    // Transform projects to match frontend expectations
    const transformedProjects = projects.map(project => ({
      ...project,
      title: project.name,
      teamSize: project.ProjectMember?.length || 1,
      // Use the actual investmentGoal field from the database, not budget
      investmentGoal: project.investmentGoal || null,
      investmentRaised: null,
      completionRate: project.progress || 0,
    }))

    return NextResponse.json({
      success: true,
      data: transformedProjects,
      count: transformedProjects.length,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
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
    const authResult = await getAuthUser(request)

    if (!authResult.success || !authResult.dbUser) {
      return unauthorized('Authentication required')
    }

    const currentUser = authResult.dbUser
    const body = await request.json()

    console.log('Project creation request body:', JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({
        success: false,
        error: 'Project name is required'
      }, { status: 400 })
    }

    // Map experience levels from Role to Vacancy format
    const mapExperienceLevel = (level: string): string => {
      const levelMap: Record<string, string> = {
        'JUNIOR': 'Entry Level',
        'MID': 'Mid Level',
        'SENIOR': 'Senior Level',
        'EXPERT': 'Lead',
      }
      return levelMap[level] || 'Mid Level'
    }

    // Prepare roles data for vacancy creation
    const rolesToCreate = body.roles || []

    // Create project with owner as member and PENDING approval status
    const project = await db.project.create({
      data: {
        name: body.name,
        description: body.description,
        ownerId: currentUser.id,
        universityId: currentUser.universityId || null,
        status: 'IDEA',
        approvalStatus: 'PENDING',
        submissionDate: new Date(),
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        budget: body.budget ? parseFloat(body.budget) : null,
        category: body.category,
        seekingInvestment: body.seekingInvestment || false,
        investmentGoal: body.investmentGoal ? parseFloat(body.investmentGoal) : null,
        teamSizeMin: body.teamSizeMin ? parseInt(body.teamSizeMin) : null,
        teamSizeMax: body.teamSizeMax ? parseInt(body.teamSizeMax) : null,
        published: false, // Projects start unpublished, need admin approval
        publishedAt: null,
        ProjectMember: {
          create: {
            userId: currentUser.id,
            role: 'OWNER',
            accessLevel: 'OWNER',
            joinedAt: new Date(),
          }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        universityId: true,
        status: true,
        approvalStatus: true,
        submissionDate: true,
        startDate: true,
        endDate: true,
        budget: true,
        category: true,
        seekingInvestment: true,
        investmentGoal: true,
        teamSizeMin: true,
        teamSizeMax: true,
        published: true,
        publishedAt: true,
      }
    })

    // Create vacancies from roles
    if (rolesToCreate.length > 0) {
      const vacancyPromises = rolesToCreate.map((role: {
        title: string
        positionsNeeded: number
        responsibilities: string[]
        requiredSkills: string[]
        experienceLevel: string
      }) => {
        return db.vacancy.create({
          data: {
            projectId: project.id,
            title: role.title,
            description: `Role: ${role.title}`,
            type: 'FULL_TIME',
            slots: role.positionsNeeded || 1,
            skills: role.requiredSkills ? role.requiredSkills.join(',') : null,
            responsibilities: role.responsibilities ? JSON.stringify(role.responsibilities) : null,
            expertise: mapExperienceLevel(role.experienceLevel),
            status: 'OPEN',
            filled: 0,
          }
        })
      })

      await Promise.all(vacancyPromises)
      console.log(`Created ${rolesToCreate.length} vacancies for project ${project.id}`)
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project submitted for review. You will be notified once it is approved.'
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
