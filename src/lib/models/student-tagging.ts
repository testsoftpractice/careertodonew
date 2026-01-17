/**
 * Student Tagging Model
 * Allow universities to tag students to their institution
 * Tags: Department, Year Level, Major, Concentration, Skill, Role
 */

export enum TagType {
  // Academic Tags
  MAJOR = 'MAJOR',
  CONCENTRATION = 'CONCENTRATION',
  YEAR_LEVEL = 'YEAR_LEVEL',
  DEPARTMENT = 'DEPARTMENT',
  FACULTY = 'FACULTY',
  ACADEMIC_PROGRAM = 'ACADEMIC_PROGRAM',
  
  // Skill Tags
  TECHNICAL_SKILL = 'TECHNICAL_SKILL',
  SOFT_SKILL = 'SOFT_SKILL',
  INDUSTRY_SKILL = 'INDUSTRY_SKILL',
  CERTIFICATION = 'CERTIFICATION',
  LANGUAGE = 'LANGUAGE',
  TOOL = 'TOOL',
  
  // Role/Position Tags
  PROJECT_ROLE = 'PROJECT_ROLE',
  LEADERSHIP_POSITION = 'LEADERSHIP_POSITION',
  TEAM_ROLE = 'TEAM_ROLE',
  
  // Achievement/Performance Tags
  AWARDS = 'AWARDS',
  BADGE = 'BADGE',
  CERTIFICATE = 'CERTIFICATE',
  ACCOMPLISHMENT = 'ACCOMPLISHMENT',
}

export enum TagApprovalStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum VerificationLevel {
  UNVERIFIED = 'UNVERIFIED',
  UNIVERSITY_VERIFIED = 'UNIVERSITY_VERIFIED',
  PLATFORM_VERIFIED = 'PLATFORM_VERIFIED',
}

export interface StudentTag {
  id: string;
  studentId: string;
  universityId: string;
  type: TagType;
  value: string;
  category?: string;
  
  // Academic Information
  department?: string;
  major?: string;
  concentration?: string;
  yearLevel?: string;
  academicProgram?: string;
  facultyAdvisor?: string;
  
  // Skill Information
  skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  certifications?: string[];
  languages?: string[];
  
  // Role Information
  projectRole?: string;
  leadershipPosition?: string;
  
  // Achievement Information
  badgeId?: string;
  earnedAt?: Date;
  expiresAt?: Date;
  
  // Approval Status
  status: TagApprovalStatus;
  verificationLevel: VerificationLevel;
  
  // Creator
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface StudentTagRequest {
  studentId: string;
  tags: {
    major?: string;
    concentration?: string;
    yearLevel?: string;
    department?: string;
    certifications?: string[];
    languages?: string[];
    skills?: {
      technical?: string[];
      soft?: string[];
      industry?: string[];
    };
  };
  message?: string;
}

export interface StudentTagUpdate {
  tagId: string;
  status?: TagApprovalStatus;
  verificationLevel?: VerificationLevel;
  category?: string;
  notes?: string;
}

export interface StudentTagProfile {
  studentId: string;
  universityId: string;
  studentName: string;
  email: string;
  
  // Academic Profile
  avatar?: string;
  department?: string;
  major?: string;
  concentration?: string;
  yearLevel?: string;
  academicProgram?: string;
  expectedGraduation?: Date;
  
  // Skill Profile
  tags: StudentTag[];
  
  // Achievements
  badges: string[];
  certificates: string[];
  awards: string[];
  
  // Performance Metrics
  totalXP: number;
  averageXP: number;
  rank: number;
  
  // Verification
  universityVerified: boolean;
  platformVerified: boolean;
  
  // Tags
  tagsByType: Record<TagType, StudentTag[]>;
  
  // Timeline
  firstTagDate: Date;
  lastTagDate: Date;
  
  // Created/Updated
  createdAt: Date;
  updatedAt: Date;
}

export interface TagStatistics {
  universityId: string;
  
  // By Tag Type
  byType: Record<TagType, number>;
  
  // By Department
  byDepartment: Record<string, number>;
  
  // By Year Level
  byYearLevel: Record<string, number>;
  
  // By Major
  byMajor: Record<string, number>;
  
  // Totals
  totalTags: number;
  approvedTags: number;
  pendingTags: number;
  rejectedTags: number;
  
  // Verification
  universityVerifiedTags: number;
  platformVerifiedTags: number;
}

export interface TaggingPermission {
  studentId: string;
  universityId: string;
  
  // Actions
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReject: boolean;
  
  // Restrictions
  maxTagsPerType: number;
  allowedTagTypes: TagType[];
  requiresApproval: boolean;
}

export interface StudentTaggingSettings {
  universityId: string;
  
  // Approval Workflow
  autoApprovalEnabled: boolean;
  autoApprovalCategories: TagType[];
  autoApprovalLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  
  // Tag Requirements
  requireFacultyVerification: boolean;
  requireProof: boolean;
  minTagsRequired: number;
  maxTagsAllowed: number;
  
  // Visibility
  showStudentNamesToPublic: boolean;
  showDepartmentTags: boolean;
  allowStudentSelfTagging: boolean;
  
  // Integration
  allowImportFromSIS: boolean;
  exportFormat: 'CSV' | 'JSON' | 'PDF';
}

/**
 * Helper function to check if a user can perform an action
 */
export function canPerformTagAction(
  user: { userRole: string; userId: string },
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'reject',
  permission: TaggingPermission
): boolean {
  const { canView, canCreate, canEdit, canDelete, canApprove, canReject } = permission

  switch (action) {
    case 'view':
      return canView
    case 'create':
      return canCreate
    case 'edit':
      return canEdit
    case 'delete':
      return canDelete
    case 'approve':
      return canApprove
    case 'reject':
      return canReject
    default:
      return false
  }
}

/**
 * Check if a tag is appropriate for student's profile
 */
export function isTagAppropriate(
  tag: StudentTag,
  studentYearLevel?: string,
  studentDepartment?: string
): boolean {
  // Academic tags are always appropriate
  if ([TagType.MAJOR, TagType.CONCENTRATION, TagType.YEAR_LEVEL, TagType.DEPARTMENT, TagType.FACULTY, TagType.ACADEMIC_PROGRAM].includes(tag.type)) {
    return true
  }
  
  // Skill tags
  if ([TagType.TECHNICAL_SKILL, TagType.SOFT_SKILL, TagType.INDUSTRY_SKILL, TagType.CERTIFICATION, TagType.LANGUAGE, TagType.TOOL].includes(tag.type)) {
    return true
  }
  
  // Role/position tags
  if ([TagType.PROJECT_ROLE, TagType.LEADERSHIP_POSITION, TagType.TEAM_ROLE].includes(tag.type)) {
    return true
  }
  
  // Achievement tags
  if ([TagType.AWARDS, TagType.BADGE, TagType.CERTIFICATE, TagType.ACCOMPLISHMENT].includes(tag.type)) {
    return true
  }
  
  return false
}

/**
 * Calculate tag complexity score
 */
export function calculateTagComplexity(tags: StudentTag[]): number {
  if (tags.length === 0) return 0
  
  let score = 0
  
  tags.forEach(tag => {
    switch (tag.type) {
      case TagType.MAJOR:
      case TagType.CONCENTRATION:
        score += 3
        break
      case TagType.YEAR_LEVEL:
        score += 2
        break
      case TagType.DEPARTMENT:
        score += 2
        break
      case TagType.MAJOR:
        score += 3
        break
      case TagType.TECHNICAL_SKILL:
      case TagType.SOFT_SKILL:
        score += 2
        break
      case TagType.CERTIFICATION:
        score += 4
        break
      default:
        score += 1
    }
  })
  
  return Math.round(score / tags.length)
}

/**
 * Get suggested tags based on student profile
 */
export function getSuggestedTags(student: {
  department?: string;
  major?: string;
  yearLevel?: string;
}): string[] {
  const suggestions: string[] = []
  
  // Based on department
  if (student.department) {
    switch (student.department.toLowerCase()) {
      case 'engineering':
        suggestions.push('Programming', 'Web Development', 'Software Architecture', 'Data Science', 'Machine Learning', 'DevOps')
        break
      case 'business':
        suggestions.push('Marketing', 'Business Development', 'Entrepreneurship', 'Finance', 'Accounting', 'Business Analytics')
        break
      case 'computer science':
        suggestions.push('AI/ML', 'Web Development', 'Software Engineering', 'Cloud Computing', 'Database Management')
        break
      case 'arts & humanities':
        suggestions.push('Design', 'Content Creation', 'Digital Media', 'Graphic Design', 'Journalism')
        break
      case 'sciences':
        suggestions.push('Research', 'Lab Work', 'Data Analysis', 'Scientific Computing', 'Biotechnology')
        break
      case 'medicine':
        suggestions.push('Clinical Research', 'Healthcare', 'Medical Technology', 'Pharmaceuticals', 'Biomedicine')
        break
      case 'law':
        suggestions.push('Legal Research', 'Corporate Law', 'International Law', 'Contract Law', 'Litigation')
        break
    }
  }
  
  // Based on year level
  if (student.yearLevel) {
    switch (student.yearLevel.toLowerCase()) {
      case 'freshman':
        suggestions.push('Introduction Courses', 'Basic Skills', 'Foundational Programming', 'Communication Skills')
        break
      case 'sophomore':
        suggestions.push('Intermediate Courses', 'Specialized Skills', 'Internship Ready', 'Project Experience')
        break
      case 'junior':
        suggestions.push('Advanced Courses', 'Leadership Roles', 'Industry Collaboration', 'Capstone Projects')
        break
      case 'senior':
        suggestions.push('Expert-Level Skills', 'Senior Project Management', 'Mentorship Roles', 'Industry Expert')
        break
      case 'graduate':
        suggestions.push('Professional Skills', 'Industry Ready', 'Leadership Experience', 'Professional Certifications')
        break
    }
  }
  
  // Remove duplicates
  return [...new Set(suggestions)]
}

/**
 * Validate student tags
 */
export function validateStudentTags(tags: StudentTag[]): {
  valid: StudentTag[];
  invalid: StudentTag[];
  duplicates: StudentTag[];
} {
  const seen = new Map<string, boolean>()
  const validTags: StudentTag[] = []
  const invalidTags: StudentTag[] = []
  const duplicates: StudentTag[] = []
  
  tags.forEach(tag => {
    const key = `${tag.studentId}-${tag.type}-${tag.value}`
    
    if (seen.has(key)) {
      duplicates.push(tag)
      return
    }
    
    seen.set(key, true)
    
    // Check if tag is appropriate
    if (isTagAppropriate(tag)) {
      validTags.push(tag)
    } else {
      invalidTags.push(tag)
    }
  })
  
  return { validTags, invalidTags, duplicates }
}

/**
 * Get tag statistics
 */
export function getTagStatistics(tags: StudentTag[]): TagStatistics {
  const byType: Record<TagType, number> = {}
  const approvedTags = tags.filter(t => t.status === 'APPROVED')
  const pendingTags = tags.filter(t => t.status === 'PENDING')
  const rejectedTags = tags.filter(t => t.status === 'REJECTED')
  
  tags.forEach(tag => {
    byType[tag.type] = (byType[tag.type] || 0) + 1
  })
  
  return {
    universityId: '', // Would be set by caller
    byType,
    approvedTags: approvedTags.length,
    pendingTags: pendingTags.length,
    rejectedTags: rejectedTags.length,
    totalTags: tags.length,
  }
}
