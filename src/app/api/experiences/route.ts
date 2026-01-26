import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/session'

// GET /api/experiences - Get all experiences for a user
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await getServerSession(request)
    if (!authResult.success) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    // Users can only view their own experiences (unless admin)
    if (userId && userId !== authResult.user.id && authResult.user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'You can only view your own experience records' }, { status: 403 })
    }

    // Build where clause - use authenticated user's ID by default
    const where: any = {}
    where.userId = userId || authResult.user.id
    if (status) {
      where.current = status === 'true' ? false : true
    }

    // Fetch experiences
    const userExperiences = await db.experience.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: userExperiences,
      message: 'Experiences fetched successfully',
    })
  } catch (error) {
    console.error('GET experiences error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch experiences',
      message: 'Failed to fetch experiences',
    })
  }
}

// POST /api/experiences - Create new experience
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({
        success: false,
        error: 'Title is required',
        message: 'Title is required',
      })
    }

    if (!body.company) {
      return NextResponse.json({
        success: false,
        error: 'Company is required',
        message: 'Company is required',
      })
    }

    // Create experience
    const experience = await db.experience.create({
      data: {
        userId: session.user.id,
        title: body.title,
        company: body.company,
        location: body.location || null,
        description: body.description || null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        current: body.current || false,
        skills: body.skills ? JSON.stringify(body.skills) : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: experience,
      message: 'Experience created successfully',
    })
  } catch (error) {
    console.error('POST experiences error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create experience',
      message: 'Failed to create experience',
    })
  }
}

// DELETE /api/experiences/[id] - Delete experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const { id: experienceId } = await params
    if (!experienceId) {
      return NextResponse.json({
        success: false,
        error: 'Experience ID is required',
        message: 'Experience ID is required',
      })
    }

    // Check if user owns the experience
    const experience = await db.experience.findUnique({
      where: {
        id: experienceId,
        userId: session.user.id,
      },
    })

    if (!experience) {
      return NextResponse.json({
        success: false,
        error: 'Experience not found',
        message: 'Experience not found',
      })
    }

    await db.experience.delete({
      where: {
        id: experienceId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Experience deleted successfully',
    })
  } catch (error) {
    console.error('DELETE experiences error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete experience',
      message: 'Failed to delete experience',
    })
  }
}
