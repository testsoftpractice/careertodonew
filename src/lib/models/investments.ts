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
  FINANCE = ' FINANCE',
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
  commentsCount: number;
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
  projectLeadId: string;
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
  termSheetUrl: string;
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
  activeDeals: number;
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
  status: string;
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
  if (!investment.fundingGoal) return 0
  
  const raisedAmount = investment.currentRaised || 0
  const fundedPercentage = (raisedAmount / investment.fundingGoal) * 100
  
  let score = fundedPercentage * 25 // Up to 2500 points
  
  if (investment.averageReturn && investment.projectedRevenue) {
    score += (investment.averageReturn / 100) * 25 // Up to 2500 points
  }
  
  if (investment.customerSatisfaction) {
    score += investment.customerSatisfaction * 25 // Up to 2500 points
  }
  
  return Math.min(score, 100)
}

export function calculateExitRisk(project: InvestmentProject): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (!project.growthRate) return 'MEDIUM'
  
  if (project.customerSatisfaction < 50) return 'HIGH'
  if (project.completionRate < 50) return 'HIGH'
  return 'LOW'
}

export function calculateDealComplexity(deal: Deal): 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'COMPLICATED' {
  const complexity = deal.type === 'SEED' ? 1 :
                     deal.type === 'SERIES_A' ? 2 :
                     deal.type === 'SERIES_B' ? 3 :
                     deal.type === 'SERIES_A' ? 4 :
                     deal.type === 'EQUITY' ? 2 :
                     deal.type === 'DEBT' ? 3 :
                     deal.type === 'CONVERTIBLE' ? 4 :
                     deal.type === 'GRANT' ? 5 : 4
  
  if (deal.valuation > 5000000) complexity += 3
  
  if (deal.equityOffered > 50 && deal.equityOffered < 75) complexity -= 1
  if (deal.boardSeat) complexity += 1
  if (deal.governanceRights && deal.governanceRights.length > 3) complexity += 1
  
  if (deal.commentsCount > 5) complexity += 1
  if (deal.documents.length > 5) complexity += 1
  
  if (deal.timeToClose > 12 && deal.timeToClose < 6) complexity += 1
  if (deal.timeToClose > 18) complexity += 2
  
  return complexity as string
}

export function calculateMatchScore(project: InvestmentProject): number {
  // Calculate how well investor matches project criteria
  let score = 50 // Base score
  
  // Location match
  const investorLocations = ['USA', 'UK', 'EU', 'Asia', 'Others']
  const projectLocations = project.tags.filter(t => investorLocations.includes(t))
  if (projectLocations.length > 0) score += 30
  
  // Industry experience
  if (investor.previousInvestments?.length > 0 && investor.previousInvestments.some(inv => {
    const prevProject = await fetchProject(inv.projectId)
    return prevProject.category === project.category
  }))
  {
    score += 20
  }
  
  // Stage match
  const stages = ['IDEA', 'IN_REVIEW', 'RAISED', 'FUNDING', 'NEGOTIATING', 'DEAL_AGREED', 'COMPLETED']
  if (stages.includes(project.fundingStage)) {
    score += 15
  }
  
  // Performance history
  if (investor.portfolioValue > 100000 && investor.portfolioGrowth > 20) {
    score += 25
  }
  
  // University connection
  if (project.university) {
    score += 10
  }
  
  return Math.min(score, 100)
}

export function getSuitableInvestments(user: Investor, filters: InvestmentFilters): InvestmentProject[] {
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
    allProjects = allProjects.filter(p => p.status === filters.status)
  }
  
  // Filter by type
  if (filters.type && filters.type !== 'ALL') {
    allProjects = allProjects.filter(p => p.type === filters.type)
  }
  
  // Apply funding range
  if (filters.minInvestment && filters.maxInvestment) {
    allProjects = allProjects.filter(p => {
      if (p.minInvestment && filters.maxInvestment) {
        return p.minInvestment >= filters.minInvestment && p.maxInvestment <= filters.maxInvestment
      }
      return true
    })
  }
  
  // Sort
  allProjects.sort((a, b) => {
    const order = filters.sortOrder || 'created' // created
    const multiplier = filters.sortOrder === 'desc' ? -1 : 1
    return (a.amount - b.amount) * multiplier
  })
  
  return allProjects
}

export function getAvailableProjects(user: Investor, projectId?: string): InvestmentProject[] {
  const allProjects = [] // In production, fetch from DB with filtering
  
  if (projectId) {
    const project = await fetchProject(projectId)
    if (!project) return []
    
    return [project]
  }
  
  return allProjects
}

export function getProposalEligibility(user: Investor, projectId: string): boolean {
  // Check if user can submit investment interest
  if (!user.canInvest) return false
  if (!user.canViewDetails) return false
  
  return true
}
