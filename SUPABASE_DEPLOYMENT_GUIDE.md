# Supabase Deployment Guide

This guide will help you deploy the CareerToDo project to Supabase PostgreSQL database.

## Prerequisites

- A Supabase account (free tier works for development)
- Node.js and Bun installed
- Git (for version control, optional but recommended)

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose a name (e.g., `careertodonew`)
4. Set a database password (save this securely!)
5. Choose a region (closest to your users)
6. Click "Create new project"
7. Wait for the project to be ready (usually 1-2 minutes)

## Step 2: Get Database Connection Strings

1. In your Supabase project, go to **Settings** → **Database**
2. Find **Connection string** section
3. Choose **URI** format
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres.xxxxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

5. Scroll down to **Connection pooling** section
6. Copy the **Transaction mode** connection string:
   ```
   postgresql://postgres.xxxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

## Step 3: Configure Environment for Supabase

Create a `.env.production.local` file (this file is gitignored):

```bash
# ============================================
# SUPABASE DATABASE CONFIGURATION
# ============================================

# Replace [YOUR-PASSWORD] and [YOUR-PROJECT-REF] with actual values
DATABASE_URL="postgresql://postgres.xxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.xxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# ============================================
# JWT AUTHENTICATION CONFIGURATION
# ============================================

# Generate secure secrets for production:
# Use: openssl rand -base64 32
JWT_SECRET=your-secure-jwt-secret-min-32-chars
NEXTAUTH_SECRET=your-secure-nextauth-secret-min-32-chars
NEXTAUTH_URL=https://your-domain.com

NODE_ENV=production
```

## Step 4: Update Prisma Schema for Production

Before deploying to Supabase, update the datasource provider in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Note**: For local development with SQLite, keep provider as `"sqlite"` and use `DATABASE_URL=file:/home/z/my-project/db/custom.db`

## Step 5: Push Schema to Supabase

1. Set environment to production (optional, or use production env file):
   ```bash
   export NODE_ENV=production
   ```

2. Or for one-time setup with production env:
   ```bash
   bun run db:push
   ```

   This will push the complete schema to Supabase PostgreSQL.

## Step 6: Generate Prisma Client

```bash
bun run db:generate
```

## Step 7: Verify Database Connection

Run the dev server with Supabase connection:

```bash
NODE_ENV=production bun run dev
```

Or if using `.env.production.local`:
```bash
bun run dev:supabase
```

## Key Differences Between SQLite and Supabase

### Advantages of Supabase (PostgreSQL):

1. **Concurrent Access**: Multiple users can access database simultaneously
2. **Better Performance**: Optimized for production workloads
3. **Real-time Features**: Supabase supports real-time subscriptions
4. **Auth Integration**: Can use Supabase Auth (optional)
5. **Backup & Restore**: Built-in database backups
6. **Scalability**: Handles growing data and user base

### Changes Needed in Code:

Most code works as-is! The Prisma Client abstracts database differences automatically.

**WorkSession Optimizations**:
- Schema already includes `projectId`, `type`, and `notes` fields
- API routes support these fields for Supabase
- Time tracking will work seamlessly

**Add Team Member**:
- Project owners can now add team members
- Modal UI is implemented
- Uses `userId` for direct user addition
- Authorization checks include project owner role

## Migration Guide (SQLite → Supabase)

### Option A: Start Fresh (Recommended for Production)

1. Export data from SQLite (if needed):
   ```bash
   bun run db:studio
   # Export any critical data manually
   ```

2. Configure Supabase connection (Step 3-4 above)

3. Push schema to Supabase:
   ```bash
   bun run db:push
   ```

4. Re-create essential data in Supabase

### Option B: Use Supabase Migrate Tool

For larger datasets, use a migration tool:
```bash
# Install pgloader or similar tool
# Follow pgloader documentation to migrate SQLite to PostgreSQL
```

## Deployment Checklist

- [ ] Supabase project created
- [ ] Database connection strings obtained
- [ ] `.env.production.local` configured with Supabase URLs
- [ ] JWT secrets generated and added to env
- [ ] Prisma schema provider changed to "postgresql"
- [ ] Schema pushed to Supabase: `bun run db:push`
- [ ] Prisma client generated: `bun run db:generate`
- [ ] Dev server runs without errors
- [ ] Core features tested in Supabase:
  - [ ] User authentication
  - [ ] Project creation and management
  - [ ] Task creation and updates
  - [ ] Time tracking (WorkSessions)
  - [ ] Team member addition
  - [ ] Milestone creation

## Troubleshooting

### Error: "Environment variable not found: DIRECT_URL"

**Solution**: Add `DIRECT_URL` to your environment file. For local SQLite development, you can remove the `directUrl` field from `prisma/schema.prisma` or make it optional with `directUrl = env("DIRECT_URL")?`.

### Error: "Connection refused" or "Database not found"

**Solution**:
- Verify Supabase project is active (not paused)
- Check connection string format
- Ensure password is URL-encoded if it contains special characters
- Verify you're using correct port (5432 vs 6543)

### Error: "Schema push failed"

**Solution**:
- Check if Supabase database is paused or in maintenance
- Verify schema syntax with `bun run db:generate`
- Try `bun run db:push --force-reset` (⚠️ deletes all data!)

### Performance Issues

**Solution**:
- Use `DIRECT_URL` for better performance (connection pooling)
- Add indexes to frequently queried fields (already in schema)
- Consider implementing caching for frequently accessed data

## Monitoring and Maintenance

### View Database Activity

1. Supabase Dashboard → Database → Logs
2. Monitor for slow queries
3. Check connection pool utilization

### Backup Strategy

Supabase provides automatic backups (7 days for free tier).

For additional protection:
1. Settings → Database → Backups
2. Configure scheduled backups
3. Enable point-in-time recovery

### Scaling

As your user base grows:

1. **Free Tier**: 500MB database, 1GB bandwidth
2. **Pro Tier**: 8GB database, 50GB bandwidth, starting at $25/month
3. Upgrade: Project Settings → Billing → Upgrade

## Local Development Setup

For day-to-day development, continue using SQLite (fast, no setup needed):

```bash
# Uses SQLite (default)
bun run dev
```

Only use Supabase when:
- Testing production-like environment
- Deploying to staging/production
- Need to test concurrent user scenarios

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Connection Pooling](https://supabase.com/docs/guides/platform/connection-pooling)

## Support

If you encounter issues:

1. Check Supabase status: https://status.supabase.com
2. Review application logs: Check Next.js dev server output
3. Enable debug mode: Set `DEBUG=prisma:query` to see SQL queries
4. Test connection: Use a PostgreSQL client like DBeaver or TablePlus

## Security Notes

1. **Never commit** `.env.production.local` to git
2. **Rotate secrets** regularly (JWT_SECRET, NEXTAUTH_SECRET)
3. **Enable Row Level Security (RLS)** in Supabase for production
4. **Use connection pooling** via `DIRECT_URL` to prevent connection exhaustion
5. **Monitor** database access logs in Supabase Dashboard

---

**Last Updated**: 2025-01
**Project**: CareerToDo New
**Schema Version**: v1.0 (with WorkSessionType enum)
