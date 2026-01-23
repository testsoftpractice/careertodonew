# Supabase PostgreSQL Configuration Guide

## Overview

This project has been configured to use Supabase PostgreSQL as the database. Follow this guide to set up your Supabase database and connect it to the application.

## Prerequisites

1. A Supabase account (free at https://supabase.com)
2. A Supabase project created

## Step 1: Get Your Supabase Credentials

1. Log in to your Supabase dashboard: https://supabase.com/dashboard
2. Select or create a project
3. Go to **Settings > Database**
4. Find the **Connection string** section

You'll need two connection strings:

### 1. Direct Connection String (DIRECT_URL)
Used for migrations and database operations:
- Copy the **URI** or **Connection string**
- Format should look like:
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
  ```

### 2. Connection Pooling URL (DATABASE_URL)
Used for application connections (better performance):
- Go to **Connection Pooling** tab
- Copy the **Transaction mode** connection string
- Format should look like:
  ```
  postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
  ```

## Step 2: Configure Environment Variables

Create or update your `.env` file in the project root:

```bash
# Copy from the example file
cp .env.example .env
```

Edit `.env` and replace the placeholders with your actual Supabase credentials:

```env
# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Connection pooling (for application)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# JWT Secret (generate a secure random string - minimum 32 characters)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-very-long-secure-string"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important Notes:**
- Replace `[YOUR-PASSWORD]` with your actual Supabase database password
- Replace `[PROJECT-REF]` with your project reference
- Replace `[REGION]` with your project's region
- Generate a secure JWT_SECRET using: `openssl rand -base64 32` or use an online generator

## Step 3: Set Up Database Schema

### Option 1: Push Schema (Recommended for First Setup)

```bash
# Push the schema to Supabase
bun run db:push
```

### Option 2: Create Migration (For Production)

```bash
# Create a new migration
bun run db:migrate
```

## Step 4: Seed the Database (Optional)

Populate the database with sample data:

```bash
# Seed the database
bun run db:seed
```

**Seed Data Includes:**
- 1 University
- 4 Users (Student, Student 2, Employer, Investor)
- 1 Business
- 1 Project
- 1 Task
- Sample notifications and audit logs

**Test Credentials:**
- Student: student@techuniversity.edu / password123
- Student 2: student2@techuniversity.edu / password123
- Employer: employer@techinnovations.com / password123
- Investor: investor@vcfirm.com / password123

## Database Reset Commands

### Force Reset Database (With Seeding)

```bash
# WARNING: This deletes ALL data and reseeds
bun run db:reset:seed
```

### Force Reset Database (Without Seeding)

```bash
# WARNING: This deletes ALL data without reseeding
bun run db:reset
```

### Push Schema Changes (Without Data Loss)

```bash
# Apply schema changes without resetting data
bun run db:push
```

## Available Database Commands

```bash
# Generate Prisma Client
bun run db:generate

# Push schema to database (dev)
bun run db:push

# Create migration (dev)
bun run db:migrate

# Force reset and reseed database
bun run db:reset:seed

# Seed database
bun run db:seed

# Deploy migrations (production)
bun run db:deploy
```

## Supabase Dashboard Management

### View Your Data
1. Go to Supabase Dashboard
2. Select your project
3. Click on **Table Editor** in the left sidebar
4. View and edit data directly

### Run SQL Queries
1. Go to **SQL Editor** in the sidebar
2. Write and execute SQL queries directly
3. Useful for debugging and custom queries

### Monitor Database Performance
1. Go to **Database > Reports**
2. View query performance, slow queries, and optimization suggestions

## Troubleshooting

### Connection Issues

**Error:** `Connection refused` or `timeout`

**Solutions:**
1. Verify DATABASE_URL and DIRECT_URL are correct
2. Check your Supabase project is active (not paused)
3. Ensure your IP is not blocked (Supabase allows all IPs by default)

**Error:** `authentication failed`

**Solutions:**
1. Double-check your password in the connection string
2. Reset password in Supabase Dashboard if needed

### Migration Issues

**Error:** `Migration failed`

**Solutions:**
1. Check Prisma schema syntax
2. Ensure directUrl is set correctly
3. Try running `bun run db:push` instead

### Seeding Issues

**Error:** `Seed failed`

**Solutions:**
1. Ensure database schema is up to date: `bun run db:push`
2. Check seed file for any errors
3. Verify user permissions in Supabase

## Security Best Practices

1. **Never commit .env file** to version control
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable SSL** in Supabase (enabled by default)
4. **Use connection pooling** for production applications
5. **Regular backups** - Supabase provides automated backups

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|-----------|----------|
| `DATABASE_URL` | Connection pooling URL | Yes | `postgresql://postgres...pooler.supabase.com:6543/postgres` |
| `DIRECT_URL` | Direct connection URL | Yes | `postgresql://postgres...supabase.co:5432/postgres` |
| `JWT_SECRET` | JWT authentication secret | Yes | Random 32+ character string |
| `NEXT_PUBLIC_APP_URL` | Application URL | No | `http://localhost:3000` |

## Testing the Connection

After configuring your environment variables, test the connection:

```bash
# Test database connection
bun run db:push

# If successful, you should see:
# "Your database is now in sync with your Prisma schema. Done in Xms"
```

## Production Deployment

When deploying to production:

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Use connection pooling URL for `DATABASE_URL`
3. Run migrations on your production database:
   ```bash
   bun run db:deploy
   ```
4. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
5. Never use direct URL for production traffic

## Next Steps

Once your Supabase database is configured:

1. Start the development server: `bun run dev`
2. Visit http://localhost:3000
3. Log in with seed credentials or create a new account
4. Test all features (projects, tasks, jobs, leave requests, etc.)

## Support

If you encounter issues:
- Check Supabase status: https://status.supabase.com
- Review Supabase logs in Dashboard
- Check application logs in terminal
