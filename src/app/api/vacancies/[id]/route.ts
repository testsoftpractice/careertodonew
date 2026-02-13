import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { successResponse, errorResponse, forbidden, notFound, unauthorized } from '@/lib/api-response'
import { z } from 'zod'

const updateVacancySchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP']).optional(),
  skills: z.array(z.string()).optional(),
  slots: z.number().min(0).optional(),
  filled: z.number().min(0).optional(),
  responsibilities: z.string().max(3000).optional(),
  requirements: z.string().max(3000).optional(),
  expertise: z.string().max(1000).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  location: z.string().max(200).optional(),
  experience: z.string().max(200).optional(),
})

/**
 * PATCH /api/vacancies/[id] - Update a vacancy
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validation = updateVacancySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues.map(issue => ({
          field: Array.isArray(issue.path) && issue.path[0] ? String(issue.path[0]) : 'unknown',
          message: issue.message
        }))
      }, { status: 400 })
    }

    const data = validation.data!

    // Check if vacancy exists
    const existingVacancy = await db.vacancy.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    })
    if (!existingVacancy) {
      return notFound('Vacancy not found')
    }

    // Check if user has permission to update this vacancy
    const isOwner = existingVacancy.project!.ownerId === currentUser.id

    if (!isOwner) {
      return forbidden('You do not have permission to update this vacancy')
    }

    // Build update data
    const updateData: any = {}

    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.type !== undefined) updateData.type = data.type
    if (data.skills !== undefined) updateData.skills = data.skills.join(',') || null
    if (data.slots !== undefined) updateData.slots = data.slots
    if (data.filled !== undefined) updateData.filled = data.filled
    if (data.responsibilities !== undefined) updateData.responsibilities = data.responsibilities || null
    if (data.requirements !== undefined) updateData.requirements = data.requirements || null
    if (data.expertise !== undefined) updateData.expertise = data.expertise || null
    if (data.salaryMin !== undefined) updateData.salaryMin = data.salaryMin
    if (data.salaryMax !== undefined) updateData.salaryMax = data.salaryMax
    if (data.location !== undefined) updateData.location = data.location
    if (data.experience !== undefined) updateData.experience = data.experience

    const updatedVacancy = await db.vacancy.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return successResponse(updatedVacancy, 'Vacancy updated successfully')
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Update vacancy error:', error)
    return errorResponse('Failed to update vacancy')
  }
}

/**
 * DELETE /api/vacancies/[id] - Delete a vacancy
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
    const { id } = await params

    // Check if vacancy exists
    const existingVacancy = await db.vacancy.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            ownerId: true,
          },
        },
      },
    })
    if (!existingVacancy) {
      return notFound('Vacancy not found')
    }

    // Check if user has permission to delete this vacancy
    const isOwner = existingVacancy.project!.ownerId === currentUser.id

    if (!isOwner) {
      return forbidden('You do not have permission to delete this vacancy')
    }

    await db.vacancy.delete({
      where: { id },
    })

    return successResponse({ id }, 'Vacancy deleted successfully')
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Delete vacancy error:', error)
    return errorResponse('Failed to delete vacancy')
  }
}
