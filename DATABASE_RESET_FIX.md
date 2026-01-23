# Database Reset and Seed Instructions

## Problem
When running `npm run db:reset`, it clears the database but doesn't recreate the tables because:
1. No migrations exist yet
2. `prisma migrate reset` only rolls back and re-runs existing migrations
3. Without migrations, it just clears the database

## Solution

### Option 1: Create Initial Migration (Recommended)

Run these commands in order:

```bash
# 1. Create the initial migration
npx prisma migrate dev --name init

# 2. Reset the database with migrations
npm run db:reset

# 3. Or if reset still doesn't work, manually seed
npx tsx prisma/seed.ts
```

### Option 2: Use Push Instead of Reset (Quick Fix)

```bash
# 1. Push schema to create tables
npx prisma db push

# 2. Run seed
npx tsx prisma/seed.ts
```

### Option 3: Manual Reset with Push

```bash
# 1. Clear all data manually (keep tables)
npx prisma migrate reset --force --skip-seed

# 2. Push schema to ensure tables exist
npx prisma db push

# 3. Run seed
npx tsx prisma/seed.ts
```

## Updated Package.json Scripts

Update your `package.json` db:reset script to:

```json
"db:reset": "prisma migrate reset --force --skip-seed && prisma db push && npm run db:seed",
```

Or create a new script:

```json
"db:reset:full": "prisma migrate reset --force --skip-seed && prisma db push && npx tsx prisma/seed.ts"
```

## What Happens When You Run db:reset

Current behavior:
1. `prisma migrate reset --force` runs
2. It rolls back all migrations
3. If no migrations exist, it just clears the database
4. It runs `npx tsx prisma/seed.ts`
5. Seed tries to insert data but tables don't exist → Error

Expected behavior (after creating migration):
1. `prisma migrate reset --force` runs
2. It rolls back all migrations
3. It re-runs all migrations (creating tables)
4. It runs seed
5. Seed inserts data successfully

## Quick One-Command Fix

Run this to create migration and seed in one go:

```bash
npx prisma migrate dev --name init --skip-generate
```

Then run your seed:

```bash
npx tsx prisma/seed.ts
```

## Verification

After successful seeding, verify:

```bash
# Check database with Prisma Studio
npx prisma studio

# Or check in Supabase Dashboard > Table Editor
```

## Seed File Updated

The comprehensive seed file has been renamed to `seed.ts` and now includes:
- 5 Universities
- 14 Users (all roles)
- 3 Businesses with 6 members
- 10 Projects with various statuses
- 12 Tasks with 16 subtasks
- 6 Jobs, 8 leave requests, 3 investments
- And many more records (~200 total)

## Test Credentials

After successful seeding, you can login with:

**Students:**
- student.stanford@edu.com / Password123!
- student.mit@edu.com / Password123!

**Employers:**
- employer@techcorp.com / Password123!

**Investors:**
- investor@venturefund.com / Password123!

**University Admins:**
- admin.stanford@stanford.edu / Password123!

**Platform Admin:**
- admin@platform.com / Password123!
