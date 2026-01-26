# Supabase Migration Guide

This guide will help you migrate your CareerToDo application from SQLite to Supabase (PostgreSQL).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Database Migration](#database-migration)
4. [Environment Configuration](#environment-configuration)
5. [Application Changes](#application-changes)
6. [Deployment](#deployment)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ Supabase account (free at [supabase.com](https://supabase.com))
- ✅ Node.js 18+ and Bun installed
- ✅ Git repository initialized
- ✅ SSL certificate (for production)

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `careertodo-prod` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose region closest to your users
4. Click **"Create new project"**
5. Wait for project to be ready (~2 minutes)

### 2. Get Database Connection Strings

Once project is ready:

1. Go to **Project Settings** → **Database**
2. Find **Connection String** section
3. Copy both URLs:

#### Pooled Connection (Recommended for Serverless)
```
postgresql://postgres.xxxxxx:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```
#### Direct Connection (For long-running connections)
```
postgresql://postgres.xxxxxx:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 3. Configure Connection Pooling

Supabase uses PgBouncer for connection pooling:

- **Pooled (port 5432)**: For serverless/edge functions (recommended)
- **Direct (port 6543)**: For long-running connections

**Recommendation**: Use pooled connection for Next.js serverless functions.

---

## Database Migration

### Step 1: Backup Current Schema

Your SQLite schema has been backed up to:
```bash
prisma/schema.sqlite.backup.prisma
```

### Step 2: Configure Environment Variables

Update `.env` file with Supabase credentials:

```bash
cp .env.supabase.example .env
```

Then edit `.env` and replace:
- `[YOUR-PASSWORD]` with your Supabase database password
- `[YOUR-PROJECT-REF]` with your Supabase project reference

### Step 3: Push Schema to Supabase

```bash
# Push the PostgreSQL schema to Supabase
bun run db:push

# If you need to reset the database (warning: deletes all data!)
bun run db:push:force
```

This will:
- ✅ Create all tables in Supabase
- ✅ Set up relationships
- ✅ Create indexes
- ✅ Configure enums

### Step 4: Verify Migration

```bash
# Open Prisma Studio to verify the schema
bun run db:studio
```

Check that:
- All tables exist
- Relationships are correct
- Indexes are created

### Step 5: Seed Initial Data (Optional)

```bash
# Seed with sample data
bun run db:seed

# Or seed with comprehensive data
bun run db:seed:comprehensive
```

---

## Environment Configuration

### Development Environment (Supabase)

`.env` file:
```env
DATABASE_URL="postgresql://postgres:[password]@[project-ref].pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@[project-ref].pooler.supabase.com:6543/postgres"
JWT_SECRET=generate-secure-random-string-32-chars-minimum
NEXTAUTH_SECRET=generate-secure-random-string-32-chars-minimum
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Development Environment (Local SQLite)

For local development, use SQLite:
```bash
bun run dev:local
```

This uses `.env.local` with SQLite database.

---

## Application Changes

### PostgreSQL Optimizations Applied

The following optimizations have been applied:

#### 1. Connection Pooling
```typescript
// src/lib/db.ts
if (process.env.DATABASE_URL?.includes('supabase')) {
  // Supabase optimizations enabled
  - Connection timeout reduced to 10s
  - Pooled connection support
  - Enhanced logging for development
}
```

#### 2. Schema Optimizations

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

### New NPM Scripts

```bash
bun run dev:supabase      # Run dev with Supabase connection
bun run db:migrate:supabase # Push schema to Supabase
bun run db:studio          # Open Prisma Studio
bun run supabase:login     # Login to Supabase CLI
```

---

## Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
bun i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Configure Environment Variables in Vercel**:
   - Go to project settings in Vercel dashboard
   - Add all variables from `.env`
   - **IMPORTANT**: Update `NEXTAUTH_URL` to your Vercel domain

### Option 2: Supabase Edge Functions

1. **Install Supabase CLI**:
```bash
bun i -g supabase
```

2. **Login**:
```bash
supabase login
```

3. **Link Project**:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

4. **Deploy**:
```bash
supabase deploy
```

### Option 3: Docker

```dockerfile
# Dockerfile for Supabase deployment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

```bash
docker build -t careertodo .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-supabase-url" \
  -e JWT_SECRET="your-jwt-secret" \
  careertodo
```

---

## Performance Optimization

### Supabase-Specific Optimizations

#### 1. Connection Pooling
- ✅ Uses Supabase's PgBouncer (built-in connection pooling)
- ✅ Reduces connection overhead
- ✅ Better for serverless environments

#### 2. Database Indexes
Existing indexes are optimized for PostgreSQL:
```prisma
@@index([userId, date])      // Time entries
@@index([userId, startTime])  // Work sessions
@@index([email])              // User lookups
@@index([projectId, status])  // Project task lists
```

#### 3. Query Optimization
```typescript
// Enable query logging in development
log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
```

#### 4. Connection Timeouts
```typescript
connectionTimeout: 10000 // 10 seconds for faster failover
```

### Monitoring

Set up Supabase monitoring:

1. Go to **Supabase Dashboard** → **Database**
2. Monitor:
   - **Connection pool** usage
   - **Query performance**
   - **Storage usage**
   - **Active connections**

---

## Troubleshooting

### Issue: Connection Timeout

**Error**: `Connection terminated unexpectedly`

**Solution**:
- Use `DIRECT_URL` instead of pooled connection for long queries
- Increase `connectionTimeout` in `src/lib/db.ts`

### Issue: Too Many Connections

**Error**: `connection limit exceeded`

**Solution**:
- Use pooled connection (port 5432)
- Close connections properly
- Check for connection leaks

### Issue: Migration Fails

**Error**: `Foreign key constraint failed`

**Solution**:
```bash
# Reset database and retry
bun run db:push:force
```

### Issue: Auth Fails After Migration

**Error**: `JWT verification failed`

**Solution**:
1. Generate new JWT secrets
2. Update both `JWT_SECRET` and `NEXTAUTH_SECRET`
3. Restart the application
4. Clear browser cookies

### Issue: Schema Mismatch

**Error**: `Column does not exist`

**Solution**:
```bash
# Regenerate Prisma Client
bun run db:generate
# Push schema again
bun run db:push
```

---

## Production Checklist

Before deploying to production:

- [ ] Supabase project created
- [ ] Database password saved securely
- [ ] Connection strings configured in `.env`
- [ ] Schema pushed to Supabase (`bun run db:push`)
- [ ] Data seeded if needed (`bun run db:seed`)
- [ ] JWT secrets generated and secured
- [ ] NEXTAUTH_URL set to production domain
- [ ] Prisma Client regenerated (`bun run db:generate`)
- [ ] Application builds successfully (`bun run build`)
- [ ] Environment variables added to hosting platform
- [ ] Database connection verified
- [ ] Authentication flow tested
- [ ] All features tested in production environment

---

## Supabase Resources

- **Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
- **Status**: [status.supabase.com](https://status.supabase.com)
- **Support**: [supabase.com/support](https://supabase.com/support)

---

## Next Steps

After migration:

1. **Monitor Performance**: Use Supabase dashboard to monitor queries
2. **Set Up Backups**: Enable automated backups in Supabase
3. **Configure Row Level Security**: For additional data protection
4. **Enable Realtime**: If you need real-time features
5. **Scale as Needed**: Supabase free tier includes 500MB database, 2GB bandwidth

---

## Rollback Plan

If you need to rollback to SQLite:

```bash
# Restore SQLite schema
cp prisma/schema.sqlite.backup.prisma prisma/schema.prisma

# Restore environment
cp .env.local .env

# Rebuild
bun run build
```

---

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review Supabase logs in dashboard
3. Check application logs for error details
4. Refer to [Prisma PostgreSQL docs](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
5. Check [Supabase community](https://supabase.com/community)

---

**Happy deploying to Supabase! 🚀**
