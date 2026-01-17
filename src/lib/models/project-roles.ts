/**
 * Project Roles Model
 * Handles role management and permissions within projects
 */

export enum ProjectRole {
  CONTRIBUTOR = 'CONTRIBUTOR',
  SENIOR_CONTRIBUTOR = 'SENIOR_CONTRIBUTOR',
  TEAM_LEAD = 'TEAM_LEAD',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  PROJECT_LEAD = 'PROJECT_LEAD',
  MENTOR = 'MENTOR',
  CO_LEAD = 'CO_LEAD',
}

export interface RolePermissions {
  canManageTeam: boolean
  canEditProject: boolean
  canCreateTasks: boolean
  canAssignTasks: boolean
  canApproveTasks: boolean
  canManageBudget: boolean
  canInviteMembers: boolean
  canRemoveMembers: boolean
  canViewAnalytics: boolean
  canExportData: boolean
}

export const ROLE_PERMISSIONS: Record<ProjectRole, RolePermissions> = {
  CONTRIBUTOR: {
    canManageTeam: false,
    canEditProject: false,
    canCreateTasks: true,
    canAssignTasks: false,
    canApproveTasks: false,
    canManageBudget: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canViewAnalytics: true,
    canExportData: false,
  },
  SENIOR_CONTRIBUTOR: {
    canManageTeam: false,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: false,
    canApproveTasks: true,
    canManageBudget: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canViewAnalytics: true,
    canExportData: false,
  },
  TEAM_LEAD: {
    canManageTeam: true,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
    canManageBudget: false,
    canInviteMembers: true,
    canRemoveMembers: true,
    canViewAnalytics: true,
    canExportData: false,
  },
  DEPARTMENT_HEAD: {
    canManageTeam: true,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
    canManageBudget: false,
    canInviteMembers: true,
    canRemoveMembers: true,
    canViewAnalytics: true,
    canExportData: true,
  },
  PROJECT_LEAD: {
    canManageTeam: true,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
    canManageBudget: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canViewAnalytics: true,
    canExportData: true,
  },
  MENTOR: {
    canManageTeam: false,
    canEditProject: false,
    canCreateTasks: false,
    canAssignTasks: false,
    canApproveTasks: true,
    canManageBudget: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canViewAnalytics: true,
    canExportData: false,
  },
  CO_LEAD: {
    canManageTeam: true,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
    canManageBudget: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canViewAnalytics: true,
    canExportData: true,
  },
}

export function getRolePermissions(role: ProjectRole): RolePermissions {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.CONTRIBUTOR
}

export function hasPermission(
  role: ProjectRole,
  permission: keyof RolePermissions
): boolean {
  const permissions = getRolePermissions(role)
  return permissions[permission] || false
}

export function canPerformAction(
  role: ProjectRole,
  action: keyof RolePermissions
): boolean {
  return hasPermission(role, action)
}
