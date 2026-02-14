import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/employer/profile - Get employer profile
export async function GET(request: NextRequest) {
  const auth = requireRole(request, ['EMPLOYER', 'PLATFORM_ADMIN'])
  if (auth instanceof NextResponse) return auth

  const user = auth.user

  try {
    const employer = await db.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        role: true,
        verificationStatus: true,
        totalPoints: true,
        createdAt: true
      }
    })

    // Get employer's project
    const project = await db.project.findFirst({
      where: { ownerId: user.userId },
      include: {
        _count: {
          select: {
            members: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...employer,
        project
      }
    })
  } catch (error) {
    console.error('Get employer profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/employer/profile - Update employer profile
export async function PATCH(request: NextRequest) {
  const auth = requireRole(request, ['EMPLOYER', 'PLATFORM_ADMIN'])
  if (auth instanceof NextResponse) return auth

  const user = auth.user

  try {
    const body = await request.json()
    const {
      name,
      bio,
      location,
      avatar,
      companyDescription,
      companyWebsite,
      companySize,
      companyIndustry
    } = body

    const updateData: Record<string, unknown> = {}

    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (location !== undefined) updateData.location = location
    if (avatar !== undefined) updateData.avatar = avatar

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: user.userId },
      data: updateData
    })

    // Update project if exists
    const project = await db.project.findFirst({
      where: { ownerId: user.userId }
    })

    if (project) {
      const projectUpdateData: Record<string, unknown> = {}
      if (companyDescription) projectUpdateData.description = companyDescription
      if (companyWebsite) projectUpdateData.website = companyWebsite
      if (companySize) projectUpdateData.size = parseInt(companySize)
      if (companyIndustry) projectUpdateData.category = companyIndustry

      await db.project.update({
        where: { id: project.id },
        data: projectUpdateData
      })
    } else {
      // Create project if it doesn't exist
      const projectData: {
        ownerId: string
        name: string
        description: string | undefined
        status: 'IDEA'
        universityId?: string | null
      } = {
        ownerId: user.userId,
        name: name || `${user.name || 'User'}'s Business`,
        description: companyDescription,
        status: 'IDEA',
        universityId: user.universityId ?? null,
      }
      await db.project.create({ data: projectData })
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Update employer profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
