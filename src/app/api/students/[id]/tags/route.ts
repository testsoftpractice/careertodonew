import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, STUDENT_TAGGING } from '@/lib/features/flags-v2'
import { TagType, TagApprovalStatus, VerificationLevel, StudentTag, canPerformTagAction, validateStudentTags, getTagStatistics, getSuggestedTags } from '@/lib/models/student-tagging'

// Validation schemas
const createTagSchema = z.object({
  studentId: z.string(),
  type: z.enum(['MAJOR', 'CONCENTRATION', 'YEAR_LEVEL', 'DEPARTMENT', 'FACULTY', 'ACADEMIC_PROGRAM',
                 'TECHNICAL_SKILL', 'SOFT_SKILL', 'INDUSTRY_SKILL', 'CERTIFICATION', 'LANGUAGE', 'TOOL']),
  value: z.string().min(1).max(100),
  category: z.string().optional(),
  skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  certificationName: z.string().optional(),
  projectRole: z.string().optional(),
  leadershipPosition: z.string().optional(),
  badgeId: z.string().optional(),
})

const updateTagSchema = z.object({
  type: z.enum(['MAJOR', 'CONCENTRATION', 'YEAR_LEVEL', 'DEPARTMENT', 'FACULTY', 'ACADEMIC_PROGRAM',
                 'TECHNICAL_SKILL', 'SOFT_SKILL', 'INDUSTRY_SKILL', 'CERTIFICATION', 'LANGUAGE', 'TOOL']).optional(),
  value: z.string().min(1).max(100).optional(),
  category: z.string().optional(),
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']).optional(),
  verificationLevel: z.enum(['UNVERIFIED', 'UNIVERSITY_VERIFIED', 'PLATFORM_VERIFIED']).optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
})

// GET /api/students/[id]/tags - Get student tags
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(STUDENT_TAGGING)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const { id: studentId } = await params
  const user = auth.user
  const universityId = user.universityId

  if (!universityId) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    // Get student tags
    const tags = await db.studentTag.findMany({
      where: { studentId, universityId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        studentId,
        universityId,
        tags: tags.map(tag => ({
          id: tag.id,
          type: tag.type,
          value: tag.value,
          category: tag.category,
          skillLevel: tag.skillLevel,
          certificationName: tag.certificationName,
          projectRole: tag.projectRole,
          leadershipPosition: tag.leadershipPosition,
          badgeId: tag.badgeId,
          status: tag.status,
          verificationLevel: tag.verificationLevel,
          createdAt: tag.createdAt,
        })),
        statistics: getTagStatistics(tags),
        suggestedTags: getSuggestedTags({ department: tags.find(t => t.type === 'DEPARTMENT')?.value }),
      },
    })
  } catch (error) {
    console.error('Get student tags error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/students/[id]/tags - Create student tag
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(STUDENT_TAGGING)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const { id: studentId } = await params
  const user = auth.user
  const universityId = user.universityId

  if (!universityId) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const validatedData = createTagSchema.parse(body)

    // Validate student belongs to this university
    const student = await db.user.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Create student tag
    const tag = await db.studentTag.create({
      data: {
        studentId,
        universityId,
        type: validatedData.type as TagType,
        value: validatedData.value,
        category: validatedData.category,
        skillLevel: validatedData.skillLevel,
        certificationName: validatedData.certificationName,
        projectRole: validatedData.projectRole,
        leadershipPosition: validatedData.leadershipPosition,
        badgeId: validatedData.badgeId,
        status: 'PENDING' as TagApprovalStatus,
        verificationLevel: 'UNIVERSITY_VERIFIED' as VerificationLevel,
        createdBy: user.id,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        tag: {
          id: tag.id,
          type: tag.type,
          value: tag.value,
          category: tag.category,
        },
        message: 'Student tag created successfully',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Create student tag error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/students/[id]/tags/[tagId] - Update student tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tagId: string }> }
) {
  if (!isFeatureEnabled(STUDENT_TAGGING)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const { id: studentId, tagId } = await params
  const user = auth.user
  const universityId = user.universityId

  if (!universityId) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const validatedData = updateTagSchema.parse(body)

    // Get student tag
    const tag = await db.studentTag.findUnique({
      where: { id: tagId, studentId, universityId },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Student tag not found' }, { status: 404 })
    }

    // Update student tag
    const updatedTag = await db.studentTag.update({
      where: { id: tagId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        tag: {
          id: updatedTag.id,
          type: updatedTag.type,
          value: updatedTag.value,
          status: updatedTag.status,
        },
        message: 'Student tag updated successfully',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Update student tag error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/students/[id]/tags/[tagId] - Delete student tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tagId: string }> }
) {
  if (!isFeatureEnabled(STUDENT_TAGGING)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const { tagId } = await params
  const user = auth.user
  const universityId = user.universityId

  if (!universityId) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    // Get student tag
    const tag = await db.studentTag.findUnique({
      where: { id: tagId, universityId },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Student tag not found' }, { status: 404 })
    }

    // Delete student tag
    await db.studentTag.delete({
      where: { id: tagId },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Student tag deleted successfully',
      },
    })
  } catch (error) {
    console.error('Delete student tag error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
