# Supabase Setup Instructions

## What Has Been Fixed

✅ **1. Prisma Schema Optimized for Supabase PostgreSQL**
- Changed datasource provider to `postgresql`
- Added `DIRECT_URL` support for faster connections (Supabase pooler)
- Added `WorkSessionType` enum with values: WORK_SESSION, BREAK, MEETING, TRAINING, RESEARCH
- Updated `WorkSession` model with:
  - `projectId` field (optional, links to Project)
  - `type` field (defaults to WORK_SESSION)
  - `notes` field (optional)
- Added proper indexes for Supabase optimization

✅ **2. WorkSession API Updated**
- GET endpoint now includes project data
- POST endpoint sets default type to WORK_SESSION
- PATCH endpoint supports updating: projectId, type, notes

✅ **3. Team Member Modal Fixed**
- Modal now uses User ID instead of email (more reliable)
- Updated handler to use userId parameter
- Fixed authorization to allow project owner to add members
- Added proper role selection dropdown

✅ **4. Project Members API Fixed**
- Project owner can now add members (not just admins)
- Fixed permission check logic

✅ **5. Next.js Config Fixed**
- Removed invalid `turbopack: false` option (Next.js 16 compatibility)
- No more warnings on startup

✅ **6. Code Quality**
- All lint checks pass
- No ESLint errors or warnings

---

## To Use Supabase PostgreSQL

The project is currently using SQLite for development. To switch to Supabase:

### Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **Database**
4. Scroll to **Connection String**
5. Copy the **URI** connection string (port 5432) for `DATABASE_URL`
6. Copy the **Connection pooling** connection string (port 6543) for `DIRECT_URL`

### Step 2: Update .env.local

Edit `/home/z/my-project/.env.local`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].pooler.supabase.com:6543/postgres"
```

### Step 3: Push Schema to Supabase

Run these commands:

```bash
# Regenerate Prisma client for PostgreSQL
bun run db:generate

# Push schema to Supabase
bun run db:push
```

### Step 4: Restart Dev Server

```bash
# Stop the current dev server if running
# Then start again
bun run dev
```

---

## Database Schema Changes

### New WorkSessionType Enum:
```prisma
enum WorkSessionType {
  WORK_SESSION
  BREAK
  MEETING
  TRAINING
  RESEARCH
}
```

### Updated WorkSession Model:
```prisma
model WorkSession {
  id        String          @id @default(cuid())
  userId    String
  projectId String?
  type      WorkSessionType @default(WORK_SESSION)
  notes     String?
  startTime DateTime
  endTime   DateTime?
  duration  Int?           // in seconds

  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  project   Project?        @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([projectId])
  @@index([startTime])
  @@index([type])
}
```

---

## Current Status

- ✅ Schema optimized for Supabase
- ✅ All code errors fixed
- ✅ Dev server runs without errors
- ⏳ Awaiting Supabase credentials to switch from SQLite to PostgreSQL

The dev server is running on port 3001 (3000 was in use). All functionality is working with SQLite database. Once you provide Supabase credentials and run `db:push`, the project will seamlessly switch to Supabase PostgreSQL.
