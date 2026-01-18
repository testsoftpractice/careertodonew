import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== BUSINESS APPLICATIONS API ====================

// Get business applications for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.studentId as string | undefined
    const businessId = searchParams.businessId as string | undefined
    const status = searchParams.status as string | undefined

    const where: any = {}
    if (studentId) where.applicantId = studentId
    if (businessId) where.businessId = businessId
    if (status) where.status = status as any

    const applications = await db.businessApplication.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
            founderId: true,
            employeesRecruited: true,
            launchDateCurrent: true,
          },
          include: {
            founder: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                major: true,
              }
            },
            university: {
              select: {
                id: true,
                name: true,
              }
            }
          },
        },
      },
      orderBy: { appliedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: applications,
      count: applications.length
    })
  } catch (error) {
    console.error('Business Applications API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch applications'
    }, { status: 500 })
  }
}

// Apply to a business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const application = await db.businessApplication.create({
      data: {
        businessId: body.businessId,
        studentId: body.studentId,
        coverLetter: body.coverLetter,
        resumeUrl: body.resumeUrl,
        portfolioUrl: body.portfolioUrl,
        status: 'PENDING',
      }
    })

    return NextResponse.json({
      success: true,
      data: application
    }, { status: 201 })
  } catch (error) {
    console.error('Business Application error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create application'
    }, { status: 500 })
  }
}
