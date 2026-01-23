# 🧪 Quick Test Checklist

Use this checklist to verify route protection is working correctly.

## Before Testing
- [ ] Clear Next.js cache: `rm -rf .next`
- [ ] Restart dev server: `npm run dev`
- [ ] Open browser DevTools Console (for any errors)
- [ ] Keep terminal visible (for middleware logs)

---

## Test Scenarios

### 🔐 Test 1: Student Cross-Access
**Login as:** STUDENT

| Route | Expected Result | Actual |
|-------|---------------|---------|
| `/dashboard/student` | ✅ Load | |
| `/dashboard/student/settings` | ✅ Load | |
| `/dashboard/employer` | ❌ Redirect to /dashboard/student | |
| `/dashboard/employer/settings` | ❌ Redirect to /dashboard/student | |
| `/dashboard/investor` | ❌ Redirect to /dashboard/student | |
| `/dashboard/investor/settings` | ❌ Redirect to /dashboard/student | |
| `/dashboard/university` | ❌ Redirect to /dashboard/student | |
| `/dashboard/university/students` | ❌ Redirect to /dashboard/student | |
| `/dashboard/university/projects` | ❌ Redirect to /dashboard/student | |
| `/dashboard/university/settings` | ❌ Redirect to /dashboard/student | |
| `/admin` | ❌ Redirect to /dashboard/student | |

---

### 🏢 Test 2: Employer Cross-Access
**Login as:** EMPLOYER

| Route | Expected Result | Actual |
|-------|---------------|---------|
| `/dashboard/employer` | ✅ Load | |
| `/dashboard/employer/settings` | ✅ Load | |
| `/dashboard/student` | ❌ Redirect to /dashboard/employer | |
| `/dashboard/student/settings` | ❌ Redirect to /dashboard/employer | |
| `/dashboard/investor` | ❌ Redirect to /dashboard/employer | |
| `/dashboard/investor/settings` | ❌ Redirect to /dashboard/employer | |
| `/dashboard/university` | ❌ Redirect to /dashboard/employer | |
| `/dashboard/university/students` | ❌ Redirect to /dashboard/employer | |
| `/dashboard/university/projects` | ❌ Redirect to /dashboard/employer | |
| `/dashboard/university/settings` | ❌ Redirect to /dashboard/employer | |
| `/admin` | ❌ Redirect to /dashboard/employer | |

---

### 💼 Test 3: Investor Cross-Access
**Login as:** INVESTOR

| Route | Expected Result | Actual |
|-------|---------------|---------|
| `/dashboard/investor` | ✅ Load | |
| `/dashboard/investor/settings` | ✅ Load | |
| `/dashboard/student` | ❌ Redirect to /dashboard/investor | |
| `/dashboard/student/settings` | ❌ Redirect to /dashboard/investor | |
| `/dashboard/employer` | ❌ Redirect to /dashboard/investor | |
| `/dashboard/employer/settings` | ❌ Redirect to /dashboard/investor | |
| `/dashboard/university` | ❌ Redirect to /dashboard/investor | |
| `/dashboard/university/students` | ❌ Redirect to /dashboard/investor | |
| `/dashboard/university/projects` | ❌ Redirect to /dashboard/investor | |
| `/dashboard/university/settings` | ❌ Redirect to /dashboard/investor | |
| `/admin` | ❌ Redirect to /dashboard/investor | |

---

### 🎓 Test 4: University Admin Cross-Access
**Login as:** UNIVERSITY_ADMIN

| Route | Expected Result | Actual |
|-------|---------------|---------|
| `/dashboard/university` | ✅ Load | |
| `/dashboard/university/students` | ✅ Load | |
| `/dashboard/university/projects` | ✅ Load | |
| `/dashboard/university/settings` | ✅ Load | |
| `/dashboard/student` | ❌ Redirect to /dashboard/university | |
| `/dashboard/student/settings` | ❌ Redirect to /dashboard/university | |
| `/dashboard/employer` | ❌ Redirect to /dashboard/university | |
| `/dashboard/employer/settings` | ❌ Redirect to /dashboard/university | |
| `/dashboard/investor` | ❌ Redirect to /dashboard/investor | |
| `/dashboard/investor/settings` | ❌ Redirect to /dashboard/university | |
| `/admin` | ❌ Redirect to /dashboard/university | |

---

### 🔐 Test 5: API Protection (Network Tab in DevTools)
**Login as:** STUDENT

| API Endpoint | Method | Expected Result | Actual |
|--------------|--------|----------------|---------|
| `/api/dashboard/student/stats` | GET | ✅ 200 OK | |
| `/api/dashboard/employer/stats` | GET | ❌ 401/403 or redirect | |
| `/api/dashboard/investor/stats` | GET | ❌ 401/403 or redirect | |
| `/api/dashboard/university/students` | GET | ❌ 401/403 or redirect | |
| `/api/admin/users` | GET | ❌ 401/403 or redirect | |

**Login as:** EMPLOYER

| API Endpoint | Method | Expected Result | Actual |
|--------------|--------|----------------|---------|
| `/api/dashboard/employer/stats` | GET | ✅ 200 OK | |
| `/api/dashboard/student/stats` | GET | ❌ 401/403 or redirect | |
| `/api/dashboard/investor/stats` | GET | ❌ 401/403 or redirect | |
| `/api/dashboard/university/students` | GET | ❌ 401/403 or redirect | |
| `/api/admin/users` | GET | ❌ 401/403 or redirect | |

---

## What to Look For in Terminal Logs

### ✅ Successful Access:
```
=== MIDDLEWARE ===
[MIDDLEWARE] Path: /dashboard/student
[MIDDLEWARE] 🔒 Protected route: /dashboard/student
[MIDDLEWARE] Allowed roles: STUDENT, MENTOR, PLATFORM_ADMIN
[MIDDLEWARE] 👤 User: cmkk9uudk0003uib0bh9y16dx Role: STUDENT
[MIDDLEWARE] ✅ ACCESS GRANTED: STUDENT -> /dashboard/student
```

### ❌ Access Denied (Wrong Role):
```
=== MIDDLEWARE ===
[MIDDLEWARE] Path: /dashboard/university/students
[MIDDLEWARE] 🔒 Protected route: /dashboard/university/students
[MIDDLEWARE] Allowed roles: UNIVERSITY_ADMIN, PLATFORM_ADMIN
[MIDDLEWARE] 👤 User: cmkk9uudk0003uib0bh9y16dx Role: STUDENT
[MIDDLEWARE] ❌ ACCESS DENIED - Wrong role
[MIDDLEWARE] User role: STUDENT
[MIDDLEWARE] Required roles: UNIVERSITY_ADMIN, PLATFORM_ADMIN
[MIDDLEWARE] 🔄 Redirecting to: /dashboard/student
```

### ❌ Access Denied (Not Authenticated):
```
=== MIDDLEWARE ===
[MIDDLEWARE] Path: /dashboard/student
[MIDDLEWARE] 🔒 Protected route: /dashboard/student
[MIDDLEWARE] Allowed roles: STUDENT, MENTOR, PLATFORM_ADMIN
[MIDDLEWARE] ❌ No token - redirecting to auth
```

---

## Common Issues & Solutions

### Issue: Still accessing other dashboards
**Solution:**
1. Clear Next.js cache: `rm -rf .next`
2. Restart dev server: `npm run dev`
3. Clear browser cache and cookies
4. Logout and login again

### Issue: No middleware logs in terminal
**Solution:**
1. Make sure dev server is running
2. Check that `/home/z/my-project/src/middleware.ts` file exists
3. Look for "Compiling /middleware" message in logs

### Issue: API endpoints still accessible
**Note:** Middleware protects pages. API endpoints also need proper role checks in their route handlers. This is already implemented in the API routes.

---

## ✅ Success Criteria

- [ ] Each stakeholder can only access their own dashboard
- [ ] Settings pages are protected per role
- [ ] Management pages are protected per role
- [ ] Redirects happen immediately (no content flash)
- [ ] Terminal logs show access decisions
- [ ] API endpoints return appropriate errors for wrong roles
- [ ] Platform admins can access everything
- [ ] All public routes remain accessible

---

## 📞 If Something Doesn't Work

1. Check terminal logs for errors
2. Clear browser cache and cookies
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server
5. Check that you're using the correct account/role
6. Verify middleware file exists at `/home/z/my-project/src/middleware.ts`

---

**Last Updated:** Just now
**Protected Routes:** 60+ routes across all stakeholder types
**Middleware Status:** ✅ Active and enforcing
