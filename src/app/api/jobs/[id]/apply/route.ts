import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/verify'

// POST /api/jobs/[id]/apply - Apply to a job
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user - use their ID, not from request body
    const authResult = await requireAuth(request)
    const userId = authResult.dbUser.id // Use authenticated user's ID
    const { id } = await params

    // Create application and award points in a transaction
    const result = await db.$transaction(async (tx) => {
      // Check if already applied
      const existingApplication = await tx.jobApplication.findFirst({
        where: {
          jobId: id,
          userId,
        },
      })

      if (existingApplication) {
        throw new Error('Already applied to this job')
      }

      // Get job title for notifications
      const job = await tx.job.findUnique({
        where: { id },
        select: { title: true },
      })

      // Create application
      const application = await tx.jobApplication.create({
        data: {
          jobId: id,
          userId,
          status: 'PENDING',
        },
      })

      // Award points for job application
      try {
        await tx.pointTransaction.create({
          data: {
            userId: userId,
            points: 5, // JOB_APPLICATION points
            source: 'JOB_APPLICATION',
            description: `Applied to job: ${job?.title || 'Job'}`,
            metadata: JSON.stringify({
              jobId: id,
              jobTitle: job?.title || 'Job',
            }),
          }
        })

        // Update user's total points
        await tx.user.update({
          where: { id: userId },
          data: {
            totalPoints: {
              increment: 5,
            },
          },
        })
      } catch (pointsError) {
        console.error('Failed to award points for job application:', pointsError)
        // Continue even if points awarding fails
      }

      return application
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        data: result,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (error instanceof Error && error.message === 'Already applied to this job') {
      return NextResponse.json(
        { success: false, error: 'You have already applied to this job' },
        { status: 400 }
      )
    }
    console.error('Apply to job error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
