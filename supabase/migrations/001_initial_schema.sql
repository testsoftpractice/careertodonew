-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "UserRole" AS ENUM (
  'STUDENT',
  'EMPLOYER',
  'INVESTOR',
  'UNIVERSITY_ADMIN',
  'PLATFORM_ADMIN'
);

CREATE TYPE "VerificationStatus" AS ENUM (
  'PENDING',
  'UNDER_REVIEW',
  'VERIFIED',
  'REJECTED'
);

CREATE TYPE "UniversityVerificationStatus" AS ENUM (
  'PENDING',
  'UNDER_REVIEW',
  'VERIFIED',
  'SUSPENDED',
  'REJECTED'
);

CREATE TYPE "SkillLevel" AS ENUM (
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT'
);

CREATE TYPE "LeaveType" AS ENUM (
  'SICK_LEAVE',
  'PERSONAL_LEAVE',
  'VACATION',
  'EMERGENCY',
  'BEREAVEMENT',
  'MATERNITY',
  'PATERNITY'
);

CREATE TYPE "LeaveRequestStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED'
);

CREATE TYPE "EmploymentType" AS ENUM (
  'FULL_TIME',
  'PART_TIME',
  'INTERNSHIP',
  'CONTRACT'
);

CREATE TYPE "ProjectStatus" AS ENUM (
  'IDEA',
  'UNDER_REVIEW',
  'FUNDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'ON_HOLD'
);

CREATE TYPE "ProjectStage" AS ENUM (
  'IDEA',
  'PROPOSAL',
  'FUNDING',
  'DEVELOPMENT',
  'TESTING',
  'DEPLOYMENT',
  'COMPLETED',
  'ON_HOLD'
);

CREATE TYPE "TaskPriority" AS ENUM (
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW'
);

CREATE TYPE "TaskStatus" AS ENUM (
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'REVIEW',
  'DONE',
  'BLOCKED',
  'CANCELLED'
);

CREATE TYPE "TaskAccessLevel" AS ENUM (
  'OWNER',
  'PROJECT_MANAGER',
  'VIEW',
  'COMMENT'
);

CREATE TYPE "MilestoneStatus" AS ENUM (
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE "RatingType" AS ENUM (
  'EXECUTION',
  'COLLABORATION',
  'LEADERSHIP',
  'ETHICS',
  'RELIABILITY'
);

CREATE TYPE "NotificationType" AS ENUM (
  'INFO',
  'SUCCESS',
  'WARNING',
  'ERROR',
  'TASK_ASSIGNED',
  'PROJECT_UPDATE',
  'VERIFICATION',
  'INVESTMENT',
  'MESSAGE'
);

CREATE TYPE "NotificationPriority" AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT'
);

CREATE TYPE "AuditAction" AS ENUM (
  'CREATE',
  'UPDATE',
  'DELETE',
  'VIEW',
  'LOGIN',
  'LOGOUT'
);

CREATE TYPE "ProgressionLevel" AS ENUM (
  'CONTRIBUTOR',
  'SENIOR_CONTRIBUTOR',
  'TEAM_LEAD',
  'PROJECT_LEAD'
);

CREATE TYPE "BusinessRole" AS ENUM (
  'OWNER',
  'ADMIN',
  'HR_MANAGER',
  'PROJECT_MANAGER',
  'TEAM_LEAD',
  'RECRUITER',
  'TEAM_MEMBER',
  'VIEWER'
);

CREATE TYPE "ProjectRole" AS ENUM (
  'OWNER',
  'PROJECT_MANAGER',
  'TEAM_LEAD',
  'TEAM_MEMBER',
  'VIEWER'
);

CREATE TYPE "WorkSessionType" AS ENUM (
  'WORK_SESSION',
  'BREAK',
  'MEETING',
  'TRAINING',
  'RESEARCH'
);

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE "University" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "description" TEXT,
  "location" TEXT,
  "website" TEXT,
  "rankingScore" DOUBLE PRECISION,
  "rankingPosition" INTEGER,
  "totalStudents" INTEGER NOT NULL DEFAULT 0,
  "verificationStatus" "UniversityVerificationStatus" NOT NULL DEFAULT 'PENDING',
  "totalProjects" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "University_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "University_code_key" UNIQUE ("code")
);

CREATE INDEX "University_code_idx" ON "University"("code");
CREATE INDEX "University_verificationStatus_idx" ON "University"("verificationStatus");

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "avatar" TEXT,
  "role" "UserRole" NOT NULL,
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  "universityId" TEXT,
  "major" TEXT,
  "graduationYear" INTEGER,
  "bio" TEXT,
  "location" TEXT,
  "linkedinUrl" TEXT,
  "portfolioUrl" TEXT,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "emailVerifiedAt" TIMESTAMP(3),
  "executionScore" DOUBLE PRECISION,
  "collaborationScore" DOUBLE PRECISION,
  "leadershipScore" DOUBLE PRECISION,
  "ethicsScore" DOUBLE PRECISION,
  "reliabilityScore" DOUBLE PRECISION,
  "progressionLevel" "ProgressionLevel",
  "totalPoints" INTEGER NOT NULL DEFAULT 0,
  "loginAttempts" INTEGER NOT NULL DEFAULT 0,
  "lockedAt" TIMESTAMP(3),
  "lastPasswordChange" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "User_email_key" UNIQUE ("email"),
  CONSTRAINT "User_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_universityId_idx" ON "User"("universityId");
CREATE INDEX "User_verificationStatus_idx" ON "User"("verificationStatus");

-- Add the missing users relation to University
ALTER TABLE "University" ADD COLUMN "users" TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "Skill" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "level" "SkillLevel" NOT NULL DEFAULT 'INTERMEDIATE',
  "endorsements" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Skill_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Skill_userId_name_key" UNIQUE ("userId", "name"),
  CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Skill_userId_idx" ON "Skill"("userId");
CREATE INDEX "Skill_level_idx" ON "Skill"("level");

CREATE TABLE "Experience" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "company" TEXT,
  "location" TEXT,
  "description" TEXT,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "current" BOOLEAN NOT NULL DEFAULT false,
  "skills" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Experience_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Experience_userId_idx" ON "Experience"("userId");
CREATE INDEX "Experience_startDate_idx" ON "Experience"("startDate");
CREATE INDEX "Experience_current_idx" ON "Experience"("current");

CREATE TABLE "Education" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "school" TEXT NOT NULL,
  "degree" TEXT NOT NULL,
  "field" TEXT,
  "description" TEXT,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Education_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Education_userId_idx" ON "Education"("userId");
CREATE INDEX "Education_startDate_idx" ON "Education"("startDate");

CREATE TABLE "LeaveRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "leaveType" "LeaveType" NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "reason" TEXT NOT NULL,
  "status" "LeaveRequestStatus" NOT NULL DEFAULT 'PENDING',
  "rejectionReason" TEXT,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LeaveRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "LeaveRequest_userId_idx" ON "LeaveRequest"("userId");
CREATE INDEX "LeaveRequest_status_idx" ON "LeaveRequest"("status");
CREATE INDEX "LeaveRequest_startDate_idx" ON "LeaveRequest"("startDate");
CREATE INDEX "LeaveRequest_endDate_idx" ON "LeaveRequest"("endDate");

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" "ProjectStatus" NOT NULL DEFAULT 'IDEA',
  "stage" "ProjectStage" NOT NULL DEFAULT 'IDEA',
  "ownerId" TEXT NOT NULL,
  "businessId" TEXT,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "budget" DOUBLE PRECISION,
  "category" TEXT,
  "tags" TEXT,
  "imageUrl" TEXT,
  "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Project_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");
CREATE INDEX "Project_businessId_idx" ON "Project"("businessId");
CREATE INDEX "Project_status_idx" ON "Project"("status");
CREATE INDEX "Project_stage_idx" ON "Project"("stage");
CREATE INDEX "Project_category_idx" ON "Project"("category");
CREATE INDEX "Project_progress_idx" ON "Project"("progress");

CREATE TABLE "ProjectMember" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "ProjectRole" NOT NULL DEFAULT 'TEAM_MEMBER',
  "accessLevel" "TaskAccessLevel" NOT NULL DEFAULT 'VIEW',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProjectMember_projectId_userId_key" UNIQUE ("projectId", "userId"),
  CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ProjectMember_projectId_idx" ON "ProjectMember"("projectId");
CREATE INDEX "ProjectMember_userId_idx" ON "ProjectMember"("userId");
CREATE INDEX "ProjectMember_accessLevel_idx" ON "ProjectMember"("accessLevel");

CREATE TABLE "Task" (
  "id" TEXT NOT NULL,
  "projectId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
  "currentStepId" TEXT DEFAULT '1',
  "assignedTo" TEXT,
  "assignedBy" TEXT NOT NULL,
  "dueDate" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "estimatedHours" DOUBLE PRECISION,
  "actualHours" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Task_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Task_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Task_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Task_projectId_status_idx" ON "Task"("projectId", "status");
CREATE INDEX "Task_assignedTo_status_idx" ON "Task"("assignedTo", "status");
CREATE INDEX "Task_projectId_priority_status_idx" ON "Task"("projectId", "priority", "status");
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX "Task_assignedTo_idx" ON "Task"("assignedTo");
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_priority_idx" ON "Task"("priority");
CREATE INDEX "Task_currentStepId_idx" ON "Task"("currentStepId");
CREATE INDEX "Task_createdAt_idx" ON "Task"("createdAt");
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

CREATE TABLE "SubTask" (
  "id" TEXT NOT NULL,
  "taskId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SubTask_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SubTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "SubTask_taskId_idx" ON "SubTask"("taskId");

CREATE TABLE "TaskDependency" (
  "id" TEXT NOT NULL,
  "taskId" TEXT NOT NULL,
  "dependsOnId" TEXT NOT NULL,

  CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TaskDependency_taskId_dependsOnId_key" UNIQUE ("taskId", "dependsOnId"),
  CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TaskDependency_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "TaskDependency_taskId_idx" ON "TaskDependency"("taskId");
CREATE INDEX "TaskDependency_dependsOnId_idx" ON "TaskDependency"("dependsOnId");

CREATE TABLE "Milestone" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "MilestoneStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "dueDate" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "metrics" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Milestone_projectId_idx" ON "Milestone"("projectId");
CREATE INDEX "Milestone_status_idx" ON "Milestone"("status");
CREATE INDEX "Milestone_dueDate_idx" ON "Milestone"("dueDate");

CREATE TABLE "Department" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "headId" TEXT,

  CONSTRAINT "Department_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Department_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Department_headId_fkey" FOREIGN KEY ("headId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "Department_projectId_idx" ON "Department"("projectId");
CREATE INDEX "Department_headId_idx" ON "Department"("headId");

CREATE TABLE "Vacancy" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "type" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
  "skills" TEXT,
  "slots" INTEGER NOT NULL DEFAULT 1,
  "filled" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Vacancy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Vacancy_projectId_idx" ON "Vacancy"("projectId");
CREATE INDEX "Vacancy_type_idx" ON "Vacancy"("type");

CREATE TABLE "TimeEntry" (
  "id" TEXT NOT NULL,
  "taskId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "hours" DOUBLE PRECISION NOT NULL,
  "description" TEXT,
  "billable" BOOLEAN NOT NULL DEFAULT false,
  "hourlyRate" DOUBLE PRECISION,

  CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TimeEntry_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "TimeEntry_taskId_idx" ON "TimeEntry"("taskId");
CREATE INDEX "TimeEntry_userId_idx" ON "TimeEntry"("userId");
CREATE INDEX "TimeEntry_date_idx" ON "TimeEntry"("date");

CREATE TABLE "WorkSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "projectId" TEXT,
  "type" "WorkSessionType" NOT NULL DEFAULT 'WORK_SESSION',
  "notes" TEXT,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3),
  "duration" INTEGER,

  CONSTRAINT "WorkSession_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "WorkSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "WorkSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "WorkSession_userId_idx" ON "WorkSession"("userId");
CREATE INDEX "WorkSession_projectId_idx" ON "WorkSession"("projectId");
CREATE INDEX "WorkSession_startTime_idx" ON "WorkSession"("startTime");
CREATE INDEX "WorkSession_type_idx" ON "WorkSession"("type");

CREATE TABLE "ProfessionalRecord" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "recordType" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "metadata" TEXT,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProfessionalRecord_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProfessionalRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ProfessionalRecord_userId_idx" ON "ProfessionalRecord"("userId");
CREATE INDEX "ProfessionalRecord_verified_idx" ON "ProfessionalRecord"("verified");

CREATE TABLE "Rating" (
  "id" TEXT NOT NULL,
  "fromUserId" TEXT NOT NULL,
  "toUserId" TEXT NOT NULL,
  "type" "RatingType" NOT NULL,
  "score" INTEGER NOT NULL,
  "comment" TEXT,
  "projectId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Rating_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Rating_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Rating_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Rating_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "Rating_fromUserId_idx" ON "Rating"("fromUserId");
CREATE INDEX "Rating_toUserId_idx" ON "Rating"("toUserId");
CREATE INDEX "Rating_type_idx" ON "Rating"("type");

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_read_idx" ON "Notification"("read");
CREATE INDEX "Notification_type_idx" ON "Notification"("type");
CREATE INDEX "Notification_priority_idx" ON "Notification"("priority");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" "AuditAction" NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "details" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

CREATE TABLE "VerificationRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "documents" TEXT,
  "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewedBy" TEXT,
  "notes" TEXT,

  CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "VerificationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "VerificationRequest_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "VerificationRequest_userId_idx" ON "VerificationRequest"("userId");
CREATE INDEX "VerificationRequest_status_idx" ON "VerificationRequest"("status");

CREATE TABLE "Business" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "industry" TEXT,
  "website" TEXT,
  "logo" TEXT,
  "location" TEXT,
  "foundedYear" INTEGER,
  "size" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Business_industry_idx" ON "Business"("industry");

CREATE TABLE "BusinessMember" (
  "id" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "BusinessRole" NOT NULL DEFAULT 'TEAM_MEMBER',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BusinessMember_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BusinessMember_businessId_userId_key" UNIQUE ("businessId", "userId"),
  CONSTRAINT "BusinessMember_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "BusinessMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "BusinessMember_businessId_idx" ON "BusinessMember"("businessId");
CREATE INDEX "BusinessMember_userId_idx" ON "BusinessMember"("userId");

CREATE TABLE "Job" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "requirements" TEXT,
  "benefits" TEXT,
  "location" TEXT,
  "type" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
  "salaryMin" DOUBLE PRECISION,
  "salaryMax" DOUBLE PRECISION,
  "salaryCurrency" TEXT DEFAULT 'USD',
  "remote" BOOLEAN NOT NULL DEFAULT false,
  "postedById" TEXT NOT NULL,
  "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deadline" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'OPEN',

  CONSTRAINT "Job_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Job_postedById_idx" ON "Job"("postedById");
CREATE INDEX "Job_type_idx" ON "Job"("type");
CREATE INDEX "Job_status_idx" ON "Job"("status");

CREATE TABLE "JobApplication" (
  "id" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "coverLetter" TEXT,
  "resume" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "notes" TEXT,

  CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "JobApplication_jobId_userId_key" UNIQUE ("jobId", "userId"),
  CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "JobApplication_jobId_idx" ON "JobApplication"("jobId");
CREATE INDEX "JobApplication_userId_idx" ON "JobApplication"("userId");
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

CREATE TABLE "Message" (
  "id" TEXT NOT NULL,
  "fromUserId" TEXT NOT NULL,
  "toUserId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Message_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Message_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Message_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Message_fromUserId_idx" ON "Message"("fromUserId");
CREATE INDEX "Message_toUserId_idx" ON "Message"("toUserId");
CREATE INDEX "Message_read_idx" ON "Message"("read");

CREATE TABLE "Leaderboard" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "score" DOUBLE PRECISION NOT NULL,
  "rank" INTEGER,
  "period" TEXT NOT NULL DEFAULT 'WEEKLY',

  CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Leaderboard_userId_idx" ON "Leaderboard"("userId");
CREATE INDEX "Leaderboard_category_idx" ON "Leaderboard"("category");
CREATE INDEX "Leaderboard_score_idx" ON "Leaderboard"("score");

CREATE TABLE "PointTransaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "points" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PointTransaction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PointTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "PointTransaction_userId_idx" ON "PointTransaction"("userId");
CREATE INDEX "PointTransaction_createdAt_idx" ON "PointTransaction"("createdAt");

CREATE TABLE "PersonalTask" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
  "dueDate" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PersonalTask_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PersonalTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "PersonalTask_userId_idx" ON "PersonalTask"("userId");
CREATE INDEX "PersonalTask_status_idx" ON "PersonalTask"("status");
CREATE INDEX "PersonalTask_dueDate_idx" ON "PersonalTask"("dueDate");

CREATE TABLE "TaskStep" (
  "id" TEXT NOT NULL,
  "taskId" TEXT NOT NULL,
  "stepNumber" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "completedAt" TIMESTAMP(3),
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TaskStep_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TaskStep_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TaskStep_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "TaskStep_taskId_idx" ON "TaskStep"("taskId");

CREATE TABLE "TaskComment" (
  "id" TEXT NOT NULL,
  "taskId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TaskComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "TaskComment_taskId_idx" ON "TaskComment"("taskId");
CREATE INDEX "TaskComment_userId_idx" ON "TaskComment"("userId");

CREATE TABLE "Agreement" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "signedById" TEXT,
  "signedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Agreement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Agreement_signedById_fkey" FOREIGN KEY ("signedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "Agreement_projectId_idx" ON "Agreement"("projectId");

CREATE TABLE "Investment" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "investorId" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "equity" DOUBLE PRECISION,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "notes" TEXT,
  "investedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Investment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Investment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Investment_projectId_idx" ON "Investment"("projectId");
CREATE INDEX "Investment_investorId_idx" ON "Investment"("investorId");
CREATE INDEX "Investment_status_idx" ON "Investment"("status");

-- ============================================
-- FUNCTIONS AND TRIGGERS FOR UPDATEDAT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updatedAt
CREATE TRIGGER update_University_updated_at BEFORE UPDATE ON "University" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_User_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Skill_updated_at BEFORE UPDATE ON "Skill" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Experience_updated_at BEFORE UPDATE ON "Experience" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Education_updated_at BEFORE UPDATE ON "Education" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_LeaveRequest_updated_at BEFORE UPDATE ON "LeaveRequest" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Project_updated_at BEFORE UPDATE ON "Project" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_SubTask_updated_at BEFORE UPDATE ON "SubTask" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Milestone_updated_at BEFORE UPDATE ON "Milestone" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Vacancy_updated_at BEFORE UPDATE ON "Vacancy" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ProfessionalRecord_updated_at BEFORE UPDATE ON "ProfessionalRecord" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Rating_updated_at BEFORE UPDATE ON "Rating" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_PersonalTask_updated_at BEFORE UPDATE ON "PersonalTask" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_TaskStep_updated_at BEFORE UPDATE ON "TaskStep" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Agreement_updated_at BEFORE UPDATE ON "Agreement" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
