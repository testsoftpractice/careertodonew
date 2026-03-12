import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/admin/users/[id] - Get single user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id: userId } = await params

    // Get user with detailed information
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        University: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
            verificationStatus: true,
          },
        },
        Project: {
          where: {
            approvalStatus: { in: ['PENDING', 'UNDER_REVIEW', 'REQUIRE_CHANGES'] }
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            description: true,
            approvalStatus: true,
            createdAt: true,
            status: true,
          },
        },
        ProjectMember: {
          include: {
            Project: {
              select: {
                id: true,
                name: true,
                status: true,
                ownerId: true,
              }
            }
          }
        },
        TaskAssignee: {
          include: {
            Task: {
              select: {
                id: true,
                title: true,
                status: true,
                projectId: true,
              }
            }
          }
        },
        _count: {
          select: {
            Project: true,
            ProjectMember: true,
            JobApplication: true,
            Investment: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get task count and completion stats
    const projectIds = (user as any).Project?.map((p: any) => p.id) || []
    const allTasks = projectIds.length > 0
      ? await db.task.findMany({
          where: {
            projectId: { in: projectIds }
          },
          select: {
            id: true,
            status: true,
            projectId: true,
          }
        })
      : []

    const completedTasks = allTasks.filter(t => t.status === 'DONE').length
    const inProgressTasks = allTasks.filter(t => t.status === 'IN_PROGRESS').length
    const todoTasks = allTasks.filter(t => t.status === 'TODO').length

    // Determine project roles
    const ownedProjects = (user as any)._count?.Project || 0
    const participatingProjects = (user as any).ProjectMember || []
    const isProjectOwner = ownedProjects > 0
    const isProjectMember = participatingProjects.length > 0

    // Role-specific data
    let roleSpecificData: any = {}

    if (user.role === 'STUDENT') {
      const studentProjects = await db.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            {
              ProjectMember: {
                some: { userId }
              }
            }
          ]
        },
        select: {
          id: true,
          name: true,
          status: true,
          ownerId: true,
          _count: {
            select: {
              Task: true,
              ProjectMember: true
            }
          }
        }
      })

      roleSpecificData = {
        studentStats: {
          totalProjects: studentProjects.length,
          ownedProjects: studentProjects.filter(p => p.ownerId === userId).length,
          participatingProjects: studentProjects.filter(p => p.ownerId !== userId).length,
          totalTasks: allTasks.length,
          completedTasks,
          inProgressTasks,
          todoTasks,
          averageProjectProgress: studentProjects.length > 0
            ? Math.round(studentProjects.reduce((sum, p) => sum + (p._count?.Task || 0), 0) / studentProjects.length)
            : 0
        }
      }
    } else if (user.role === 'UNIVERSITY_ADMIN') {
      const universityProjects = user.universityId ? await db.project.findMany({
        where: {
          universityId: user.universityId
        },
        select: {
          id: true,
          name: true,
          status: true,
          approvalStatus: true,
          ownerId: true,
          createdAt: true,
          _count: {
            select: {
              Task: true,
              ProjectMember: true
            }
          }
        }
      }) : []

      const universityStudents = user.universityId ? await db.user.findMany({
        where: {
          universityId: user.universityId,
          role: 'STUDENT'
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              Project: true,
              ProjectMember: true
            }
          }
        },
        take: 20
      }) : []

      roleSpecificData = {
        universityStats: {
          totalProjects: universityProjects.length,
          approvedProjects: universityProjects.filter(p => p.approvalStatus === 'APPROVED').length,
          pendingProjects: universityProjects.filter(p => p.approvalStatus === 'PENDING').length,
          totalStudents: universityStudents.length,
          activeStudents: universityStudents.filter(s => (s._count?.Project || 0) + (s._count?.ProjectMember || 0) > 0).length,
          totalProjectTasks: universityProjects.reduce((sum, p) => sum + (p._count?.Task || 0), 0),
        },
        recentStudents: universityStudents.slice(0, 10)
      }
    } else if (user.role === 'EMPLOYER') {
      const employerProjects = await db.project.findMany({
        where: {
          ownerId: userId
        },
        select: {
          id: true,
          name: true,
          status: true,
          approvalStatus: true,
          createdAt: true,
          _count: {
            select: {
              Task: true,
              ProjectMember: true
            }
          }
        }
      })

      const employerVacancies = await db.vacancy.findMany({
        where: {
          Project: {
            ownerId: userId
          }
        },
        select: {
          id: true,
          title: true,
          slots: true,
          filled: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      roleSpecificData = {
        employerStats: {
          totalProjects: employerProjects.length,
          publishedProjects: employerProjects.filter(p => p.approvalStatus === 'APPROVED').length,
          totalVacancies: employerVacancies.length,
          filledPositions: employerVacancies.reduce((sum, v) => sum + (v.filled || 0), 0),
          totalPositions: employerVacancies.reduce((sum, v) => sum + (v.slots || 0), 0),
          totalProjectTasks: employerProjects.reduce((sum, p) => sum + (p._count?.Task || 0), 0),
        },
        recentVacancies: employerVacancies
      }
    } else if (user.role === 'INVESTOR') {
      const investments = await db.investment.findMany({
        where: {
          userId: userId
        },
        include: {
          Project: {
            select: {
              id: true,
              name: true,
              status: true,
              approvalStatus: true,
              ownerId: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      roleSpecificData = {
        investorStats: {
          totalInvestments: investments.length,
          totalInvestedAmount: investments.reduce((sum, inv) => sum + (inv.amount || 0), 0),
          investedProjects: investments.filter(i => i.Project).length,
          activeProjects: investments.filter(i => i.Project?.status === 'IN_PROGRESS').length,
          completedProjects: investments.filter(i => i.Project?.status === 'COMPLETED').length,
        },
        recentInvestments: investments.slice(0, 10)
      }
    } else if (user.role === 'PLATFORM_ADMIN') {
      const allProjects = await db.project.findMany({
        select: {
          id: true,
          name: true,
          status: true,
          approvalStatus: true,
          createdAt: true,
          _count: {
            select: {
              Task: true,
              ProjectMember: true
            }
          }
        },
        take: 100
      })

      const allUsers = await db.user.count()

      roleSpecificData = {
        platformStats: {
          totalProjects: allProjects.length,
          pendingApprovals: allProjects.filter(p => p.approvalStatus === 'PENDING').length,
          totalUsers: allUsers,
          totalTasks: allProjects.reduce((sum, p) => sum + (p._count?.Task || 0), 0),
        }
      }
    }

    // Transform user data
    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      mobileNumber: user.mobileNumber,
      major: user.major,
      graduationYear: user.graduationYear,
      bio: user.bio,
      location: user.location,
      linkedinUrl: user.linkedinUrl,
      portfolioUrl: user.portfolioUrl,
      avatar: user.avatar,
      university: (user as any).University,
      projects: (user as any).Project || [],
      projectRoles: {
        isProjectOwner: isProjectOwner,
        isProjectMember: isProjectMember,
        ownedProjectsCount: ownedProjects,
        participatingProjectsCount: participatingProjects.length,
        participatingProjectsList: participatingProjects.map((pm: any) => ({
          projectId: pm.projectId,
          projectName: pm.Project?.name,
          role: pm.role,
          isOwner: pm.Project?.ownerId === userId
        }))
      },
      taskStats: {
        totalTasks: allTasks.length,
        completedTasks,
        inProgressTasks,
        todoTasks,
        completionRate: allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0
      },
      stats: {
        projectsOwned: (user as any)._count?.Project || 0,
        projectsParticipating: (user as any)._count?.ProjectMember || 0,
        tasks: allTasks.length,
        jobApplications: (user as any)._count?.JobApplication || 0,
        investments: (user as any)._count?.Investment || 0,
        totalPoints: user.totalPoints,
        executionScore: user.executionScore,
        collaborationScore: user.collaborationScore,
        leadershipScore: user.leadershipScore,
        ethicsScore: user.ethicsScore,
        reliabilityScore: user.reliabilityScore,
      },
      roleSpecificData,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    }

    return NextResponse.json({
      success: true,
      data: transformedUser
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - Update user (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id: userId } = await params
    const body = await request.json()
    const { verificationStatus, role } = body

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {}

    if (verificationStatus) {
      updateData.verificationStatus = verificationStatus
    }

    if (role) {
      updateData.role = role
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData
    })

    // Create notification for the user
    if (verificationStatus) {
      await db.notification.create({
        data: {
          userId: userId,
          type: 'INFO',
          title: 'Account Status Updated',
          message: `Your account has been ${verificationStatus.toLowerCase()}`,
          link: '/dashboard'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    })
  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
