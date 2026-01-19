# 🔍 DEBUGGING 500 ERRORS - Step by Step

## The Issue:

You're getting 500 errors because the **environment variables in `.env` are placeholders**, not real values.

---

## ✅ QUICK FIX - 2 STEPS:

### Step 1: Visit This Debug Endpoint

Open your browser and go to:
**http://localhost:3000/api/debug/env**

This will show you:
- Which environment variables are set
- If database connection is working
- Exact error if database connection fails

### Step 2: Fill in Your Real .env Values

Edit `/home/z/my-project/.env` and replace the placeholders:

```bash
# Replace this:
DATABASE_URL="your-supabase-pooled-connection-url-here"

# With your ACTUAL Supabase URL like:
DATABASE_URL="postgresql://postgres.abc123:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Same for others:
DIRECT_URL="postgresql://postgres.abc123:your-password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="your-real-secret"
NEXTAUTH_SECRET="your-real-nextauth-secret"
```

---

## 📋 HOW TO GET YOUR SUPABASE CREDENTIALS:

### 1. Go to Supabase Dashboard

Visit: https://supabase.com/dashboard

### 2. Select Your Project

Click on your project

### 3. Go to API Settings

Click: **⚙️ Settings** → **API**

### 4. Copy Connection Strings

You'll see two sections:

#### For DATABASE_URL (Connection Pooling):
- Look for: **"Connection String"** section
- Subsection: **"Connection Pooling"**
- Copy the URL
- It looks like:
  ```
  postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

#### For DIRECT_URL (Direct Connection):
- Same section
- Subsection: **"Direct Connection"**
- Copy the URL
- It looks like:
  ```
  postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
  ```

### 5. Get JWT Secret (if using Supabase)

In the same API section, look for:
- **"JWT Secret"** or **"anon key"**
- Copy and use as `JWT_SECRET`

### 6. Your NextAuth Secret

If you used a NextAuth secret generator, use that as `NEXTAUTH_SECRET`.
Otherwise, generate a random one:
```bash
openssl rand -base64 32
```

---

## 🧪 TESTING YOUR SETUP:

### Test 1: Check Debug Endpoint

Visit: http://localhost:3000/api/debug/env

**Expected Response (if working):**
```json
{
  "message": "Environment and Database Debug",
  "environment": {
    "DATABASE_URL": "SET ✓",
    "DIRECT_URL": "SET ✓",
    "JWT_SECRET": "SET ✓",
    "NEXTAUTH_SECRET": "SET ✓",
    "NEXTAUTH_URL": "SET ✓",
    "NODE_ENV": "development"
  },
  "database": {
    "status": "Connected ✓",
    "error": null
  }
}
```

**If you see "NOT SET ✗":**
- That environment variable is missing from your .env file
- You need to add it

**If you see "Failed ✗" in database:**
- Your DATABASE_URL is incorrect
- Wrong password
- Supabase project doesn't exist

### Test 2: Run Database Push

```bash
cd /home/z/my-project
bun run db:push
```

**Expected Output:**
```
✔ Database URL is valid
✔ Applying migrations...
✔ Done!
```

**If it fails:**
- DATABASE_URL is wrong
- Check password in URL
- Make sure Supabase project is active

### Test 3: Try Signup

Visit: http://localhost:3000/auth

Try to create a user. Check browser console (F12) for errors.

### Test 4: Try Login

Use the credentials you just created.

---

## 🔍 COMMON PROBLEMS & SOLUTIONS:

### Problem 1: "DATABASE_URL not set"

**Cause**: `.env` file has placeholder: `DATABASE_URL="your-supabase-pooled-connection-url-here"`

**Solution**: Replace with actual Supabase URL

### Problem 2: "JWT_SECRET not set"

**Cause**: `.env` has placeholder: `JWT_SECRET="your-jwt-secret-here"`

**Solution**: Replace with actual secret

### Problem 3: "Database connection failed"

**Cause**: Wrong password or incorrect URL format

**Solution**:
1. Check Supabase Dashboard → Settings → Database
2. Reset password if needed
3. Copy fresh connection string
4. Make sure no extra spaces or quotes

### Problem 4: "Table doesn't exist"

**Cause**: Database tables haven't been created

**Solution**: Run `bun run db:push`

---

## 📝 EXAMPLE OF CORRECTLY FILLED .env:

```bash
# ==========================================
# Database Configuration (Supabase)
# ==========================================
DATABASE_URL="postgresql://postgres.abcd12345:super-secret-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcd12345:super-secret-password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# ==========================================
# Authentication Secrets
# ==========================================
JWT_SECRET="abc123def456ghi789jkl012mno345pqr"
NEXTAUTH_SECRET="xyz789abc456def123ghi789jkl012"

# ==========================================
# App Configuration
# ==========================================
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🎯 CHECKLIST:

Before trying signup/login again:

- [ ] I've visited Supabase Dashboard
- [ ] I've copied the Connection Pooling URL
- [ ] I've copied the Direct Connection URL
- [ ] I've gotten my JWT secret
- [ ] I've filled in DATABASE_URL in .env (no placeholders)
- [ ] I've filled in DIRECT_URL in .env (no placeholders)
- [ ] I've filled in JWT_SECRET in .env (no placeholders)
- [ ] I've filled in NEXTAUTH_SECRET in .env (no placeholders)
- [ ] I've visited /api/debug/env and all show "SET ✓"
- [ ] I've run `bun run db:push` successfully
- [ ] I've restarted the dev server or it auto-restarted

---

## 🚀 ONCE EVERYTHING IS WORKING:

1. **Commit to Git** (without .env file!):
   ```bash
   git add .
   git commit -m "fix: update database credentials"
   ```

2. **Push to GitHub**

3. **Vercel will auto-deploy**
   - Vercel uses its own environment variables (which you've already set)
   - Local .env won't affect production

---

## ❓ STILL HAVING ISSUES?

### Check Server Logs:

```bash
# Watch logs in real-time
tail -f /home/z/my-project/dev.log

# Or check recent logs
bun run dev 2>&1 | tee server.log
```

### Check Browser Console:

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Go to Network tab
5. Click on failing request
6. Check Response tab for actual error message

### Test Database in Supabase SQL Editor:

1. Go to Supabase Dashboard
2. Click on "SQL Editor"
3. Run: `SELECT NOW();`
4. If it works, your connection is good

---

## 📁 What Files Were Changed:

- ✅ `.env` - Template created (YOU NEED TO FILL IN)
- ✅ `/api/debug/env/route.ts` - Debug endpoint to test connection
- ✅ `src/middleware.ts` - Added debug endpoint to public paths
- ✅ `/api/auth/signup/route.ts` - Added better error logging
- ✅ `/api/auth/login/route.ts` - Added better error logging

---

## 🎯 CRITICAL REMINDER:

**The .env file I created has PLACEHOLDERS. You MUST replace them with your actual Supabase credentials or nothing will work!**

Do NOT commit .env to version control!
