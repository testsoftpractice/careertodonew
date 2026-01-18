import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== BUSINESS EMPLOYEES API ====================

// Get employees for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.businessId as string
    const isActive = searchParams.isActive as string | undefined

    if (!businessId) {
      return NextResponse.json({
        success: false,
        error: 'Business ID is required'
      }, { status: 400 })
    }

    const where: any = { businessId }
    if (isActive !== undefined) where.isActive = isActive === 'true'

    const employees = await db.businessEmployee.findMany({
      where,
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
                code: true,
              }
            }
          }
        },
        },
      orderBy: { joinedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: employees,
      count: employees.length
    })
  } catch (error) {
    console.error('Business Employees API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch employees'
    }, { status: 500 })
  }
}

// Add employee to business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const employee = await db.businessEmployee.create({
      data: {
        businessId: body.businessId,
        employeeId: body.employeeId,
        role: body.role || 'EMPLOYEE',
        position: body.position,
        salary: body.salary ? parseFloat(body.salary) : null,
        joinedAt: new Date(),
        onboardingCompleted: false,
      }
    })

    // Update business team size
    await db.business.update({
      where: { id: body.businessId },
      data: {
        teamSizeCurrent: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: employee
    }, { status: 201 })
  } catch (error) {
    console.error('Business Employee creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add employee'
    }, { status: 500 })
  }
}

// Update employee
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.id as string

    if (!employeeId) {
      return NextResponse.json({
        success: false,
        error: 'Employee ID is required'
      }, { status: 400 })
    }

    const body = await request.json()

    const updateData: any = {}

    if (body.onboardingCompleted !== undefined) {
      updateData.onboardingCompleted = body.onboardingCompleted
      if (body.onboardingCompleted) {
        updateData.salary = body.salary ? parseFloat(body.salary) : undefined
        updateData.position = body.position
      }
    }

    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive
    }

    const employee = await db.businessEmployee.update({
      where: { id: employeeId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: employee
    })
  } catch (error) {
    console.error('Business Employee update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update employee'
    }, { status: 500 })
  }
}
