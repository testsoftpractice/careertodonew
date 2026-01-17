/**
 * Project Lifecycle Management
 * Handles project stages: Idea → Draft → Proposed → Approved → Recruiting → Active → Paused → Completed → Archived
 */

export enum ProjectStage {
  IDEA = 'IDEA',
  DRAFT = 'DRAFT',
  PROPOSED = 'PROPOSED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  RECRUITING = 'RECRUITING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
  COMPLETED = 'COMPLETED',
}

export interface ProjectLifecycle {
  id: string;
  projectId: string;
  currentStage: ProjectStage;
  previousStage?: ProjectStage;
  enteredAt: Date;
  enteredBy: string;
  notes?: string;
  stageData?: {
    // Stage-specific data
    approvalCriteria?: string[];
    rejectionReason?: string;
    recruitingGoals?: string[];
    completionMetrics?: {
      milestonesCompleted: number;
      totalMilestones: number;
      satisfactionScore: number;
    };
  };
  estimatedDuration?: number; // Days until next stage
  nextStage?: ProjectStage;
  requirements?: {
    // Requirements to move to next stage
    met: boolean[];
    pending: string[];
    blockers: string[];
  };
}

/**
 * Project Lifecycle Stage Gates
 * Define what must be completed to move between stages
 */
export interface ProjectStageGate {
  id: string;
  fromStage: ProjectStage;
  toStage: ProjectStage;
  requirements: string[];
  approvers: string[];
  autoAdvance?: boolean; // Can automatically advance if all requirements met
}

/**
 * Example Stage Gates
 */
export const PROJECT_STAGE_GATES: Record<ProjectStage, ProjectStageGate> = {
  IDEA_PROPOSED: {
    fromStage: ProjectStage.IDEA,
    toStage: ProjectStage.PROPOSED,
    requirements: [
      'Title defined',
      'Description written',
      'Category selected',
      'Team size estimated',
    ],
    approvers: ['projectLead', 'universityAdmin'],
    autoAdvance: false,
  },
  PROPOSED_UNDER_REVIEW: {
    fromStage: ProjectStage.PROPOSED,
    toStage: ProjectStage.UNDER_REVIEW,
    requirements: [
      'University review',
      'Risk assessment completed',
      'Budget estimates submitted',
    ],
    approvers: ['universityAdmin'],
    autoAdvance: false,
  },
  UNDER_REVIEW_APPROVED: {
    fromStage: ProjectStage.UNDER_REVIEW,
    toStage: ProjectStage.APPROVED,
    requirements: [
      'University approval',
      'Team minimum met',
    ],
    approvers: ['universityAdmin'],
    autoAdvance: false,
  },
  APPROVED_RECRUITING: {
    fromStage: ProjectStage.APPROVED,
    toStage: ProjectStage.RECRUITING,
    requirements: [
      'Project posted publicly',
      'First team member recruited',
    ],
    approvers: ['projectLead', 'universityAdmin'],
    autoAdvance: false,
  },
  RECRUITING_ACTIVE: {
    fromStage: ProjectStage.RECRUITING,
    toStage: ProjectStage.ACTIVE,
    requirements: [
      'Minimum team size reached',
      'Initial funding secured',
    ],
    approvers: ['projectLead'],
    autoAdvance: false,
  },
  ACTIVE_PAUSED: {
    fromStage: ProjectStage.ACTIVE,
    toStage: ProjectStage.PAUSED,
    requirements: [],
    approvers: ['projectLead'],
    autoAdvance: true,
  },
  PAUSED_ACTIVE: {
    fromStage: ProjectStage.PAUSED,
    toStage: ProjectStage.ACTIVE,
    requirements: [
      'Pause reason resolved',
      'Team availability confirmed',
    ],
    approvers: ['projectLead'],
    autoAdvance: true,
  },
  ACTIVE_COMPLETED: {
    fromStage: ProjectStage.ACTIVE,
    toStage: ProjectStage.COMPLETED,
    requirements: [
      'All milestones completed',
      'Final deliverable submitted',
    ],
    approvers: ['projectLead', 'universityAdmin'],
    autoAdvance: false,
  },
};
