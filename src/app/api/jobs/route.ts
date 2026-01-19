import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== JOBS API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employerId = searchParams.employerId as string | undefined
    const status = searchParams.status as string | undefined
    const type = searchParams.type as string | undefined
    const remote = searchParams.remote as string | undefined

    const where: any = {}

    if (employerId) {
      where.employerId = employerId
    }

    if (status) {
      where.status = status as any
    }

    if (type) {
      where.type = type as any
    }

    if (remote !== undefined) {
      where.remote = remote === 'true'
    }

    const jobs = await db.job.findMany({
      where,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            companyWebsite: true,
          }
        },
        _count: {
          applications: true
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: jobs,
      count: jobs.length
    })
  } catch (error) {
    console.error('Jobs API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch jobs'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const job = await db.job.create({
      data: {
        employerId: body.employerId,
        title: body.title,
        description: body.description,
        type: body.type,
        status: 'DRAFT',
        location: body.location,
        remote: body.remote || false,
        salaryMin: body.salaryMin ? parseFloat(body.salaryMin) : null,
        salaryMax: body.salaryMax ? parseFloat(body.salaryMax) : null,
        salaryType: body.salaryType,
        requiredSkills: body.requiredSkills ? JSON.stringify(body.requiredSkills) : null,
        requiredLevel: body.requiredLevel,
        experienceRequired: body.experienceRequired ? parseInt(body.experienceRequired) : null,
        deadline: body.deadline ? new Date(body.deadline) : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: job
    }, { status: 201 })
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create job'
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.id as string

    if (!jobId) {
      return NextResponse.json({
        success: false,
        error: 'Job ID is required'
      }, { status: 400 })
    }

    const body = await request.json()

    const updateData: any = {}

    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === 'PUBLISHED') {
        updateData.publishedAt = new Date()
      }
      if (body.status === 'CLOSED') {
        updateData.closedAt = new Date()
      }
    }

    const job = await db.job.update({
      where: { id: jobId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: job
    })
  } catch (error) {
    console.error('Job update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update job'
    }, { status: 500 })
  }
}
