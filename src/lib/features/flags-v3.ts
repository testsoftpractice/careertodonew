/**
 * Feature Flags System - Modular Version
 * Supports 8 phases with independent modules
 */

export enum FeatureModule {
  STUDENT_ENHANCEMENTS = 'STUDENT_ENHANCEMENTS',
  PROJECT_LIFECYCLE = 'PROJECT_LIFECYCLE',
  TASK_MANAGEMENT = 'TASK_MANAGEMENT',
  PROJECT_ROLES = 'PROJECT_ROLES',
  UNIVERSITY_DASHBOARD = 'UNIVERSITY_DASHBOARD',
  STUDENT_TAGGING = 'STUDENT_TAGGING',
  GOVERNANCE_APPROVAL = 'GOVERNANCE_APPROVAL',
  INVESTMENT_MARKETPLACE = 'INVESTMENT_MARKETPLACE',
  PROPOSAL_SYSTEM = 'PROPOSAL_SYSTEM',
  DEAL_FLOW = 'DEAL_FLOW',
  SUPPLIER_MARKETPLACE = 'SUPPLIER_MARKETPLACE',
  NEED_BOARD = 'NEED_BOARD',
  CANDIDATE_MARKETPLACE = 'CANDIDATE_MARKETPLACE',
  EMPLOYER_VERIFICATION = 'EMPLOYER_VERIFICATION',
  JOB_POSTING = 'JOB_POSTING',
  AUDIT_LOGGING = 'AUDIT_LOGGING',
  ADVANCED_ANALYTICS = 'ADVANCED_ANALYTICS',
  DISPUTE_RESOLUTION = 'DISPUTE_RESOLUTION',
}

export interface FeatureConfig {
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  minUserRole?: 'STUDENT' | 'EMPLOYER' | 'INVESTOR' | 'UNIVERSITY_ADMIN' | 'PLATFORM_ADMIN';
}

/**
 * Student Enhancement Features (Phase 1)
 */
export const STUDENT_ENHANCEMENTS_CONFIG: FeatureConfig = {
  enabled: true,
  description: 'Project lifecycle stages (Idea → Draft → Approved → Active → Completed)',
  rolloutPercentage: 100,
}

/**
 * Task Management Features (Phase 1)
 */
export const TASK_MANAGEMENT_CONFIG: FeatureConfig = {
  enabled: true,
  description: 'Advanced task management with dependencies, priorities, time tracking, checklists',
  rolloutPercentage: 100,
}

/**
 * Project Roles Features (Phase 1)
 */
export const PROJECT_ROLES_CONFIG: FeatureConfig = {
  enabled: true,
  description: 'Project roles with permissions (Project Lead, Contributor, Reviewer, Guest)',
  rolloutPercentage: 100,
}

/**
 * University Integrations (Phase 2)
 */
export const UNIVERSITY_DASHBOARD_CONFIG: FeatureConfig = {
  enabled: true,
  description: 'University dashboard with student analytics and project insights',
  rolloutPercentage: 100,
}

/**
 * Student Tagging (Phase 2)
 */
export const STUDENT_TAGGING_CONFIG: FeatureConfig = {
  enabled: true,
  description: 'Allow universities to tag students to their institution',
  rolloutPercentage: 100,
}

/**
 * Governance Approval (Phase 2)
 */
export const GOVERNANCE_APPROVAL_CONFIG: FeatureConfig = {
  enabled: true,
  description: 'Governance approval workflow (submit, review, approve/reject governance proposals)',
  rolloutPercentage: 100,
}

// Helper functions
export function isFeatureEnabled(flag: FeatureModule): boolean {
  const config = FEATURE_FLAGS[flag];
  return config.enabled;
}

export function isFeatureEnabledForRole(flag: FeatureModule, userRole: string): boolean {
  const config = FEATURE_FLAGS[flag]
  if (!config.enabled) return false;
  if (!config.minUserRole) return true;

  const roleHierarchy: Record<string, number> = {
    'STUDENT': 1,
    'EMPLOYER': 2,
    'INVESTOR': 3,
    'UNIVERSITY_ADMIN': 4,
    'PLATFORM_ADMIN': 5,
  };

  const minRoleLevel = roleHierarchy[config.minUserRole!] || 0;
  const userRoleLevel = roleHierarchy[userRole] || 0;

  return userRoleLevel >= minRoleLevel;
}

export function getAllActiveFeatures(): FeatureModule[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, config]) => config.enabled)
    .map(([flag]) => flag as FeatureModule);
}

export function getAllFeaturesByPhase(): Record<number, FeatureModule[]> {
  const phases: Record<number, FeatureModule[]> = {
    1: [
      FeatureModule.STUDENT_ENHANCEMENTS,
      FeatureModule.TASK_MANAGEMENT,
      FeatureModule.PROJECT_ROLES,
    ],
    2: [
      FeatureModule.UNIVERSITY_DASHBOARD,
      FeatureModule.STUDENT_TAGGING,
      FeatureModule.GOVERNANCE_APPROVAL,
    ],
    3: [
      FeatureModule.INVESTMENT_MARKETPLACE,
      FeatureModule.PROPOSAL_SYSTEM,
      FeatureModule.DEAL_FLOW,
    ],
    4: [
      FeatureModule.SUPPLIER_MARKETPLACE,
      FeatureModule.NEED_BOARD,
    ],
    5: [
      FeatureModule.CANDIDATE_MARKETPLACE,
      FeatureModule.EMPLOYER_VERIFICATION,
      FeatureModule.JOB_POSTING,
    ],
    6: [
      FeatureModule.AUDIT_LOGGING,
      FeatureModule.ADVANCED_ANALYTICS,
      FeatureModule.DISPUTE_RESOLUTION,
    ],
  }
  return phases
}

export function getEnabledFeaturesForUser(userRole: string): FeatureModule[] {
  const roleHierarchy: Record<string, number> = {
    'STUDENT': 1,
    'EMPLOYER': 2,
    'INVESTOR': 3,
    'UNIVERSITY_ADMIN': 4,
    'PLATFORM_ADMIN': 5,
  };

  return Object.entries(FEATURE_FLAGS)
    .filter(([_, config]) => {
      if (!config.enabled) return false;
      if (!config.minUserRole) return true;
      
      const minRoleLevel = roleHierarchy[config.minUserRole!] || 0;
      const userRoleLevel = roleHierarchy[userRole] || 0;
      
      return userRoleLevel >= minRoleLevel;
    })
}

export function getFeatureConfig(flag: FeatureModule): FeatureConfig {
  return FEATURE_FLAGS[flag];
}

export function setFeatureEnabled(flag: FeatureModule, enabled: boolean): void {
  if (FEATURE_FLAGS[flag]) {
    FEATURE_FLAGS[flag].enabled = enabled;
  }
}

/**
 * All Feature Flags
 */
export const FEATURE_FLAGS: Record<FeatureModule, FeatureConfig> = {
  // Phase 1: Student Enhancements (Ready for use)
  STUDENT_ENHANCEMENTS: {
    enabled: true,
    description: 'Project lifecycle stages (Idea → Draft → Approved → Active → Completed)',
    rolloutPercentage: 100,
  },
  TASK_MANAGEMENT: {
    enabled: true,
    description: 'Advanced task management with dependencies, priorities, time tracking, checklists',
    rolloutPercentage: 100,
  },
  PROJECT_ROLES: {
    enabled: true,
    description: 'Project roles with permissions (Project Lead, Contributor, Reviewer, Guest)',
    rolloutPercentage: 100,
  },

  // Phase 2: University Integrations (New)
  UNIVERSITY_DASHBOARD: {
    enabled: true,
    description: 'University dashboard with student analytics and project insights',
    rolloutPercentage: 100,
  },
  STUDENT_TAGGING: {
    enabled: true,
    description: 'Allow universities to tag students to their institution (department, year level, major, concentration, skill tags)',
    rolloutPercentage: 100,
  },
  GOVERNANCE_APPROVAL: {
    enabled: true,
    description: 'Governance approval workflow (submit, review, approve/reject governance proposals)',
    rolloutPercentage: 100,
  },

  // Phase 3: Investor Enhancements (Not yet implemented)
  INVESTMENT_MARKETPLACE: {
    enabled: false,
    description: 'Enhanced investment marketplace with filters and deal tracking',
    rolloutPercentage: 0,
  },
  PROPOSAL_SYSTEM: {
    enabled: false,
    description: 'Investment proposal submission and tracking system',
    rolloutPercentage: 0,
  },
  DEAL_FLOW: {
    enabled: false,
    description: 'Deal tracking from interest to term sheet to closing',
    rolloutPercentage: 0,
  },

  // Phase 4: Supplier Marketplace (Not yet implemented)
  SUPPLIER_MARKETPLACE: {
    enabled: false,
    description: 'Supplier marketplace for universities to browse and post needs',
    rolloutPercentage: 0,
  },
  NEED_BOARD: {
    enabled: false,
    description: 'University needs board for suppliers to post service requests',
    rolloutPercentage: 0,
  },

  // Phase 5: Employer Enhancements (Not yet implemented)
  CANDIDATE_MARKETPLACE: {
    enabled: false,
    description: 'Talent marketplace for employers to browse and connect with students',
    rolloutPercentage: 0,
  },
  EMPLOYER_VERIFICATION: {
    enabled: false,
    description: 'Employer verification and employee rating system',
    rolloutPercentage: 0,
  },
  JOB_POSTING: {
    enabled: false,
    description: 'Job posting and candidate management system',
    rolloutPercentage: 0,
  },

  // Phase 6: Admin Features (Not yet implemented)
  AUDIT_LOGGING: {
    enabled: false,
    description: 'System audit logging for all actions across platform',
    rolloutPercentage: 0,
  },
  ADVANCED_ANALYTICS: {
    enabled: false,
    description: 'Advanced analytics dashboards with export capabilities',
    rolloutPercentage: 0,
  },
  DISPUTE_RESOLUTION: {
    enabled: false,
    description: 'Structured dispute resolution workflow with evidence gathering',
    rolloutPercentage: 0,
  },
};

export const ALL_FEATURES = [
  // Phase 1
  STUDENT_ENHANCEMENTS,
  TASK_MANAGEMENT,
  PROJECT_ROLES,

  // Phase 2
  UNIVERSITY_DASHBOARD,
  STUDENT_TAGGING,
  GOVERNANCE_APPROVAL,

  // Phase 3
  // INVESTMENT_MARKETPLACE,
  PROPOSAL_SYSTEM,
  DEAL_FLOW,

  // Phase 4
  // SUPPLIER_MARKETPLACE,
  NEED_BOARD,

  // Phase 5
  // CANDIDATE_MARKETPLACE,
  EMPLOYER_VERIFICATION,
  JOB_POSTING,

  // Phase 6
  // AUDIT_LOGGING,
  ADVANCED_ANALYTICS,
  DISPUTE_RESOLUTION,
] as FeatureModule[]
