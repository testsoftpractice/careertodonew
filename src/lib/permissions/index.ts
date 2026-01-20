import { db } from '@/lib/db'

// Role hierarchies
export const BUSINESS_ROLE_HIERARCHY: Record<string, number> = {
  OWNER: 5,
  ADMIN: 4,
  HR_MANAGER: 3,
  PROJECT_MANAGER: 3,
  TEAM_LEAD: 2,
  RECRUITER: 2,
  TEAM_MEMBER: 1,
  VIEWER: 0,
}

export const PROJECT_ROLE_HIERARCHY: Record<string, number> = {
  OWNER: 5,
  PROJECT_MANAGER: 4,
  TEAM_LEAD: 3,
  TEAM_MEMBER: 2,
  VIEWER: 1,
}

// Business permissions
export const BUSINESS_ROLE_PERMISSIONS: Record<string, string[]> = {
  OWNER: ['*'], // Can do everything
  ADMIN: [
    'manage_business',
    'manage_members',
    'post_jobs',
    'manage_projects',
    'view_analytics',
    'invite_members',
  ],
  HR_MANAGER: [
    'post_jobs',
    'view_candidates',
    'invite_members',
    'manage_team',
    'view_analytics',
  ],
  PROJECT_MANAGER: [
    'manage_projects',
    'create_projects',
    'assign_tasks',
    'manage_team',
    'view_project_analytics',
  ],
  TEAM_LEAD: [
    'manage_team',
    'assign_tasks',
    'view_tasks',
    'update_tasks',
  ],
  RECRUITER: [
    'post_jobs',
    'view_candidates',
    'review_applications',
  ],
  TEAM_MEMBER: [
    'view_projects',
    'view_tasks',
    'update_own_tasks',
  ],
  VIEWER: ['view_only'],
}

// Project permissions
export const PROJECT_ROLE_PERMISSIONS: Record<string, string[]> = {
  OWNER: ['*'],
  PROJECT_MANAGER: [
    'manage_project',
    'create_tasks',
    'assign_tasks',
    'manage_members',
    'update_milestones',
  ],
  TEAM_LEAD: [
    'create_tasks',
    'assign_tasks',
    'update_tasks',
    'view_analytics',
  ],
  TEAM_MEMBER: [
    'view_tasks',
    'update_own_tasks',
    'comment_tasks',
  ],
  VIEWER: ['view_only'],
}

// Helper: Get user's role in a business
export async function getUserBusinessRole(userId: string, businessId: string): Promise<string | null> {
  const business = await db.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true },
  })

  if (!business) return null

  // Owner has OWNER role
  if (business.ownerId === userId) {
    return 'OWNER'
  }

  // Check member roles
  const member = await db.businessMember.findUnique({
    where: {
      businessId_userId: {
        businessId,
        userId,
      },
    },
    select: { role: true },
  })

  return member?.role || null
}

// Helper: Get user's role in a project
export async function getUserProjectRole(userId: string, projectId: string): Promise<string | null> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) return null

  // Owner has OWNER role
  if (project.ownerId === userId) {
    return 'OWNER'
  }

  // Check member roles
  const member = await db.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
    select: { role: true },
  })

  return member?.role || null
}

// Helper: Check if user has higher or equal role in business
export function hasHigherBusinessRole(userRole: string, targetRole: string): boolean {
  const userLevel = BUSINESS_ROLE_HIERARCHY[userRole] || 0
  const targetLevel = BUSINESS_ROLE_HIERARCHY[targetRole] || 0
  return userLevel >= targetLevel
}

// Helper: Check if user has higher or equal role in project
export function hasHigherProjectRole(userRole: string, targetRole: string): boolean {
  const userLevel = PROJECT_ROLE_HIERARCHY[userRole] || 0
  const targetLevel = PROJECT_ROLE_HIERARCHY[targetRole] || 0
  return userLevel >= targetLevel
}

// Helper: Check if user has specific permission in business
export async function hasBusinessPermission(
  userId: string,
  businessId: string,
  permission: string
): Promise<boolean> {
  const userRole = await getUserBusinessRole(userId, businessId)

  if (!userRole) return false

  const permissions = BUSINESS_ROLE_PERMISSIONS[userRole] || []

  // Wildcard access
  if (permissions.includes('*')) return true

  return permissions.includes(permission)
}

// Helper: Check if user has specific permission in project
export async function hasProjectPermission(
  userId: string,
  projectId: string,
  permission: string
): Promise<boolean> {
  const userRole = await getUserProjectRole(userId, projectId)

  if (!userRole) return false

  const permissions = PROJECT_ROLE_PERMISSIONS[userRole] || []

  // Wildcard access
  if (permissions.includes('*')) return true

  return permissions.includes(permission)
}

// Helper: Check if user can manage business (general)
export async function canManageBusiness(
  userId: string,
  businessId: string,
  requiredRoles: string[] = ['OWNER', 'ADMIN']
): Promise<boolean> {
  const userRole = await getUserBusinessRole(userId, businessId)

  if (!userRole) return false

  // Owner can do everything
  if (userRole === 'OWNER') return true

  // Check if user's role meets requirements
  const requiredLevel = Math.max(...requiredRoles.map(role => BUSINESS_ROLE_HIERARCHY[role] || 0))
  const userLevel = BUSINESS_ROLE_HIERARCHY[userRole] || 0

  return userLevel >= requiredLevel
}

// Helper: Check if user can manage project (general)
export async function canManageProject(
  userId: string,
  projectId: string,
  requiredRoles: string[] = ['OWNER', 'PROJECT_MANAGER']
): Promise<boolean> {
  const userRole = await getUserProjectRole(userId, projectId)

  if (!userRole) return false

  // Owner can do everything
  if (userRole === 'OWNER') return true

  // Check if user's role meets requirements
  const requiredLevel = Math.max(...requiredRoles.map(role => PROJECT_ROLE_HIERARCHY[role] || 0))
  const userLevel = PROJECT_ROLE_HIERARCHY[userRole] || 0

  return userLevel >= requiredLevel
}

// Helper: Check if user can assign task in project
export async function canAssignTask(userId: string, projectId: string): Promise<boolean> {
  const userRole = await getUserProjectRole(userId, projectId)

  if (!userRole) return false

  return ['OWNER', 'PROJECT_MANAGER', 'TEAM_LEAD'].includes(userRole)
}

// Helper: Check if user can post job for business
export async function canPostJob(userId: string, businessId: string): Promise<boolean> {
  const userRole = await getUserBusinessRole(userId, businessId)

  if (!userRole) return false

  return ['OWNER', 'ADMIN', 'HR_MANAGER', 'RECRUITER'].includes(userRole)
}

// Helper: Check if user can manage members in business
export async function canManageMembers(userId: string, businessId: string): Promise<boolean> {
  const userRole = await getUserBusinessRole(userId, businessId)

  if (!userRole) return false

  return ['OWNER', 'ADMIN', 'HR_MANAGER'].includes(userRole)
}

// Helper: Get all accessible businesses for user
export async function getUserAccessibleBusinesses(userId: string, userPlatformRole?: string) {
  // Platform admins can access all businesses
  if (userPlatformRole === 'PLATFORM_ADMIN') {
    return db.business.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
            jobs: true,
          },
        },
      },
    })
  }

  // Get businesses owned by user
  const ownedBusinesses = await db.business.findMany({
    where: { ownerId: userId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          members: true,
          projects: true,
          jobs: true,
        },
      },
    },
  })

  // Get businesses where user is a member
  const memberBusinesses = await db.businessMember.findMany({
    where: { userId },
    include: {
      business: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              members: true,
              projects: true,
              jobs: true,
            },
          },
        },
      },
    },
  })

  // Combine and deduplicate
  const allBusinesses = [
    ...ownedBusinesses.map(b => ({ ...b, myRole: 'OWNER' })),
    ...memberBusinesses.map(m => ({ ...m.business, myRole: m.role })),
  ]

  return allBusinesses
}
