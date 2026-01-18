# 🔧 Step-by-Step Fix for 500 Errors

## The Problem:
Your application is returning 500 errors because **environment variables are missing**.

You've configured Vercel environment variables, but the **local dev server** needs a `.env` file.

---

## ✅ Step-by-Step Fix:

### Step 1: Get Your Supabase Database URLs

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **⚙️ Settings** (gear icon)
4. Click on **API** in the left sidebar
5. Find the **"Connection String"** section

#### DATABASE_URL (Pooled Connection):
- Look for **"Connection Pooling"**
- Copy the URL
- It looks like: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`
- Paste this as `DATABASE_URL`

#### DIRECT_URL (Direct Connection):
- Look for **"Direct Connection"**
- Copy the URL
- It looks like: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
- Paste this as `DIRECT_URL`

---

### Step 2: Open and Edit the .env File

The `.env` file has been created at: `/home/z/my-project/.env`

Edit it and fill in your values:

```bash
# Replace these with your actual Supabase URLs:
DATABASE_URL="postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Use your generated secrets:
JWT_SECRET="your-supabase-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# Keep this as is for local development:
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

---

### Step 3: Initialize the Database

Once you've filled in the .env file, run:

```bash
# Generate Prisma Client
bun run db:generate

# Push database schema to Supabase (creates all tables)
bun run db:push
```

This will create all the tables (User, Project, Task, etc.) in your Supabase database.

---

### Step 4: Restart the Dev Server

```bash
# The dev server should auto-restart when .env changes
# If not, it will restart automatically
```

Then test:
1. Go to `http://localhost:3000/auth`
2. Try to signup a new user
3. Check if it works!

---

## 🎯 Example Filled .env File:

```bash
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.abcd123:your-actual-password-here@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10"
DIRECT_URL="postgresql://postgres.abcd123:your-actual-password-here@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Authentication Secrets
JWT_SECRET="your-generated-secret-from-supabase"
NEXTAUTH_SECRET="your-generated-secret-from-nextauth-generator"

# App Configuration
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🔍 How to Test Connection:

After filling in .env:

```bash
# Test if Prisma can connect
bun run db:push
```

If successful, you'll see something like:
```
✔ Database URL is valid
✔ Applying migrations...
✔ Done!
```

If it fails, it means:
- DATABASE_URL is incorrect
- Password is wrong
- Supabase project doesn't exist
- Network issue

---

## 📝 What Each Variable Does:

| Variable | Purpose | Source |
|----------|---------|---------|
| `DATABASE_URL` | Runtime database queries (with connection pooling) | Supabase API settings |
| `DIRECT_URL` | Database migrations (direct connection) | Supabase API settings |
| `JWT_SECRET` | Sign/verify JWT tokens for login/signup | Supabase JWT secret or any secure string |
| `NEXTAUTH_SECRET` | NextAuth.js sessions (social login) | NextAuth generator |
| `NEXTAUTH_URL` | Your app's base URL | `http://localhost:3000` locally |
| `NODE_ENV` | Environment mode | `development` for local, `production` for Vercel |

---

## 🚀 After This Works Locally:

### For Vercel Deployment:

You already have the environment variables set in Vercel, so you just need to:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "fix: add .env with database credentials"
   git push
   ```

2. Vercel will auto-deploy with your Vercel environment variables

3. Test on production URL

---

## ❓ If Still Getting 500 Errors:

### 1. Check Server Logs:
```bash
# View dev server logs
tail -f /home/z/my-project/dev.log
```

### 2. Check Browser Console:
- Open DevTools (F12)
- Go to Console tab
- Look for red error messages
- Go to Network tab
- Click on `/api/auth/signup` or `/api/auth/login`
- Check the Response

### 3. Verify Supabase Project:
- Make sure Supabase project is active
- Check if password is correct
- Try connecting from Supabase's SQL Editor

### 4. Test Database Connection:
```bash
# Run this to test connection
bun run db:push
```

---

## ✅ Summary:

1. ✅ Created `.env` file
2. ⚠️ **YOU MUST FILL IN** your Supabase credentials
3. ⚠️ **YOU MUST FILL IN** your JWT and NextAuth secrets
4. ⚠️ **YOU MUST RUN** `bun run db:push` to create database tables
5. ⚠️ **YOU MUST TEST** signup/login after

---

## 🎯 Quick Checklist:

- [ ] DATABASE_URL filled in from Supabase
- [ ] DIRECT_URL filled in from Supabase
- [ ] JWT_SECRET filled in (your Supabase or generated secret)
- [ ] NEXTAUTH_SECRET filled in (from generator)
- [ ] NEXTAUTH_URL set to `http://localhost:3000`
- [ ] Run `bun run db:generate`
- [ ] Run `bun run db:push` (creates tables in Supabase)
- [ ] Test signup at `/auth`
- [ ] Test login at `/auth`
- [ ] Test admin login at `/admin/login`

---

## 🔑 Where to Find Your Secrets:

### Supabase JWT Secret:
If you want to use Supabase's JWT:
1. Go to Supabase Dashboard → Settings → API
2. Look for **"JWT Secret"** section
3. Copy it and use as `JWT_SECRET`

### NextAuth Secret:
You mentioned you got this from a generator - just paste it in!

---

That's it! Once you fill in the `.env` file and run `bun run db:push`, everything should work! 🚀
