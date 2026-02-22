import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buildJobVisibilityWhereClause } from '@/lib/visibility-controls'

// GET /api/jobs/[id] - Get a specific job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get user info for visibility control
    let userRole: string | null = null
    let authUserId: string | null = null

    // Try to get auth info if available
    try {
      const tokenCookie = request.cookies.get('token')
      const token = tokenCookie?.value
      if (token) {
        const { verifyToken } = await import('@/lib/auth/jwt')
        const decoded = verifyToken(token)
        authUserId = decoded.userId
        userRole = decoded.role
      }
    } catch (e) {
      // Not authenticated - that's fine, will show only approved jobs
    }

    const job = await db.job.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        Business: {
          select: {
            id: true,
            name: true,
            industry: true,
            location: true,
          },
        },
        JobApplication: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }

    // Check visibility
    const isVisible = 
      job.approvalStatus === 'APPROVED' ||
      job.userId === authUserId ||
      userRole === 'PLATFORM_ADMIN'

    if (!isVisible) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }

    // Parse metadata and add computed fields
    let metadata = {}
    try {
      metadata = job.metadata ? JSON.parse(job.metadata) : {}
    } catch (e) {
      console.error('Failed to parse job metadata:', e)
    }

    const parsedJob = {
      ...job,
      companyName: (metadata as any).companyName || job.Business?.name || 'Unknown Company',
      category: (metadata as any).category || null,
      positions: (metadata as any).positions || '1',
      requirements: (metadata as any).requirements || [],
      responsibilities: (metadata as any).responsibilities || [],
      benefits: (metadata as any).benefits || [],
      salaryRange: job.salaryMin && job.salaryMax 
        ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
        : job.salary || 'Not specified',
      applications: job.JobApplication?.length || 0,
      postedBy: job.User ? {
        id: job.User.id,
        name: job.User.name,
        email: job.User.email,
      } : null,
    }

    return NextResponse.json({
      success: true,
      data: { job: parsedJob },
    })
  } catch (error: any) {
    console.error('Get job error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
