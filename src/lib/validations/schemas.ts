import { z } from 'zod'

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['STUDENT', 'UNIVERSITY', 'EMPLOYER', 'INVESTOR', 'PLATFORM_ADMIN']),
  bio: z.string().optional(),
  // Student specific fields
  universityId: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.string().optional(),
  // University specific fields
  universityName: z.string().optional(),
  universityCode: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  // Employer specific fields
  companyName: z.string().optional(),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  position: z.string().optional(),
  // Investor specific fields
  firmName: z.string().optional(),
  investmentFocus: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// User schemas
export const updateProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  major: z.string().optional(),
  graduationYear: z.coerce.number().min(2000).max(2030).optional(),
})

// Project schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['NEWS_MEDIA', 'E_COMMERCE', 'STARTUP', 'CONSULTING', 'MARKETING', 'RESEARCH', 'TAX_CONSULTING', 'OTHER']),
  projectLeadId: z.string().min(1, 'Project lead is required'),
  universityId: z.string().optional(),
  seekingInvestment: z.boolean().optional(),
  investmentGoal: z.coerce.number().min(0).optional(),
  startDate: z.string().optional(),
})

export const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['PROPOSED', 'APPROVED', 'RECRUITING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'TERMINATED']).optional(),
  hrLeadId: z.string().optional(),
  completionRate: z.coerce.number().min(0).max(100).optional(),
  seekingInvestment: z.boolean().optional(),
  investmentGoal: z.coerce.number().min(0).optional(),
  investmentRaised: z.coerce.number().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// Task schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  departmentId: z.string().optional(),
  assigneeId: z.string().optional(),
  creatorId: z.string().min(1, 'Creator ID is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().optional(),
  dependsOn: z.string().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'REJECTED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().optional(),
  deliverable: z.string().optional(),
  outputUrl: z.string().url().optional().or(z.literal('')),
  qualityScore: z.coerce.number().min(0).max(5).optional(),
  feedback: z.string().optional(),
})

// Rating schemas
export const createRatingSchema = z.object({
  raterId: z.string().min(1, 'Rater ID is required'),
  ratedId: z.string().min(1, 'Rated ID is required'),
  dimension: z.enum(['EXECUTION', 'COLLABORATION', 'LEADERSHIP', 'ETHICS', 'RELIABILITY']),
  source: z.enum(['PEER', 'LEAD', 'MENTOR', 'EMPLOYER']).optional(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  score: z.coerce.number().min(1).max(5),
  comment: z.string().max(500, 'Comment must be less than 500 characters').optional(),
})

// Professional Record schemas
export const createRecordSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['PROJECT_ROLE', 'LEADERSHIP', 'TASK_COMPLETION', 'SKILL_ACQUIRED', 'CERTIFICATION', 'ACHIEVEMENT', 'EMPLOYMENT']),
  title: z.string().min(1, 'Record title is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  projectId: z.string().optional(),
  roleName: z.string().optional(),
  department: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

// Verification Request schemas
export const createVerificationRequestSchema = z.object({
  requesterId: z.string().min(1, 'Requester ID is required'),
  subjectId: z.string().min(1, 'Subject ID is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  accessDuration: z.coerce.number().min(1).max(90).optional(),
})

export const updateVerificationRequestSchema = z.object({
  action: z.enum(['approve', 'reject', 'rate']),
  approvedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
  employerRating: z.coerce.number().min(1).max(5).optional(),
  employerComment: z.string().max(500, 'Comment must be less than 500 characters').optional(),
})

// Investment schemas
export const createInvestmentSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  investorId: z.string().min(1, 'Investor ID is required'),
  type: z.enum(['EQUITY', 'REVENUE_SHARE', 'CONVERTIBLE_NOTE', 'GRANT', 'PARTNERSHIP']),
  amount: z.coerce.number().min(0).optional(),
  equity: z.coerce.number().min(0).max(100).optional(),
  terms: z.record(z.string(), z.any()).optional(),
})

// University schemas
export const createUniversitySchema = z.object({
  name: z.string().min(1, 'University name is required'),
  code: z.string().min(1, 'University code is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  logo: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
})

// Leaderboard schemas
export const generateLeaderboardSchema = z.object({
  type: z.enum(['STUDENT', 'UNIVERSITY', 'PROJECT', 'TEAM', 'DEPARTMENT']),
  period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ALL_TIME']),
})

// Query parameter schemas
export const projectFilterSchema = z.object({
  status: z.enum(['all', 'PROPOSED', 'APPROVED', 'RECRUITING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'TERMINATED']).optional(),
  category: z.enum(['all', 'NEWS_MEDIA', 'E_COMMERCE', 'STARTUP', 'CONSULTING', 'MARKETING', 'RESEARCH', 'TAX_CONSULTING', 'OTHER']).optional(),
  universityId: z.string().optional(),
  userId: z.string().optional(),
  seekingInvestment: z.string().optional(),
})

export const taskFilterSchema = z.object({
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.enum(['all', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'REJECTED', 'CANCELLED']).optional(),
  priority: z.enum(['all', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  departmentId: z.string().optional(),
})

export const userFilterSchema = z.object({
  role: z.enum(['all', 'STUDENT', 'UNIVERSITY', 'EMPLOYER', 'INVESTOR', 'PLATFORM_ADMIN']).optional(),
  verificationStatus: z.enum(['all', 'PENDING', 'VERIFIED', 'REJECTED']).optional(),
  universityId: z.string().optional(),
  search: z.string().optional(),
})

export const leaderboardFilterSchema = z.object({
  type: z.enum(['STUDENT', 'UNIVERSITY', 'PROJECT', 'TEAM', 'DEPARTMENT']).optional(),
  period: z.enum(['all', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ALL_TIME']).optional(),
})

export const investmentFilterSchema = z.object({
  projectId: z.string().optional(),
  investorId: z.string().optional(),
  status: z.enum(['all', 'INTERESTED', 'UNDER_REVIEW', 'AGREEMENT_PENDING', 'AGREED', 'FUNDED', 'REJECTED', 'WITHDRAWN']).optional(),
  type: z.enum(['all', 'EQUITY', 'REVENUE_SHARE', 'CONVERTIBLE_NOTE', 'GRANT', 'PARTNERSHIP']).optional(),
})
