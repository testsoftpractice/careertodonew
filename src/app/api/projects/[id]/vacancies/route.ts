import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
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
  if ('status' in auth) return auth

  const { id } = await params
  const userId = auth.userId
  const userRole = auth.role

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
      include: {
        _count: {
          select: {
            filled: true,
          },
        },
      },
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
