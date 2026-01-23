# RBAC System Architecture for CareerToDone

## Overview
A comprehensive Role-Based Access Control (RBAC) system for businesses and projects with flexible role assignment and granular permissions.

## Roles Defined

### Business Roles (BusinessRole enum)
- OWNER: Full control over business, can add/edit all business details, post jobs, assign team members
- ADMIN: Administrative access, manage business settings, approve projects, manage all team roles
- HR_MANAGER: Can post jobs, manage applications, view candidates, manage recruitment
- PROJECT_MANAGER: Can create projects, assign tasks to team members, view project details
- TEAM_LEAD: Can view assigned tasks, update task status, add comments
- RECRUITER: Can search for candidates, manage applications, post jobs
- TEAM_MEMBER: View-only access to assigned projects and tasks
- VIEWER: Read-only access to view projects and information

### Project Roles (ProjectRole enum)
- OWNER: Full control - manage all aspects of project
- PROJECT_MANAGER: Manage team, assign tasks, manage milestones
- TEAM_LEAD: Lead a team section, moderate comments
- TEAM_MEMBER: Complete assigned tasks, add time entries
- VIEWER: View-only access

## Permission Matrix

### Business-Level Permissions

| Action | OWNER | ADMIN | HR_MANAGER | PROJECT_MANAGER | TEAM_LEAD | RECRUITER | TEAM_MEMBER | VIEWER |
|---------|-------|--------|--------------|----------|---------|----------|--------|---------|--------|
| Business Settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Post Jobs | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Team | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Projects | ✅ | ✅ | ✅ ✅ ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |

### Project-Level Permissions

| Action | OWNER | PROJECT_MANAGER | TEAM_LEAD | TEAM_MEMBER | VIEWER |
|---------|--------------|---------|---------|----------|---------|
| Create Project | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Project | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Project Details | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Milestones | ✅ ✅ ✅ | ✅ | ✅ |
| View Department Stats | ✅ ✅ ✅ ✅ | ✅ | ✅ |

### Task-Level Permissions

| Action | OWNER | PROJECT_MANAGER | TEAM_LEAD | TEAM_MEMBER | VIEWER |
|---------|--------------|---------|---------|----------|---------|
| Create Task | ✅ | ✅ | ❌ | ❌ | ❌ |
| Assign Task | ✅ | ✅ | ✅ ❌ | ❌ |
| Edit Task Details | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update Task Status | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Time Entries | ✅ | ✅ | ✅ ✅ | ✅ ✅ |
| Add Comments | ✅ | ✅ ✅ | ✅ ✅ ✅ |

## Schema Changes Needed

### New Models Required
1. **Business Model** - Business entity with approval status
2. **BusinessMember Model** - Role assignment within businesses
3. **Project Model** - Enhanced with businessId field
4. **Job Model** - Enhanced with businessId field
5. **Task Model** - Enhanced for role-based permissions

### API Routes to Create
1. Business management APIs (CRUD)
2. Business member management APIs (add/update roles, permissions)
3. Project management APIs with role checks
4. Task assignment APIs with permission validation
5. Dashboard widgets for each role

## Implementation Priority
1. HIGH - Create and validate database schema
2. HIGH - Build middleware protection
3. HIGH - Create API endpoints
4. MEDIUM - Create dashboard widgets
5. LOW - Integrate with existing dashboards
