# 🔐 Demo Credentials for All Stakeholders

## Quick Reference

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Platform Admin | admin@careertodo.com | adminpassword123 | /admin |
| Student | student@careertodo.com | studentpassword123 | /dashboard/student |
| University Admin | university@careertodo.com | universitypassword123 | /dashboard/university |
| Employer | employer@careertodo.com | employerpassword123 | /dashboard/employer |
| Investor | investor@careertodo.com | investorpassword123 | /dashboard/investor |
| Mentor | mentor@careertodo.com | mentorpassword123 | Login as regular user |

---

## Detailed Account Information

### 1️⃣ Platform Administrator

**Access URL**: `/admin/login` or `/admin`
**Email**: `admin@careertodo.com`
**Password**: `adminpassword123`

**Capabilities**:
- Full access to all platform features
- Manage users and accounts
- Monitor platform analytics
- Handle disputes and compliance
- View all projects and activities

**Dashboard**: `/admin` → Access all admin pages:
- `/admin` - Overview
- `/admin/users` - User management
- `/admin/projects` - Project oversight
- `/admin/audit` - Activity logs
- `/admin/compliance` - Compliance tracking
- `/admin/governance` - Governance proposals
- `/admin/content` - Content management
- `/admin/settings` - Platform settings

---

### 2️⃣ Student

**Access URL**: `/auth` → Select "Student" role
**Email**: `student@careertodo.com`
**Password**: `studentpassword123`
**Name**: Alex Johnson
**University**: Demo University
**Major**: Computer Science
**Graduation Year**: 2025

**Capabilities**:
- Create and join projects
- Earn reputation points through tasks
- Build professional records
- Browse marketplace and apply for jobs
- View leaderboards

**Dashboard**: `/dashboard/student`
- Profile management
- View active projects
- Track task progress
- Browse opportunities
- View achievements

---

### 3️⃣ University Administrator

**Access URL**: `/auth` → Select "University Admin" role
**Email**: `university@careertodo.com`
**Password**: `universitypassword123`
**Name**: Dr. Sarah Martinez
**University**: Demo University

**Capabilities**:
- Manage university students
- Approve/reject projects
- Tag students to university
- View university analytics
- Manage departments and programs

**Dashboard**: `/dashboard/university`
- Student overview and analytics
- Project management
- Department management
- University settings
- Activity feed

---

### 4️⃣ Employer / Company

**Access URL**: `/auth` → Select "Employer" role
**Email**: `employer@careertodo.com`
**Password**: `employerpassword123`
**Name**: Tech Ventures Inc.
**Company**: Tech Ventures Inc.
**Position**: Talent Acquisition Manager

**Capabilities**:
- Post job opportunities
- Browse candidate marketplace
- Request background verifications
- Track applications and hiring
- Manage employer profile

**Dashboard**: `/dashboard/employer`
- View candidate applications
- Post new job listings
- Manage verification requests
- Employer profile and settings

---

### 5️⃣ Investor / VC Firm

**Access URL**: `/auth` → Select "Investor" role
**Email**: `investor@careertodo.com`
**Password**: `investorpassword123`
**Name**: Apex Ventures
**Focus**: Technology, SaaS, EdTech

**Capabilities**:
- Browse investment marketplace
- Submit investment proposals
- Track deal pipeline
- Manage portfolio
- View startup opportunities

**Dashboard**: `/dashboard/investor`
- View investment portfolio
- Track deal progress
- Submit new proposals
- Investor profile and settings

---

### 6️⃣ Mentor

**Access URL**: `/auth` → Select "Mentor" role
**Email**: `mentor@careertodo.com`
**Password**: `mentorpassword123`
**Name**: James Chen
**Experience**: 15+ years in tech industry

**Capabilities**:
- Browse projects seeking mentorship
- Provide guidance to students
- Build mentorship portfolio
- Connect with entrepreneurs
- Share expertise and network

**Note**: Mentors access the platform similar to students but with a mentor role designation for project matching.

---

## 🚀 How to Use Demo Accounts

### Option 1: Seed the Database (Recommended)

If you have your Supabase credentials set up:

```bash
# 1. Ensure .env has your Supabase credentials
# 2. Generate Prisma Client
bun run db:generate

# 3. Seed demo data
bun run db:seed
```

This will create all demo users, a university, and a sample project in your database.

### Option 2: Manual Signup

If database seeding fails, you can manually sign up:

1. Go to `/auth`
2. Select the appropriate role
3. Use the email/password combinations above
4. Fill in required profile information

---

## 📋 Demo Data Overview

When you run `bun run db:seed`, the following will be created:

### Users Created:
- 1 Platform Administrator
- 1 Student (Alex Johnson)
- 1 University Admin (Dr. Sarah Martinez)
- 1 Employer (Tech Ventures Inc.)
- 1 Investor (Apex Ventures)
- 1 Mentor (James Chen)

### Organizations Created:
- 1 University (Demo University)

### Projects Created:
- 1 Sample Project (Campus Mobile App)

### Professional Records Created:
- Multiple records demonstrating career progression

---

## 🎯 Testing Different Workflows

### Test Student Flow:
1. Login as student
2. Create a new project at `/projects/create`
3. Join existing projects
4. Browse jobs at `/jobs`
5. View leaderboards at `/leaderboards`

### Test University Admin Flow:
1. Login as university admin
2. Go to `/dashboard/university`
3. View student analytics
4. Approve pending projects
5. Tag students to departments

### Test Employer Flow:
1. Login as employer
2. Go to `/dashboard/employer`
3. Post a job at `/jobs/create`
4. Browse candidates
5. Request verification

### Test Investor Flow:
1. Login as investor
2. Go to `/dashboard/investor`
3. Browse marketplace at `/marketplace`
4. Submit investment proposal
5. Track deal progress

### Test Platform Admin Flow:
1. Login at `/admin/login`
2. Go to `/admin`
3. View platform statistics
4. Manage users
5. Monitor compliance

---

## 🔧 Troubleshooting

### Issue: Login fails with "Invalid email or password"

**Solution**:
- Make sure you're using the correct role
- Verify email spelling
- Check password matches exactly
- If database was seeded, try re-running seed

### Issue: Redirected to auth page instead of dashboard

**Solution**:
- Make sure you're logged in successfully
- Check browser console for errors
- Verify cookies are being set

### Issue: Cannot access admin pages

**Solution**:
- Use admin login: `/admin/login`
- Make sure using admin credentials
- Check if middleware is blocking access (should be fixed now)

---

## 🔄 Resetting Demo Data

To reset all demo data and start fresh:

```bash
# Reset database
bun run db:reset

# Reseed with demo data
bun run db:seed
```

⚠️ **Warning**: This will delete ALL existing data including any real accounts you created!

---

## 📝 Notes

- All demo passwords use the format `[role]password123` for easy remembering
- Demo accounts are for testing and development only
- In production, use strong, unique passwords
- Never commit real credentials to version control
- Consider using environment-specific demo accounts

---

## 🚀 Next Steps

1. **Set up Supabase database** if not already done
2. **Run database seed**: `bun run db:seed`
3. **Test all user roles** using credentials above
4. **Verify each dashboard** works correctly
5. **Test cross-role interactions** (e.g., student creating project, investor funding it)

---

**Last Updated**: $(date +"%B %d, %Y")
