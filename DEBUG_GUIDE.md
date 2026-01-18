# Debug Guide - Auth Redirect Issues

## 🎯 Current State

I've made several improvements to fix the redirect issue:

1. ✅ **Session cookie setting** - Cookie is now set on login/signup
2. ✅ **Changed redirect method** - Now using `window.location.href` instead of `router.push()`
3. ✅ **Added extensive logging** - Every step is logged to console
4. ✅ **Added role verification** - Shows which role values match/don't match
5. ✅ **Fixed seed database** - Now uses upsert instead of create

## 🧪 What to Do Now

### Step 1: Refresh Your Browser
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to hard refresh
- This ensures you get the latest JavaScript code

### Step 2: Open DevTools
- Press `F12` to open Developer Tools
- Go to the **Console** tab
- Clear the console (click the 🚫 icon or press `Ctrl + L`)

### Step 3: Try Login/Signup
- Go to http://localhost:3000/auth
- Fill in your credentials
- Submit the form

### Step 4: Watch the Console

**You should see these messages in order:**

```
[AUTH] Starting login with email: your@email.com
[AUTH] Login response: { status: 200, success: true, error: undefined }
[AUTH] User logged in, redirecting to dashboard...
[AUTH] Setting cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...
[AUTH] Cookie set successfully: true  ← IMPORTANT!
[AUTH] User role: STUDENT  ← IMPORTANT!
[AUTH] Full user data: {"id":"...","email":"...","role":"STUDENT",...}
[AUTH] Checking role against values: {
  userRole: "STUDENT",
  isStudent: true,  ← SHOULD BE TRUE!
  isUniversityAdmin: false,
  isEmployer: false,
  isInvestor: false,
  isMentor: false,
  isPlatformAdmin: false
}
[AUTH] Determined redirect path: /dashboard/student
[AUTH] Waiting 1.5 seconds before redirect...
[AUTH] Redirecting NOW to: /dashboard/student
```

## 🔍 Troubleshooting

### Issue 1: You see `[AUTH] Cookie set successfully: false`

**What it means:** Browser is blocking cookies

**Solutions:**
1. Check browser settings:
   - Chrome: Settings → Privacy → Cookies → Allow localhost
   - Firefox: Settings → Privacy → Cookies → Allow localhost
   - Edge: Settings → Cookies → Allow localhost
2. Try in an Incognito/Private window
3. Disable ad blockers temporarily
4. Check if you're using a browser extension that blocks cookies

### Issue 2: You see `[AUTH] Cookie set successfully: true` but no redirect

**What it means:** Cookie is working but redirect isn't happening

**Solutions:**
1. Check if you see the last message: `[AUTH] Redirecting NOW to: /dashboard/student`
2. If you DON'T see this message, the setTimeout callback isn't firing
3. Try manually typing this in the console:
   ```javascript
   window.location.href = '/dashboard/student'
   ```
4. If that works, the issue is with the setTimeout
5. Check if there are any popup blockers or similar extensions

### Issue 3: Redirect happens but goes back to `/auth`

**What it means:** Middleware is rejecting the cookie

**Solutions:**
1. After login, check the cookie value:
   - Go to DevTools → Application → Cookies
   - Look for the `session` cookie
   - Copy the token value
2. In console, type:
   ```javascript
   console.log(document.cookie)
   ```
   - Should show the session cookie
3. Check the server logs for any middleware errors
4. Verify the token isn't expired

### Issue 4: Console shows `isStudent: false` when role is `STUDENT`

**What it means:** There's a mismatch in role values

**What to do:**
1. Look at the `userRole` value
2. Check all the boolean values
3. Tell me what you see:
   - What is the userRole value?
   - Are any of the isX values true?
   - What is the determined redirect path?

### Issue 5: No console messages appear at all

**What it means:** JavaScript error is preventing code from running

**Solutions:**
1. Check for red error messages in console
2. Look for any errors about:
   - "document is not defined"
   - "window is not defined"
   - "Cannot read property of undefined"
3. Take a screenshot of the console
4. Send me the error messages

## 📊 Expected Console Output Examples

### Example 1: Successful Student Login
```javascript
[AUTH] Starting login with email: student@example.com
[AUTH] Login response: { status: 200, success: true, error: undefined }
[AUTH] User logged in, redirecting to dashboard...
[AUTH] Setting cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...
[AUTH] Cookie set successfully: true
[AUTH] User role: STUDENT
[AUTH] Full user data: {"id":"...","email":"student@example.com","name":"...","role":"STUDENT",...}
[AUTH] Checking role against values: {
  userRole: "STUDENT",
  isStudent: true,
  isUniversityAdmin: false,
  isEmployer: false,
  isInvestor: false,
  isMentor: false,
  isPlatformAdmin: false
}
[AUTH] Determined redirect path: /dashboard/student
[AUTH] Waiting 1.5 seconds before redirect...
[AUTH] Redirecting NOW to: /dashboard/student
```

### Example 2: Successful Employer Login
```javascript
[AUTH] Starting login with email: employer@example.com
[AUTH] Login response: { status: 200, success: true, error: undefined }
[AUTH] User logged in, redirecting to dashboard...
[AUTH] Setting cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...
[AUTH] Cookie set successfully: true
[AUTH] User role: EMPLOYER
[AUTH] Full user data: {"id":"...","email":"employer@example.com","name":"...","role":"EMPLOYER",...}
[AUTH] Checking role against values: {
  userRole: "EMPLOYER",
  isStudent: false,
  isUniversityAdmin: false,
  isEmployer: true,  ← THIS ONE!
  isInvestor: false,
  isMentor: false,
  isPlatformAdmin: false
}
[AUTH] Determined redirect path: /marketplace
[AUTH] Waiting 1.5 seconds before redirect...
[AUTH] Redirecting NOW to: /marketplace
```

## 🧪 Manual Testing

### Test 1: Manual Redirect
After seeing the console messages, try typing this in the console:
```javascript
window.location.href = '/dashboard/student'
```
If this works, the redirect mechanism is the issue.

### Test 2: Check Cookie Value
In console, type:
```javascript
console.log(document.cookie)
```
You should see: `session=eyJhbGci...`

### Test 3: Check User Object
In console, type:
```javascript
JSON.parse(localStorage.getItem('user'))
```
You should see your user object.

## 📝 Information to Collect If Still Not Working

Please provide:
1. **Full console output** - Copy all [AUTH] messages
2. **Browser** - Which browser are you using? (Chrome, Firefox, Edge, Safari)
3. **Console errors** - Any red error messages?
4. **Cookie value** - Screenshot of Application → Cookies tab
5. **Network tab** - Screenshot of the request to /dashboard/student

## 🎯 What Should Happen

1. You submit login form
2. After ~1.5 seconds, console shows `[AUTH] Redirecting NOW to: ...`
3. Browser navigates to dashboard page
4. You see the dashboard content
5. You're not redirected back to auth page

## 🔧 Last Resort: Manual Navigation

If nothing works, you can:
1. Login (which should work based on logs)
2. After seeing success message, manually type this in address bar:
   ```
   http://localhost:3000/dashboard/student
   ```
3. This will bypass the redirect mechanism
4. If you can access the dashboard this way, the issue is specifically with the redirect

## 📞 What to Send Me

If it still doesn't work after trying everything, please send:

1. **Screenshot of console** - All the [AUTH] messages
2. **Screenshot of Application → Cookies** - Showing the session cookie
3. **Browser version** - Chrome 120, Firefox 121, etc.
4. **Any error messages** - Red text in console
5. **What happens after 1.5 seconds** - Does anything change on the page?

With this information, I can pinpoint the exact issue!

## 🚀 Quick Test

**Do this right now:**
1. Refresh browser (Ctrl+Shift+R)
2. Open DevTools (F12) → Console
3. Clear console (Ctrl+L)
4. Go to http://localhost:3000/auth
5. Login with your credentials
6. Copy everything from the console
7. Wait 1.5 seconds
8. Tell me what you see!

The console output will tell us exactly what's happening.
