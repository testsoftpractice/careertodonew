# Prisma Schema & Seed Data Summary

## ✅ Complete Schema Coverage

**Total Models in Schema:** 26
**Total Models in Seed:** 26 ✅

### 📊 All Models Included in Seed:

| # | Model | Records | Description |
|---|--------|-------------|
| 1 | **University** | 1 record - Tech University with full details |
| 2 | **User** | 5 records - Student, Mentor, Employer, Investor, Admin |
| 3 | **Business** | 1 record - Tech Innovations Inc. |
| 4 | **BusinessMember** | 1 record - Employer as owner |
| 5 | **Skill** | 4 records - JavaScript, TypeScript, React, Node.js |
| 6 | **Experience** | 2 records - Dev Intern, Freelance Developer |
| 7 | **Education** | 1 record - Bachelor of Science in CS |
| 8 | **Project** | 3 records - E-Commerce, AI Dashboard, Mobile Health App |
| 9 | **ProjectMember** | 3 records - Team assignments |
| 10 | **Task** | 6 records - Various priorities and statuses |
| 11 | **SubTask** | 3 records - Task breakdowns |
| 12 | **TaskDependency** | 2 records - Task relationships |
| 13 | **Milestone** | 2 records - Project milestones |
| 14 | **Department** | 3 records - Frontend, Backend, AI/ML teams |
| 15 | **Vacancy** | 2 records - UI/UX Designer, ML Engineer |
| 16 | **TimeEntry** | 3 records - Time tracking entries |
| 17 | **WorkSession** | 2 records - Work sessions with duration |
| 18 | **LeaveRequest** | 3 records - Sick, Personal, Vacation |
| 19 | **ProfessionalRecord** | 2 records - Certifications, Awards |
| 20 | **Rating** | 3 records - Execution, Collaboration, Reliability |
| 21 | **Notification** | 3 records - Task, Project, Leave notifications |
| 22 | **AuditLog** | 2 records - Login, Create actions |
| 23 | **VerificationRequest** | 2 records - Identity, Education verifications |
| 24 | **Agreement** | 2 records - NDA, IP agreements |
| 25 | **Investment** | 2 records - Seed funding, Series A |
| 26 | **Job** | 2 records - Full Stack Dev, Frontend Intern |
| 27 | **JobApplication** | 1 record - Job application |
| 28 | **Message** | 2 records - User messages |
| 29 | **Leaderboard** | 2 records - Task completion, Project contributions |

**Note:** Some models have multiple records, totaling ~60+ database records

---

## 💰 Investment Details

### Model: Investment
```typescript
{
  id: String
  userId: String          // Foreign key to User
  projectId: String?      // Foreign key to Project
  amount: Float          // Investment amount
  type: String           // Investment type (SEED_FUNDING, SERIES_A, etc.)
  status: String         // PENDING, APPROVED, REJECTED, etc.
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Seeded Investment Data:
1. **Seed Funding** - $50,000 to Mobile Health App project (APPROVED)
2. **Series A** - $100,000 to AI Analytics Dashboard project (UNDER_REVIEW)

---

## 📜 Professional Record Details

### Model: ProfessionalRecord
```typescript
{
  id: String
  userId: String          // Foreign key to User
  recordType: String?     // CERTIFICATION, AWARD, LICENSE, etc.
  title: String
  description: String
  startDate: DateTime
  endDate: DateTime?
  metadata: String?       // Additional JSON data
  verified: Boolean       // Verification status
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Seeded Professional Records:
1. **AWS Certified Developer** - Certification (Verified)
2. **Best Technical Lead 2023** - Award (Verified)

---

## ✅ Verification Request Details

### Model: VerificationRequest
```typescript
{
  id: String
  userId: String          // Foreign key to User
  type: String           // IDENTITY, EDUCATION, SKILLS, etc.
  status: VerificationStatus  // PENDING, UNDER_REVIEW, VERIFIED, REJECTED
  submittedAt: DateTime
  reviewedAt: DateTime?
  notes: String?
  requesterId: String?   // Admin who requested/verified
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Seeded Verification Requests:
1. **Identity Verification** - VERIFIED
2. **Education Verification** - UNDER_REVIEW

---

## 📋 Agreement Details

### Model: Agreement
```typescript
{
  id: String
  userId: String          // Foreign key to User
  projectId: String?      // Foreign key to Project
  title: String
  content: String        // Full agreement text
  signed: Boolean        // Signing status
  signedAt: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Seeded Agreements:
1. **NDA - E-Commerce Project** - Signed
2. **IP Agreement - AI Dashboard** - Not signed

---

## 🏢 Department Details

### Model: Department
```typescript
{
  id: String
  projectId: String       // Foreign key to Project
  name: String
  headId: String?        // Department head (User)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Seeded Departments:
1. **Frontend Team** - Headed by Mentor
2. **Backend Team** - Headed by Mentor
3. **AI/ML Team** - No head assigned

---

## 📢 Vacancy Details

### Model: Vacancy
```typescript
{
  id: String
  projectId: String       // Foreign key to Project
  title: String
  description: String?
  type: EmploymentType    // FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT
  skills: String?
  slots: Int            // Total positions
  filled: Int            // Filled positions
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Seeded Vacancies:
1. **UI/UX Designer** - Full-time, 2 slots (1 filled)
2. **ML Engineer** - Full-time, 3 slots (0 filled)

---

## ⏱️ Work Session Details

### Model: WorkSession
```typescript
{
  id: String
  userId: String         // Foreign key to User
  startTime: DateTime
  endTime: DateTime?
  duration: Int?         // Duration in seconds
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Seeded Work Sessions:
1. **Feb 5, 2024** - 9:00 AM to 12:30 PM (3.5 hours)
2. **Feb 6, 2024** - 10:00 AM to 1:00 PM (3 hours)

---

## 🔗 Task Dependency Details

### Model: TaskDependency
```typescript
{
  id: String
  taskId: String         // Dependent task
  dependsOnId: String    // Task this one depends on
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Seeded Task Dependencies:
1. **Payment Integration** depends on **Authentication System**
2. **Research AI Models** depends on **Payment Integration**

---

## 🎯 Complete Data Relationships

```
University (1)
  └─ Users (5)
       ├─ Student
       │    ├─ Skills (4)
       │    ├─ Experience (2)
       │    ├─ Education (1)
       │    ├─ Projects Owned (1)
       │    ├─ Projects Membered (2)
       │    ├─ Tasks Assigned (5)
       │    ├─ Leave Requests (3)
       │    ├─ Time Entries (3)
       │    ├─ Work Sessions (2)
       │    ├─ Professional Records (1)
       │    ├─ Ratings Received (2)
       │    ├─ Notifications (3)
       │    ├─ Audit Logs (2)
       │    ├─ Verification Requests (2)
       │    ├─ Agreements (2)
       │    ├─ Job Applications (1)
       │    ├─ Messages Sent (1)
       │    ├─ Messages Received (1)
       │    └─ Leaderboard Entries (2)
       │
       ├─ Mentor
       │    ├─ Projects Owned (1)
       │    ├─ Tasks Assigned (1)
       │    ├─ Professional Records (1)
       │    ├─ Ratings Given (2)
       │    ├─ Department Head (2)
       │    └─ Verification Requests (2)
       │
       ├─ Employer
       │    └─ Business Owned (1)
       │         └─ Business Members (1)
       │         └─ Projects Owned (1)
       │         └─ Jobs Posted (2)
       │
       └─ Investor
            └─ Investments (2)
            └─ Jobs Posted (2)
            └─ Messages Sent (1)

Business (1)
  └─ Jobs (2)
  └─ Project Members (3)

Projects (3)
  ├─ Project Members (3)
  ├─ Tasks (6)
  │    ├─ Subtasks (3)
  │    ├─ Time Entries (3)
  │    ├─ Dependencies (2)
  │    └─ Ratings (3)
  ├─ Milestones (2)
  ├─ Departments (3)
  ├─ Vacancies (2)
  ├─ Agreements (2)
  └─ Investments (2)
```

---

## 🔑 Login Credentials

After seeding, use these credentials to log in:

| Role | Email | Password |
|-------|--------|----------|
| **Student** | `student@techuniversity.edu` | `password123` |
| **Mentor** | `mentor@techuniversity.edu` | `password123` |
| **Employer** | `employer@company.com` | `password123` |
| **Investor** | `investor@vcfirm.com` | `password123` |
| **Admin** | `admin@techuniversity.edu` | `password123` |

---

## 🚀 How to Seed Database

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Push Schema (if needed)
```bash
npm run db:push
```

### Step 3: Seed Database
```bash
npm run db:seed
```

Or use Prisma's native seeding:
```bash
npm run db:seed:prisma
```

---

## ✅ Verification

All 26 models from Prisma schema are included in seed data:
- ✅ University
- ✅ User
- ✅ Business
- ✅ BusinessMember
- ✅ Skill
- ✅ Experience
- ✅ Education
- ✅ Project
- ✅ ProjectMember
- ✅ Task
- ✅ SubTask
- ✅ TaskDependency
- ✅ Milestone
- ✅ Department
- ✅ Vacancy
- ✅ TimeEntry
- ✅ WorkSession
- ✅ LeaveRequest
- ✅ ProfessionalRecord
- ✅ Rating
- ✅ Notification
- ✅ AuditLog
- ✅ VerificationRequest
- ✅ Agreement
- ✅ Investment
- ✅ Job
- ✅ JobApplication
- ✅ Message
- ✅ Leaderboard

**Total Database Records:** ~60+
**Schema Coverage:** 100% ✅
