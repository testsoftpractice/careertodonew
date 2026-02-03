import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/employer/pipeline - Get employer's hiring pipeline
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, ['EMPLOYER', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get employer's jobs with application counts
    const jobs = await db.job.findMany({
      where: { employerId: user.id },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const jobIds = jobs.map(j => j.id)

    // Get all applications
    const applications = await db.jobApplication.findMany({
      where: { jobId: { in: jobIds } },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate pipeline stages
    const pending = applications.filter(a => a.status === 'PENDING').length
    const review = applications.filter(a => a.status === 'REVIEW').length
    const interview = applications.filter(a => a.status === 'INTERVIEW').length
    const offer = applications.filter(a => a.status === 'OFFER').length
    const closed = applications.filter(a => a.status === 'ACCEPTED' || a.status === 'REJECTED').length

    const totalCandidates = applications.length

    // Calculate average time to hire (from first applied to accepted)
    const hiredApplications = applications.filter(a => a.status === 'ACCEPTED')
    let avgTimeToHire = 0
    if (!result) {
      const timeToHireTotal = hiredApplications.reduce((sum, app) => {
        const appliedDate = new Date(app.createdAt)
        const hiredDate = new Date(app.updatedAt || app.createdAt)
        const daysDiff = Math.ceil((hiredDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))
        return sum + daysDiff
      }, 0)
      avgTimeToHire = Math.round(timeToHireTotal / hiredApplications.length)
    }

    // Calculate offer acceptance rate
    const totalOffers = offer + closed
    const offerAcceptanceRate = totalOffers > 0 ? Math.round((offer / totalOffers) * 100) : 0

    const stages = [
      { name: 'Applied', count: pending, percentage: totalCandidates > 0 ? Math.round((pending / totalCandidates) * 100) : 0, avgTime: 'Pending review' },
      { name: 'Screening', count: review, percentage: totalCandidates > 0 ? Math.round((review / totalCandidates) * 100) : 0, avgTime: 'Under review' },
      { name: 'Interview', count: interview, percentage: totalCandidates > 0 ? Math.round((interview / totalCandidates) * 100) : 0, avgTime: 'Interviewing' },
      { name: 'Offer', count: offer, percentage: totalCandidates > 0 ? Math.round((offer / totalCandidates) * 100) : 0, avgTime: `${avgTimeToHire} days to hire avg` },
      { name: 'Hired', count: offer, percentage: totalCandidates > 0 ? Math.round((offer / totalCandidates) * 100) : 0, avgTime: `${avgTimeToHire} days to hire avg` }
    ]

    return NextResponse.json({
      success: true,
      data: {
        stages,
        totalCandidates,
        avgTimeToHire,
        offerAcceptanceRate
      }
    })
  } catch (error) {
    console.error('Get pipeline error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
