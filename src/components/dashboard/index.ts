// Dashboard Configuration System
export { DashboardEditor } from './DashboardEditor'
export type { DashboardWidget, DashboardConfig, DashboardEditorProps } from './DashboardEditor'

// Core Dashboard Widgets (Reusable across roles)
export { StatsCard } from '@/components/dashboard-widgets/StatsCard'
export { ActivityList } from '@/components/dashboard-widgets/ActivityList'
export { QuickActions } from '@/components/dashboard-widgets/QuickActions'
export { TaskCard } from '@/components/dashboard-widgets/TaskCard'
export { ProjectCard } from '@/components/dashboard-widgets/ProjectCard'
export { WelcomeHeader } from '@/components/dashboard-widgets/WelcomeHeader'

// Student-specific Widgets
export * from './student'

// University-specific Widgets
export * from './university'

// Employer-specific Widgets
export * from './employer'

// Investor-specific Widgets
export * from './investor'

// Admin-specific Widgets
export * from './admin'
