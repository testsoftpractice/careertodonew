import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== DASHBOARD API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined
    const role = searchParams.role as string | undefined

    if (!userId || !role) {
      return NextResponse.json({
        success: false,
        error: 'User ID and role are required'
      }, { status: 400 })
    }

    // Common data for all roles
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        university: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    const dashboardData: any = {
      user,
    }

    // STUDENT Dashboard
    if (role === 'STUDENT') {
      const myProjects = await db.projectMember.findMany({
        where: { userId },
        include: {
          project: {
            include: {
              tasks: {
                where: { assignedTo: userId },
                take: 5,
                orderBy: { dueDate: 'asc' }
              }
            }
          }
        }
      })

      const mySkills = await db.skill.findMany({
        where: { userId },
        orderBy: { level: 'desc' }
      })

      const myTimeEntries = await db.timeEntry.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 20
      })

      const myWorkSessions = await db.workSession.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        take: 10
      })

      const availableJobs = await db.job.findMany({
        where: {
          published: true,
        },
        take: 20,
        orderBy: { createdAt: 'desc' }
      })

      const myApplications = await db.jobApplication.findMany({
        where: { userId },
        include: {
          job: true
        },
        orderBy: { createdAt: 'desc' }
      })

      dashboardData.projects = myProjects
      dashboardData.skills = mySkills
      dashboardData.timeEntries = myTimeEntries
      dashboardData.workSessions = myWorkSessions
      dashboardData.availableJobs = availableJobs
      dashboardData.applications = myApplications
      dashboardData.stats = {
        totalProjects: myProjects.length,
        totalSkills: mySkills.length,
        totalHours: myTimeEntries.reduce((sum, entry) => sum + entry.hours, 0),
        applicationsPending: myApplications.filter(app => app.status === 'PENDING').length,
      }
    }

    // UNIVERSITY ADMIN Dashboard
    if (role === 'UNIVERSITY_ADMIN') {
      const university = await db.university.findUnique({
        where: { id: user.universityId }
      })

      const universityProjects = await db.project.findMany({
        where: {
          ownerId: user.id,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              major: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const universityStudents = await db.user.findMany({
        where: {
          universityId: user.universityId,
          role: 'STUDENT'
        },
        take: 50,
        orderBy: { createdAt: 'desc' }
      })

      dashboardData.university = university
      dashboardData.projects = universityProjects
      dashboardData.students = universityStudents
      dashboardData.stats = {
        totalProjects: universityProjects.length,
        totalStudents: universityStudents.length,
        activeProjects: universityProjects.filter(p => p.status === 'IN_PROGRESS').length,
      }
    }

    // EMPLOYER Dashboard
    if (role === 'EMPLOYER') {
      const postedJobs = await db.job.findMany({
        where: { userId },
        include: {
          _count: {
            applications: true
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const applications = await db.jobApplication.findMany({
        where: {
          job: {
            userId
          }
        } as any,
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              major: true,
              university: {
                select: {
                  name: true,
                  code: true,
                }
              }
            }
          },
          job: true
        },
        orderBy: { createdAt: 'desc' }
      })

      dashboardData.postedJobs = postedJobs
      dashboardData.applications = applications
      dashboardData.stats = {
        totalJobs: postedJobs.length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'PENDING').length,
        activeJobs: postedJobs.filter(j => j.published).length,
      }
    }

    // INVESTOR Dashboard
    if (role === 'INVESTOR') {
      const investments = await db.investment.findMany({
        where: { userId },
        include: {
          project: {
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const availableProjects = await db.project.findMany({
        where: {
          status: 'IN_PROGRESS'
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        take: 20,
        orderBy: { createdAt: 'desc' }
      })

      dashboardData.investments = investments
      dashboardData.availableProjects = availableProjects
      dashboardData.stats = {
        totalInvestments: investments.length,
        totalAmount: investments.reduce((sum, inv) => sum + inv.amount, 0),
        fundedProjects: investments.filter(inv => inv.status === 'COMPLETED').length,
      }
    }

    // PLATFORM ADMIN Dashboard
    if (role === 'PLATFORM_ADMIN') {
      const allUsers = await db.user.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' }
      })

      const allProjects = await db.project.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' }
      })

      const allUniversities = await db.university.findMany({
        orderBy: { totalProjects: 'desc' }
      })

      const recentJobs = await db.job.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' }
      })

      const recentInvestments = await db.investment.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' }
      })

      dashboardData.users = allUsers
      dashboardData.projects = allProjects
      dashboardData.universities = allUniversities
      dashboardData.jobs = recentJobs
      dashboardData.investments = recentInvestments
      dashboardData.stats = {
        totalUsers: allUsers.length,
        totalProjects: allProjects.length,
        totalUniversities: allUniversities.length,
        totalInvestments: recentInvestments.length,
      }
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard data'
    }, { status: 500 })
  }
}
