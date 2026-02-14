/**
 * Investment Marketplace Model
 * Handles investment listings, search, filtering, and project details for investors
 */

export enum InvestmentType {
  SEED = 'SEED',
  SERIES_A = 'SERIES_A',
  SERIES_B = 'SERIES_B',
  EQUITY = 'EQUITY',
  DEBT = 'DEBT',
  CONVERTIBLE = 'CONVERTIBLE',
  GRANT = 'GRANT',
}

export enum ProjectCategory {
  TECHNOLOGY = 'TECHNOLOGY',
  CONSUMER = 'CONSUMER',
  BUSINESS = 'BUSINESS',
  HEALTHCARE = 'HEALTHCARE',
  FINANCE = 'FINANCE',
  ENERGY = 'ENERGY',
  REAL_ESTATE = 'REAL_ESTATE',
  ENTERTAINMENT = 'ENTERTAINMENT',
  EDUCATION = 'EDUCATION',
  MEDIA = 'MEDIA',
  ADVERTISING = 'ADVERTISING',
  MARKETPLACE = 'MARKETPLACE',
  TECH_STARTUP = 'TECH_STARTUP',
}

export enum FundingStage {
  IDEA = 'IDEA',
  IN_REVIEW = 'IN_REVIEW',
  RAISED = 'RAISED',
  FUNDING = 'FUNDING',
  NEGOTIATING = 'NEGOTIATING',
  DEAL_AGREED = 'DEAL_AGREED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  EXITED = 'EXITED',
}

export enum InvestmentStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  COMMITTED = 'COMMITTED',
  SOLD = 'SOLD',
  ARCHIVED = 'ARCHIVED',
}

export enum InterestLevel {
  PRE_QUALIFIED = 'PRE_QUALIFIED',
  QUALIFIED = 'QUALIFIED',
  READY_TO_CLOSE = 'READY_TO_CLOSE',
  IN_DILIGENCE = 'IN_DILIGENCE',
  DUE_DILIGENCE_COMPLETE = 'DUE_DILIGENCE_COMPLETE',
}

export interface InvestmentProject {
  id: string;
  projectName: string;
  projectDescription: string;
  category: ProjectCategory;
  university: string;
  universityLogo?: string;

  // Team Information
  teamSize: number;
  foundingTeam: string[];
  teamDescription: string;
  teamExperience: string;

  // Investment Details
  fundingStage: FundingStage;
  minInvestment: number;
  maxInvestment: number;
  targetRaise: number;
  currentRaised: number;
  percentageRaised: number;
  fundingGoal?: number;

  // Project Performance
  monthlyRevenue?: number;
  annualRevenue?: number;
  projectedRevenue?: number;
  growthRate?: number;
  customerSatisfaction?: number;
  completionRate?: number;

  // Investment Terms
  equityOffered?: number;
  votingRights?: boolean;
  boardSeat?: boolean;
  observerRights?: boolean;
  exitClause?: string;

  // Timestamps
  createdAt: Date;
  lastUpdated: Date;
  fundingDate?: Date;
  closedDate?: Date;

  // Documents
  pitchDeckUrl?: string;
  financialsUrl?: string;
  legalDocsUrl?: string;

  // Metadata
  approvedBy: string;
  reviewedBy: string;
  viewedBy: number;
  investedBy: number;
  commentsCount: number;
  rating: number;

  // Marketplace Flags
  visible: boolean;
  featured: boolean;
  promoted: boolean;
  tags: string[];
  status?: InvestmentStatus;
  type?: InvestmentType;
}

export interface InvestmentFilters {
  category: ProjectCategory | 'ALL';
  stage: FundingStage | 'ALL';
  status: InvestmentStatus | 'ALL';
  type: InvestmentType | 'ALL';
  minInvestment: { min?: number };
  maxInvestment: { max?: number };
  industry: string[];
  university: string[];
  searchQuery: string;
  sortField: 'created' | 'fundingGoal' | 'raisedPercentage' | 'revenue';
  sortOrder: 'asc' | 'desc';
}

export interface ProjectSearchResult {
  projects: InvestmentProject[];
  totalResults: number;
  facets: {
    categories: Record<ProjectCategory, number>;
    stages: Record<FundingStage, number>;
    universities: Record<string, number>;
    statuses: Record<InvestmentStatus, number>;
  };
}

export interface InvestmentRequest {
  title: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  documents: string[];
}

export interface InterestExpression {
  userId: string;
  projectId: string;
  type: 'EQUITY' | 'DEBT' | 'CONVERTIBLE' | 'GRANT' | 'BUYOUT' | 'STRATEGIC';
  amount?: number;
  equityPercentage?: number;
  termYears?: number;
  conditions?: string[];
  message?: string;
}

export interface Deal {
  id: string;
  projectId: string;
  proposalId: string;
  type: InvestmentType;

  // Parties
  investorId: string;
  ownerId: string;
  teamId?: string;

  // Deal Terms
  valuation: number;
  investmentAmount: number;
  equityPercentage: number;
  governanceRights: string[];
  boardSeats: boolean;
  equityOffered?: number;
  observerRights?: boolean;
  informationRights?: boolean;
  documents?: string[];

  // Timeline
  submittedAt: Date;
  viewedAt?: Date;
  respondedAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  signedAt?: Date;
  exitedAt?: Date;

  // Attachments
  termSheetUrl?: string;
  shareholdersAgreementUrl?: string;
  ndaUrl?: string;
  financialsUrl?: string;
  legalDocsUrl?: string;

  // Status
  status: 'INTEREST' | 'UNDER_DILIGENCE' | 'NEGOTIATING' | 'AGREED' | 'CANCELLED' | 'COMPLETED' | 'EXITED';
  rejectionReason?: string;
  nextMilestone?: string;
  completionPercentage?: number;

  // Audit Trail
  createdById: string;
  updatedBy?: string;
  action: string;
  changes: string[];

  // Notes
  comments: string[];
}

export interface InvestmentMetrics {
  totalProjects: number;
  totalInvestments: number;
  totalDealFlow: number;
  averageDealSize: number;
  conversionRate: number;
  totalRaised: number;
  avgDaysToClose: number;
  totalExits: number;
  fundingGoal: number;
  currentRunwayPercentage: number;
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  avatar?: string;

  // Preferences
  investmentInterests: string[];
  projectCategories: ProjectCategory[];
  investmentStages: FundingStage[];
  fundingRanges: {
    seed: { min: number; max: number };
    angel: { min: number; max: number };
    preseed: { min: number; max: number };
    seriesA: { min: number; max: number };
    seriesB: { min: number; max: number };
  };
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'BALANCED' | 'AGGRESSIVE';
  previousInvestments?: Array<{ projectId: string }>;
  portfolioGrowth?: number;

  // Permissions
  canInvest: boolean;
  canManageDeals: boolean;
  canViewDetails: boolean;
  canViewTerms: boolean;

  // Metrics
  totalInvested: number;
  totalExits: number;
  averageReturn: number;
  portfolioValue: number;
}

export interface InvestmentAlert {
  id: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  investorId: string;
  projectId: string;
  projectTitle: string;
  dealId?: string;

  // Details
  message: string;
  details?: {
    projectId?: string;
    dealId?: string;
    amount?: number;
    equityPercentage?: number;
    status?: string;
    reason?: string;
  };

  // Tracking
  createdById: string;
  dismissedAt?: Date;
  acknowledgedAt?: Date;
  updatedAt?: Date;

  // Timestamps
  createdAt: Date;
}

export interface InvestmentProposal {
  id: string;
  type: InvestmentType;
  projectId: string;

  // Investment Details
  amount: number;
  equityPercentage?: number;
  termYears?: number;

  // Terms
  governanceRights: string[];
  boardSeat: boolean;
  observerRights: boolean;
  votingRights?: boolean;
  informationRights?: string;
  exitClause?: string;

  // Documents
  pitchDeckUrl?: string;
  financialsUrl?: string;
  legalDocsUrl?: string;

  // Status
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

  // Metadata
  submittedAt: Date;
  updatedAt?: Date;
  viewedAt?: Date;
  interestedParties: string[];

  // Review
  reviewedBy: string[];
  comments: string[];
  rating?: number;
  recommendations?: string[];
}

export function calculateInvestmentScore(investment: InvestmentProject): number {
  const fundingGoal = investment.fundingGoal || investment.targetRaise || 1
  const raisedAmount = investment.currentRaised || 0
  const fundedPercentage = (raisedAmount / fundingGoal) * 100

  let score = fundedPercentage * 0.25

  if (investment.growthRate) {
    score += (investment.growthRate / 100) * 25
  }

  if (investment.customerSatisfaction) {
    score += investment.customerSatisfaction * 0.25
  }

  return Math.min(score, 100)
}

export function calculateExitRisk(project: InvestmentProject): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (!project.growthRate) return 'MEDIUM'

  if (project.customerSatisfaction !== undefined && project.customerSatisfaction < 50) return 'HIGH'
  if (project.completionRate !== undefined && project.completionRate < 50) return 'HIGH'
  return 'LOW'
}

export function calculateDealComplexity(deal: Deal): 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'COMPLICATED' {
  let complexity = 1

  // Type-based complexity
  switch (deal.type) {
    case InvestmentType.SEED: complexity = 1; break
    case InvestmentType.SERIES_A: complexity = 2; break
    case InvestmentType.SERIES_B: complexity = 3; break
    case InvestmentType.EQUITY: complexity = 2; break
    case InvestmentType.DEBT: complexity = 3; break
    case InvestmentType.CONVERTIBLE: complexity = 4; break
    case InvestmentType.GRANT: complexity = 5; break
    default: complexity = 4
  }

  if (deal.valuation > 5000000) complexity += 3

  if (deal.equityOffered !== undefined && deal.equityOffered > 50 && deal.equityOffered < 75) complexity -= 1
  if (deal.boardSeats) complexity += 1
  if (deal.governanceRights && deal.governanceRights.length > 3) complexity += 1

  if (deal.comments.length > 5) complexity += 1
  if (deal.documents && deal.documents.length > 5) complexity += 1

  if (complexity <= 3) return 'SIMPLE'
  if (complexity <= 6) return 'MODERATE'
  if (complexity <= 9) return 'COMPLEX'
  return 'COMPLICATED'
}

export function calculateMatchScore(project: InvestmentProject, investor?: Investor): number {
  let score = 50

  const investorLocations = ['USA', 'UK', 'EU', 'Asia', 'Others']
  const projectLocations = project.tags.filter(t => investorLocations.includes(t))
  if (projectLocations.length > 0) score += 30

  if (project.foundingTeam && project.foundingTeam.length > 0) {
    score += 10
  }

  if (investor && investor.portfolioValue > 100000 && (investor.portfolioGrowth || 0) > 20) {
    score += 25
  }

  if (project.university) {
    score += 10
  }

  return Math.min(score, 100)
}

export function getSuitableInvestments(user: Investor, filters: InvestmentFilters): InvestmentProject[] {
  let allProjects: InvestmentProject[] = []

  if (filters.category && filters.category !== 'ALL') {
    allProjects = allProjects.filter(p => p.category === filters.category)
  }

  if (filters.stage && filters.stage !== 'ALL') {
    allProjects = allProjects.filter(p => p.fundingStage === filters.stage)
  }

  if (filters.status && filters.status !== 'ALL') {
    allProjects = allProjects.filter(p => p.status === filters.status)
  }

  if (filters.type && filters.type !== 'ALL') {
    allProjects = allProjects.filter(p => p.type === filters.type)
  }

  if (filters.minInvestment && filters.maxInvestment) {
    allProjects = allProjects.filter(p => {
      if (p.minInvestment && filters.maxInvestment.max !== undefined) {
        return p.minInvestment >= (filters.minInvestment.min || 0) &&
               p.maxInvestment <= filters.maxInvestment.max
      }
      return true
    })
  }

  allProjects.sort((a, b) => {
    const multiplier = filters.sortOrder === 'desc' ? -1 : 1
    return (a.targetRaise - b.targetRaise) * multiplier
  })

  return allProjects
}

export function getAvailableProjects(user: Investor, projectId?: string): InvestmentProject[] {
  const allProjects: InvestmentProject[] = []

  if (projectId) {
    return allProjects.filter(p => p.id === projectId)
  }

  return allProjects
}

export function getProposalEligibility(user: Investor, _projectId: string): boolean {
  if (!user.canInvest) return false
  if (!user.canViewDetails) return false

  return true
}

export function getInvestorMetrics(): InvestmentMetrics {
  return {
    totalProjects: 0,
    totalInvestments: 0,
    totalDealFlow: 0,
    averageDealSize: 0,
    conversionRate: 0,
    totalRaised: 0,
    avgDaysToClose: 0,
    totalExits: 0,
    fundingGoal: 0,
    currentRunwayPercentage: 0,
  }
}
