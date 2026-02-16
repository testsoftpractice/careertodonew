// User roles
export const UserRole = {
  STUDENT: 'STUDENT',
  UNIVERSITY_ADMIN: 'UNIVERSITY_ADMIN',
  EMPLOYER: 'EMPLOYER',
  INVESTOR: 'INVESTOR',
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// Verification status
export const VerificationStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const

export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus]

// Task status
export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

// Task priority
export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority]

// Project status
export const ProjectStatus = {
  IDEA: 'IDEA',
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]

// Project stage
export const ProjectStage = {
  IDEA: 'IDEA',
  VALIDATION: 'VALIDATION',
  DEVELOPMENT: 'DEVELOPMENT',
  TESTING: 'TESTING',
  LAUNCH: 'LAUNCH',
  SCALING: 'SCALING',
} as const

export type ProjectStage = (typeof ProjectStage)[keyof typeof ProjectStage]

// Job status
export const JobStatus = {
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  FILLED: 'FILLED',
} as const

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus]

// Investment status
export const InvestmentStatus = {
  INTERESTED: 'INTERESTED',
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  AGREED: 'AGREED',
  FUNDED: 'FUNDED',
} as const

export type InvestmentStatus = (typeof InvestmentStatus)[keyof typeof InvestmentStatus]

// Collaboration type
export const CollaborationType = {
  PROJECT: 'PROJECT',
  PARTNERSHIP: 'PARTNERSHIP',
  MENTORSHIP: 'MENTORSHIP',
  NETWORKING: 'NETWORKING',
} as const

export type CollaborationType = (typeof CollaborationType)[keyof typeof CollaborationType]

// Collaboration status
export const CollaborationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type CollaborationStatus = (typeof CollaborationStatus)[keyof typeof CollaborationStatus]

// Rating type
export const RatingType = {
  SKILL: 'SKILL',
  PERFORMANCE: 'PERFORMANCE',
  LEADERSHIP: 'LEADERSHIP',
  COLLABORATION: 'COLLABORATION',
  COMMUNICATION: 'COMMUNICATION',
} as const

export type RatingType = (typeof RatingType)[keyof typeof RatingType]

// University verification status
export const UniversityVerificationStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const

export type UniversityVerificationStatus = (typeof UniversityVerificationStatus)[keyof typeof UniversityVerificationStatus]

// Job approval status
export const JobApprovalStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const

export type JobApprovalStatus = (typeof JobApprovalStatus)[keyof typeof JobApprovalStatus]

// Project approval status
export const ProjectApprovalStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
} as const

export type ProjectApprovalStatus = (typeof ProjectApprovalStatus)[keyof typeof ProjectApprovalStatus]
