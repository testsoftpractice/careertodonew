/**
 * Investment Marketplace Model (Fixed Version)
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
  FUNDING = 'FUNDING',
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  DEPLOYMENT = 'DEPLOYMENT',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
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

  // Project Performance
  monthlyRevenue?: number;
  annualRevenue?: number;
  projectedRevenue?: number;
  growthRate?: number;
  customerSatisfaction?: number;

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
  rating: number;

  // Marketplace Flags
  visible: boolean;
  featured: boolean;
  promoted: boolean;
  tags: string[];
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
  fundingRanges?: {
    seed?: { min: number; max: number };
    angel?: { min: number; max: number };
    preseed?: { min: number; max: number };
    seriesA?: { min: number; max: number };
    seriesB?: { min: number; max: number };
  };
  riskProfile?: 'CONSERVATIVE' | 'MODERATE' | 'BALANCED' | 'AGGRESSIVE';
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
  financialsUrl?: string;
  legalDocsUrl?: string;

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
  averageDaysToClose: number;
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
  conditions?: string[];
  message?: string;

  // Terms
  governanceRights: string[];
  boardSeat?: boolean;
  observerRights?: boolean;
  informationRights?: boolean;
  exitClause?: string;

  // Status
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

  // Metadata
  submittedAt: Date;
  updatedAt?: Date;
  viewedAt?: Date;
  interestedParties: string[];
  recommendations?: string[];
}

/**
 * Calculate investment project complexity score
 */
export function calculateDealComplexity(deal: Deal): 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'COMPLICATED' {
  let complexity = 1

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

  if (deal.valuation > 1000000) complexity += 2
  if (deal.valuation > 10000000) complexity += 3

  if (deal.equityPercentage > 50 && deal.equityPercentage <= 80) complexity += 1
  if (deal.equityPercentage > 80) complexity += 2
  if (deal.equityPercentage > 95) complexity += 3

  const governanceCount = deal.governanceRights.length
  if (governanceCount > 0) {
    complexity += governanceCount * 2
  }

  if (deal.boardSeats) complexity += 2
  if (deal.observerRights) complexity += 1
  if (deal.informationRights) complexity += 1

  const documentCount = (deal.termSheetUrl ? 1 : 0) +
    (deal.shareholdersAgreementUrl ? 1 : 0) +
    (deal.ndaUrl ? 1 : 0) +
    (deal.financialsUrl ? 1 : 0) +
    (deal.legalDocsUrl ? 1 : 0)
  if (documentCount > 5) complexity += 1
  if (documentCount > 10) complexity += 1

  if (deal.status === 'COMPLETED') complexity -= 1

  if (complexity <= 3) return 'SIMPLE'
  if (complexity <= 6) return 'MODERATE'
  if (complexity <= 9) return 'COMPLEX'
  return 'COMPLICATED'
}

/**
 * Calculate how well investor matches project criteria
 */
export function calculateMatchScore(project: InvestmentProject): number {
  let score = 50

  const investorLocations = ['USA', 'UK', 'EU', 'Asia', 'Others']
  const projectLocations = project.tags.filter(t => investorLocations.includes(t))
  if (projectLocations.length > 0) score += 30

  if (project.foundingTeam && project.foundingTeam.length > 0) {
    score += 10
  }

  if (project.university) {
    score += 10
  }

  return Math.min(100, score)
}

/**
 * Get suitable investment opportunities for an investor
 */
export async function getSuitableInvestments(user: Investor, filters: InvestmentFilters): Promise<InvestmentProject[]> {
  let allProjects: InvestmentProject[] = []

  if (filters.category && filters.category !== 'ALL') {
    allProjects = allProjects.filter(p => p.category === filters.category)
  }

  if (filters.stage && filters.stage !== 'ALL') {
    allProjects = allProjects.filter(p => p.fundingStage === filters.stage)
  }

  if (filters.status && filters.status !== 'ALL') {
    allProjects = allProjects.filter(p => {
      return true // Project doesn't have status in this version
    })
  }

  if (filters.minInvestment && filters.maxInvestment) {
    const min = filters.minInvestment.min || 0
    const max = filters.maxInvestment.max || Infinity

    allProjects = allProjects.filter(p => {
      const amount = p.targetRaise || 0
      const percentage = p.percentageRaised || 0

      if (percentage >= 25 && percentage <= 75 && amount >= min && amount <= max) {
        return true
      }
      return false
    })
  }

  return allProjects
}

/**
 * Calculate project exit risk level
 */
function calculateExitRisk(project: InvestmentProject): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (!project.growthRate) return 'MEDIUM'
  if (project.growthRate < 20) return 'LOW'

  if (project.customerSatisfaction !== undefined && project.customerSatisfaction < 50) return 'HIGH'
  if (project.customerSatisfaction !== undefined && project.customerSatisfaction < 30) return 'CRITICAL'

  return 'LOW'
}

export function getInvestorMetrics(): InvestmentMetrics {
  return {
    totalProjects: 0,
    totalInvestments: 0,
    totalDealFlow: 0,
    averageDealSize: 0,
    conversionRate: 0,
    totalRaised: 0,
    averageDaysToClose: 0,
    totalExits: 0,
    fundingGoal: 0,
    currentRunwayPercentage: 0,
  }
}

/**
 * Check if user can submit investment interest
 */
export function getProposalEligibility(user: Investor, _projectId: string): boolean {
  if (!user.canInvest) return false
  if (!user.canViewDetails) return false

  return true
}
