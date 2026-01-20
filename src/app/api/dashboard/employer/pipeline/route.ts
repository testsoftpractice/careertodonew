import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/employer/pipeline - Get employer's hiring pipeline
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
      select: { id: true },
      take: 10
    })

    const jobIds = jobs.map(j => j.id)

    // Get job applications
    const applications = await db.jobApplication.findMany({
      where: {
        jobId: { in: jobIds }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate pipeline stages
    const pending = applications.filter(a => a.status === 'PENDING').length
    const review = applications.filter(a => a.status === 'REVIEW').length
    const interview = applications.filter(a => a.status === 'INTERVIEW').length
    const offer = applications.filter(a => a.status === 'OFFER').length
    const closed = applications.filter(a => a.status === 'ACCEPTED').length

    const totalCandidates = applications.length
    const avgTimeToHire = 14 // Mock days
    const offerAcceptanceRate = applications.length > 0 ? ((closed / (offer + closed)) * 100) : 80

    const stages = [
      { name: 'Applied', count: pending, percentage: totalCandidates > 0 ? (pending / totalCandidates) * 100 : 0, avgTime: '1 day' },
      { name: 'Screening', count: review, percentage: totalCandidates > 0 ? (review / totalCandidates) * 100 : 0, avgTime: '2 days' },
      { name: 'Interview', count: interview, percentage: totalCandidates > 0 ? (interview / totalCandidates) * 100 : 0, avgTime: '5 days' },
      { name: 'Offer', count: offer, percentage: totalCandidates > 0 ? (offer / totalCandidates) * 100 : 0, avgTime: '3 days' },
      { name: 'Hired', count: closed, percentage: totalCandidates > 0 ? (closed / totalCandidates) * 100 : 0, avgTime: '1 day' }
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
  } catch (error: any) {
    console.error('Get pipeline error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pipeline' },
      { status: 500 }
    )
  }
}
