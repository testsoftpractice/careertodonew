---
Task ID: 1
Agent: Z.ai Code
Task: Fix authentication and data loading issues

Work Log:
- Identified JWT token expiration issue (1 hour too short)
- Extended JWT token expiration from 1 hour to 7 days
- Extended refresh token expiration from 7 days to 30 days
- Updated login route cookie expiration to 7 days
- Fixed inconsistent authentication middleware across admin approval endpoints
- Updated admin/approvals/jobs/route.ts to use @/lib/auth/verify
- Updated admin/approvals/jobs/[id]/route.ts to use @/lib/auth/verify
- Updated admin/approvals/projects/[id]/route.ts to use @/lib/auth/verify
- Added proper AuthError handling in all admin approval endpoints
- Verified database schema is in sync
- Successfully built application with 170 static pages

Stage Summary:
- Fixed the primary cause of automatic logouts (1-hour token expiration)
- Standardized authentication middleware across all admin approval endpoints
- All admin approval endpoints now use consistent auth pattern from @/lib/auth/verify
- Build successful with no errors
- Authentication errors should now be significantly reduced
