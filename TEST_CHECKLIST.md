# Auth Testing Checklist

## Quick Test Steps

### 1. Test Student Signup
- [ ] Navigate to http://localhost:3000/auth
- [ ] Click "Sign Up" tab
- [ ] Select "Student" role
- [ ] Fill in all required fields (use `Password123!` as password)
- [ ] Submit form
- [ ] ✅ Expected: Success message + redirect to `/dashboard/student`

### 2. Test Student Login
- [ ] Navigate to http://localhost:3000/auth
- [ ] Click "Login" tab
- [ ] Enter email and password from Step 1
- [ ] Submit form
- [ ] ✅ Expected: Success message + redirect to `/dashboard/student`

### 3. Test Employer Signup
- [ ] Navigate to http://localhost:3000/auth
- [ ] Click "Sign Up" tab
- [ ] Select "Employer" role
- [ ] Fill in all required fields
- [ ] Submit form
- [ ] ✅ Expected: Success message + redirect to `/marketplace`

### 4. Test Employer Login
- [ ] Navigate to http://localhost:3000/auth
- [ ] Click "Login" tab
- [ ] Enter employer credentials
- [ ] Submit form
- [ ] ✅ Expected: Success message + redirect to `/marketplace`

### 5. Test University Signup
- [ ] Navigate to http://localhost:3000/auth
- [ ] Click "Sign Up" tab
- [ ] Select "University" role
- [ ] Fill in all required fields
- [ ] Submit form
- [ ] ✅ Expected: Success message + redirect to `/dashboard/university`
- [ ] Note: Role stored as `UNIVERSITY_ADMIN` in database

### 6. Test University Login
- [ ] Navigate to http://localhost:3000/auth
- [ ] Click "Login" tab
- [ ] Enter university credentials
- [ ] Submit form
- [ ] ✅ Expected: Success message + redirect to `/dashboard/university`

### 7. Test Investor Signup
- [ ] Navigate to http://localhost:3000/auth
- [ ] Click "Sign Up" tab
- [ ] Select "Investor" role
- [ ] Fill in all required fields
- [ ] Submit form
- [ ] ✅ Expected: Success message + redirect to `/marketplace`

### 8. Test Investor Login
- [ ] Navigate to http://localhost:3000/auth
- [ ] Click "Login" tab
- [ ] Enter investor credentials
- [ ] Submit form
- [ ] ✅ Expected: Success message + redirect to `/marketplace`

## Browser Console Checks

After each test, open browser console (F12) and check for:

✅ **Success Indicators:**
- `[AUTH] Starting signup with data:`
- `[AUTH] Signup response: { success: true, ... }`
- `[AUTH] User logged in, redirecting to dashboard...`
- `[AUTH] Redirecting user with role: STUDENT` (or other role)
- `[AUTH] Starting login with email:`
- `[AUTH] Login response: { success: true, ... }`

❌ **Error Indicators:**
- `[AUTH] Signup failed:` followed by error message
- `[AUTH] Login failed:` followed by error message
- Any red error messages in console
- Network errors (failed to fetch)

## What If Something Doesn't Work?

### Problem: Still seeing "Invalid email or password"
**Check:**
1. Open browser console
2. Look for `[AUTH] Login response:` message
3. Verify it shows `success: true`
4. If not, check server logs for actual error

**Possible Solutions:**
- User might not exist in database - check signup first
- Password might not match - try signup again
- Database might have issues - check server logs

### Problem: Signup successful but no redirect
**Check:**
1. Open browser console
2. Look for `[AUTH] Redirecting user with role:` message
3. Verify the role is correct
4. Check if there are any JavaScript errors

**Possible Solutions:**
- Refresh the page and try logging in instead
- Check browser console for errors
- Verify the dashboard route exists

### Problem: Redirected to wrong dashboard
**Check:**
1. Open browser console
2. Look for `[AUTH] Redirecting user with role:` message
3. Verify the role matches expected

**Possible Solutions:**
- This might be intentional (e.g., employer goes to marketplace)
- Check AUTH_FIXES.md for role redirect mapping

## Sample Test Data

### Student
```
Email: student.test@example.com
Password: Password123!
Name: Test Student
University: Test University
University ID: TEST001
Major: Computer Science
Graduation Year: 2025
```

### Employer
```
Email: employer.test@example.com
Password: Password123!
Name: Test Employer
Company: Test Company
Position: Hiring Manager
Website: https://testcompany.com
```

### University
```
Email: admin.test@university.edu
Password: Password123!
Name: Test Admin
University Name: Test University
University Code: TESTU
Website: https://testuniversity.edu
```

### Investor
```
Email: investor.test@example.com
Password: Password123!
Name: Test Investor
Firm: Test Ventures
Focus: Technology Startups
```

## After Testing

### If Everything Works ✅
- All checkboxes should be marked
- No errors in browser console
- Redirects work correctly for all roles
- Login works with signed up credentials

### If Something Doesn't Work ❌
- Note which step failed
- Copy browser console output
- Copy server logs
- Check AUTH_FIXES.md for troubleshooting
- Report specific issue with logs

## Quick Notes

- All passwords must be at least 8 characters with uppercase, lowercase, number, and special character
- "Password123!" is a valid test password
- University role in form = UNIVERSITY_ADMIN in database
- Employers and Investors both redirect to marketplace
- Students and Universities have dedicated dashboards
- Check browser console for detailed flow information
