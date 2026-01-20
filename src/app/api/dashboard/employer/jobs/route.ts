import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/employer/jobs - Get employer's job postings
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get employer's jobs
    const jobs = await db.job.findMany({
      where: {
        employerId: decoded.userId
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Get job applications count
    const jobIds = jobs.map(j => j.id)
    const applications = await db.jobApplication.findMany({
      where: {
        jobId: { in: jobIds }
      }
    })

    // Calculate stats
    const totalActive = jobs.filter(j => j.status === 'ACTIVE').length
    const totalApplications = applications.length
    const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0)

    // Transform to job posting format
    const jobPostings = jobs.map(job => {
      const jobApplications = applications.filter(a => a.jobId === job.id)
      const status = job.status === 'ACTIVE' ? 'active' as const :
                   job.status === 'CLOSED' ? 'closed' as const :
                   'draft' as const

      return {
        id: job.id,
        title: job.title,
        department: job.department || 'General',
        location: job.location || 'Remote',
        type: job.type || 'full_time' as const,
        status,
        applications: jobApplications.length,
        views: job.views || 0,
        postedDate: job.createdAt,
        deadline: job.deadline,
        budget: job.salary
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        jobs: jobPostings,
        totalActive,
        totalApplications,
        totalViews
      }
    })
  } catch (error: any) {
    console.error('Get job postings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job postings' },
      { status: 500 }
    )
  }
}
