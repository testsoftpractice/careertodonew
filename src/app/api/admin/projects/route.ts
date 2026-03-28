import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ProjectStatus } from "@/lib/constants"
import { verifyToken } from "@/lib/auth/jwt"
import { z } from "zod"

// Validation schema for creating a project
const createProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
  ownerId: z.string().min(1, 'Owner ID is required'),
  businessId: z.string().optional(),
  universityId: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  budget: z.number().positive().optional(),
  investmentGoal: z.number().positive().optional(),
  teamSizeMin: z.number().int().min(1).optional(),
  teamSizeMax: z.number().int().min(1).optional(),
  seekingInvestment: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const statusParam = searchParams.get("status") || null
    const limit = parseInt(searchParams.get("limit") || "20")

    // Build where clause based on status filter
    const where: any = {}

    if (statusParam === "PENDING") {
      // For pending projects, filter by approvalStatus instead of status
      where.approvalStatus = "PENDING"
    } else if (statusParam) {
      // Map other status filters
      let status: ProjectStatus
      if (statusParam === "PROPOSED") {
        status = "IDEA" as ProjectStatus
      } else if (statusParam === "UNDER_REVIEW") {
        status = "UNDER_REVIEW" as ProjectStatus
      } else {
        status = statusParam as ProjectStatus
      }
      where.status = status
    }

    const [projects, totalCount] = await Promise.all([
      db.project.findMany({
        where,
        take: limit,
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              University: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                }
              }
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.project.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        projects: projects.map(p => {
          // Map backend status to frontend-friendly status
          let mappedStatus = p.status
          if (p.status === "UNDER_REVIEW") {
            mappedStatus = "PENDING" as any
          } else if (p.status === "IDEA") {
            mappedStatus = "PROPOSED" as any
          }

          return {
            id: p.id,
            title: p.name,
            name: p.name,
            description: p.description || "",
            category: p.category || "",
            status: mappedStatus,
            approvalStatus: p.approvalStatus,
            ownerId: p.ownerId,
            university: p.User.University?.name || "No University",
            owner: {
              name: p.User.name,
              email: p.User.email
            },
            budget: p.budget,
            submittedAt: p.createdAt.toISOString(),
            lastUpdated: p.updatedAt.toISOString(),
            createdAt: p.createdAt.toISOString(),
          }
        }),
        totalCount,
      },
    })
  } catch (error: any) {
    console.error("Get projects error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch projects",
      status: 500,
    })
  }
}

// POST /api/admin/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validationResult = createProjectSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Verify owner exists
    const owner = await db.user.findUnique({
      where: { id: data.ownerId }
    })

    if (!owner) {
      return NextResponse.json(
        { success: false, error: 'Owner not found' },
        { status: 404 }
      )
    }

    // Verify university exists if provided
    if (data.universityId) {
      const university = await db.university.findUnique({
        where: { id: data.universityId }
      })

      if (!university) {
        return NextResponse.json(
          { success: false, error: 'University not found' },
          { status: 404 }
        )
      }
    }

    // Verify business exists if provided
    if (data.businessId) {
      const business = await db.business.findUnique({
        where: { id: data.businessId }
      })

      if (!business) {
        return NextResponse.json(
          { success: false, error: 'Business not found' },
          { status: 404 }
        )
      }
    }

    // Create project
    const project = await db.project.create({
      data: {
        name: data.name,
        description: data.description || null,
        ownerId: data.ownerId,
        businessId: data.businessId || null,
        universityId: data.universityId || null,
        category: data.category || null,
        tags: data.tags || null,
        imageUrl: data.imageUrl || null,
        budget: data.budget || null,
        investmentGoal: data.investmentGoal || null,
        teamSizeMin: data.teamSizeMin || null,
        teamSizeMax: data.teamSizeMax || null,
        seekingInvestment: data.seekingInvestment || false,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: 'IDEA',
        stage: 'IDEA',
        approvalStatus: 'APPROVED', // Admin-created projects are auto-approved
        published: false,
        progress: 0,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        University: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        Business: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    // Create notification for project owner
    await db.notification.create({
      data: {
        userId: data.ownerId,
        type: 'SUCCESS',
        title: 'Project Created',
        message: `Your project "${data.name}" has been created by the platform admin.`,
        priority: 'HIGH',
        read: false,
        projectId: project.id,
      }
    })

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/projects - Delete multiple projects (batch delete)
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',') || []

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No project IDs provided' },
        { status: 400 }
      )
    }

    // Check if projects exist and get details
    const projects = await db.project.findMany({
      where: { id: { in: ids } },
      include: {
        _count: {
          select: {
            ProjectMember: true,
            Task: true,
            Investment: true,
          }
        }
      }
    })

    // Check if any projects have members or tasks (safety check)
    const projectsWithDependencies = projects.filter(p => 
      (p._count?.ProjectMember || 0) > 1 || 
      (p._count?.Task || 0) > 0 ||
      (p._count?.Investment || 0) > 0
    )

    if (projectsWithDependencies.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete projects with active members, tasks, or investments',
          projects: projectsWithDependencies.map(p => ({
            id: p.id,
            name: p.name,
            members: p._count?.ProjectMember,
            tasks: p._count?.Task,
            investments: p._count?.Investment,
          }))
        },
        { status: 400 }
      )
    }

    // Delete projects (cascade will handle related records)
    await db.project.deleteMany({
      where: { id: { in: ids } }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${projects.length} project(s)`
    })
  } catch (error: any) {
    console.error('Delete projects error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete projects' },
      { status: 500 }
    )
  }
}
