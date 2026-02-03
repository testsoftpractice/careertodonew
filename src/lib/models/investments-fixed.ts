import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isFeatureEnabled, INVESTOR_DASHBOARD, INVESTOR_PORTFOLIO } from '@/lib/features/flags-v2'

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
  teamExperience: string; // Years combined

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
  equityOffered?: number; // Percentage of company ownership offered
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
  approvedBy: string; // Username
  reviewedBy: string; // Username
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
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'BALANCED' | 'AGGRESSIVE' | 'AGGRESSIVE';

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
 * Based on deal type, equity, board rights, documentation, etc.
 */
export function calculateDealComplexity(deal: Deal): 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'COMPLICATED' {
  const complexity = deal.type === 'SEED' ? 1 :
                     deal.type === 'SERIES_A' ? 2 :
                     deal.type === 'SERIES_B' ? 3 :
                     deal.type === 'SERIES_A' ? 4 :
                     deal.type === 'EQUITY' ? 5 :
                     deal.type === 'DEBT' ? 6 :
                     deal.type === 'CONVERTIBLE' ? 7 :
                     deal.type === 'GRANT' ? 8 :
                     deal.type === 'BUYOUT' ? 10 :
                     deal.type === 'STRATEGIC' ? 8 :
                     deal.type === 'EQUITY' ? 5 : 6

  // Add complexity for very large deals
  if (deal.valuation > 1000000) complexity += 2
  if (deal.valuation > 10000000) complexity += 3

  // Equity-based weighting
  if (deal.equityPercentage > 50 && deal.equityPercentage <= 80) complexity += 1
  if (deal.equityPercentage > 80) complexity += 2
  if (deal.equityPercentage > 95) complexity += 3

  // Governance rights complexity
  const governanceCount = deal.governanceRights.length
  if (governanceCount > 0) {
    complexity += governanceCount * 2
  }

  // Board representation
  if (deal.boardSeats) complexity += 2
  if (deal.observerRights) complexity += 1
  if (deal.informationRights) complexity += 1

  // Documentation complexity
  const documentCount = (deal.termSheetUrl ? 1 : 0) +
                            (deal.shareholdersAgreementUrl ? 1 : 0) +
                            (deal.ndaUrl ? 1 : 0) +
                            (deal.financialsUrl ? 1 : 0) +
                            (deal.legalDocsUrl ? 1 : 0)
  if (documentCount > 5) complexity += 1
  if (documentCount > 10) complexity += 1

  // Timeline pressure
  const daysSinceSubmitted = Math.floor((Date.now() - deal.submittedAt.getTime()) / (1000 * 60 * 24))
  if (deal.submittedAt) {
    if (daysSinceSubmitted < 7) complexity += 1
    else if (daysSinceSubmitted < 30) complexity += 0
    else if (daysSinceSubmitted < 60) complexity -= 1
  }

  // Due diligence
  if (deal.respondedAt) {
    const responseTime = deal.respondedAt.getTime()
    const submitTime = deal.submittedAt.getTime()
    const daysToRespond = Math.floor((responseTime - submitTime) / (1000 * 60 * 24))

    if (daysToRespond < 3) complexity += 3
    else if (daysToRespond < 7) complexity += 1
    else if (daysToRespond < 14) complexity += 0
    else if (daysToRespond < 30) complexity -= 1
  }

  // Stage appropriateness
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
  let score = 50 // Base score

  // Location match
  const investorLocations = ['USA', 'UK', 'EU', 'Asia', 'Others']
  const projectLocations = project.tags.filter(t => investorLocations.includes(t))
  if (projectLocations.length > 0) score += 30

  // Industry experience
  // Note: Would need to query investor's previous investments in production
  const experienceScore = 0 // Would calculate from history

  // Team strength
  if (project.foundingTeam && project.foundingTeam.length > 0) {
    score += 10
  }

  // University connection
  if (project.university) {
    score += 10
  }

  return Math.min(100, score)
}

/**
 * Get suitable investment opportunities for an investor
 */
export async function getSuitableInvestments(user: Investor, filters: InvestmentFilters): Promise<InvestmentProject[]> {
  const allProjects = [] // In production, fetch from DB

  // Filter by category
  if (filters.category && filters.category !== 'ALL') {
    allProjects = allProjects.filter(p => p.category === filters.category)
  }

  // Filter by stage
  if (filters.stage && filters.stage !== 'ALL') {
    allProjects = allProjects.filter(p => p.fundingStage === filters.stage)
  }

  // Filter by status
  if (filters.status && filters.status !== 'ALL') {
    allProjects = allProjects.filter(p => {
      const status = p as any
      return status.status === filters.status
    })
  }

  // Apply funding range
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

  // Apply funding ranges
  if (filters.fundingRanges) {
    const { seed, angel, preseed, seriesA, seriesB, riskProfile } = user.fundingRanges

    if (filters.riskProfile === 'CONSERVATIVE') {
      allProjects = allProjects.filter(p => {
        const complexity = calculateExitRisk(p) || 'UNKNOWN'
        return complexity <= 3
      })
    } else if (filters.riskProfile === 'MODERATE') {
      allProjects = allProjects.filter(p => {
        const complexity = calculateExitRisk(p) || 'UNKNOWN'
        return complexity <= 5
      })
    } else if (filters.riskProfile === 'AGGRESSIVE') {
      allProjects = allProjects.filter(p => {
        const complexity = calculateExitRisk(p) || 'UNKNOWN'
        return complexity <= 7
      })
    } else {
      allProjects = allProjects.filter(p => {
        const complexity = calculateExitRisk(p) || 'UNKNOWN'
        return complexity <= 10
      })
    }
  }

  return allProjects
}

/**
 * Calculate project exit risk level
 */
function calculateExitRisk(project: InvestmentProject): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (!project.growthRate) return 'MEDIUM'
  if (project.growthRate && project.growthRate < 20) return 'LOW'

  if (project.customerSatisfaction && project.customerSatisfaction < 50) return 'HIGH'
  if (project.customerSatisfaction < 30) return 'CRITICAL'

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
export function getProposalEligibility(user: Investor, projectId: string): boolean {
  // Check if user has permission to express interest
  if (!user.canInvest) return false
  if (!user.canViewDetails) return false

  return true
}
