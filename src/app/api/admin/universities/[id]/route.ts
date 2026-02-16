import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { UniversityVerificationStatus } from '@/lib/constants'
import { z } from 'zod'

// Validation schema for updating university
const universityUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(2).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')).or(z.null()),
  rankingScore: z.number().optional(),
  rankingPosition: z.number().optional(),
  verificationStatus: z.enum(['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'SUSPENDED', 'REJECTED']).optional(),
})

// GET /api/admin/universities/[id] - Get a single university with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get university with full details
    const university = await db.university.findUnique({
      where: { id },
      include: {
        users: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            verificationStatus: true,
            major: true,
            graduationYear: true,
            totalPoints: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            users: true,
          }
        }
      }
    })

    if (!university) {
      return NextResponse.json(
        { success: false, error: 'University not found' },
        { status: 404 }
      )
    }

    // Get additional university statistics
    const [
      studentCount,
      projectCount,
      pendingVerifications
    ] = await Promise.all([
      db.user.count({
        where: {
          universityId: id,
          role: 'STUDENT'
        }
      }),
      db.project.count({
        where: {
          User: {
            universityId: id
          }
        }
      }),
      db.user.count({
        where: {
          universityId: id,
          verificationStatus: 'PENDING'
        }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        ...university,
        statistics: {
          totalStudents: studentCount,
          totalProjects: projectCount,
          pendingVerifications,
          totalUsers: university._count.users,
        }
      }
    })
  } catch (error: any) {
    console.error('Get university error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch university' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/universities/[id] - Update a university
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const validationResult = universityUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validationResult.error },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if university exists
    const existingUniversity = await db.university.findUnique({
      where: { id }
    })

    if (!existingUniversity) {
      return NextResponse.json(
        { success: false, error: 'University not found' },
        { status: 404 }
      )
    }

    // If code is being updated, check if it's already taken
    if (data.code && data.code !== existingUniversity.code) {
      const codeExists = await db.university.findUnique({
        where: { code: data.code.toUpperCase() }
      })

      if (codeExists) {
        return NextResponse.json(
          { success: false, error: 'University with this code already exists' },
          { status: 400 }
        )
      }
    }

    // Update university
    const updateData: any = {}

    if (data.name) updateData.name = data.name
    if (data.code) updateData.code = data.code.toUpperCase()
    if (data.description !== undefined) updateData.description = data.description
    if (data.location !== undefined) updateData.location = data.location
    if (data.website !== undefined) updateData.website = data.website || null
    if (data.rankingScore !== undefined) updateData.rankingScore = data.rankingScore
    if (data.rankingPosition !== undefined) updateData.rankingPosition = data.rankingPosition
    if (data.verificationStatus) updateData.verificationStatus = data.verificationStatus

    const university = await db.university.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: university,
      message: 'University updated successfully'
    })
  } catch (error: any) {
    console.error('Update university error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update university' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/universities/[id] - Delete a university
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if university exists
    const existingUniversity = await db.university.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true }
        }
      }
    })

    if (!existingUniversity) {
      return NextResponse.json(
        { success: false, error: 'University not found' },
        { status: 404 }
      )
    }

    // Check if university has users
    if (existingUniversity._count.users > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete university with registered users' },
        { status: 400 }
      )
    }

    // Delete university (cascade will handle related records)
    await db.university.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'University deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete university error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete university' },
      { status: 500 }
    )
  }
}
