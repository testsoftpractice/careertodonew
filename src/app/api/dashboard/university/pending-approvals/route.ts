import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireRole, getUserFromRequest } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/university/pending-approvals - Get pending business approvals
export async function GET(request: NextRequest) {
  const user = requireRole(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if (user instanceof NextResponse) return user
  const universityId = user.universityId

  if (!user) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const status = (searchParams.get('status') as string) || 'PROPOSED'

  try {
    const businesses = await db.project.findMany({
      where: {
        universityId,
        status: status as any,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            major: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true,
                location: true,
              },
            },
          },
        },
        university: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
          },
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
              },
            },
          },
          take: 10,
        },
        _count: {
          select: {
            members: true,
            tasks: true,
            milestones: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedBusinesses = businesses.map(business => ({
      id: business.id,
      title: business.name,
      description: business.description || '',
      category: business.category || 'General',
      owner: business.owner ? {
        id: business.owner.id,
        name: business.owner.name,
        email: business.owner.email,
        avatar: business.owner.avatar,
        university: business.owner.university,
      } : null,
      university: business.university,
      createdAt: business.createdAt,
      updatedAt: business.updatedAt,
      members: business._count.members,
      tasks: business._count.tasks,
      milestones: business._count.milestones,
      status: business.status,
      stage: business.stage,
      progress: business.progress || 0,
      seekingInvestment: business.category?.toLowerCase().includes('investment') || false,
      investmentGoal: null,
      investmentRaised: 0,
      teamSizeMin: business._count.members || 0,
      teamSizeMax: business._count.members || 0,
    }))

    return NextResponse.json({
      success: true,
      data: {
        businesses: formattedBusinesses,
        count: formattedBusinesses.length,
      }
    })
  } catch (error) {
    console.error('Get pending approvals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
