/**
 * Feature Flags System - All Phases Enabled
 * Comprehensive feature management for CareerToDo Platform
 */

export type FeatureFlag =
  // Phase 1: Student Enhancements
  | 'PROJECT_LIFECYCLE'
  | 'TASK_MANAGEMENT'
  | 'PROJECT_ROLES'

  // Phase 2: University Integrations
  | 'UNIVERSITY_DASHBOARD'
  | 'STUDENT_TAGGING'
  | 'GOVERNANCE_APPROVAL'

  // Phase 3: Investor Enhancements
  | 'INVESTMENT_MARKETPLACE'
  | 'PROPOSAL_SYSTEM'
  | 'DEAL_FLOW'

  // Phase 4: Supplier & Candidate Marketplaces
  | 'SUPPLIER_MARKETPLACE'
  | 'NEED_BOARD'
  | 'CANDIDATE_MARKETPLACE'

  // Phase 5: Employer Features
  | 'EMPLOYER_VERIFICATION'
  | 'JOB_POSTING'

  // Phase 6: Platform Features
  | 'AUDIT_LOGGING'
  | 'ADVANCED_ANALYTICS'
  | 'DISPUTE_RESOLUTION'

// Export feature flag constants for easy import
export const PROJECT_LIFECYCLE = 'PROJECT_LIFECYCLE';
export const TASK_MANAGEMENT = 'TASK_MANAGEMENT';
export const PROJECT_ROLES = 'PROJECT_ROLES';
export const UNIVERSITY_DASHBOARD = 'UNIVERSITY_DASHBOARD';
export const STUDENT_TAGGING = 'STUDENT_TAGGING';
export const GOVERNANCE_APPROVAL = 'GOVERNANCE_APPROVAL';
export const INVESTMENT_MARKETPLACE = 'INVESTMENT_MARKETPLACE';
export const PROPOSAL_SYSTEM = 'PROPOSAL_SYSTEM';
export const DEAL_FLOW = 'DEAL_FLOW';
export const SUPPLIER_MARKETPLACE = 'SUPPLIER_MARKETPLACE';
export const NEED_BOARD = 'NEED_BOARD';
export const CANDIDATE_MARKETPLACE = 'CANDIDATE_MARKETPLACE';
export const EMPLOYER_VERIFICATION = 'EMPLOYER_VERIFICATION';
export const JOB_POSTING = 'JOB_POSTING';
export const AUDIT_LOGGING = 'AUDIT_LOGGING';
export const ADVANCED_ANALYTICS = 'ADVANCED_ANALYTICS';
export const DISPUTE_RESOLUTION = 'DISPUTE_RESOLUTION';

export interface FeatureFlagConfig {
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  minUserRole?: 'STUDENT' | 'EMPLOYER' | 'INVESTOR' | 'UNIVERSITY_ADMIN' | 'PLATFORM_ADMIN';
}

export const FEATURE_FLAGS: Record<FeatureFlag, FeatureFlagConfig> = {
  // ========== PHASE 1: Student Enhancements ==========
  PROJECT_LIFECYCLE: {
    enabled: true,
    description: 'Complete project lifecycle management (proposed → active → completed)',
    rolloutPercentage: 100,
  },
  TASK_MANAGEMENT: {
    enabled: true,
    description: 'Advanced task management with dependencies, priorities, and subtasks',
    rolloutPercentage: 100,
  },
  PROJECT_ROLES: {
    enabled: true,
    description: 'Role-based project management (contributor, team lead, department head, etc.)',
    rolloutPercentage: 100,
  },

  // ========== PHASE 2: University Integrations ==========
  UNIVERSITY_DASHBOARD: {
    enabled: true,
    description: 'University dashboard with student analytics, activity feeds, and project insights',
    rolloutPercentage: 100,
  },
  STUDENT_TAGGING: {
    enabled: true,
    description: 'Allow universities to tag students to their institution (department, year level, major, skill tags)',
    rolloutPercentage: 100,
  },
  GOVERNANCE_APPROVAL: {
    enabled: true,
    description: 'Governance approval workflow (submit, review, approve/reject governance proposals)',
    rolloutPercentage: 100,
  },

  // ========== PHASE 3: Investor Enhancements ==========
  INVESTMENT_MARKETPLACE: {
    enabled: true,
    description: 'Investment marketplace for browsing and discovering student-led projects seeking funding',
    rolloutPercentage: 100,
    minUserRole: 'INVESTOR',
  },
  PROPOSAL_SYSTEM: {
    enabled: true,
    description: 'Investment proposal submission system with terms, equity, and negotiation support',
    rolloutPercentage: 100,
    minUserRole: 'INVESTOR',
  },
  DEAL_FLOW: {
    enabled: true,
    description: 'Deal flow management tracking proposals through under review, agreed, and funded stages',
    rolloutPercentage: 100,
    minUserRole: 'INVESTOR',
  },

  // ========== PHASE 4: Supplier & Candidate Marketplaces ==========
  SUPPLIER_MARKETPLACE: {
    enabled: true,
    description: 'Supplier marketplace for projects to find vendors, freelancers, and service providers',
    rolloutPercentage: 100,
  },
  NEED_BOARD: {
    enabled: true,
    description: 'Project needs board for posting requirements, resources, and collaboration opportunities',
    rolloutPercentage: 100,
  },
  CANDIDATE_MARKETPLACE: {
    enabled: true,
    description: 'Candidate marketplace connecting students with employment and internship opportunities',
    rolloutPercentage: 100,
    minUserRole: 'EMPLOYER',
  },

  // ========== PHASE 5: Employer Features ==========
  EMPLOYER_VERIFICATION: {
    enabled: true,
    description: 'Employer verification system for accessing and verifying student professional records',
    rolloutPercentage: 100,
    minUserRole: 'EMPLOYER',
  },
  JOB_POSTING: {
    enabled: true,
    description: 'Job posting system for employers to post full-time, part-time, and internship positions',
    rolloutPercentage: 100,
    minUserRole: 'EMPLOYER',
  },

  // ========== PHASE 6: Platform Features ==========
  AUDIT_LOGGING: {
    enabled: true,
    description: 'Comprehensive audit logging for all platform actions and data changes',
    rolloutPercentage: 100,
    minUserRole: 'PLATFORM_ADMIN',
  },
  ADVANCED_ANALYTICS: {
    enabled: true,
    description: 'Advanced analytics dashboards with charts, trends, and predictive insights',
    rolloutPercentage: 100,
    minUserRole: 'UNIVERSITY_ADMIN',
  },
  DISPUTE_RESOLUTION: {
    enabled: true,
    description: 'Dispute resolution system for conflicts, grievances, and mediated settlements',
    rolloutPercentage: 100,
  },
}

// Helper functions
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag]?.enabled || false
}

export function isFeatureEnabledForRole(flag: FeatureFlag, userRole: string): boolean {
  const config = FEATURE_FLAGS[flag]

  if (!config?.enabled) return false
  if (!config.minUserRole) return true

  const roleHierarchy: Record<string, number> = {
    'STUDENT': 1,
    'EMPLOYER': 2,
    'INVESTOR': 3,
    'UNIVERSITY_ADMIN': 4,
    'PLATFORM_ADMIN': 5,
  }

  const userRoleLevel = roleHierarchy[userRole] || 0
  const minRoleLevel = config.minUserRole ? roleHierarchy[config.minUserRole] || 0 : 0

  return userRoleLevel >= minRoleLevel
}

export function getEnabledFeaturesForUser(userRole: string): FeatureFlag[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, config]) => {
      if (!config?.enabled) return false
      if (!config.minUserRole) return true
      return isFeatureEnabledForRole(_ as FeatureFlag, userRole)
    })
    .map(([flag]) => flag as FeatureFlag)
}

export function isFeatureVisible(flag: FeatureFlag, userId?: string): boolean {
  const config = FEATURE_FLAGS[flag]

  if (!config?.enabled) return false

  if (config?.rolloutPercentage === undefined || config?.rolloutPercentage === 100) return true

  if (!userId) return true

  const hash = userId?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const percentage = (hash % 100) + 1

  return percentage <= (config?.rolloutPercentage || 100)
}

export function getFeatureConfig(flag: FeatureFlag): FeatureFlagConfig | null {
  return FEATURE_FLAGS[flag] || null
}

export function setFeatureEnabled(flag: FeatureFlag, enabled: boolean): void {
  if (FEATURE_FLAGS[flag]) {
    FEATURE_FLAGS[flag].enabled = enabled
  }
}

export function getFeaturesByPhase(phase: number): FeatureFlag[] {
  const phaseFeatures: Record<number, FeatureFlag[]> = {
    1: ['PROJECT_LIFECYCLE', 'TASK_MANAGEMENT', 'PROJECT_ROLES'],
    2: ['UNIVERSITY_DASHBOARD', 'STUDENT_TAGGING', 'GOVERNANCE_APPROVAL'],
    3: ['INVESTMENT_MARKETPLACE', 'PROPOSAL_SYSTEM', 'DEAL_FLOW'],
    4: ['SUPPLIER_MARKETPLACE', 'NEED_BOARD', 'CANDIDATE_MARKETPLACE'],
    5: ['EMPLOYER_VERIFICATION', 'JOB_POSTING'],
    6: ['AUDIT_LOGGING', 'ADVANCED_ANALYTICS', 'DISPUTE_RESOLUTION'],
  }

  return phaseFeatures[phase] || []
}
