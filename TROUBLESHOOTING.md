# Authentication & Signup Errors - Troubleshooting Guide

## Issue Summary

You're seeing these errors in the browser console:

1. `POST /api/auth/validate 401 (Unauthorized)` - ✅ **This is NORMAL**
2. `POST /api/auth/signup 500 (Internal Server Error)` - ❌ **This needs fixing**

---

## Error 1: 401 on /api/auth/validate (Normal, No Fix Needed)

### What's Happening:
This is **expected behavior**, not an error. Here's the flow:

1. Page loads → AuthContext initializes
2. App checks if user has a valid token stored in localStorage
3. Calls `/api/auth/validate` to verify the token
4. If no valid token exists (new user), returns 401
5. App shows login/signup page

**This is working as designed.** The 401 means "not logged in", which is correct for a new visitor.

---

## Error 2: 500 on /api/auth/signup (Needs Fix)

### Root Cause:
The 500 error on signup is caused by **database connection issues in production**.

Your application uses **PostgreSQL**, but:
- The production environment variables may not be configured correctly
- The database connection might be failing
- Prisma migrations might not be applied

---

## Solution for Production (careertodo.com)

### Step 1: Configure Production Environment Variables

In your hosting platform (Vercel, Railway, Render, etc.), set these environment variables:

```bash
# Required for PostgreSQL
DATABASE_URL="postgresql://username:password@host:5432/database_name"
DIRECT_URL="postgresql://username:password@host:5432/database_name"

# Required for Authentication
JWT_SECRET="generate-a-strong-random-string-min-32-chars"

# App Configuration
NEXTAUTH_URL="https://careertodo.com"
NEXT_PUBLIC_APP_URL="https://careertodo.com"
```

### Step 2: Run Database Migrations in Production

```bash
# From your local machine
npx prisma migrate deploy
```

Or if using the build script:
```bash
bun run db:push
```

### Step 3: Check Production Logs

Look at your hosting platform's logs to see the actual error:

Common issues:
- `Connection refused` → Database is not reachable
- `authentication failed` → Wrong credentials in DATABASE_URL
- `relation does not exist` → Tables not created (need to run migrations)
- `timeout` → Network/firewall issue

---

## Solution for Local Development

### Option 1: Use Supabase (Recommended)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from Settings → Database
4. Update `.env`:

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="dev-secret-key"
```

5. Run migrations:
```bash
bun run db:push
```

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create database:
```bash
createdb careertodo_dev
```

3. Update `.env`:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/careertodo_dev"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/careertodo_dev"
```

4. Run migrations:
```bash
bun run db:push
```

---

## Testing the Fix

### 1. Test Locally:
```bash
# Start dev server
bun run dev

# Test signup with curl
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "STUDENT",
    "agreeTerms": true
  }'
```

### 2. Test Production:
1. Push changes to GitHub
2. Wait for deployment
3. Try signing up at https://careertodo.com/auth
4. Check browser console for errors

---

## Common Signup Issues & Fixes

### Issue: "University not found"
**Cause**: Trying to signup with a university ID that doesn't exist
**Fix**: Either:
- Don't provide a university ID (make it optional)
- Create universities in the database first
- Use the university selector component properly

### Issue: "Password validation failed"
**Cause**: Password doesn't meet requirements
**Requirements**:
- Min 8 characters
- At least 1 lowercase letter
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*()_+-=[]{}|;:'",.<>/?)

### Issue: "Rate limit exceeded"
**Cause**: Too many signup attempts
**Wait**: 15 minutes before trying again
**Config**: Change in `src/lib/rate-limiter.ts`

---

## Quick Checklist

- [ ] PostgreSQL database is running and accessible
- [ ] `DATABASE_URL` and `DIRECT_URL` are set correctly
- [ ] `JWT_SECRET` is set (must be same as when tokens were generated)
- [ ] Database tables exist (run migrations)
- [ ] Database user has proper permissions (CREATE, INSERT, SELECT, UPDATE)
- [ ] No firewall blocking database connection
- [ ] Prisma Client is generated (`bun run db:generate`)

---

## Getting More Help

If you're still seeing the 500 error, check the actual error message:

**In production logs**, look for:
```
[SIGNUP] =============== ERROR ===============
[SIGNUP] Error type: ...
[SIGNUP] Error message: ...
[SIGNUP] Error stack: ...
```

This will tell you exactly what's failing.

---

## Summary

| Error | Action Required |
|-------|----------------|
| 401 on `/api/auth/validate` | ✅ None - this is normal behavior |
| 500 on `/api/auth/signup` | ❌ Fix database configuration and run migrations |
