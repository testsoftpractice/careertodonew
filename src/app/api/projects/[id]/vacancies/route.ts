import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, PROJECT_ROLES } from '@/lib/features/flags'

// GET /api/projects/[id]/vacancies - Get all project vacancies
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const user = auth.user
  const { id } = await params
  const userId = user.userId
  const userRole = user.role

  try {
    // Get project
    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,
      },
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user has access
    const isOwner = project.ownerId === userId
    const isAdmin = userRole === 'PLATFORM_ADMIN' || userRole === 'UNIVERSITY_ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Only project owner or admins can view vacancies' }, { status: 403 })
    }

    // Get all vacancies for this project
    const vacancies = await db.vacancy.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: vacancies,
      count: vacancies.length,
    })
  } catch (error) {
    console.error('Get project vacancies error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects/[id]/vacancies - Create vacancy for this project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const user = auth.user
  const { id } = await params
  const userId = user.userId
  const userRole = user.role

  try {
    const body = await request.json()
    const {
      title,
      description,
      type,
      slots,
      skills,
      responsibilities,
      requirements,
      expertise,
      salaryMin,
      salaryMax,
      location,
      experience
    } = body

    // Get project
    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,
      },
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user has access (owner or member)
    const isOwner = project.ownerId === userId
    const isAdmin = userRole === 'PLATFORM_ADMIN' || userRole === 'UNIVERSITY_ADMIN'

    if (!isOwner && !isAdmin) {
      const member = await db.projectMember.findFirst({
        where: {
          projectId: id,
          userId,
        },
      })

      if (!member) {
        return NextResponse.json({ error: 'Forbidden - Only project owner or members can create vacancies' }, { status: 403 })
      }
    }

    // Create vacancy
    const vacancy = await db.vacancy.create({
      data: {
        projectId: id,
        title,
        description,
        type: type || 'FULL_TIME',
        slots: parseInt(slots) || 1,
        skills: skills ? (Array.isArray(skills) ? skills.join(',') : skills) : null,
        responsibilities: responsibilities || null,
        requirements: requirements || null,
        expertise: expertise || null,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        location: location || null,
        experience: experience || null,
        status: 'OPEN',
        filled: 0,
      },
    })

    return NextResponse.json({
      success: true,
      data: vacancy,
      message: 'Vacancy created successfully',
    })
  } catch (error) {
    console.error('Create vacancy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
