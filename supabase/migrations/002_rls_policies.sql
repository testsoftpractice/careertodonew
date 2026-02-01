-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE "University" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Skill" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Experience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Education" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeaveRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubTask" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TaskDependency" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Milestone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Department" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vacancy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TimeEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProfessionalRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Rating" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Business" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BusinessMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JobApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Leaderboard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PointTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PersonalTask" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TaskStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TaskComment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Agreement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Investment" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- UNIVERSITY POLICIES
-- ============================================

-- Anyone can read universities
CREATE POLICY "Universities are viewable by everyone"
  ON "University" FOR SELECT
  USING (true);

-- Only platform admins can create universities
CREATE POLICY "Only platform admins can create universities"
  ON "University" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE "User"."id" = auth.uid()
      AND "User"."role" = 'PLATFORM_ADMIN'
    )
  );

-- Only platform admins and university admins can update universities
CREATE POLICY "University admins can update their universities"
  ON "University" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE "User"."id" = auth.uid()
      AND ("User"."role" = 'PLATFORM_ADMIN' OR "User"."role" = 'UNIVERSITY_ADMIN')
    )
  );

-- ============================================
-- USER POLICIES
-- ============================================

-- Users can read public profiles
CREATE POLICY "User profiles are viewable by everyone"
  ON "User" FOR SELECT
  USING (
    "emailVerified" = true
    OR "id" = auth.uid()
    OR EXISTS (
      SELECT 1 FROM "User" u
      WHERE u."id" = auth.uid()
      AND u."role" IN ('PLATFORM_ADMIN', 'UNIVERSITY_ADMIN', 'EMPLOYER')
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON "User" FOR UPDATE
  USING ("id" = auth.uid());

-- Admins can update any user
CREATE POLICY "Admins can update any user"
  ON "User" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE "User"."id" = auth.uid()
      AND "User"."role" IN ('PLATFORM_ADMIN', 'UNIVERSITY_ADMIN')
    )
  );

-- ============================================
-- PROJECT POLICIES
-- ============================================

-- Anyone can read public projects
CREATE POLICY "Public projects are viewable by everyone"
  ON "Project" FOR SELECT
  USING (
    "status" IN ('IN_PROGRESS', 'COMPLETED')
    OR "ownerId" = auth.uid()
    OR EXISTS (
      SELECT 1 FROM "ProjectMember"
      WHERE "ProjectMember"."projectId" = "Project"."id"
      AND "ProjectMember"."userId" = auth.uid()
    )
  );

-- Users can create their own projects
CREATE POLICY "Users can create projects"
  ON "Project" FOR INSERT
  WITH CHECK ("ownerId" = auth.uid());

-- Project owners and members can update projects
CREATE POLICY "Project owners and members can update projects"
  ON "Project" FOR UPDATE
  USING (
    "ownerId" = auth.uid()
    OR EXISTS (
      SELECT 1 FROM "ProjectMember"
      WHERE "ProjectMember"."projectId" = "Project"."id"
      AND "ProjectMember"."userId" = auth.uid()
      AND "ProjectMember"."role" IN ('OWNER', 'PROJECT_MANAGER', 'TEAM_LEAD')
    )
  );

-- ============================================
-- TASK POLICIES
-- ============================================

-- Anyone can read tasks from public projects
CREATE POLICY "Tasks are viewable by project members"
  ON "Task" FOR SELECT
  USING (
    "assignedTo" = auth.uid()
    OR "assignedBy" = auth.uid()
    OR EXISTS (
      SELECT 1 FROM "ProjectMember"
      WHERE "ProjectMember"."projectId" = "Task"."projectId"
      AND "ProjectMember"."userId" = auth.uid()
    )
  );

-- Project members can create tasks
CREATE POLICY "Project members can create tasks"
  ON "Task" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "ProjectMember"
      WHERE "ProjectMember"."projectId" = "Task"."projectId"
      AND "ProjectMember"."userId" = auth.uid()
    )
  );

-- Task assignees and creators can update tasks
CREATE POLICY "Task assignees and creators can update tasks"
  ON "Task" FOR UPDATE
  USING (
    "assignedTo" = auth.uid()
    OR "assignedBy" = auth.uid()
    OR EXISTS (
      SELECT 1 FROM "Project"
      WHERE "Project"."id" = "Task"."projectId"
      AND "Project"."ownerId" = auth.uid()
    )
  );

-- ============================================
-- NOTIFICATION POLICIES
-- ============================================

-- Users can only read their own notifications
CREATE POLICY "Users can read their own notifications"
  ON "Notification" FOR SELECT
  USING ("userId" = auth.uid());

-- System can create notifications for users
CREATE POLICY "System can create notifications"
  ON "Notification" FOR INSERT
  WITH CHECK (true);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update their own notifications"
  ON "Notification" FOR UPDATE
  USING ("userId" = auth.uid());

-- ============================================
-- PERSONAL TASK POLICIES
-- ============================================

-- Users can only read their own personal tasks
CREATE POLICY "Users can read their own personal tasks"
  ON "PersonalTask" FOR SELECT
  USING ("userId" = auth.uid());

-- Users can create their own personal tasks
CREATE POLICY "Users can create personal tasks"
  ON "PersonalTask" FOR INSERT
  WITH CHECK ("userId" = auth.uid());

-- Users can update their own personal tasks
CREATE POLICY "Users can update their personal tasks"
  ON "PersonalTask" FOR UPDATE
  USING ("userId" = auth.uid());

-- ============================================
-- SKILL POLICIES
-- ============================================

-- Anyone can read skills
CREATE POLICY "Skills are viewable by everyone"
  ON "Skill" FOR SELECT
  USING (true);

-- Users can create their own skills
CREATE POLICY "Users can create their own skills"
  ON "Skill" FOR INSERT
  WITH CHECK ("userId" = auth.uid());

-- Users can update their own skills
CREATE POLICY "Users can update their own skills"
  ON "Skill" FOR UPDATE
  USING ("userId" = auth.uid());

-- ============================================
-- RATING POLICIES
-- ============================================

-- Anyone can read ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON "Rating" FOR SELECT
  USING (true);

-- Users can create ratings for others
CREATE POLICY "Users can create ratings"
  ON "Rating" FOR INSERT
  WITH CHECK ("fromUserId" = auth.uid());

-- Users can update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON "Rating" FOR UPDATE
  USING ("fromUserId" = auth.uid());

-- ============================================
-- MESSAGE POLICIES
-- ============================================

-- Users can read messages they sent or received
CREATE POLICY "Users can read their own messages"
  ON "Message" FOR SELECT
  USING (
    "fromUserId" = auth.uid()
    OR "toUserId" = auth.uid()
  );

-- Users can send messages
CREATE POLICY "Users can send messages"
  ON "Message" FOR INSERT
  WITH CHECK ("fromUserId" = auth.uid());

-- Users can mark messages as read
CREATE POLICY "Users can update received messages"
  ON "Message" FOR UPDATE
  USING ("toUserId" = auth.uid());

-- ============================================
-- JOB POLICIES
-- ============================================

-- Anyone can read jobs
CREATE POLICY "Jobs are viewable by everyone"
  ON "Job" FOR SELECT
  USING ("status" = 'OPEN' OR "postedById" = auth.uid());

-- Employers can create jobs
CREATE POLICY "Employers can create jobs"
  ON "Job" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE "User"."id" = auth.uid()
      AND "User"."role" = 'EMPLOYER'
    )
  );

-- Job posters can update their own jobs
CREATE POLICY "Job posters can update their jobs"
  ON "Job" FOR UPDATE
  USING ("postedById" = auth.uid());

-- ============================================
-- JOB APPLICATION POLICIES
-- ============================================

-- Job posters can read applications for their jobs
CREATE POLICY "Job posters can read applications"
  ON "JobApplication" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Job"
      WHERE "Job"."id" = "JobApplication"."jobId"
      AND "Job"."postedById" = auth.uid()
    )
    OR "userId" = auth.uid()
  );

-- Users can apply to jobs
CREATE POLICY "Users can apply to jobs"
  ON "JobApplication" FOR INSERT
  WITH CHECK ("userId" = auth.uid());

-- Users can update their own applications
CREATE POLICY "Users can update their own applications"
  ON "JobApplication" FOR UPDATE
  USING ("userId" = auth.uid());

-- ============================================
-- BUSINESS POLICIES
-- ============================================

-- Anyone can read businesses
CREATE POLICY "Businesses are viewable by everyone"
  ON "Business" FOR SELECT
  USING (true);

-- Users can create businesses
CREATE POLICY "Users can create businesses"
  ON "Business" FOR INSERT
  WITH CHECK (true);

-- Business members can update their business
CREATE POLICY "Business members can update their business"
  ON "Business" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "BusinessMember"
      WHERE "BusinessMember"."businessId" = "Business"."id"
      AND "BusinessMember"."userId" = auth.uid()
      AND "BusinessMember"."role" IN ('OWNER', 'ADMIN')
    )
  );

-- ============================================
-- EXPERIENCE & EDUCATION POLICIES
-- ============================================

-- Anyone can read experiences and education
CREATE POLICY "Experience is viewable by everyone"
  ON "Experience" FOR SELECT
  USING (true);

CREATE POLICY "Education is viewable by everyone"
  ON "Education" FOR SELECT
  USING (true);

-- Users can create their own experience and education
CREATE POLICY "Users can create their own experience"
  ON "Experience" FOR INSERT
  WITH CHECK ("userId" = auth.uid());

CREATE POLICY "Users can create their own education"
  ON "Education" FOR INSERT
  WITH CHECK ("userId" = auth.uid());

-- Users can update their own experience and education
CREATE POLICY "Users can update their own experience"
  ON "Experience" FOR UPDATE
  USING ("userId" = auth.uid());

CREATE POLICY "Users can update their own education"
  ON "Education" FOR UPDATE
  USING ("userId" = auth.uid());

-- ============================================
-- AUDIT LOG POLICIES
-- ============================================

-- Only platform admins can read audit logs
CREATE POLICY "Only admins can read audit logs"
  ON "AuditLog" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE "User"."id" = auth.uid()
      AND "User"."role" = 'PLATFORM_ADMIN'
    )
  );

-- System can create audit logs
CREATE POLICY "System can create audit logs"
  ON "AuditLog" FOR INSERT
  WITH CHECK (true);

-- ============================================
-- LEADERBOARD POLICIES
-- ============================================

-- Anyone can read leaderboards
CREATE POLICY "Leaderboards are viewable by everyone"
  ON "Leaderboard" FOR SELECT
  USING (true);

-- System can create leaderboard entries
CREATE POLICY "System can create leaderboard entries"
  ON "Leaderboard" FOR INSERT
  WITH CHECK (true);

-- ============================================
-- POINT TRANSACTION POLICIES
-- ============================================

-- Users can read their own point transactions
CREATE POLICY "Users can read their own point transactions"
  ON "PointTransaction" FOR SELECT
  USING ("userId" = auth.uid());

-- System can create point transactions
CREATE POLICY "System can create point transactions"
  ON "PointTransaction" FOR INSERT
  WITH CHECK (true);
