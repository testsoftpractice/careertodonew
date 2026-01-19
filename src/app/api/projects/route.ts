import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== PROJECTS API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.status as string | undefined
    const universityId = searchParams.universityId as string | undefined
    const userId = searchParams.userId as string | undefined
    const seekingInvestment = searchParams.seekingInvestment as string | undefined

    const where: any = {}

    if (status) {
      where.status = status as any
    }

    if (universityId) {
      where.universityId = universityId
    }

    if (seekingInvestment) {
      where.seekingInvestment = seekingInvestment === 'true'
    }

    const projects = await db.project.findMany({
      where,
      include: {
        projectLead: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          }
        },
        hrLead: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        university: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
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
        _count: {
          members: true,
          tasks: true,
        }
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
        title: body.title,
        description: body.description,
        category: body.category,
        projectLeadId: body.projectLeadId,
        hrLeadId: body.hrLeadId,
        universityId: body.universityId,
        status: body.status || 'PROPOSED',
        seekingInvestment: body.seekingInvestment || false,
        investmentGoal: body.investmentGoal ? parseFloat(body.investmentGoal) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
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
