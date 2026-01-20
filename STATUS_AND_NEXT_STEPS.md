# 🔄 Student Dashboard Updates - Current Status & Next Steps

## ✅ Completed Changes:

### 1. **Leave Management Relocated**
- ✅ Removed from separate "Leave" tab
- ✅ Moved to header section beside Check-in button (compact view)
- ✅ Displayed as `Leave Management` card with stats and quick view
- ✅ Properly integrated into overview section

### 2. **Prisma Schema Updates** (Attempted)
- ✅ Added new models: `LeaveRequest`, `Experience`, `Education`, `Skill`, `Vacancy`, `Milestone`
- ✅ Added `rejectionReason` field to `Project` model
- ✅ Added `UNDER_REVIEW`, `VERIFIED` statuses to `ProjectStatus` enum
- ✅ Updated User model with new relations: `leaveRequests`, `experiences`, `education`, `skills`
- ✅ Updated Project model with new relations: `vacancies`, `milestones`

### 3. **API Routes Created** (Attempted)
- ✅ `/api/leave-requests/route.ts` - Full CRUD for leave requests
- ✅ `/api/experiences/route.ts` - Full CRUD for experiences
- ✅ `/api/education/route.ts` - Full CRUD for education
- ✅ `/api/projects/[id]/vacancies/route.ts` - Vacancy management
- ✅ `/api/projects/[id]/milestones/route.ts` - Milestone management

---

## ⚠️ Current Issues:

### **Prisma Schema Problems**
The Prisma schema has encountered errors:
1. Duplicate Skill definitions in original file (lines 894-901 and 1262-1269)
2. Vacancy model referencing unknown `status` field
3. Schema needs migration or reset

**Database State**: Prisma client is showing errors on `db:push`, likely due to:
- Duplicates in schema definition
- Missing or incorrect datasource configuration in schema
- Conflicts with existing Skill model structure

### **API Routes Status**
Routes are created but cannot be tested yet because:
1. Schema has conflicts preventing migration
2. Database may be in inconsistent state

---

## 🔧 Next Steps to Complete:

### Phase 1: Fix Prisma Schema (CRITICAL)
1. **Backup current database** (if important data exists)
2. **Reset schema to clean state** - remove all duplicates and conflicts
3. **Define clear enums** before models
4. **Use correct datasource** - ensure SQLite is properly configured
5. **Define relations properly** - ensure all `@relation` fields point to existing models

### Phase 2: Run Database Migration
1. **Run `bun run db:generate`** - regenerate Prisma client
2. **Verify migration** - ensure no errors
3. **Run `bun run db:push`** - push schema changes

### Phase 3: Test API Routes
1. Test leave requests API
2. Test experiences API
3. Test education API
4. Test project vacancies API
5. Test project milestones API
6. Test team API

### Phase 4: Update Components to Use New APIs
1. Update `LeaveManagement` component to fetch from new APIs
2. Update profile page to fetch from new APIs
3. Update project detail page to fetch from new APIs
4. Update student dashboard to fetch from new APIs

---

## 📋 Schema Models Needed:

### Leave Management
```prisma
model LeaveRequest {
  id          String              @id @default(cuid())
  userId      String
  leaveType   LeaveType
  startDate   DateTime
  endDate     DateTime
  reason      String
  status      LeaveRequestStatus @default(PENDING)
  rejectionReason String?
  reviewedBy  String?
  reviewedAt  DateTime?
  
  // Relations
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([status])
  @@index([startDate])
  @@index([endDate])
}
```

### LinkedIn-Style Experiences
```prisma
model Experience {
  id          String   @id @default(cuid())
  userId      String
  title       String
  company     String
  location    String?
  description String?
  startDate   DateTime
  endDate     DateTime?
  current     Boolean  @default(false)
  skills      String? // JSON array
  
  // Relations
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([startDate])
  @@index([current])
}
```

### Education
```prisma
model Education {
  id          String   @id @default(cuid())
  userId      String
  school      String
  degree      String
  field       String?
  description String?
  startDate   DateTime
  endDate     DateTime
  
  // Relations
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@(olders])
}
```

### Skills
```prisma
model Skill {
  id          String   @id @default(cuid())
  userId      String
  name        String
  level       SkillLevel @default(INTERMEDIATE)
  endorsements Int      @default(0)
  
  // Timestamps
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Relations
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@unique([userId, name])
  @@index([level])
}
```

### Project Vacancies
```prisma
enum EmploymentType {
  FULL_TIME
  PART_TIME
  INTERNSHIP
  CONTRACT
}

model Vacancy {
  id          String         @id @default(cuid())
  projectId   String
  title       String
  description String?
  type        EmploymentType @default(FULL_TIME)
  skills      String? // JSON array
  slots       Int            @default(1)
  filled      Int            @default(0)
  
  // Timestamps
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  // Relations
  project     Project         @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  ++@@index([projectId])
  ++@@index([type])
}
```

### Milestones
```prisma
model Milestone {
  id          String   @id @default(cuid())
  projectId   String
  title       String
  description String?
  status      MilestoneStatus @default(NOT_STARTED)
  dueDate     DateTime
  completedAt DateTime?
  metrics     String? // JSON string for key metrics
  
  // Timestamps
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Relations
  project     Project         @relation(fields: [projectId], references: [ properly, references: [id], onDelete: Cascade)
  
  @@index([projectId])
  @@index([status])
  @index([dueDate])
}
```

---

## 🏗️ API Structure:

### Routes Already Created:
1. `/api/leave-requests/route.ts` - Leave requests
2. `/api/experiences/route.ts` - Experiences
3. `/api/education/route.ts` - Education
4. `/api/projects/[id]/vacancies/route.ts` - Project vacancies
5. `/api/projects/[id]/milestones/route.ts` - Project milestones

---

## 🎯 Implementation Plan:

### Step 1: Fix Prisma Schema (Priority - DO THIS FIRST)
**Problem**: Current schema has duplicate definitions and conflicts

**Solution**:
1. Check existing schema for current Skill model structure
2. Use that structure for all new models (LeaveRequest, Experience, Education, Vacancy, Milestone)
3. Update User model to reference new models
4. Ensure Project model has proper relations
5. Add `rejectionReason` field to Project model
6. Update ProjectStatus enum to include `UNDER_REVIEW` and `VERIFIED`
7. **RUN**: `bun run db:generate` to regenerate Prisma client

### Step 2: Create Database
1. Run `bun run db:push` to apply schema changes

### Step 3: Test APIs
1. Test each API route with Postman or curl
2. Verify data is stored correctly
3. Test all CRUD operations

### Step 4: Update Frontend Components
1. Update LeaveManagement component
2. Update StudentProfile page
3. Update ProjectDetail page
4. Update StudentDashboard to use real APIs

---

## 🚨 Why The Issues Occurred:

**Root Cause**: The Prisma schema file has been manually edited and created with duplicate model definitions, conflicting with existing schema structure.

**Impact**: Database cannot be migrated properly because:
1. Duplicate model names (multiple Skill/Skill models)
2. Inconsistent enum definitions
3. Incorrect field references
4. Prisma client can't parse the schema cleanly

---

## 💡 Recommendation:

### Option A: Clean Schema Reset (RECOMMENDED)
1. Backup current database (if has data)
2. Manually fix Prisma schema file to remove duplicates
3. Run `bun run db:generate` to regenerate client
4. Run `bun run db:push`

### Option B: Work Around Issues
1. Comment out duplicate models
2. Keep existing models, modify to add fields only
3. Fix Vacancy model issues (remove status index)
4. Use existing project/milestone models as reference

### Option C: Start Fresh
1. Create a new clean Prisma schema
2. Use SQLite default configuration
3. Add all models cleanly one by one
4. Migrate database
5. Create API routes cleanly

---

## 📋 Current File Structure:

### Dashboard Files Modified:
- `/home/z/my-project/src/app/dashboard/student/page.tsx`
- Added LeaveManagement to header section
- Removed separate Leave tab
- Updated tabs

### Frontend Components Created:
- `/home/z/my-project/src/components/leave/leave-management.tsx`
- `/home/z/my-project/src/app/dashboard/student/profile/page.tsx`
- `/home/z/my-project/src/app/projects/[id]/page.tsx`

### API Routes Created:
- `/home/z/my-project/src/app/api/leave-requests/route.ts`
- `/home/z/my-project/src/app/api/experiences/route.ts`
- `/home/z/my-project/src/app/api/education/route.ts`
- `/home/z/my-project/src/app/projects/[id]/vacancies/route.ts`
- `/home/z/my-project/src/app/projects/[id]/milestones/risma/route.ts`

### Prisma Schema:
- `/home/z/my-project/prisma/schema.prisma` - Has conflicts, needs fixing

---

## 🔧 Your Options:

**Option 1**: Let me fix the Prisma schema properly
- I'll carefully remove duplicates
- Add missing enums
- Fix relations
- Run `db:generate` and `db:push`

**Option 2**: You fix it yourself
- I've added models with conflicts - you can clean them up

**Option 3**: Start fresh with schema
- Create clean schema from scratch with only needed models
- Run fresh migration

---

## 🎯 Decision:

Let me **fix the Prisma schema properly** and ensure database works. This is blocking all API routes from functioning.

The user is waiting for:
1. ✅ Leave management in header section (completed)
2. 🔄 Proper backend API integration (in progress - blocked by schema issues)

I need to resolve this before proceeding with more features.
