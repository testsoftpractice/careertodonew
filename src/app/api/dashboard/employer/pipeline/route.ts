import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, errorResponse } from '@/lib/api-response'
import { db } from '@/lib/db'

// GET /api/dashboard/employer/pipeline - Get employer's hiring pipeline
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized('Authentication required')
    }

    const user = authResult.user

    // Get employer's jobs
    const jobs = await db.job.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const jobIds = jobs.map(j => j.id)

    // Get all applications with user details
    const applications = await db.jobApplication.findMany({
      where: { jobId: { in: jobIds } },
      include: {
        job: {
          select: { id: true, title: true }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            major: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true
              }
            },
            totalPoints: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Map applications to pipeline format
    const pipelineData = applications.map(app => {
      let status = 'APPLIED'
      if (app.status === 'PENDING') status = 'APPLIED'
      else if (app.status === 'REVIEW') status = 'SCREENING'
      else if (app.status === 'INTERVIEW') status = 'INTERVIEW'
      else if (app.status === 'OFFER') status = 'OFFER'
      else if (app.status === 'ACCEPTED') status = 'HIRED'
      else if (app.status === 'REJECTED') status = 'REJECTED'

      return {
        id: app.id,
        candidate: {
          id: app.user.id,
          name: app.user.name,
          email: app.user.email,
          avatar: app.user.avatar,
          university: app.user.university,
          major: app.user.major,
          totalPoints: app.user.totalPoints || 0,
        },
        job: app.job,
        status: status,
        appliedDate: app.createdAt,
        updatedAt: app.updatedAt,
      }
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
    if (hiredApplications.length > 0) {
      const timeToHireTotal = (hiredApplications || []).reduce((sum, app) => {
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
      data: pipelineData,
      metadata: {
        stages,
        totalCandidates,
        avgTimeToHire,
        offerAcceptanceRate
      }
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get pipeline error:', error)
    return errorResponse('Failed to fetch hiring pipeline', 500)
  }
}
