import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireRole } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { UniversityVerificationStatus } from '@/lib/constants'

// GET /api/universities/[id] - Get university details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const university = await db.university.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
            major: true,
            totalPoints: true,
          },
          take: 5,
          orderBy: { totalPoints: 'desc' }
        },
        _count: {
          select: { users: true }
        }
      }
    })
    if (!university) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: university
    })
  } catch (error) {
    console.error('Get university error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/universities/[id] - Update university profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user

  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      description,
      location,
      website,
      rankingScore,
      rankingPosition,
      totalStudents,
      totalProjects,
      verificationStatus,
    } = body

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (location !== undefined) updateData.location = location
    if (website !== undefined) updateData.website = website
    if (rankingScore !== undefined) updateData.rankingScore = rankingScore
    if (rankingPosition !== undefined) updateData.rankingPosition = rankingPosition
    if (totalStudents !== undefined) updateData.totalStudents = parseInt(totalStudents)
    if (totalProjects !== undefined) updateData.totalProjects = parseInt(totalProjects)
    if (verificationStatus !== undefined) updateData.verificationStatus = verificationStatus as UniversityVerificationStatus

    const updatedUniversity = await db.university.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: updatedUniversity,
      message: 'University updated successfully'
    })
  } catch (error) {
    console.error('Update university error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/universities/[id] - Delete university (platform admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, ['PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  try {
    const { id } = await params
    await db.university.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'University deleted successfully'
    })
  } catch (error) {
    console.error('Delete university error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
