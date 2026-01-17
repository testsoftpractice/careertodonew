import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, PROJECT_ROLES } from '@/lib/features/flags-v2'

// GET /api/permissions - Get user permissions
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const user = auth.user

  try {
    // Get all project memberships
    const memberships = await db.projectMember.findMany({
      where: { userId: user.id },
      select: {
        projectId: true,
        role: true,
      },
    })

    // Calculate user's highest role and permissions
    const permissions = memberships.map(m => ({
      projectId: m.projectId,
      role: m.role,
    }))

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        permissions,
        totalProjects: memberships.length,
      },
    })
  } catch (error) {
    console.error('Get user permissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
