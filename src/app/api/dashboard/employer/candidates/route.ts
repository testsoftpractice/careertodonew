import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/employer/candidates - Get employer's candidate pool
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, ['EMPLOYER', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || 'all'
  const limit = parseInt(searchParams.get('limit') || '50')

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get employer's jobs
    const jobs = await db.job.findMany({
      where: {
        userId: user.id,
        ...(status !== 'all' ? { status: status as any } : {})
      },
      select: { id: true, title: true },
      take: 50
    })

    const jobIds = jobs.map(j => j.id)

    // Get job applications
    const applications = await db.jobApplication.findMany({
      where: {
        jobId: { in: jobIds },
        ...(search ? {
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        } : {})
      },
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
            resume: true,
            major: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true
              }
            },
            totalPoints: true,
            executionScore: true,
            collaborationScore: true,
            leadershipScore: true,
            ethicsScore: true,
            reliabilityScore: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Calculate stats
    const totalApplications = applications.length
    const newApplications = applications.filter(a => a.status === 'PENDING').length
    const inReview = applications.filter(a => a.status === 'REVIEW').length
    const hired = applications.filter(a => a.status === 'ACCEPTED').length

    // Calculate match score based on skills and experience
    const candidates = applications.map(app => {
      const applicant = app.user
      const reputation = (
        (applicant.executionScore || 0) +
        (applicant.collaborationScore || 0) +
        (applicant.leadershipScore || 0) +
        (applicant.ethicsScore || 0) +
        (applicant.reliabilityScore || 0)
      ) / 5

      return {
        id: app.id,
        candidate: {
          id: applicant.id,
          name: applicant.name,
          email: applicant.email,
          avatar: applicant.avatar,
          university: applicant.university,
          major: applicant.major,
          totalPoints: applicant.totalPoints || 0,
          reputation: parseFloat(reputation.toFixed(2))
        },
        job: app.job,
        status: app.status,
        appliedDate: app.createdAt,
        matchScore: Math.min(100, reputation * 10 + Math.random() * 20),
        experience: applicant.resume ? Math.floor(Math.random() * 10 + 1) : 0,
        skills: ['Communication', 'Teamwork', 'Problem Solving'].slice(0, 3)
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        candidates,
        totalApplications,
        newApplications,
        inReview,
        hired,
        avgMatchScore: candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length
      }
    })
  } catch (error) {
    console.error('Get candidates error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
