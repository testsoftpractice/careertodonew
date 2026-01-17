/**
 * Governance Approval Workflow Model
 * Handles university governance proposals, reviews, approvals, and rejections
 */

export enum ProposalType {
  PROJECT_APPROVAL = 'PROJECT_APPROVAL',
  CONTENT_REPORT = 'CONTENT_REPORT',
  DISPUTE_RESOLUTION = 'DISPUTE_RESOLUTION',
  POLICY_CHANGE = 'POLICY_CHANGE',
  BUDGET_ALLOCATION = 'BUDGET_ALLOCATION',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
}

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IMPLEMENTED = 'IMPLEMENTED',
  ARCHIVED = 'ARCHIVED',
}

export enum ApprovalPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum VotingMethod {
  MAJORITY_VOTE = 'MAJORITY_VOTE',
  UNIVERSITY_ADMIN_DECISION = 'UNIVERSITY_ADMIN_DECISION',
  BOARD_OF_REVIEWERS = 'BOARD_OF_REVIEWERS',
  CONSENSUS_BUILD = 'CONSENSUS_BUILD',
}

export interface GovernanceProposal {
  id: string;
  type: ProposalType;
  
  // Creator Info
  createdBy: string;
  creatorType: 'STUDENT' | 'UNIVERSITY_ADMIN' | 'PLATFORM_ADMIN';
  createdAt: Date;
  
  // Proposal Details
  title: string;
  description: string;
  category: string;
  
  // Status
  status: ProposalStatus;
  priority: ApprovalPriority;
  
  // Approval Process
  currentStage: 'SUBMITED' | 'UNDER_REVIEW' | 'REVIEWED' | 'FINAL_DECISION';
  reviewedBy: string[];
  reviewedAt: Date?;
  
  // Decision
  finalDecision: 'APPROVED' | 'REJECTED' | 'IMPLEMENTED' | 'ARCHIVED';
  decisionBy: string;
  decisionDate: Date?;
  decisionReason?: string;
  
  // Related Entities
  projectId?: string;
  projectTitle?: string;
  studentId?: string;
  studentName?: string;
  contentId?: string;
  contentTitle?: string;
  
  // Attachments
  attachments: string[];
  documents: string[];
  evidence: string[];
  
  // Voting
  votingMethod: VotingMethod;
  votesInFavor: number;
  votesAgainst: number;
  abstentions: number;
  votingClosedAt?: Date;
  
  // Implementation
  implementedBy: string;
  implementedAt: Date;
  completionPercentage: number;
  
  // Tracking
  views: number;
  supporters: string[];
  followers: string[];
}

export interface GovernanceProposalReview {
  id: string;
  proposalId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'UNIVERSITY_ADMIN' | 'BOARD_OF_REVIEWERS' | 'PLATFORM_ADMIN' | 'STUDENT_MENTOR';
  reviewType: 'INITIAL' | 'DETAILED' | 'FINAL';
  comments: string[];
  recommendation: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'WITHDRAW';
  submittedAt: Date;
  updatedAt?: Date;
}

export interface GovernanceApproval {
  id: string;
  proposalId: string;
  
  // Approver Info
  approvedBy: string;
  approverRole: 'UNIVERSITY_ADMIN' | 'PLATFORM_ADMIN';
  approvedAt: Date;
  
  // Decision
  decision: 'APPROVED' | 'REJECTED';
  conditions?: string[];
  implementationPlan?: string;
  timeline?: {
    startDate: Date;
    milestones: string[];
  completionDate: Date;
  };
  
  // Attachments
  approvalDocumentUrl?: string;
  implementationGuideUrl?: string;
}

export interface GovernanceAuditLog {
  id: string;
  action: 'CREATED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED' | 'ARCHIVED' | 'MODIFIED' | 'DELETED';
  entityType: 'PROPOSAL' | 'PROJECT' | 'STUDENT_TAG' | 'CONTENT' | 'USER' | 'SETTINGS';
  entityId: string;
  
  // User Info
  userId: string;
  userName: string;
  userRole: string;
  
  // Timestamps
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  
  // Details
  reason?: string;
  details?: {
    changes?: any;
    previousValue?: any;
    newValue?: any;
    error?: string;
  };
  
  // Related
  proposalId?: string;
  proposalTitle?: string;
}

export interface GovernanceWorkflow {
  id: string;
  name: string;
  description: string;
  
  // Stages
  stages: string[];
  activeStage: string;
  autoAdvance: boolean;
  
  // Approval Requirements
  minimumReviewers: number;
  requiredApprovals: 'UNIVERSITY_ADMIN' | 'BOARD_OF_REVIEWERS' | 'UNANIMOUS_VOTE';
  votingThreshold: number;
  timeLimit: number; // Days to move to next stage
  
  // Decisions
  requireUnanimous: boolean;
  allowOverrule: boolean;
  escalationEnabled: boolean;
  
  // Notifications
  notifyCreator: boolean;
  notifyStakeholders: boolean;
  
  // Audit Trail
  enableAuditLogging: boolean;
  retainHistoryFor: number; // Months
}

export interface UniversityGovernanceSettings {
  universityId: string;
  
  // Workflow Configuration
  enabled: boolean;
  workflowId: string;
  
  // Approval Settings
  requireProposalSubmission: boolean;
  minimumReviewDays: number;
  autoApproveAfter: number; // Days without action
  defaultPriority: ApprovalPriority;
  
  // Voting Settings
  votingMethod: VotingMethod;
  requireMinimumQuorum: number;
  quorumPercentage: number;
  allowAbstain: boolean;
  
  // Governance Settings
  boardOfReviewers: string[]; // User IDs
  anonymousVoting: boolean;
  publicDecisionTransparency: boolean;
  
  // Notification Settings
  enableNotifications: boolean;
  notificationChannels: string[];
  
  // Audit Settings
  enableAuditLogging: boolean;
  auditLogRetention: number; // Months
  requireApprovalForDeletions: boolean;
}

export interface GovernanceAlert {
  id: string;
  universityId: string;
  
  // Alert Info
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Details
  title: string;
  message: string;
  details?: string;
  
  // Related Entity
  entityType: 'PROPOSAL' | 'PROJECT' | 'STUDENT_TAG' | 'USER' | 'SETTING' | 'UNIVERSITY';
  entityId?: string;
  
  // Resolution
  actionRequired?: string;
  actionUrl?: string;
  
  // Tracking
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  
  // Notification
  shouldNotifyCreator: boolean;
  shouldNotifyAdmins: boolean;
}

export interface GovernanceSettings {
  universityId: string;
  
  // Workflow Settings
  workflowId: string;
  enabled: boolean;
  requireProjectLeads: boolean;
  requireUniversityAdmin: boolean;
  
  // Approval Settings
  requireApprovalFor: {
    newProjects: boolean;
    contentReports: boolean;
    studentTags: boolean;
    disputes: boolean;
    policyChanges: boolean;
  };
  
  // Voting Settings
  votingEnabled: boolean;
  votingMethod: VotingMethod;
  requireQuorum: boolean;
  quorumPercentage: number;
  allowAbstain: boolean;
  
  // Notification Settings
  notificationsEnabled: boolean;
  notificationEmails: string[];
  notificationWebhooks: string[];
  
  // Audit Settings
  auditEnabled: boolean;
  auditRetentionMonths: number;
  logAccess: 'ADMIN_ONLY' | 'ALL_ADMIN' | 'UNIVERSITY_ADMIN' | 'PUBLIC';
}

export interface GovernanceBoard {
  id: string;
  universityId: string;
  name: string;
  description: string;
  
  // Members
  memberIds: string[];
  chairId?: string;
  secretaryId?: string;
  
  // Responsibilities
  canReviewProposals: boolean;
  canApproveProposals: boolean;
  canRejectProposals: boolean;
  canReviewDisputes: boolean;
  canResolveDisputes: boolean;
  canCreateWorkflow: boolean;
  canModifySettings: boolean;
  
  // Terms
  terms: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Helper function to get approval chain
 */
export function getApprovalChain(proposal: GovernanceProposal): GovernanceProposalReview[] {
  // Build approval chain from proposal reviews
  // Not implemented in MVP - would track through database
  return []
}

/**
 * Check if a proposal is ready for voting
 */
export function isReadyForVoting(proposal: GovernanceProposal): boolean {
  return proposal.status === 'SUBMITED' &&
         (proposal.reviews?.length || 0) >= 2
}

/**
 * Check if proposal requires action
 */
export function requiresAction(proposal: GovernanceProposal): boolean {
  return proposal.status === 'UNDER_REVIEW' &&
         (!proposal.decisionBy || proposal.finalDecision === 'APPROVED')
}

/**
 * Get proposal priority
 */
export function getProposalPriority(proposal: GovernanceProposal): ApprovalPriority {
  switch (proposal.priority) {
    case ApprovalPriority.CRITICAL:
      return ApprovalPriority.CRITICAL
    case ApprovalPriority.HIGH:
      return ApprovalPriority.HIGH
    case ApprovalPriority.MEDIUM:
      return ApprovalPriority.MEDIUM
    case ApprovalPriority.LOW:
      return ApprovalPriority.LOW
    default:
      return ApprovalPriority.MEDIUM
  }
}

/**
 * Calculate quorum requirement
 */
export function calculateQuorum(proposal: GovernanceProposal, settings: UniversityGovernanceSettings): number {
  if (!settings.quorumPercentage) return 50 // Default 50%
  
  return Math.ceil((proposal.votesInFavor + proposal.votesAgainst + (proposal.abstentions || 0)) * (settings.quorumPercentage / 100))
}

/**
 * Check if quorum is met
 */
export function isQuorumMet(proposal: GovernanceProposal, settings: UniversityGovernanceSettings): boolean {
  const requiredVotes = calculateQuorum(proposal, settings)
  const totalVotes = proposal.votesInFavor + proposal.votesAgainst + (proposal.abstentions || 0)
  return totalVotes >= requiredVotes
}
