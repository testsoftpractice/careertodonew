# Route Protection Matrix

## Complete Access Control for All Stakeholders

### 🎯 Overview
All dashboard and management routes are now protected with role-based access control.
No stakeholder can access another stakeholder's dashboard, settings, or management features.

---

## 🔐 Protected Routes and Access Matrix

| Route Path | Allowed Roles | Description |
|------------|---------------|-------------|
| **Student Routes** | | |
| `/dashboard/student` | STUDENT, MENTOR, PLATFORM_ADMIN | Student main dashboard |
| `/dashboard/student/settings` | STUDENT, MENTOR, PLATFORM_ADMIN | Student profile & settings |
| `/dashboard/student/projects` | STUDENT, MENTOR, PLATFORM_ADMIN | Student's projects |
| **Employer Routes** | | |
| `/dashboard/employer` | EMPLOYER, PLATFORM_ADMIN | Employer main dashboard |
| `/dashboard/employer/settings` | EMPLOYER, PLATFORM_ADMIN | Employer profile & settings |
| `/dashboard/employer/projects` | EMPLOYER, PLATFORM_ADMIN | Employer's projects |
| `/dashboard/employer/jobs` | EMPLOYER, PLATFORM_ADMIN | Employer's job postings |
| **Investor Routes** | | |
| `/dashboard/investor` | INVESTOR, PLATFORM_ADMIN | Investor main dashboard |
| `/dashboard/investor/settings` | INVESTOR, PLATFORM_ADMIN | Investor profile & settings |
| `/dashboard/investor/projects` | INVESTOR, PLATFORM_ADMIN | Investor's project investments |
| `/dashboard/investor/investments` | INVESTOR, PLATFORM_ADMIN | Investment management |
| **University Admin Routes** | | |
| `/dashboard/university` | UNIVERSITY_ADMIN, PLATFORM_ADMIN | University main dashboard |
| `/dashboard/university/settings` | UNIVERSITY_ADMIN, PLATFORM_ADMIN | University settings |
| `/dashboard/university/students` | UNIVERSITY_ADMIN, PLATFORM_ADMIN | Student management |
| `/dashboard/university/projects` | UNIVERSITY_ADMIN, PLATFORM_ADMIN | Project management |
| `/dashboard/university/departments` | UNIVERSITY_ADMIN, PLATFORM_ADMIN | Department management |
| **Platform Admin Routes** | | |
| `/admin` | PLATFORM_ADMIN | Platform admin dashboard |
| `/admin/settings` | PLATFORM_ADMIN | Platform settings |
| `/admin/projects` | PLATFORM_ADMIN | All projects management |
| `/admin/users` | PLATFORM_ADMIN | User management |
| `/admin/universities` | PLATFORM_ADMIN | University management |
| `/admin/analytics` | PLATFORM_ADMIN | Platform analytics |
| **Shared Routes** | | |
| `/dashboard/notifications` | All authenticated users | Notifications for all |

---

## 🚫 What Each Role CANNOT Access

### ❌ Students Cannot Access:
- `/dashboard/employer/*` - Employer dashboard and settings
- `/dashboard/investor/*` - Investor dashboard and settings
- `/dashboard/university/*` - University admin dashboard, student management, project management
- `/admin/*` - Platform admin features
- `/api/dashboard/employer/*` - Employer API endpoints
- `/api/dashboard/investor/*` - Investor API endpoints
- `/api/dashboard/university/*` - University admin API endpoints
- `/api/admin/*` - Platform admin API endpoints

### ❌ Employers Cannot Access:
- `/dashboard/student/*` - Student dashboard and settings
- `/dashboard/investor/*` - Investor dashboard and settings
- `/dashboard/university/*` - University admin dashboard, student management, project management
- `/admin/*` - Platform admin features
- `/api/dashboard/student/*` - Student API endpoints
- `/api/dashboard/investor/*` - Investor API endpoints
- `/api/dashboard/university/*` - University admin API endpoints
- `/api/admin/*` - Platform admin API endpoints

### ❌ Investors Cannot Access:
- `/dashboard/student/*` - Student dashboard and settings
- `/dashboard/employer/*` - Employer dashboard and settings
- `/dashboard/university/*` - University admin dashboard, student management, project management
- `/admin/*` - Platform admin features
- `/api/dashboard/student/*` - Student API endpoints
- `/api/dashboard/employer/*` - Employer API endpoints
- `/api/dashboard/university/*` - University admin API endpoints
- `/api/admin/*` - Platform admin API endpoints

### ❌ University Admins Cannot Access:
- `/dashboard/student/*` - Student dashboard and settings
- `/dashboard/employer/*` - Employer dashboard and settings
- `/dashboard/investor/*` - Investor dashboard and settings
- `/admin/*` - Platform admin features
- `/api/dashboard/student/*` - Student API endpoints
- `/api/dashboard/employer/*` - Employer API endpoints
- `/api/dashboard/investor/*` - Investor API endpoints
- `/api/admin/*` - Platform admin API endpoints

### ✅ Platform Admins Can Access:
- All dashboard routes
- All admin routes
- All management features
- Full platform access

---

## 🔄 Redirect Behavior

When a user tries to access a route they're not authorized for:

1. **Not authenticated** → Redirect to `/auth?redirect=...`
2. **Wrong role** → Redirect to their appropriate dashboard:
   - STUDENT → `/dashboard/student`
   - MENTOR → `/dashboard/student`
   - EMPLOYER → `/dashboard/employer`
   - INVESTOR → `/dashboard/investor`
   - UNIVERSITY_ADMIN → `/dashboard/university`
   - PLATFORM_ADMIN → `/admin`

---

## 🌐 Public Routes (No Authentication Required)

- `/` - Home page
- `/about` - About page
- `/features` - Features page
- `/solutions` - Solutions page
- `/contact` - Contact page
- `/support` - Support page
- `/terms` - Terms page
- `/privacy` - Privacy page
- `/auth` - Authentication pages
- `/forgot-password` - Password recovery
- `/reset-password` - Password reset
- `/projects` - Public projects listing
- `/marketplace` - Public marketplace
- `/marketplace/projects` - Marketplace projects
- `/leaderboards` - Public leaderboards
- `/jobs` - Public job listings
- `/suppliers` - Public suppliers listing
- `/needs` - Public needs listing
- `/api/auth/login` - Login API
- `/api/auth/signup` - Signup API
- `/api/auth/forgot-password` - Password recovery API
- `/api/auth/reset-password` - Password reset API

---

## 🔍 How Protection Works

### Middleware Flow:
1. Request comes in
2. Check if path is static file → allow
3. Check if path is public → allow
4. Check if path is protected:
   - Get token from cookie
   - Verify token
   - Check user role
   - Compare with allowed roles
   - If allowed → proceed
   - If not allowed → redirect to appropriate dashboard

### Logging:
All requests are logged with:
- Path being accessed
- Whether it's public, protected, or undefined
- User ID and role (if authenticated)
- Access decision (allow/deny)
- Redirect target (if denied)

---

## 🧪 Testing Access Control

### Test 1: Student Cross-Access Protection
1. Login as STUDENT
2. Try to access `/dashboard/employer`
   - ✅ Should redirect to `/dashboard/student`
3. Try to access `/dashboard/employer/settings`
   - ✅ Should redirect to `/dashboard/student`
4. Try to access `/dashboard/university`
   - ✅ Should redirect to `/dashboard/student`
5. Try to access `/dashboard/university/students`
   - ✅ Should redirect to `/dashboard/student`
6. Try to access `/dashboard/investor`
   - ✅ Should redirect to `/dashboard/student`

### Test 2: Employer Cross-Access Protection
1. Login as EMPLOYER
2. Try to access `/dashboard/student`
   - ✅ Should redirect to `/dashboard/employer`
3. Try to access `/dashboard/student/settings`
   - ✅ Should redirect to `/dashboard/employer`
4. Try to access `/dashboard/university`
   - ✅ Should redirect to `/dashboard/employer`
5. Try to access `/dashboard/investor`
   - ✅ Should redirect to `/dashboard/employer`

### Test 3: University Admin Cross-Access Protection
1. Login as UNIVERSITY_ADMIN
2. Try to access `/dashboard/student`
   - ✅ Should redirect to `/dashboard/university`
3. Try to access `/dashboard/student/settings`
   - ✅ Should redirect to `/dashboard/university`
4. Try to access `/dashboard/employer`
   - ✅ Should redirect to `/dashboard/university`
5. Try to access `/dashboard/investor`
   - ✅ Should redirect to `/dashboard/university`

### Test 4: Investor Cross-Access Protection
1. Login as INVESTOR
2. Try to access `/dashboard/student`
   - ✅ Should redirect to `/dashboard/investor`
3. Try to access `/dashboard/employer`
   - ✅ Should redirect to `/dashboard/investor`
4. Try to access `/dashboard/university`
   - ✅ Should redirect to `/dashboard/investor`

### Test 5: API Protection
1. Open browser DevTools Network tab
2. Try accessing protected APIs directly:
   - Login as STUDENT
   - Fetch `/api/dashboard/university/students`
   - ✅ Should fail or redirect (401/403)
3. Check that only appropriate API endpoints are accessible

---

## 📝 Important Notes

1. **Immediate Redirects**: Unauthorized access results in immediate redirects with no content flash
2. **Comprehensive Protection**: All dashboard routes, settings, and management pages are protected
3. **API Protection**: API routes that return role-specific data are also protected
4. **Platform Admin Override**: Platform admins can access everything
5. **Logging**: All access attempts are logged for security auditing

---

## 🚀 Deployment Checklist

- [x] All dashboard routes protected
- [x] All settings pages protected
- [x] All management pages protected
- [x] API endpoints protected
- [x] Cross-access prevention for all stakeholders
- [x] Immediate redirects for unauthorized access
- [x] Comprehensive logging for security
- [x] Platform admin full access maintained
