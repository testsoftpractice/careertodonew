import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/suppliers/[id]/contact - Send a contact request to supplier
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { message, projectDetails, budget, timeline } = body

    // Mock validation (in production, verify user is authenticated)
    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create contact request (mock - in production, save to database and send email/notification)
    const contactRequest = {
      id: `contact-${Date.now()}`,
      supplierId: id,
      contactorId: 'user-mock', // In production, get from auth session
      message,
      projectDetails: projectDetails || null,
      budget: budget || null,
      timeline: timeline || null,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact request sent successfully',
        data: contactRequest,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Contact supplier error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
