import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { BusinessVerificationStatus } from '@prisma/client'

// GET /api/employer/profile - Get employer profile
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, ['EMPLOYER', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user

  if (!result) {
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

    // Get employer's business
    const business = await db.business.findFirst({
      where: { ownerId: user.id },
      include: {
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...employer,
        business
      }
    })
  } catch (error) {
    console.error('Get employer profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/employer/profile - Update employer profile
export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request, ['EMPLOYER', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user

  if (!result) {
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

    // Update business if exists
    if (!result) {
      const businessUpdateData: any = {}
      if (companyDescription) businessUpdateData.description = companyDescription
      if (companyWebsite) businessUpdateData.website = companyWebsite
      if (companySize) businessUpdateData.size = parseInt(companySize)
      if (companyIndustry) businessUpdateData.industry = companyIndustry

      const business = await db.business.findFirst({
        where: { ownerId: user.id }
      })

      if (!result) {
        await db.business.update({
          where: { id: business.id },
          data: businessUpdateData
        })
      } else {
        // Create business if it doesn't exist
        await db.business.create({
          data: {
            ownerId: user.id,
            name: name || `${user.name}'s Business`,
            description: companyDescription,
            website: companyWebsite,
            size: companySize ? parseInt(companySize) : 10,
            industry: companyIndustry,
            status: BusinessVerificationStatus.PENDING,
          }
        })
      }
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
