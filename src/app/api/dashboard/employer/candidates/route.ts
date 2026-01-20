import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/employer/candidates - Get employer's candidate pool
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
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Calculate stats
    const totalApplications = applications.length
    const newApplications = applications.filter(a => a.status === 'PENDING').length
    const inReview = applications.filter(a => a.status === 'REVIEW').length
    const hired = applications.filter(a => a.status === 'ACCEPTED').length
    const avgMatchScore = applications.length > 0 ? 85 : 0 // Mock - would need real matching logic

    // Transform to candidate pool format
    const candidates = applications.map(app => ({
      id: app.id,
      candidate: {
        id: app.applicant.id,
        name: app.applicant.name,
        email: app.applicant.email,
        avatar: app.applicant.avatar
      },
      position: 'Position Title', // Mock - would need job relation
      status: app.status === 'ACCEPTED' ? 'hired' as const :
              app.status === 'REVIEW' ? 'interview' as const :
              'new' as const,
      appliedDate: app.createdAt,
      matchScore: avgMatchScore + Math.random() * 15,
      experience: Math.floor(Math.random() * 10),
      skills: ['Communication', 'Teamwork', 'Problem Solving'].slice(0, Math.floor(Math.random() * 3) + 1)
    }))

    return NextResponse.json({
      success: true,
      data: {
        applications: candidates,
        totalApplications,
        newApplications,
        inReview,
        hired,
        avgMatchScore
      }
    })
  } catch (error: any) {
    console.error('Get candidates error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch candidates' },
      { status: 500 }
    )
  }
}
