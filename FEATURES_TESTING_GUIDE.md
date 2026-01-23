# Project Features & Testing Guide

## Overview

This document provides a comprehensive guide to all major features and functionalities available in the CareerToDo application. Use this guide to test and verify that all features are working correctly.

## Feature Categories

1. **Project Management** - Create and manage projects
2. **Task Management** - Task creation, assignment, and tracking
3. **Job Management** - Job posting and application system
4. **Leave Management** - Leave request submission and approval
5. **Time Tracking** - Check-in/check-out and work session tracking
6. **User Management** - Authentication, roles, and profiles
7. **Business Management** - Business creation and team management
8. **Investment System** - Project funding and investment tracking
9. **Dashboard Analytics** - Role-specific dashboards with metrics
10. **Notification System** - Real-time notifications

---

## 1. Project Management

### Create a Project

**Endpoint:** `POST /api/projects`

**Request Body:**
```json
{
  "name": "E-Commerce Platform",
  "description": "A full-stack e-commerce platform with advanced features",
  "ownerId": "user-id-here",
  "startDate": "2024-01-15",
  "endDate": "2024-06-30",
  "budget": 50000,
  "category": "Web Development"
}
```

**Test Steps:**
1. Login as an Employer or Student
2. Navigate to `/projects/create`
3. Fill in project details
4. Submit the form
5. Verify project appears in projects list

**API Response:**
```json
{
  "success": true,
  "data": {
    "id": "project-id",
    "name": "E-Commerce Platform",
    "status": "IDEA",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

### Update Project Status

**Endpoints:**
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `POST /api/projects/[id]/stage-transition` - Transition project stage

**Test Steps:**
1. Open a project detail page
2. Click "Edit Project"
3. Update project details or status
4. Save changes
5. Verify updates are reflected

---

## 2. Task Management

### Create a Task

**Endpoint:** `POST /api/tasks`

**Request Body:**
```json
{
  "title": "Design User Authentication System",
  "description": "Implement secure user authentication with JWT tokens",
  "projectId": "project-id",
  "assigneeId": "assignee-user-id",
  "assignedBy": "creator-user-id",
  "priority": "HIGH",
  "dueDate": "2024-02-15",
  "estimatedHours": 8.0
}
```

**Test Steps:**
1. Navigate to a project
2. Go to "Tasks" tab
3. Click "Create Task"
4. Fill in task details
5. Select assignee from team members
6. Submit task

**API Response:**
```json
{
  "success": true,
  "data": {
    "id": "task-id",
    "title": "Design User Authentication System",
    "status": "TODO",
    "priority": "HIGH"
  }
}
```

### Update Task Status

**Endpoint:** `PATCH /api/tasks`

**Request Body:**
```json
{
  "id": "task-id",
  "status": "IN_PROGRESS",
  "assigneeId": "user-id"
}
```

**Task Status Workflow:**
```
BACKLOG → TODO → IN_PROGRESS → REVIEW → DONE
         ↓
      BLOCKED
         ↓
      CANCELLED
```

**Test Steps:**
1. Open task detail view
2. Update task status (e.g., TODO → IN_PROGRESS)
3. Verify status changes
4. Test transitioning through all statuses

---

## 3. Job Management

### Post a Job

**Endpoint:** `POST /api/jobs`

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "description": "We're looking for an experienced React developer...",
  "type": "FULL_TIME",
  "location": "Remote",
  "salary": "$80,000 - $120,000",
  "businessId": "business-id",
  "published": true
}
```

**Test Steps:**
1. Login as Employer
2. Navigate to `/jobs/create`
3. Fill in job details
4. Select job type (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
5. Publish the job

**API Response:**
```json
{
  "success": true,
  "data": {
    "id": "job-id",
    "title": "Senior React Developer",
    "type": "FULL_TIME",
    "published": true,
    "publishedAt": "2024-01-15T00:00:00.000Z"
  },
  "message": "Job created successfully"
}
```

### Apply for a Job

**Endpoint:** `POST /api/jobs/[id]/apply`

**Request Body:**
```json
{
  "userId": "applicant-id",
  "coverLetter": "I'm interested in this position because..."
}
```

**Test Steps:**
1. Login as Student or Investor
2. Browse jobs at `/jobs`
3. Click on a job posting
4. Click "Apply Now"
5. Fill in application details
6. Submit application

---

## 4. Leave Management

### Submit a Leave Request

**Endpoint:** `POST /api/leave-requests`

**Request Body:**
```json
{
  "leaveType": "VACATION",
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "reason": "Family vacation"
}
```

**Leave Types Available:**
- `SICK_LEAVE`
- `PERSONAL_LEAVE`
- `VACATION`
- `EMERGENCY`
- `BEREAVEMENT`
- `MATERNITY`
- `PATERNITY`

**Test Steps:**
1. Login as any authenticated user
2. Navigate to dashboard
3. Find leave request section or form
4. Select leave type
5. Choose start and end dates
6. Provide reason
7. Submit request

**API Response:**
```json
{
  "success": true,
  "data": {
    "id": "leave-request-id",
    "leaveType": "VACATION",
    "status": "PENDING",
    "startDate": "2024-02-01T00:00:00.000Z",
    "endDate": "2024-02-05T00:00:00.000Z"
  },
  "message": "Leave request created successfully"
}
```

### Approve/Reject Leave Request

**Endpoint:** `PATCH /api/leave-requests/[id]`

**Request Body (Approve):**
```json
{
  "status": "APPROVED"
}
```

**Request Body (Reject):**
```json
{
  "status": "REJECTED",
  "rejectionReason": "Not enough notice period"
}
```

**Test Steps:**
1. Login as Employer or Platform Admin
2. Navigate to team management or dashboard
3. Find pending leave requests
4. Review the request
5. Approve or reject with reason (if rejecting)
6. Verify notification sent to user

---

## 5. Time Tracking (Check-in/Check-out)

### Start Work Session (Check-in)

**Endpoint:** `POST /api/work-sessions`

**Request Body:**
```json
{
  "userId": "user-id"
}
```

**Test Steps:**
1. Login as any authenticated user
2. Navigate to dashboard or time tracking section
3. Click "Check In" or "Start Timer"
4. Verify timer starts

**API Response:**
```json
{
  "success": true,
  "data": {
    "id": "session-id",
    "userId": "user-id",
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": null,
    "duration": null
  }
}
```

### End Work Session (Check-out)

**Endpoint:** `PATCH /api/work-sessions?id=session-id`

**Request Body:**
```json
{
  "duration": 14400
}
```

**Test Steps:**
1. With an active work session
2. Click "Check Out" or "Stop Timer"
3. Verify session ends and duration is recorded
4. Check time entries for the session

**API Response:**
```json
{
  "success": true,
  "data": {
    "id": "session-id",
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T14:00:00.000Z",
    "duration": 14400
  }
}
```

### View Time Entries

**Endpoint:** `GET /api/time-entries?userId=user-id&taskId=task-id`

**Test Steps:**
1. Navigate to project task view
2. Click "Time Entries" tab
3. View logged time for tasks
4. Verify work sessions are converted to entries

---

## 6. User Management

### User Registration

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "STUDENT"
}
```

**User Roles:**
- `STUDENT` - Students and learners
- `EMPLOYER` - Business owners and hiring managers
- `INVESTOR` - Investors and venture capitalists
- `UNIVERSITY_ADMIN` - University administrators
- `PLATFORM_ADMIN` - Platform administrators

**Test Steps:**
1. Go to `/auth`
2. Click "Sign Up"
3. Fill in registration form
4. Select user role
5. Submit registration
6. Verify email verification process

### User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "student@techuniversity.edu",
  "password": "password123"
}
```

**Test Steps:**
1. Go to `/auth`
2. Enter email and password
3. Click "Login"
4. Verify session is created
5. Redirect to appropriate dashboard based on role

### User Profile

**Endpoints:**
- `GET /api/users` - Get all users (filtered)
- `GET /api/users/[id]` - Get user details
- `PATCH /api/users/[id]` - Update user profile

**Test Steps:**
1. Navigate to profile settings
2. Update profile information
3. Add skills, education, experience
4. Save changes
5. Verify profile updates

---

## 7. Business Management

### Create a Business

**Endpoint:** `POST /api/businesses`

**Request Body:**
```json
{
  "name": "Tech Innovations Inc.",
  "description": "Leading technology company",
  "industry": "Technology",
  "location": "San Francisco, CA",
  "website": "https://techinnovations.com",
  "size": "51-200",
  "ownerId": "user-id"
}
```

**Test Steps:**
1. Login as Employer or Student
2. Navigate to `/business/create`
3. Fill in business details
4. Submit business creation
5. Verify business appears in list

### Add Business Members

**Endpoint:** `POST /api/businesses/[id]/members`

**Request Body:**
```json
{
  "userId": "new-member-id",
  "role": "TEAM_MEMBER"
}
```

**Business Roles:**
- `OWNER`
- `ADMIN`
- `HR_MANAGER`
- `PROJECT_MANAGER`
- `TEAM_LEAD`
- `RECRUITER`
- `TEAM_MEMBER`
- `VIEWER`

**Test Steps:**
1. Open business dashboard
2. Go to "Team" or "Members" section
3. Invite or add members
4. Assign roles
5. Verify members appear in list

---

## 8. Investment System

### Make an Investment

**Endpoint:** `POST /api/investments`

**Request Body:**
```json
{
  "projectId": "project-id",
  "investorId": "investor-user-id",
  "amount": 50000,
  "equity": 10,
  "notes": "Investment for product development"
}
```

**Test Steps:**
1. Login as Investor
2. Navigate to marketplace or project
3. Click "Invest" or "Fund Project"
4. Enter investment details
5. Submit investment
6. Verify investment is recorded

### View Investments

**Endpoints:**
- `GET /api/investments?investorId=user-id` - Get investor's investments
- `GET /api/investments/deals` - Get investment deals

**Test Steps:**
1. Login as Investor
2. Navigate to `/dashboard/investor/portfolio`
3. View all investments
4. Check investment status and returns

---

## 9. Dashboard Analytics

### Student Dashboard

**Endpoint:** `GET /api/dashboard/student`

**Features:**
- Course progress tracking
- Grades overview
- Assignment deadlines
- Study time statistics
- Skills matrix
- Achievement badges

**Test Steps:**
1. Login as Student
2. Navigate to `/dashboard/student`
3. Verify all widgets display correctly
4. Check statistics are accurate

### Employer Dashboard

**Endpoint:** `GET /api/dashboard/employer`

**Features:**
- Job postings overview
- Candidate pipeline
- Team performance metrics
- Hiring statistics
- Active projects

**Test Steps:**
1. Login as Employer
2. Navigate to `/dashboard/employer`
3. Verify hiring pipeline data
4. Check team performance metrics

### Investor Dashboard

**Endpoint:** `GET /api/dashboard/investor`

**Features:**
- Portfolio overview
- Investment deals
- Financial metrics
- Startup tracker
- ROI statistics

**Test Steps:**
1. Login as Investor
2. Navigate to `/dashboard/investor`
3. Verify portfolio data displays
4. Check financial metrics

### University Dashboard

**Endpoint:** `GET /api/dashboard/university`

**Features:**
- Student statistics
- Department performance
- Research projects
- Funding overview
- Project approvals

**Test Steps:**
1. Login as University Admin
2. Navigate to `/dashboard/university`
3. Verify student data displays
4. Check department performance

---

## 10. Notification System

### Get Notifications

**Endpoint:** `GET /api/notifications?userId=user-id`

**Test Steps:**
1. Login as any user
2. Click notification bell icon
3. View notification list
4. Mark notifications as read

**Notification Types:**
- `INFO` - General information
- `SUCCESS` - Success messages
- `WARNING` - Warning messages
- `ERROR` - Error messages
- `TASK_ASSIGNED` - New task assignment
- `PROJECT_UPDATE` - Project updates
- `VERIFICATION` - Verification requests
- `INVESTMENT` - Investment updates
- `MESSAGE` - New messages

---

## Testing Checklist

Use this checklist to verify all features are working:

### Authentication & Authorization
- [ ] User registration works
- [ ] User login works
- [ ] Logout works
- [ ] Password reset works
- [ ] Role-based access control works

### Project Management
- [ ] Create project
- [ ] Update project details
- [ ] Delete project
- [ ] Add project members
- [ ] Transition project stages

### Task Management
- [ ] Create task
- [ ] Update task status
- [ ] Assign task to user
- [ ] Add subtasks
- [ ] Set task priority
- [ ] Track time on task

### Job Management
- [ ] Create job posting
- [ ] Publish job
- [ ] Apply for job
- [ ] View job applications
- [ ] Update job status

### Leave Management
- [ ] Submit leave request
- [ ] Approve leave request
- [ ] Reject leave request
- [ ] Cancel pending request
- [ ] View leave history

### Time Tracking
- [ ] Start work session (check-in)
- [ ] End work session (check-out)
- [ ] View time entries
- [ ] View work sessions
- [ ] Calculate total hours

### Business Management
- [ ] Create business
- [ ] Add business members
- [ ] Update business details
- [ ] Remove business members

### Investment System
- [ ] Make investment
- [ ] View portfolio
- [ ] Track investment returns
- [ ] View investment deals

### Dashboard
- [ ] Student dashboard loads
- [ ] Employer dashboard loads
- [ ] Investor dashboard loads
- [ ] University dashboard loads
- [ ] Dashboard metrics are accurate

### Notifications
- [ ] Receive notifications
- [ ] Mark as read
- [ ] Delete notifications
- [ ] Notification badges display

---

## API Testing with cURL

### Test Project Creation

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "A test project",
    "ownerId": "user-id",
    "category": "Testing"
  }'
```

### Test Task Creation

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "projectId": "project-id",
    "assignedBy": "user-id",
    "priority": "HIGH"
  }'
```

### Test Leave Request

```bash
curl -X POST http://localhost:3000/api/leave-requests \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your-session-token" \
  -d '{
    "leaveType": "VACATION",
    "startDate": "2024-02-01",
    "endDate": "2024-02-05",
    "reason": "Testing"
  }'
```

---

## Troubleshooting

### Feature Not Working

1. **Check authentication** - Ensure user is logged in
2. **Check permissions** - Verify user has correct role
3. **Check API** - Use browser DevTools to view API responses
4. **Check logs** - Review terminal logs for errors
5. **Check database** - Verify data exists in Supabase

### Database Issues

1. **Verify connection** - Test with `bun run db:push`
2. **Check schema** - Ensure migrations are applied
3. **Check permissions** - Verify Supabase user has correct permissions

### Performance Issues

1. **Check network** - Ensure stable internet connection
2. **Check database** - Review query performance in Supabase
3. **Check caching** - Verify API responses are cached appropriately

---

## Support & Documentation

- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- Project Issues: Check GitHub issues and documentation

---

**Note:** All endpoints require proper authentication unless they are public routes. Include the session cookie or JWT token in your requests.
