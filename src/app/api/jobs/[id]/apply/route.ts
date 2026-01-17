import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/jobs/[id]/apply - Apply to a job
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { coverLetter, resumeUrl, portfolioUrl, linkedInUrl } = body

    // Mock validation (in production, verify user is authenticated)
    // Validate input
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

    // Create application (mock - in production, save to database)
    const application = {
      id: `app-${Date.now()}`,
      jobId: id,
      applicantId: 'user-mock', // In production, get from auth session
      coverLetter,
      resumeUrl,
      portfolioUrl: portfolioUrl || null,
      linkedInUrl: linkedInUrl || null,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        data: application,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Apply to job error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
