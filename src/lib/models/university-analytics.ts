/**
 * University Dashboard Analytics Model
 * Tracks university-wide metrics, student performance, and project insights
 */

export enum UniversityMetricType {
  TOTAL_STUDENTS = 'TOTAL_STUDENTS',
  ACTIVE_STUDENTS = 'ACTIVE_STUDENTS',
  VERIFIED_STUDENTS = 'VERIFIED_STUDENTS',
  TAGGED_STUDENTS = 'TAGGED_STUDENTS',
  TOTAL_PROJECTS = 'TOTAL_PROJECTS',
  ACTIVE_PROJECTS = 'ACTIVE_PROJECTS',
  APPROVED_PROJECTS = 'APPROVED_PROJECTS',
  PENDING_PROPOSALS = 'PENDING_PROPOSALS',
  COMPLETED_PROJECTS = 'COMPLETED_PROJECTS',
  TOTAL_INVESTMENTS = 'TOTAL_INVESTMENTS',
  INVESTMENT_VOLUME = 'INVESTMENT_VOLUME',
  RECRUITMENT_RATE = 'RECRUITMENT_RATE',
  SATISFACTION_SCORE = 'SATISFACTION_SCORE',
  RANKING_POSITION = 'RANKING_POSITION',
}

export enum DepartmentCategory {
  BUSINESS = 'Business',
  ENGINEERING = 'Engineering',
  ARTS_HUMANITIES = 'Arts & Humanities',
  SCIENCES = 'Sciences',
  MEDICINE = 'Medicine',
  LAW = 'Law',
  EDUCATION = 'Education',
  OTHER = 'Other',
}

export interface UniversityDashboardMetrics {
  universityId: string;
  
  // Student Metrics
  totalStudents: number;
  activeStudents: number;
  verifiedStudents: number;
  taggedStudents: number;
  
  // Project Metrics
  totalProjects: number;
  activeProjects: number;
  approvedProjects: number;
  completedProjects: number;
  pendingProposals: number;
  
  // Investment Metrics
  totalInvestments: number;
  investmentVolume: number;
  averageInvestmentAmount: number;
  successRate: number;
  
  // Rankings
  rankingPosition: number;
  rankingChange: number;
  
  // Engagement
  studentEngagementRate: number;
  projectCompletionRate: number;
  proposalAcceptanceRate: number;
  
  // Performance
  averageProjectQuality: number;
  averageStudentPerformance: number;
  overallSatisfactionScore: number;
  
  // Departments Performance
  departmentMetrics: {
    [category: string]: DepartmentMetric;
  };
}

export interface DepartmentMetric {
  department: string;
  category: DepartmentCategory;
  
  // Student Count
  totalStudents: number;
  activeStudents: number;
  taggedStudents: number;
  xpEarned: number;
  averageXP: number;
  
  // Project Count
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  
  // Performance
  averageProjectQuality: number;
  averageCompletionTime: number;
  studentSatisfactionScore: number;
}

export interface UniversityStudentInsight {
  studentId: string;
  studentName: string;
  universityId: string;
  department: string;
  yearLevel: string;
  major: string;
  concentration?: string;
  
  // Performance
  totalXP: number;
  averageXP: number;
  rank: number;
  
  // Projects
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  
  // Tags
  tags: string[];
  
  // Timestamps
  firstProjectDate: Date;
  lastActiveDate: Date;
  
  // Engagement
  engagementScore: number;
  participationRate: number;
}

export interface UniversityProjectInsight {
  projectId: string;
  projectTitle: string;
  universityId: string;
  projectLead: string;
  category: string;
  
  // Metrics
  totalMembers: number;
  activeMembers: number;
  totalTasks: number;
  completedTasks: number;
  
  // Performance
  taskCompletionRate: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  
  // Investment
  fundingAmount?: number;
  investorCount?: number;
  
  // Timeline
  startDate: Date;
  endDate: Date;
  durationDays: number;
}

export interface UniversityActivityFeedItem {
  id: string;
  type: 'PROJECT_CREATED' | 'PROJECT_APPROVED' | 'PROJECT_COMPLETED' | 'STUDENT_JOINED' | 'STUDENT_TAGGED' | 'INVESTMENT_RECEIVED' | 'GOVERNANCE_DECISION';
  timestamp: Date;
  
  // User Info
  userId: string;
  userName: string;
  userRole: string;
  
  // Related Entity
  projectId?: string;
  studentId?: string;
  proposalId?: string;
  
  // Details
  details: {
    projectTitle?: string;
    studentName?: string;
    tags?: string[];
    amount?: number;
    decision?: 'APPROVED' | 'REJECTED' | 'PENDING';
    reason?: string;
  };
}

export interface DepartmentInsight {
  department: string;
  category: DepartmentCategory;
  
  // Metrics
  totalStudents: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  
  // Performance
  averageProjectQuality: number;
  averageCompletionTime: number;
  studentSatisfactionScore: number;
  
  // Ranking
  departmentRank: number;
  universityRank?: number;
}

export interface UniversityComparison {
  universityId: string;
  universityName: string;
  
  // Metrics for comparison
  totalStudents: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  
  // Rankings
  overallRank: number;
  departmentRanks: {
    [department: string]: number;
  };
  
  // Performance Scores
  averageStudentPerformance: number;
  averageProjectQuality: number;
  overallSatisfactionScore: number;
}

export interface UniversityLeaderboard {
  id: string;
  universityId: string;
  universityName: string;
  
  // Ranking Metrics
  rank: number;
  score: number;
  change: number;
  category: 'OVERALL' | 'STUDENT_ENGAGEMENT' | 'PROJECT_SUCCESS' | 'INNOVATION';
  
  // Scoring
  totalStudents: number;
  totalProjects: number;
  totalInvestments: number;
  investmentVolume: number;
  
  // Performance
  averageProjectQuality: number;
  averageStudentPerformance: number;
  satisfactionScore: number;
  
  // Achievement Badges
  badges: string[];
}

export interface UniversityTrendData {
  universityId: string;
  metric: UniversityMetricType;
  period: string; // 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  
  dataPoints: {
    timestamp: Date;
    value: number;
    change: number; // Percent change from previous period
    target?: number;
  }[];
}

export interface UniversityAlert {
  id: string;
  universityId: string;
  type: 'WARNING' | 'ERROR' | 'INFO' | 'SUCCESS';
  
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  message: string;
  details?: {
    category?: string;
    studentId?: string;
    projectId?: string;
    count?: number;
    threshold?: number;
  };
  
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
}

export interface UniversitySettings {
  universityId: string;
  
  // Visibility Controls
  dashboardVisibility: 'PUBLIC' | 'UNIVERSITY_ONLY' | 'PRIVATE';
  showStudentNames: boolean;
  showProjectDetails: boolean;
  showFinancialDetails: boolean;
  
  // Analytics Controls
  enableRealTimeAnalytics: boolean;
  analyticsRefreshRate: number; // minutes
  
  // Governance Controls
  enableAutoApproval: boolean;
  approvalWorkflow: 'STRICT' | 'MODERATE' | 'FLEXIBLE';
  
  // Tagging Controls
  requireUniversityApproval: boolean;
  allowedTagCategories: string[];
  allowedTagDepartments: string[];
  
  // Integration Controls
  allowSISIntegration: boolean;
  allowLDAPIntegration: boolean;
  apiKeysEnabled: boolean;
}

export interface UniversityDashboardData {
  metrics: UniversityDashboardMetrics;
  students: UniversityStudentInsight[];
  projects: UniversityProjectInsight[];
  departments: DepartmentInsight[];
  comparisons?: UniversityComparison[];
  activityFeed: UniversityActivityFeedItem[];
  leaderboard?: UniversityLeaderboard;
  trends: UniversityTrendData[];
  alerts: UniversityAlert[];
  settings: UniversitySettings;
  lastUpdated: Date;
}
