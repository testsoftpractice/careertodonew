import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders } from '@/lib/auth/jwt'
import { isValidUUID } from '@/lib/uuid-validation'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromHeaders(request.headers)
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - No token provided'
      }, { status: 401 })
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not configured')
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Invalid token'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined
    const role = searchParams.role as string | undefined

    // Validate userId format
    if (userId && !isValidUUID(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID format'
      }, { status: 400 })
    }

    // Verify that the token owner matches the requested userId
    if (userId && decoded.userId !== userId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Access denied'
      }, { status: 403 })
    }

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
      // Get my businesses
      const myBusinesses = await db.business.findMany({
        where: { founderId: userId },
        include: {
          university: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
          businessPlan: {
            select: {
              isApproved: true,
              approvedAt: true,
            }
          },
          employees: {
            include: {
              employee: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            },
            where: {
              isActive: true
            }
          },
          _count: {
            employees: true
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Get business applications
      const myApplications = await db.businessApplication.findMany({
        where: { applicantId: userId },
        include: {
          business: {
            include: {
              founder: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  university: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                    }
                  }
                }
              },
              university: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        },
        orderBy: { appliedAt: 'desc' }
      })

      // Get available businesses to join
      const availableBusinesses = await db.business.findMany({
        where: {
          status: 'APPROVED',
          universityId: user.universityId
        },
        include: {
          founder: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              major: true,
            }
          },
          _count: {
            employees: true
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      dashboardData.myBusinesses = myBusinesses
      dashboardData.businessApplications = myApplications
      dashboardData.availableBusinesses = availableBusinesses
      dashboardData.stats = {
        totalBusinesses: myBusinesses.length,
        approvedBusinesses: myBusinesses.filter(b => b.status === 'APPROVED').length,
        pendingApplications: myApplications.filter(a => a.status === 'PENDING').length,
        acceptedApplications: myApplications.filter(a => a.status === 'ACCEPTED').length,
        businessesWithOpenings: availableBusinesses.filter(b => b.employeesRecruited < b.teamSizeGoal).length,
      }
    }

    // UNIVERSITY ADMIN Dashboard
    if (role === 'UNIVERSITY_ADMIN') {
      if (!user.universityId) {
        return NextResponse.json({ dashboardData }, { status: 200 })
      }

      // Get university businesses awaiting approval
      const university = await db.university.findUnique({
        where: { id: user.universityId }
      })

      const pendingBusinesses = await db.business.findMany({
        where: {
          universityId: user.universityId,
          status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'REVISION_REQUIRED'] }
        },
        include: {
          founder: {
            select: {
              id: true,
              name: true,
              email: true,
              major: true,
              university: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          },
          businessPlan: {
            select: {
              isApproved: true,
              executiveSummary: true,
              marketAnalysis: true,
            }
          },
          applications: {
            where: { status: 'PENDING' },
            take: 20,
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
                      id: true,
                      name: true,
                      code: true,
                    }
                  }
                }
              }
            }
          },
        },
        orderBy: { submittedAt: 'desc' }
      })

      // Get approved businesses for this university
      const approvedBusinesses = await db.business.findMany({
        where: {
          universityId: user.universityId,
          status: 'APPROVED'
        },
        include: {
          founder: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            }
          },
          employees: {
            take: 5,
            include: {
              employee: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  university: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                    }
                  }
                }
              }
            }
          },
          _count: {
            employees: true
          }
        },
        orderBy: { approvedAt: 'desc' }
      })

      dashboardData.university = university
      dashboardData.pendingBusinesses = pendingBusinesses
      dashboardData.approvedBusinesses = approvedBusinesses
      dashboardData.stats = {
        totalPending: pendingBusinesses.length,
        totalApproved: approvedBusinesses.length,
        totalRevenue: approvedBusinesses.reduce((sum, b) => sum + (b.revenueGenerated || 0), 0),
        employeesPlaced: approvedBusinesses.reduce((sum, b) => sum + b.employeesRecruited, 0),
        studentsInvolved: approvedBusinesses.length,
      }
    }

    // EMPLOYER Dashboard (can post jobs for their businesses)
    if (role === 'EMPLOYER') {
      const myBusinesses = await db.business.findMany({
        where: {
          founderId: userId,
          status: { in: ['ACTIVE', 'PAUSED'] }
        },
        include: {
          businessPlan: {
            select: {
              isApproved: true
            }
          },
          employees: {
            include: {
              employee: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          },
          applications: {
            where: { status: 'PENDING' },
            take: 20,
            _count: {
              applications: true
            }
          },
          _count: {
            employees: true,
            applications: true,
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      dashboardData.myBusinesses = myBusinesses
      dashboardData.stats = {
        totalBusinesses: myBusinesses.length,
        activeBusinesses: myBusinesses.filter(b => b.status === 'ACTIVE').length,
        totalEmployees: myBusinesses.reduce((sum, b) => sum + (b.employeesRecruited || 0), 0),
        pendingApplications: myBusinesses.reduce((sum, b) => sum + b.applications?.length || 0, 0),
        totalRevenue: myBusinesses.reduce((sum, b) => sum + (b.revenueGenerated || 0), 0),
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
