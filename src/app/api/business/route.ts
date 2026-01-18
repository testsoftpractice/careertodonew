import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== BUSINESS API ====================

// Get all businesses with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.status as string | undefined
    const universityId = searchParams.universityId as string | undefined
    const category = searchParams.category as string | undefined
    const founderId = searchParams.founderId as string | undefined

    const where: any = {}

    if (status) where.status = status as any
    if (universityId) where.universityId = universityId
    if (category) where.category = category as any
    if (founderId) where.founderId = founderId

    const businesses = await db.business.findMany({
      where,
      include: {
        founder: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            major: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            }
          }
        },
        university: {
          select: {
            id: true,
            name: true,
          }
        },
        businessPlan: {
          select: {
            id: true,
            isApproved: true,
            approvedBy: true,
            approvedAt: true,
          }
        },
        employees: {
          take: 10,
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                major: true,
                university: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        },
        applications: {
          where: { status: 'PENDING' },
          take: 10,
          include: {
            applicant: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                major: true,
                university: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            employees: true,
            applications: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: businesses,
      count: businesses.length
    })
  } catch (error) {
    console.error('Businesses API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch businesses'
    }, { status: 500 })
  }
}

// Create a new business (student)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const business = await db.business.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category || 'OTHER',
        founderId: body.founderId,
        universityId: body.universityId,
        status: 'DRAFT',
        missionStatement: body.missionStatement,
        targetMarket: body.targetMarket,
        valueProposition: body.valueProposition,
        revenueModel: body.revenueModel,
        fundingGoal: body.fundingGoal ? parseFloat(body.fundingGoal) : null,
        teamSizeGoal: body.teamSizeGoal ? parseInt(body.teamSizeGoal) : null,
        launchDateGoal: body.launchDateGoal ? new Date(body.launchDateGoal) : null,
      }
    })

    // Create initial business plan
    await db.businessPlan.create({
      data: {
        businessId: business.id,
        executiveSummary: body.executiveSummary,
        marketAnalysis: body.marketAnalysis,
        productService: body.productService,
        marketingStrategy: body.marketingStrategy,
        operationalPlan: body.operationalPlan,
        financialProjections: body.financialProjections,
      }
    })

    return NextResponse.json({
      success: true,
      data: business
    }, { status: 201 })
  } catch (error) {
    console.error('Business creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create business'
    }, { status: 500 })
  }
}

// Submit business for approval
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.id as string

    if (!businessId) {
      return NextResponse.json({
        success: false,
        error: 'Business ID is required'
      }, { status: 400 })
    }

    const body = await request.json()

    const updateData: any = {}

    if (body.status) {
      updateData.status = body.status
      if (body.status === 'SUBMITTED') {
        updateData.submittedAt = new Date()
      }
    }

    // Update business plan if provided
    if (body.businessPlan) {
      const businessPlan = await db.businessPlan.findFirst({
        where: { businessId }
      })

      if (businessPlan) {
        const planUpdate: any = {}
        if (body.businessPlan.executiveSummary) planUpdate.executiveSummary = body.businessPlan.executiveSummary
        if (body.businessPlan.marketAnalysis) planUpdate.marketAnalysis = body.businessPlan.marketAnalysis
        if (body.businessPlan.productService) planUpdate.productService = body.businessPlan.productService
        if (body.businessPlan.marketingStrategy) planUpdate.marketingStrategy = body.businessPlan.marketingStrategy
        if (body.businessPlan.operationalPlan) planUpdate.operationalPlan = body.businessPlan.operationalPlan
        if (body.businessPlan.financialProjections) planUpdate.financialProjections = body.businessPlan.financialProjections

        await db.businessPlan.update({
          where: { id: businessPlan.id },
          data: planUpdate
        })
      }
    }

    const business = await db.business.update({
      where: { id: businessId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: business
    })
  } catch (error) {
    console.error('Business update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update business'
    }, { status: 500 })
  }
}
