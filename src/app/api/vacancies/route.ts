import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, validationError, forbidden, notFound } from '@/lib/api-response'
import { requireAuth } from '@/lib/auth/verify'
import { z } from 'zod'

const createVacancySchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP'], 'Invalid vacancy type'),
  skills: z.array(z.string()).default([]),
  slots: z.number().min(1, 'Slots must be at least 1'),
  filled: z.number().min(0, 'Filled must be at least 0').default(0),
})

// GET - Get vacancies for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.projectId as string | undefined

    if (!projectId) {
      return errorResponse('Project ID is required', 400)
    }

    const vacancies = await db.vacancy.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(vacancies)
  } catch (error) {
    console.error('Vacancies API error:', error)
    return errorResponse('Failed to fetch vacancies', 500)
  }
}

// POST - Create new vacancy
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    const body = await request.json()

    // Validate request body
    const validation = createVacancySchema.safeParse(body)

    if (!validation.success) {
      return validationError(validation.error.issues.map(issue => ({
        field: issue.path[0] || 'unknown',
        message: issue.message
      })))
    }

    const data = validation.data

    // Verify user is member of the project
    const member = await db.projectMember.findFirst({
      where: {
        projectId: data.projectId,
        userId: authResult.dbUser.id,
      },
    })

    if (!member) {
      return forbidden('You are not a member of this project')
    }

    // Create vacancy
    const vacancy = await db.vacancy.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        type: data.type,
        skills: data.skills.join(',') || null,
        slots: data.slots,
        filled: data.filled,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return successResponse(vacancy, 'Vacancy created successfully')
  } catch (error: any) {
    console.error('Create vacancy error:', error)

    // Handle AuthError - return proper JSON response
    if (error.name === 'AuthError' || error.statusCode) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }

    if (error.code === 'P2002') {
      return errorResponse('Project not found', 404)
    }
    if (error.code === 'P2003') {
      return errorResponse('Foreign key constraint failed', 400)
    }
    return errorResponse('Failed to create vacancy', 500)
  }
}

// DELETE - Delete vacancy
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.id as string | undefined

    if (!id) {
      return errorResponse('Vacancy ID is required', 400)
    }

    // Find vacancy
    const vacancy = await db.vacancy.findUnique({
      where: { id },
      include: {
        project: true
      }
    })

    if (!vacancy) {
      return notFound('Vacancy not found')
    }

    // Check if user is member of the project
    const member = await db.projectMember.findFirst({
      where: {
        projectId: vacancy.projectId,
        userId: authResult.dbUser.id,
      },
    })

    if (!member && authResult.dbUser.role !== 'ADMIN') {
      return forbidden('You are not a member of this project')
    }

    // Delete vacancy
    await db.vacancy.delete({
      where: { id }
    })

    return successResponse({ id }, 'Vacancy deleted successfully')
  } catch (error) {
    console.error('Delete vacancy error:', error)
    return errorResponse('Failed to delete vacancy', 500)
  }
}
