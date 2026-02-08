import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/employer/jobs - Get employer's job postings
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const user = auth.user
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'all'
  const limit = parseInt(searchParams.get('limit') || '50')

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const jobs = await db.job.findMany({
      where: {
        userId: user.id,
        ...(status !== 'all' ? { status: status as any } : {})
      },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    const jobIds = (jobs || []).map(j => j.id)

    const jobApplications = await db.jobApplication.findMany({
      where: { jobId: { in: jobIds } }
    })

    // Create a map of jobId -> applications
    const applicationsByJob = new Map()
    jobApplications.forEach(app => {
      if (!applicationsByJob.has(app.jobId)) {
        applicationsByJob.set(app.jobId, [])
      }
      applicationsByJob.get(app.jobId).push(app)
    })

    // Calculate stats
    const totalActive = (jobs || []).filter(j => j.published).length
    const totalApplications = jobApplications?.length || 0
    const totalViews = (jobs || []).reduce((sum, j) => sum + (j.views || 0), 0)

    // Transform to job posting format
    const jobPostings = (jobs || []).map(job => {
      const jobApps = applicationsByJob.get(job.id) || []
      const hiredCount = jobApps.filter(a => a.status === 'ACCEPTED').length

      return {
        id: job.id,
        title: job.title,
        description: job.description || '',
        location: job.location || 'Remote',
        type: job.employmentType || job.type || 'FULL_TIME',
        status: job.status,
        applications: jobApps.length,
        hired: hiredCount,
        views: job.views || 0,
        postedDate: job.publishedAt || job.createdAt
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
  } catch (error) {
    console.error('Get job postings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
