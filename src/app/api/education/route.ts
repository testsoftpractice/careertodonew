import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/session'

// GET /api/education - Get all education for a user
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await getServerSession(request)
    if (!authResult) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Users can only view their own education (unless admin)
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'You can only view your own education records' }, { status: 403 })
    }

    // Build where clause - use authenticated user's ID by default
    const where: any = {}
    where.userId = userId || authResult.user.id

    // Fetch education records
    const userEducations = await db.education.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: userEducations,
      message: 'Education fetched successfully',
    })
  } catch (error) {
    console.error('GET education error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch education',
      message: 'Failed to fetch education',
    })
  }
}

// POST /api/education - Create new education
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body) {
      return NextResponse.json({
        success: false,
        error: 'School is required',
        message: 'School name is required',
      })
    }

    if (!body.degree) {
      return NextResponse.json({
        success: false,
        error: 'Degree is required',
        message: 'Degree is required',
      })
    }

    // Validate date range
    if (body.startDate && body.endDate && new Date(body.startDate) >= new Date(body.endDate)) {
      return NextResponse.json({
        success: false,
        error: 'End date must be after start date',
        message: 'End date must be after start date',
      })
    }

    // Create education
    const createData: any = {
      userId: session.user.id,
      school: body.school,
      degree: body.degree,
      field: body.field || null,
      description: body.description || null,
      startDate: new Date(body.startDate),
    }

    if (body.endDate) {
      createData.endDate = new Date(body.endDate)
    }

    const education = await db.education.create({
      data: createData,
    })

    return NextResponse.json({
      success: true,
      data: education,
      message: 'Education created successfully',
    })
  } catch (error) {
    console.error('POST education error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create education',
      message: 'Failed to create education',
    })
  }
}

// PATCH /api/education/[id] - Update education
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const session = await getServerSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const { id: educationId } = await params
    if (!educationId) {
      return NextResponse.json({
        success: false,
        error: 'Education ID is required',
        message: 'Education ID is required',
      })
    }

    const body = await request.json()

    // Validate date range
    if (body.startDate && body.endDate && new Date(body.startDate) >= new Date(body.endDate)) {
      return NextResponse.json({
        success: false,
        error: 'End date must be after start date',
        message: 'End date must be after start date',
      })
    }

    // Update education - only update provided fields
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (body.school) updateData.school = body.school
    if (body.degree) updateData.degree = body.degree
    if (body.field !== undefined) updateData.field = body.field
    if (body.description !== undefined) updateData.description = body.description
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate) updateData.endDate = new Date(body.endDate)

    const education = await db.education.update({
      where: { id: educationId },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: education,
      message: 'Education updated successfully',
    })
  } catch (error) {
    console.error('PATCH education/[id] error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update education',
      message: 'Failed to update education',
    })
  }
}

// DELETE /api/education/[id] - Delete education
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const session = await getServerSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const { id: educationId } = await params
    if (!educationId) {
      return NextResponse.json({
        success: false,
        error: 'Education ID is required',
        message: 'Education ID is required',
      })
    }

    // Check if user owns education
    const education = await db.education.findUnique({
      where: { id: educationId, userId: session.user.id },
    })
    if (!education) {
      return NextResponse.json({
        success: false,
        error: 'Education not found',
        message: 'Education not found',
      })
    }

    await db.education.delete({
      where: { id: educationId, userId: session.user.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Education deleted successfully',
    })
  } catch (error) {
    console.error('DELETE education/[id] error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete education',
      message: 'Failed to delete education',
    })
  }
}
