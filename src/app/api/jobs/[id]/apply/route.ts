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
    const { applicantId, coverLetter, resumeUrl, portfolioUrl, linkedInUrl } = body

    // Validate input
    if (!applicantId) {
      return NextResponse.json(
        { success: false, error: 'Applicant ID is required' },
        { status: 400 }
      )
    }

    if (!coverLetter || coverLetter.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cover letter is required' },
        { status: 400 }
      )
    }

    if (!resumeUrl) {
      return NextResponse.json(
        { success: false, error: 'Resume URL is required' },
        { status: 400 }
      )
    }

    // Create application and award points in a transaction
    const result = await db.$transaction(async (tx) => {
      // Check if already applied
      const existingApplication = await tx.jobApplication.findFirst({
        where: {
          jobId: id,
          applicantId,
        },
      })

      if (existingApplication) {
        throw new Error('Already applied to this job')
      }

      // Create application
      const application = await tx.jobApplication.create({
        data: {
          jobId: id,
          applicantId,
          coverLetter,
          resumeUrl,
          portfolioUrl: portfolioUrl || null,
          linkedInUrl: linkedInUrl || null,
          status: 'PENDING',
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      })

      // Award points for job application
      try {
        await tx.pointTransaction.create({
          data: {
            userId: applicantId,
            points: 5, // JOB_APPLICATION points
            source: 'JOB_APPLICATION',
            description: `Applied to job: ${application.job.title}`,
            metadata: JSON.stringify({
              jobId: id,
              jobTitle: application.job.title,
            }),
          }
        })

        // Update user's total points
        await tx.user.update({
          where: { id: applicantId },
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
