import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/jobs/[id]/apply - Apply to a job
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId } = body

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

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
  } catch (error: any) {
    console.error('Apply to job error:', error)
    if (error.message === 'Already applied to this job') {
      return NextResponse.json(
        { success: false, error: 'You have already applied to this job' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
