import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireRole, getUserFromRequest } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { VerificationStatus } from '@prisma/client'

// GET /api/employer/profile - Get employer profile
export async function GET(request: NextRequest) {
  const user = requireRole(request, ['EMPLOYER', 'PLATFORM_ADMIN'])
  if (user instanceof NextResponse) return user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const employer = await db.user.findUnique({
      where: { id: user.id },
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
      where: { ownerId: user.id },
      include: {
        _count: {
          select: {
            projectMembers: true,
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
  const user = requireRole(request, ['EMPLOYER', 'PLATFORM_ADMIN'])
  if (user instanceof NextResponse) return user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (location !== undefined) updateData.location = location
    if (avatar !== undefined) updateData.avatar = avatar

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData
    })

    // Update project if exists
    const project = await db.project.findFirst({
      where: { ownerId: user.id }
    })

    if (project) {
      const projectUpdateData: any = {}
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
      await db.project.create({
        data: {
          ownerId: user.id,
          name: name || `${user.name}'s Business`,
          description: companyDescription,
          website: companyWebsite,
          size: companySize ? parseInt(companySize) : 10,
          category: companyIndustry,
          status: VerificationStatus.PENDING,
          universityId: user.universityId,
        }
      })
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
