import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/needs/[id]/apply - Apply to a need
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { message, resumeUrl, portfolioUrl } = body

    // Mock validation (in production, verify user is authenticated)
    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create application (mock - in production, save to database)
    const application = {
      id: `app-${Date.now()}`,
      needId: id,
      applicantId: 'user-mock', // In production, get from auth session
      message,
      resumeUrl: resumeUrl || null,
      portfolioUrl: portfolioUrl || null,
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
    console.error('Apply to need error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
