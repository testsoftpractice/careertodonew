'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dumbbell,
  ExternalLink,
  Lock,
  Search,
  Filter,
  Zap,
  ArrowRight,
  Mail,
  BookOpen,
  Workflow,
  Target,
  PieChart,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Database,
  CheckCircle2,
  Clock,
  Star,
  Keyboard,
  ShoppingCart,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'

interface PracticeTool {
  id: string
  name: string
  path: string
  url: string
  description: string
  category: string
  icon: React.ReactNode
  features: string[]
  status: 'available' | 'coming-soon'
}

const departments = [
  {
    id: 'human-resource',
    name: 'Human Resource',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    tools: [
      {
        id: 'hr-workflow',
        name: 'HR Workflow',
        path: '/hr-workflow',
        url: '/hr-workflow',
        description: 'HR tasks list for managing human resources processes efficiently.',
        category: 'HR',
        icon: <Users className="w-6 h-6" />,
        features: ['Employee Onboarding', 'Leave Management', 'Performance Reviews', 'Document Management'],
        status: 'available',
      },
      {
        id: 'hrms',
        name: 'HRMS',
        path: '/hrms',
        url: '/hrms',
        description: 'Complete Human Resource Management System for employee lifecycle management.',
        category: 'HR',
        icon: <Users className="w-6 h-6" />,
        features: ['Employee Records', 'Payroll Management', 'Leave & Attendance', 'Recruitment'],
        status: 'available',
      },
      {
        id: 'application-tracking',
        name: 'Application Tracking',
        path: '/application-tracking',
        url: '/application-tracking',
        description: 'Track and manage job applications throughout the recruitment process.',
        category: 'HR',
        icon: <FileText className="w-6 h-6" />,
        features: ['Application Pipeline', 'Candidate Management', 'Interview Scheduling', 'Status Tracking'],
        status: 'available',
      },
    ],
  },
  {
    id: 'accounting-finance',
    name: 'Accounting & Finance',
    icon: <PieChart className="w-5 h-5" />,
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    tools: [
      {
        id: 'af-workflow',
        name: 'AF Workflow',
        path: '/af-workflow',
        url: '/af-workflow',
        description: 'Accounting & Finance workflow for managing financial processes.',
        category: 'Finance',
        icon: <FileText className="w-6 h-6" />,
        features: ['Financial Reporting', 'Expense Tracking', 'Budget Management', 'Tax Preparation'],
        status: 'available',
      },
      {
        id: 'accounting',
        name: 'Accounting',
        path: '/accounting',
        url: '/accounting',
        description: 'Comprehensive accounting software for financial management and bookkeeping.',
        category: 'Finance',
        icon: <Database className="w-6 h-6" />,
        features: ['General Ledger', 'Accounts Payable/Receivable', 'Financial Statements', 'Bank Reconciliation'],
        status: 'available',
      },
      {
        id: 'tax-submit',
        name: 'Tax Submit',
        path: '/tax-submit',
        url: '/tax-submit',
        description: 'Tax preparation and submission platform for individuals and businesses.',
        category: 'Finance',
        icon: <FileText className="w-6 h-6" />,
        features: ['Tax Calculation', 'Form Generation', 'E-Filing', 'Tax Compliance'],
        status: 'available',
      },
    ],
  },
  {
    id: 'operations-management',
    name: 'Operation & Management',
    icon: <Workflow className="w-5 h-5" />,
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    tools: [
      {
        id: 'operations-tasks',
        name: 'Operations Tasks',
        path: '/operations-tasks',
        url: '/operations-tasks',
        description: 'Operations tasks for managing daily business operations.',
        category: 'Operations',
        icon: <CheckCircle2 className="w-6 h-6" />,
        features: ['Task Assignment', 'Priority Management', 'Progress Tracking', 'Team Coordination'],
        status: 'available',
      },
      {
        id: 'erp',
        name: 'ERP System',
        path: '/erp',
        url: '/erp',
        description: 'Enterprise Resource Planning system for integrated business management.',
        category: 'Operations',
        icon: <Database className="w-6 h-6" />,
        features: ['Resource Planning', 'Supply Chain', 'Inventory Management', 'Financial Integration'],
        status: 'available',
      },
      {
        id: 'odoo',
        name: 'Odoo',
        path: '/odoo',
        url: '/odoo',
        description: 'Comprehensive business management suite with various integrated applications.',
        category: 'Operations',
        icon: <Workflow className="w-6 h-6" />,
        features: ['CRM', 'Sales', 'Accounting', 'Inventory'],
        status: 'available',
      },
      {
        id: 'project-management',
        name: 'Project Management',
        path: '/project-management',
        url: '/project-management',
        description: 'Complete project management solution for planning and tracking projects.',
        category: 'Operations',
        icon: <BarChart3 className="w-6 h-6" />,
        features: ['Project Planning', 'Task Management', 'Gantt Charts', 'Resource Allocation'],
        status: 'available',
      },
      {
        id: 'bpm',
        name: 'Business Process Management',
        path: '/bpm',
        url: '/bpm',
        description: 'Design, execute, and optimize business processes efficiently.',
        category: 'Operations',
        icon: <Workflow className="w-6 h-6" />,
        features: ['Process Modeling', 'Workflow Automation', 'Process Analytics', 'Compliance'],
        status: 'available',
      },
      {
        id: 'automation',
        name: 'Automation',
        path: '/automation',
        url: '/automation',
        description: 'Business automation platform for streamlining workflows and tasks.',
        category: 'Operations',
        icon: <Zap className="w-6 h-6" />,
        features: ['Workflow Automation', 'Task Scheduling', 'Process Orchestration', 'Integration Hub'],
        status: 'available',
      },
      {
        id: 'document-management',
        name: 'Document Management',
        path: '/document-management',
        url: '/document-management',
        description: 'Secure document storage and management system for organizations.',
        category: 'Operations',
        icon: <FileText className="w-6 h-6" />,
        features: ['Document Storage', 'Version Control', 'Access Control', 'Search & Retrieval'],
        status: 'available',
      },
      {
        id: 'business-supply',
        name: 'Business Supply',
        path: '/business-supply',
        url: '/business-supply',
        description: 'Supply chain management for efficient business operations.',
        category: 'Operations',
        icon: <ShoppingCart className="w-6 h-6" />,
        features: ['Supplier Management', 'Order Processing', 'Inventory Control', 'Logistics'],
        status: 'available',
      },
    ],
  },
  {
    id: 'sales-marketing',
    name: 'Sales & Marketing',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    tools: [
      {
        id: 'sales-workflow',
        name: 'Sales Workflow',
        path: '/sales-workflow',
        url: '/sales-workflow',
        description: 'Sales workflow for managing sales processes and customer relationships.',
        category: 'Sales',
        icon: <Target className="w-6 h-6" />,
        features: ['Lead Management', 'Pipeline Tracking', 'Follow-up Reminders', 'Sales Analytics'],
        status: 'available',
      },
      {
        id: 'email-marketing',
        name: 'Email Marketing',
        path: '/email-marketing',
        url: '/email-marketing',
        description: 'Create and manage email campaigns with templates, automation, and analytics.',
        category: 'Marketing',
        icon: <Mail className="w-6 h-6" />,
        features: ['Email Templates', 'Automation Workflows', 'Analytics Dashboard', 'A/B Testing'],
        status: 'available',
      },
      {
        id: 'study-pathways',
        name: 'Student Consulting Firm CRM',
        path: '/study-pathways',
        url: '/study-pathways',
        description: 'Student consulting firm CRM for managing student relationships and consulting projects.',
        category: 'Sales',
        icon: <BookOpen className="w-6 h-6" />,
        features: ['Student Management', 'Project Tracking', 'Consultation Scheduling', 'Progress Reports'],
        status: 'available',
      },
      {
        id: 'ghl-crm',
        name: 'GHL CRM',
        path: '/ghl-crm',
        url: '/ghl-crm',
        description: 'Comprehensive CRM system for managing customer relationships and sales.',
        category: 'Sales',
        icon: <Users className="w-6 h-6" />,
        features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline', 'Marketing Automation'],
        status: 'available',
      },
      {
        id: 'appointment-booking',
        name: 'Appointment Booking',
        path: '/appointment-booking',
        url: '/appointment-booking',
        description: 'Schedule and manage appointments with clients and customers.',
        category: 'Sales',
        icon: <Calendar className="w-6 h-6" />,
        features: ['Online Booking', 'Calendar Sync', 'Reminders', 'Client Management'],
        status: 'available',
      },
      {
        id: 'pos',
        name: 'Point of Sale',
        path: '/pos',
        url: '/pos',
        description: 'Point of Sale system for retail and restaurant businesses.',
        category: 'Sales',
        icon: <ShoppingCart className="w-6 h-6" />,
        features: ['Sales Processing', 'Inventory Management', 'Payment Integration', 'Receipt Printing'],
        status: 'available',
      },
      {
        id: 'ecommerce',
        name: 'E-commerce',
        path: '/ecommerce',
        url: '/ecommerce',
        description: 'Complete e-commerce platform for online selling and store management.',
        category: 'Sales',
        icon: <ShoppingCart className="w-6 h-6" />,
        features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management'],
        status: 'available',
      },
    ],
  },
  {
    id: 'data-analytics',
    name: 'Data & Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
    tools: [
      {
        id: 'excel',
        name: 'Excel',
        path: '/excel',
        url: '/excel',
        description: 'Spreadsheet application for data organization, analysis, and visualization.',
        category: 'Data',
        icon: <BarChart3 className="w-6 h-6" />,
        features: ['Data Entry', 'Formulas & Functions', 'Charts & Graphs', 'Data Analysis'],
        status: 'available',
      },
      {
        id: 'powerbi',
        name: 'Power BI',
        path: '/powerbi',
        url: '/powerbi',
        description: 'Business intelligence and data visualization platform for insights.',
        category: 'Analytics',
        icon: <PieChart className="w-6 h-6" />,
        features: ['Data Visualization', 'Interactive Dashboards', 'Data Modeling', 'Report Sharing'],
        status: 'available',
      },
    ],
  },
  {
    id: 'productivity-tools',
    name: 'Productivity & Tools',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    tools: [
      {
        id: 'typing',
        name: 'Typing Practice',
        path: '/typing',
        url: '/typing',
        description: 'Improve your typing speed and accuracy with practice exercises.',
        category: 'Skills',
        icon: <Keyboard className="w-6 h-6" />,
        features: ['Speed Training', 'Accuracy Tests', 'WPM Tracking', 'Progress Reports'],
        status: 'available',
      },
      {
        id: 'zap',
        name: 'Zap',
        path: '/zap',
        url: '/zap',
        description: 'Automation tool for connecting apps and streamlining workflows.',
        category: 'Productivity',
        icon: <Zap className="w-6 h-6" />,
        features: ['App Integration', 'Workflow Automation', 'Triggers & Actions', 'Multi-step Workflows'],
        status: 'available',
      },
      {
        id: 'roadmap',
        name: 'Roadmap',
        path: '/roadmap',
        url: '/roadmap',
        description: 'Strategic planning tool for creating and managing project roadmaps.',
        category: 'Planning',
        icon: <Target className="w-6 h-6" />,
        features: ['Strategic Planning', 'Milestone Tracking', 'Timeline View', 'Resource Planning'],
        status: 'available',
      },
      {
        id: 'nexus',
        name: 'Nexus',
        path: '/nexus',
        url: '/nexus',
        description: 'Centralized hub for managing and integrating business applications.',
        category: 'Productivity',
        icon: <Workflow className="w-6 h-6" />,
        features: ['App Integration', 'Central Management', 'Data Synchronization', 'Workflow Orchestration'],
        status: 'available',
      },
    ],
  },
]

export default function PracticeLabPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  // Redirect if not authenticated - must use useEffect to avoid SSR issues
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  const filteredDepartments = departments.map(dept => ({
    ...dept,
    tools: dept.tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(dept => dept.tools.length > 0)

  const selectedDeptData = selectedDepartment
    ? departments.find(d => d.id === selectedDepartment)
    : null

  const allTools = departments.flatMap(dept => dept.tools)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Dumbbell className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Practice Lab</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Master Real-World Skills
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Access professional-grade software tools and practice scenarios to build hands-on experience across multiple departments.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tools and applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{allTools.length}</strong> Tools Available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{departments.length}</strong> Departments
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">24/7</strong> Access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Department Filter */}
        <section className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Button
                variant={selectedDepartment === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDepartment(null)}
                className="flex-shrink-0"
              >
                All Tools
              </Button>
              {departments.map((dept) => (
                <Button
                  key={dept.id}
                  variant={selectedDepartment === dept.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept.id)}
                  className="flex-shrink-0"
                >
                  <span className="mr-2">{dept.icon}</span>
                  {dept.name}
                  <Badge variant="secondary" className="ml-2">
                    {dept.tools.length}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="container mx-auto px-4 py-8">
          {selectedDeptData && (
            <div className="mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${selectedDeptData.color} mb-4`}>
                {selectedDeptData.icon}
                <h2 className="text-lg font-semibold">{selectedDeptData.name}</h2>
              </div>
              <p className="text-muted-foreground">
                Explore {selectedDeptData.tools.length} {selectedDeptData.tools.length === 1 ? 'tool' : 'tools'} available in this department.
              </p>
            </div>
          )}

          {searchQuery && filteredDepartments.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all departments.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {(selectedDeptData ? [selectedDeptData] : filteredDepartments).map((dept) => (
                <div key={dept.id} className="space-y-4">
                  {!selectedDeptData && (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${dept.color}`}>
                      {dept.icon}
                      <h2 className="text-lg font-semibold">{dept.name}</h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dept.tools.map((tool) => (
                      <Card
                        key={tool.id}
                        className="hover:shadow-md transition-all duration-200 border hover:border-primary/30 group"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${dept.color.replace('border-', 'bg-').replace('border-', 'text-')} bg-opacity-10`}>
                              {tool.icon}
                            </div>
                            {tool.status === 'coming-soon' && (
                              <Badge variant="secondary" className="text-xs">Soon</Badge>
                            )}
                          </div>
                          <CardTitle className="text-base line-clamp-1">{tool.name}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            {tool.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {/* Action Button */}
                          {tool.status === 'available' ? (
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => router.push(tool.path)}
                            >
                              Launch
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="w-full" disabled>
                              <Lock className="mr-2 h-4 w-4" />
                              Coming Soon
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Info Section */}
        <section className="bg-muted/30 border-t">
          <div className="container mx-auto px-4 py-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Start Practicing Today</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                  These tools provide hands-on experience with real-world software. Practice at your own pace and build skills that employers value.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>No installation required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Real software environment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Learn by doing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
