# Flexible Dashboard System

A comprehensive, customizable dashboard system with role-specific widgets for the CareerToDone platform.

## Features

- **Flexible Dashboard Configuration**: Customize widget visibility and order using the DashboardEditor
- **Role-Specific Widgets**: 24+ widgets designed for different user roles
- **Responsive Design**: All widgets work seamlessly on mobile, tablet, and desktop
- **Easy Integration**: Simple import structure for quick widget integration
- **TypeScript Support**: Fully typed for better developer experience

## Roles and Widgets

### Student Dashboard Widgets

Located in `/src/components/dashboard/student/`

1. **CourseProgress** - Track academic course progress, grades, and credits
2. **GradesCard** - Display academic performance with GPA metrics
3. **ScheduleCard** - Show weekly or daily class schedule
4. **StudyTimeTracker** - Monitor study sessions, goals, and streaks
5. **AchievementBadges** - Display unlocked achievements and rarity
6. **SkillsMatrix** - Show skills with endorsements, levels, and verification
7. **MentorConnect** - Connect with mentors and schedule meetings
8. **UpcomingDeadlines** - Track assignment and project deadlines

### University Dashboard Widgets

Located in `/src/components/dashboard/university/`

1. **StudentStats** - Student statistics, enrollment, and department breakdown
2. **DepartmentPerformance** - Department metrics, budgets, and performance scores
3. **ResearchProjects** - Track research projects, funding, and publications
4. **FundingOverview** - Financial overview, budget utilization, and revenue

### Employer Dashboard Widgets

Located in `/src/components/dashboard/employer/`

1. **JobPostings** - Manage job postings and track applications
2. **CandidatePool** - View candidates, match scores, and application pipeline
3. **HiringPipeline** - Track hiring stages, time-to-hire, and efficiency
4. **TeamPerformance** - Monitor team member performance and recent hires

### Investor Dashboard Widgets

Located in `/src/components/dashboard/investor/`

1. **PortfolioOverview** - Track portfolio value, ROI, and asset allocation
2. **DealFlow** - Manage investment deals and pipeline value
3. **StartupTracker** - Monitor startup investments and growth
4. **FinancialMetrics** - Revenue, profit, and monthly trends

### Admin Dashboard Widgets

Located in `/src/components/dashboard/admin/`

1. **PlatformStatistics** - Platform-wide user and engagement metrics
2. **SystemHealth** - Monitor server resources, uptime, and status
3. **SecurityOverview** - Track security alerts and incidents
4. **UserManagement** - Manage users, roles, and verifications

## Usage

### Basic Widget Import

Import widgets from the central dashboard library:

```tsx
import {
  CourseProgress,
  GradesCard,
  StatsCard,
  ProjectCard,
} from '@/components/dashboard'
```

Or import from role-specific directories:

```tsx
import { CourseProgress, GradesCard } from '@/components/dashboard/student'
```

### Dashboard Editor Integration

Add the DashboardEditor to enable dashboard customization:

```tsx
'use client'

import { useState } from 'react'
import { DashboardEditor, type DashboardConfig } from '@/components/dashboard'
import { CourseProgress, GradesCard } from '@/components/dashboard/student'

export default function StudentDashboard() {
  const [config, setConfig] = useState<DashboardConfig>({
    role: 'STUDENT',
    layout: 'grid',
    widgets: [
      { id: 'courses', title: 'Course Progress', component: 'CourseProgress', visible: true, order: 0 },
      { id: 'grades', title: 'Academic Performance', component: 'GradesCard', visible: true, order: 1 },
    ],
  })

  const handleSave = () => {
    // Save configuration to backend/localStorage
  }

  const handleReset = () => {
    // Reset to default configuration
  }

  return (
    <div>
      <DashboardEditor
        config={config}
        onConfigChange={setConfig}
        onSave={handleSave}
        onReset={handleReset}
      />

      {/* Render widgets based on config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.widgets
          .filter(w => w.visible)
          .sort((a, b) => a.order - b.order)
          .map(widget => (
            <div key={widget.id}>
              {widget.component === 'CourseProgress' && (
                <CourseProgress courses={courseData} />
              )}
              {widget.component === 'GradesCard' && (
                <GradesCard {...gradesData} />
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
```

### Widget Props

Each widget accepts specific props. See individual widget files for detailed prop interfaces.

#### Example: CourseProgress

```tsx
import { CourseProgress, type Course } from '@/components/dashboard/student'

const courses: Course[] = [
  {
    id: '1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Smith',
    progress: 75,
    grade: 'A',
    credits: 4,
    status: 'in_progress',
  },
]

<CourseProgress courses={courses} maxCourses={4} className="col-span-2" />
```

## Customization

### Adding Custom Widgets

1. Create a new widget component in the appropriate role directory
2. Add it to the role's index.ts file
3. Add it to the dashboard config
4. Integrate it in the DashboardEditor

Example:

```tsx
// src/components/dashboard/student/MyCustomWidget.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MyCustomWidgetProps {
  data: any[]
  className?: string
}

export function MyCustomWidget({ data, className = '' }: MyCustomWidgetProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>My Custom Widget</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Widget content */}
      </CardContent>
    </Card>
  )
}
```

Add to index.ts:

```tsx
// src/components/dashboard/student/index.ts
export { MyCustomWidget } from './MyCustomWidget'
export type { MyCustomWidgetProps } from './MyCustomWidget'
```

### Persisting Dashboard Configuration

Store user's dashboard configuration in the database:

```tsx
// Example API route to save config
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { userId, config } = await request.json()

  await db.dashboardConfig.upsert({
    where: { userId },
    update: { config },
    create: { userId, config },
  })

  return NextResponse.json({ success: true })
}
```

## Responsive Design

All widgets are designed with mobile-first approach:

- Mobile: 1 column layout
- Tablet: 2 column layout
- Desktop: 3-4 column layout

Use responsive grid utilities:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <CourseProgress className="col-span-2" />
  <GradesCard />
</div>
```

## Best Practices

1. **Use TypeScript**: All widgets are fully typed for better DX
2. **Handle Loading States**: Widgets should support loading and empty states
3. **Responsive Grid**: Use Tailwind's responsive grid utilities
4. **Consistent Styling**: Follow the existing design system (shadcn/ui)
5. **Error Handling**: Add proper error boundaries and fallbacks

## Examples

See existing dashboard implementations:

- Student: `/src/app/dashboard/student/page.tsx`
- University: `/src/app/dashboard/university/page.tsx`
- Employer: `/src/app/dashboard/employer/page.tsx`
- Investor: `/src/app/dashboard/investor/page.tsx`

## Support

For issues or questions, refer to the widget source files in `/src/components/dashboard/` directories.
