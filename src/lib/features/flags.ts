/**
 * Feature Flags System
 *
 * Allows gradual rollout of new features without breaking existing functionality
 * Features can be enabled/disabled per environment or per user group
 */

export type FeatureFlag =
  // Phase 1: Student Enhancements
  | 'PROJECT_LIFECYCLE'
  | 'TASK_MANAGEMENT'
  | 'PROJECT_ROLES'
  | 'STAGE_MANAGEMENT'

  // Phase 2: University Integrations
  | 'UNIVERSITY_DASHBOARD'
  | 'STUDENT_TAGGING'
  | 'GOVERNANCE_APPROVAL'

  // Phase 3: Investor Enhancements
  | 'INVESTMENT_MARKETPLACE'
  | 'PROPOSAL_SYSTEM'
  | 'DEAL_FLOW'

  // Phase 4: Supplier Marketplace
  | 'SUPPLIER_MARKETPLACE'
  | 'NEED_BOARD'

  // Phase 5: Employer Enhancements
  | 'CANDIDATE_MARKETPLACE'
  | 'EMPLOYER_VERIFICATION'
  | 'JOB_POSTING'

  // Phase 6: Admin Features
  | 'AUDIT_LOGGING'
  | 'ADVANCED_ANALYTICS'
  | 'DISPUTE_RESOLUTION';

// Export feature flag constants for easy import
export const PROJECT_LIFECYCLE = 'PROJECT_LIFECYCLE';
export const TASK_MANAGEMENT = 'TASK_MANAGEMENT';
export const PROJECT_ROLES = 'PROJECT_ROLES';
export const STAGE_MANAGEMENT = 'STAGE_MANAGEMENT';
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
  rolloutPercentage?: number; // Percentage of users to enable for (0-100)
  minUserRole?: 'STUDENT' | 'EMPLOYER' | 'INVESTOR' | 'UNIVERSITY_ADMIN' | 'PLATFORM_ADMIN';
}

/**
 * Central feature flag configuration
 * Update these to enable/disable features across the platform
 */
export const FEATURE_FLAGS: Record<FeatureFlag, FeatureFlagConfig> = {
  // Phase 1: Student Enhancements
  PROJECT_LIFECYCLE: {
    enabled: true,
    description: 'Project lifecycle stages (Idea → Draft → Approved → Active → Completed)',
    rolloutPercentage: 100, // Roll out to all users immediately
  },
  TASK_MANAGEMENT: {
    enabled: true,
    description: 'Advanced task management with dependencies, priorities, and time tracking',
    rolloutPercentage: 100,
  },
  PROJECT_ROLES: {
    enabled: true,
    description: 'Project roles with permissions (Project Lead, Contributor, Reviewer, Guest)',
    rolloutPercentage: 100,
  },
  STAGE_MANAGEMENT: {
    enabled: true,
    description: 'Stage management with templates and gate requirements',
    rolloutPercentage: 100,
  },

  // Phase 2: University Integrations
  UNIVERSITY_DASHBOARD: {
    enabled: true,
    description: 'University dashboard with student analytics and activity feeds',
    rolloutPercentage: 50, // Start with 50% of universities
    minUserRole: 'UNIVERSITY_ADMIN',
  },
  STUDENT_TAGGING: {
    enabled: true,
    description: 'Allow universities to tag students to their institution',
    rolloutPercentage: 50,
    minUserRole: 'UNIVERSITY_ADMIN',
  },
  GOVERNANCE_APPROVAL: {
    enabled: true,
    description: 'Governance proposal workflow (submit → review → approve/reject)',
    rolloutPercentage: 50,
    minUserRole: 'UNIVERSITY_ADMIN',
  },
  
  // Phase 3: Investor Enhancements
  INVESTMENT_MARKETPLACE: {
    enabled: true,
    description: 'Enhanced investment marketplace with filters and deal tracking',
    rolloutPercentage: 100,
  },
  PROPOSAL_SYSTEM: {
    enabled: true,
    description: 'Investment proposal submission and tracking system',
    rolloutPercentage: 100,
  },
  DEAL_FLOW: {
    enabled: true,
    description: 'Deal tracking from interest to term sheet to closing',
    rolloutPercentage: 100,
  },
  
  // Phase 4: Supplier Marketplace
  SUPPLIER_MARKETPLACE: {
    enabled: true,
    description: 'Supplier marketplace for universities to browse and post needs',
    rolloutPercentage: 50, // Start with 50% of universities
    minUserRole: 'UNIVERSITY_ADMIN',
  },
  NEED_BOARD: {
    enabled: true,
    description: 'University needs board for suppliers to post service requests',
    rolloutPercentage: 50,
    minUserRole: 'UNIVERSITY_ADMIN',
  },
  
  // Phase 5: Employer Enhancements
  CANDIDATE_MARKETPLACE: {
    enabled: true,
    description: 'Talent marketplace for employers to browse and connect with students',
    rolloutPercentage: 100,
  },
  EMPLOYER_VERIFICATION: {
    enabled: true,
    description: 'Employer verification and employee rating system',
    rolloutPercentage: 100,
  },
  JOB_POSTING: {
    enabled: true,
    description: 'Job posting and candidate management system',
    rolloutPercentage: 100,
  },
  
  // Phase 6: Admin Features
  AUDIT_LOGGING: {
    enabled: true,
    description: 'System audit logging for all actions across the platform',
    rolloutPercentage: 100,
    minUserRole: 'PLATFORM_ADMIN',
  },
  ADVANCED_ANALYTICS: {
    enabled: true,
    description: 'Advanced analytics dashboards with export capabilities',
    rolloutPercentage: 100,
    minUserRole: 'PLATFORM_ADMIN',
  },
  DISPUTE_RESOLUTION: {
    enabled: true,
    description: 'Structured dispute resolution workflow with evidence gathering',
    rolloutPercentage: 100,
    minUserRole: 'PLATFORM_ADMIN',
  },
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag].enabled;
}

/**
 * Check if a feature is enabled for a specific user role
 */
export function isFeatureEnabledForRole(flag: FeatureFlag, userRole: string): boolean {
  const featureConfig = FEATURE_FLAGS[flag];
  
  // If no role restriction, use enabled status
  if (!featureConfig.minUserRole) {
    return featureConfig.enabled;
  }
  
  // Check if user's role meets the minimum requirement
  const roleHierarchy: Record<string, number> = {
    'STUDENT': 1,
    'EMPLOYER': 2,
    'INVESTOR': 3,
    'UNIVERSITY_ADMIN': 4,
    'PLATFORM_ADMIN': 5,
  };
  
  const minRoleLevel = roleHierarchy[featureConfig.minUserRole!] || 0;
  const userRoleLevel = roleHierarchy[userRole] || 0;
  
  return featureConfig.enabled && userRoleLevel >= minRoleLevel;
}

/**
 * Get all features enabled for a specific user
 */
export function getEnabledFeaturesForUser(userRole: string): FeatureFlag[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, config]) => {
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
    })
    .map(([flag]) => flag as FeatureFlag);
}

/**
 * Check if a feature should be visible in the UI
 * Takes into account rollout percentage (A/B testing)
 */
export function isFeatureVisible(flag: FeatureFlag, userId?: string): boolean {
  const config = FEATURE_FLAGS[flag];
  
  if (!config.enabled) return false;
  if (config.rolloutPercentage === undefined || config.rolloutPercentage === 100) {
    return true;
  }
  
  // Simple hash-based rollout (can be enhanced with real A/B testing system)
  if (!userId) return false;
  
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const percentage = (hash % 100) + 1;
  
  return percentage <= config.rolloutPercentage!;
}

/**
 * Get feature configuration for debugging/logging
 */
export function getFeatureConfig(flag: FeatureFlag): FeatureFlagConfig {
  return FEATURE_FLAGS[flag];
}

/**
 * Get all active features
 */
export function getAllActiveFeatures(): FeatureFlag[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, config]) => config.enabled)
    .map(([flag]) => flag as FeatureFlag);
}

/**
 * Enable or disable a feature at runtime (for admin use)
 */
export function setFeatureEnabled(flag: FeatureFlag, enabled: boolean): void {
  if (FEATURE_FLAGS[flag]) {
    FEATURE_FLAGS[flag].enabled = enabled;
  }
}
