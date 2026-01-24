# Quick Start Guide - CareerToDo Application

## Prerequisites

- Node.js 18+ or Bun
- Supabase account
- Git (optional)

## Setup Instructions

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Supabase Database

Follow the detailed guide in `SUPABASE_SETUP.md`, but here's the quick version:

1. Create a Supabase project at https://supabase.com
2. Get your connection strings from Dashboard > Settings > Database
3. Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

4. Edit `.env` with your Supabase credentials:

```env
# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Connection pooling (for application)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-very-long-secure-string"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

Push the schema to Supabase:

```bash
bun run db:push
```

### 4. Seed Database (Optional but Recommended)

Populate with test data:

```bash
bun run db:seed
```

**Seed credentials:**
- Student: student@techuniversity.edu / password123
- Student 2: student2@techuniversity.edu / password123
- Employer: employer@techinnovations.com / password123
- Investor: investor@vcfirm.com / password123

### 5. Start Development Server

```bash
bun run dev
```

Visit: http://localhost:3000

## Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint

# Database
bun run db:push          # Push schema to database
bun run db:migrate        # Create migration
bun run db:generate       # Generate Prisma client
bun run db:reset          # Force reset database
bun run db:reset:seed     # Force reset and reseed
bun run db:seed           # Seed database
bun run db:deploy        # Deploy migrations (production)
```

## Quick Testing Guide

### Test 1: User Registration & Login

1. Go to http://localhost:3000/auth
2. Click "Sign Up"
3. Fill in details and register
4. Login with your credentials

### Test 2: Create a Project

1. Login as Employer or Student
2. Go to http://localhost:3000/projects/create
3. Fill in project details
4. Create project
5. Verify it appears in project list

### Test 3: Create a Task

1. Open a project
2. Go to Tasks tab
3. Click "Create Task"
4. Fill in task details
5. Create task
6. Update task status (TODO → IN_PROGRESS → DONE)

### Test 4: Post a Job

1. Login as Employer
2. Go to http://localhost:3000/jobs/create
3. Fill in job details
4. Publish job
5. Verify it appears in jobs list

### Test 5: Apply for a Job

1. Login as Student
2. Go to http://localhost:3000/jobs
3. Click on a job
4. Click "Apply Now"
5. Submit application

### Test 6: Submit Leave Request

1. Login as any user
2. Navigate to dashboard
3. Find leave request form
4. Fill in details (type, dates, reason)
5. Submit request
6. Verify it appears as pending

### Test 7: Check-In/Check-Out

1. Login as any user
2. Go to dashboard or time tracking section
3. Click "Check In"
4. Wait a few seconds
5. Click "Check Out"
6. Verify work session is recorded

## Common Issues & Solutions

### Issue: Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
1. Verify DATABASE_URL and DIRECT_URL in `.env`
2. Check Supabase project is active (not paused)
3. Test connection: `bun run db:push`

### Issue: Migration Failed

**Error:** `Migration failed: database error`

**Solution:**
1. Check Prisma schema syntax
2. Ensure directUrl is set correctly
3. Try `bun run db:push` instead

### Issue: Seeding Failed

**Error:** `Seed failed: Table does not exist`

**Solution:**
1. Ensure schema is pushed: `bun run db:push`
2. Check for typos in connection strings
3. Verify Supabase user has permissions

### Issue: Authentication Failed

**Error:** `Unauthorized` or `Invalid token`

**Solution:**
1. Verify JWT_SECRET is set in `.env`
2. Clear browser cookies and re-login
3. Check user role in database

### Issue: Page Not Found

**Error:** `404 - Page not found`

**Solution:**
1. Ensure dev server is running: `bun run dev`
2. Check you're accessing correct URL
3. Verify the route exists

## Project Structure

```
/home/z/my-project/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed data
│   └── migrations/         # Database migrations
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   └── [pages]/       # Other pages
│   ├── components/
│   │   ├── ui/            # UI components
│   │   └── [feature]/      # Feature components
│   ├── lib/
│   │   ├── auth/          # Authentication utilities
│   │   └── db.ts          # Database client
│   └── hooks/             # React hooks
├── public/                # Static assets
├── .env                   # Environment variables (NOT in git)
├── .env.example           # Example environment variables
├── package.json           # Dependencies and scripts
└── next.config.ts         # Next.js configuration
```

## Key Features Overview

| Feature | Description | Who Can Access |
|---------|-------------|----------------|
| **Projects** | Create and manage projects | Students, Employers |
| **Tasks** | Assign and track tasks | All authenticated users |
| **Jobs** | Post and apply for jobs | Employers, Students |
| **Leave** | Request and approve leave | All authenticated users |
| **Time Tracking** | Check-in/check-out system | All authenticated users |
| **Investments** | Fund projects and track investments | Investors |
| **Analytics** | Role-specific dashboards | All authenticated users |
| **Notifications** | Real-time notifications | All authenticated users |

## Testing API Endpoints

You can test API endpoints using tools like:
- cURL
- Postman
- Insomnia
- Thunder Client

Example with cURL:

```bash
# Get all projects
curl http://localhost:3000/api/projects

# Create a new project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","ownerId":"user-id"}'
```

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

Follow platform-specific instructions, but ensure:
1. Environment variables are set
2. Build command is: `bun run build`
3. Start command is: `bun run start`
4. Node version is 18+

## Additional Resources

- **Supabase Setup Guide:** `SUPABASE_SETUP.md`
- **Features & Testing Guide:** `FEATURES_TESTING_GUIDE.md`
- **Prisma Documentation:** https://www.prisma.io/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Next.js Documentation:** https://nextjs.org/docs

## Getting Help

If you encounter issues:

1. Check terminal logs for errors
2. Review browser console for frontend errors
3. Check Supabase dashboard for database issues
4. Review the detailed guides in this project
5. Check GitHub issues for similar problems

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit `.env` file** to version control
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Rotate secrets regularly** in production
4. **Enable SSL** (enabled by default in Supabase)
5. **Use connection pooling** for production
6. **Regular backups** - Supabase provides automated backups
7. **Monitor logs** for suspicious activity

## Next Steps

1. ✅ Configure Supabase (see SUPABASE_SETUP.md)
2. ✅ Run database migrations: `bun run db:push`
3. ✅ Seed database: `bun run db:seed`
4. ✅ Start dev server: `bun run dev`
5. ✅ Test all features (see FEATURES_TESTING_GUIDE.md)
6. ✅ Deploy to production when ready

---

**Happy coding! 🚀**
