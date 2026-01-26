# 🚀 Quick Start: Supabase Deployment

This guide gets you from code to deployed on Supabase in 5 minutes!

---

## ⏱️ Time Required

- **Setup**: 2 minutes
- **Migration**: 1 minute
- **Deployment**: 2 minutes
- **Total**: ~5 minutes

---

## 📝 Prerequisites

- Supabase account (free at [supabase.com](https://supabase.com))
- Git installed
- Node.js 18+ and Bun installed

---

## 🎯 Quick Steps

### Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Name it: `careertodo`
4. Set a strong database password (**SAVE IT!**)
5. Choose nearest region
6. Wait for project to be ready (~2 min)

### Step 2: Get Connection Strings (30 sec)

Once ready:

1. Go to **Project Settings** → **Database**
2. Copy the **Connection string (URI)**:
   ```
   postgresql://postgres.xxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

3. Copy the **Direct connection string** (optional, for better performance):
   ```
   postgresql://postgres.xxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

### Step 3: Configure Environment (1 min)

1. Create `.env` file:
```bash
cp .env.supabase.example .env
```

2. Edit `.env` and replace:
   - `[YOUR-PASSWORD]` with your Supabase password
   - `[YOUR-PROJECT-REF]` with your project reference (from connection string)
   - `JWT_SECRET` with a secure random string (32+ chars)
   - `NEXTAUTH_SECRET` with a secure random string (32+ chars)
   - `NEXTAUTH_URL` with your deployment URL (e.g., https://careertodo.vercel.app)

3. Generate secure secrets:
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate NextAuth secret
openssl rand -base64 32
```

### Step 4: Push Schema (30 sec)

```bash
# Generate Prisma client for PostgreSQL
bun run db:generate

# Push schema to Supabase
bun run db:push
```

**Output**: ✅ All tables, indexes, and relationships created in Supabase

### Step 5: Seed Database (Optional, 30 sec)

```bash
# Seed with sample data
bun run db:seed
```

### Step 6: Verify with Prisma Studio (Optional, 30 sec)

```bash
bun run db:studio
```

This opens Prisma Studio connected to your Supabase database!

---

## 📦 Deployment

### Option A: Vercel (Recommended) 🚀

1. **Install Vercel CLI**:
```bash
bun i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Add Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL` - Your Supabase connection string
   - `DIRECT_URL` - Your Supabase direct connection string
   - `JWT_SECRET` - Your JWT secret
   - `NEXTAUTH_SECRET` - Your NextAuth secret
   - `NEXTAUTH_URL` - Your Vercel domain

4. **Done!** Your app is live at `https://careertodo.vercel.app`

### Option B: Docker (Simple) 🐳

```bash
# Build Docker image
docker build -t careertodo .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-supabase-url" \
  -e DIRECT_URL="your-supabase-direct-url" \
  -e JWT_SECRET="your-jwt-secret" \
  -e NEXTAUTH_SECRET="your-nextauth-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  careertodo
```

### Option C: VPS/Cloud (Any hosting) ☁️

```bash
# Build for production
bun run build

# Start production server
NODE_ENV=production bun start
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Homepage loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays correctly
- [ ] Tasks can be created
- [ ] Kanban board works
- [ ] Database queries are fast (< 200ms)
- [ ] No console errors

---

## 🔍 Troubleshooting

### Connection Failed?

```bash
# Test connection directly
psql "postgresql://postgres:[password]@[project-ref].pooler.supabase.com:5432/postgres"
```

### Build Errors?

```bash
# Regenerate Prisma client
bun run db:generate

# Rebuild
bun run build
```

### Schema Not Applied?

```bash
# Force reset and retry
bun run db:push:force
```

---

## 📊 Performance Tips

1. **Use pooled connection** for serverless (port 5432)
2. **Use direct connection** for long-running operations (port 6543)
3. **Enable query logging** in development:
   ```bash
   LOG_LEVEL=debug bun run dev
   ```
4. **Monitor** at Supabase Dashboard → Database

---

## 📚 Next Steps

After successful deployment:

1. Set up **automated backups** in Supabase dashboard
2. Configure **Row Level Security** for extra protection
3. Enable **Supabase Auth** (optional, for built-in auth)
4. Set up **real-time subscriptions** if needed
5. Monitor **usage metrics** in Supabase dashboard

---

## 🆘 Need Help?

- **Full Guide**: See `SUPABASE_MIGRATION_GUIDE.md`
- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Support**: https://supabase.com/support

---

**🎉 Ready to deploy!**
