/**
 * Visibility Control System
 * Controls what content is visible to which users
 */

// Project visibility rules
export const PROJECT_VISIBILITY = {
  // Who can see projects with these approval statuses
  PENDING: ['owner', 'members', 'platform_admin', 'university_admin'],
  UNDER_REVIEW: ['owner', 'members', 'platform_admin', 'university_admin'],
  APPROVED: ['everyone'],
  REJECTED: ['owner', 'members', 'platform_admin', 'university_admin'],
  REQUIRE_CHANGES: ['owner', 'members', 'platform_admin', 'university_admin'],
}

// Job visibility rules
export const JOB_VISIBILITY = {
  DRAFT: ['owner', 'platform_admin'],
  PENDING: ['owner', 'platform_admin'],
  UNDER_REVIEW: ['owner', 'platform_admin'],
  APPROVED: ['everyone'],
  REJECTED: ['owner', 'platform_admin'],
  EXPIRED: ['everyone'], // Expired jobs are visible but marked as expired
}

// Helper to check if user can see a project
export function canUserSeeProject(
  project: any,
  userId: string | null,
  userRole: string | null,
  userUniversityId?: string | null
): boolean {
  const isOwner = project.ownerId === userId
  const isMember = project.members?.some((m: any) => m.userId === userId)
  const isAdmin = userRole === 'PLATFORM_ADMIN'
  const isUniversityAdmin = userRole === 'UNIVERSITY_ADMIN' && project.universityId === userUniversityId
  const statusVisibility = PROJECT_VISIBILITY[project.approvalStatus as keyof typeof PROJECT_VISIBILITY]

  if (isOwner || isMember || isAdmin || isUniversityAdmin) {
    return true
  }

  return statusVisibility?.includes('everyone') || false
}

// Helper to check if user can see a job
export function canUserSeeJob(
  job: any,
  userId: string | null,
  userRole: string | null
): boolean {
  const isOwner = job.userId === userId
  const isAdmin = userRole === 'PLATFORM_ADMIN'
  const statusVisibility = JOB_VISIBILITY[job.approvalStatus as keyof typeof JOB_VISIBILITY]

  if (isOwner || isAdmin) {
    return true
  }

  return statusVisibility?.includes('everyone') || false
}

// Helper to filter projects based on user permissions
export function filterProjectsByVisibility(
  projects: any[],
  userId: string | null,
  userRole: string | null
): any[] {
  return projects.filter(project => canUserSeeProject(project, userId, userRole))
}

// Helper to filter jobs based on user permissions
export function filterJobsByVisibility(
  jobs: any[],
  userId: string | null,
  userRole: string | null
): any[] {
  return jobs.filter(job => canUserSeeJob(job, userId, userRole))
}

// Helper to build Prisma where clause for visibility
export function buildProjectVisibilityWhereClause(
  userId: string | null,
  userRole: string | null,
  userUniversityId: string | null = null,
  additionalWhere?: any
): any {
  // Start with additional where conditions
  const where: any = { ...additionalWhere }

  // Platform admins see everything
  if (userRole === 'PLATFORM_ADMIN') {
    return where
  }

  // If not logged in, only show approved projects
  if (!userId) {
    where.approvalStatus = 'APPROVED'
    return where
  }

  // University admins can see approved projects or projects from their university
  if (userRole === 'UNIVERSITY_ADMIN') {
    where.OR = [
      { approvalStatus: 'APPROVED' },
      { universityId: userUniversityId },
      { ownerId: userId },
      {
        ProjectMember: {
          some: {
            userId: userId,
          },
        },
      },
    ]
    return where
  }

  // Logged in users can see approved projects or projects they're involved in
  where.OR = [
    { approvalStatus: 'APPROVED' },
    { ownerId: userId },
    {
      ProjectMember: {
        some: {
          userId: userId,
        },
      },
    },
  ]

  return where
}

// Helper to build Prisma where clause for job visibility
export function buildJobVisibilityWhereClause(
  userId: string | null,
  userRole: string | null,
  additionalWhere?: any
): any {
  // Start with additional where conditions
  const where: any = { ...additionalWhere }

  // Platform admins see everything
  if (userRole === 'PLATFORM_ADMIN') {
    return where
  }

  // If not logged in, only show approved jobs
  if (!userId) {
    where.approvalStatus = 'APPROVED'
    return where
  }

  // Logged in users can see approved jobs or their own jobs
  where.OR = [
    { approvalStatus: 'APPROVED' },
    { userId: userId },
  ]

  return where
}
