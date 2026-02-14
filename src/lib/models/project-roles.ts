/**
 * Project Roles Model
 * Handles role management and permissions within projects
 */

export enum ProjectRole {
  CONTRIBUTOR = 'CONTRIBUTOR',
  SENIOR_CONTRIBUTOR = 'SENIOR_CONTRIBUTOR',
  JUNIOR_CONTRIBUTOR = 'JUNIOR_CONTRIBUTOR',
  TEAM_LEAD = 'TEAM_LEAD',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  PROJECT_LEAD = 'PROJECT_LEAD',
  TECHNICAL_LEAD = 'TECHNICAL_LEAD',
  DESIGN_LEAD = 'DESIGN_LEAD',
  MARKETING_LEAD = 'MARKETING_LEAD',
  FINANCE_LEAD = 'FINANCE_LEAD',
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

const DEFAULT_PERMISSIONS: RolePermissions = {
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
}

export const ROLE_PERMISSIONS: Record<ProjectRole, RolePermissions> = {
  CONTRIBUTOR: {
    ...DEFAULT_PERMISSIONS,
    canCreateTasks: true,
    canViewAnalytics: true,
  },
  JUNIOR_CONTRIBUTOR: {
    ...DEFAULT_PERMISSIONS,
    canCreateTasks: true,
  },
  SENIOR_CONTRIBUTOR: {
    ...DEFAULT_PERMISSIONS,
    canEditProject: true,
    canCreateTasks: true,
    canApproveTasks: true,
  },
  TEAM_LEAD: {
    ...DEFAULT_PERMISSIONS,
    canManageTeam: true,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
    canInviteMembers: true,
    canRemoveMembers: true,
  },
  DEPARTMENT_HEAD: {
    ...DEFAULT_PERMISSIONS,
    canManageTeam: true,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canExportData: true,
  },
  PROJECT_LEAD: {
    ...DEFAULT_PERMISSIONS,
    canManageTeam: true,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
    canManageBudget: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canExportData: true,
  },
  TECHNICAL_LEAD: {
    ...DEFAULT_PERMISSIONS,
    canManageTeam: true,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
    canInviteMembers: true,
  },
  DESIGN_LEAD: {
    ...DEFAULT_PERMISSIONS,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
  },
  MARKETING_LEAD: {
    ...DEFAULT_PERMISSIONS,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canViewAnalytics: true,
  },
  FINANCE_LEAD: {
    ...DEFAULT_PERMISSIONS,
    canManageBudget: true,
    canViewAnalytics: true,
    canExportData: true,
  },
  MENTOR: {
    ...DEFAULT_PERMISSIONS,
    canApproveTasks: true,
    canViewAnalytics: true,
  },
  CO_LEAD: {
    ...DEFAULT_PERMISSIONS,
    canManageTeam: true,
    canEditProject: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canApproveTasks: true,
    canManageBudget: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canExportData: true,
  },
}

export function getRolePermissions(role: ProjectRole): RolePermissions {
  return ROLE_PERMISSIONS[role] || DEFAULT_PERMISSIONS
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

/**
 * Get available actions for a role
 */
export function getAvailableActions(role: ProjectRole, projectId: string): string[] {
  const permissions = getRolePermissions(role)
  const actions: string[] = []

  if (permissions.canManageTeam) actions.push('manage_team')
  if (permissions.canEditProject) actions.push('edit_project')
  if (permissions.canCreateTasks) actions.push('create_tasks')
  if (permissions.canAssignTasks) actions.push('assign_tasks')
  if (permissions.canApproveTasks) actions.push('approve_tasks')
  if (permissions.canManageBudget) actions.push('manage_budget')
  if (permissions.canInviteMembers) actions.push('invite_members')
  if (permissions.canRemoveMembers) actions.push('remove_members')
  if (permissions.canViewAnalytics) actions.push('view_analytics')
  if (permissions.canExportData) actions.push('export_data')

  return actions
}
