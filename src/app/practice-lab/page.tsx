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
  MessageSquare,
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
    id: 'marketing',
    name: 'Marketing & Sales',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    tools: [
      {
        id: 'email-marketing',
        name: 'Email Marketing',
        path: '/email-marketing',
        url: 'https://email-marketing-theta-five.vercel.app',
        description: 'Create and manage email campaigns with templates, automation, and analytics.',
        category: 'Marketing',
        icon: <Mail className="w-6 h-6" />,
        features: ['Email Templates', 'Automation Workflows', 'Analytics Dashboard', 'A/B Testing'],
        status: 'available',
      },
    ],
  },
  {
    id: 'education',
    name: 'Education & Learning',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    tools: [
      {
        id: 'study-pathways',
        name: 'Study Pathways',
        path: '/study-pathways',
        url: 'https://study-pathways.vercel.app',
        description: 'Personalized learning paths with progress tracking and skill assessments.',
        category: 'Education',
        icon: <BookOpen className="w-6 h-6" />,
        features: ['Custom Learning Paths', 'Progress Tracking', 'Skill Assessments', 'Certification'],
        status: 'available',
      },
    ],
  },
  {
    id: 'automation',
    name: 'Automation & Workflow',
    icon: <Workflow className="w-5 h-5" />,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    tools: [
      {
        id: 'zap',
        name: 'ZAP Automation',
        path: '/zap',
        url: 'https://zap-smoky-one.vercel.app',
        description: 'Automate workflows and integrate multiple applications seamlessly.',
        category: 'Automation',
        icon: <Zap className="w-6 h-6" />,
        features: ['Workflow Builder', 'Multi-App Integration', 'Scheduling', 'Error Handling'],
        status: 'available',
      },
      {
        id: 'automation',
        name: 'Automation Hub',
        path: '/automation',
        url: 'https://automation-five-pi.vercel.app',
        description: 'Comprehensive automation platform for business process optimization.',
        category: 'Automation',
        icon: <Workflow className="w-6 h-6" />,
        features: ['Process Automation', 'Task Scheduling', 'Integration Builder', 'Monitoring'],
        status: 'available',
      },
    ],
  },
  {
    id: 'development',
    name: 'Development & Roadmaps',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    tools: [
      {
        id: 'roadmap',
        name: 'Roadmap Builder',
        path: '/roadmap',
        url: 'https://roadmap-seven-xi.vercel.app',
        description: 'Create and manage product and project roadmaps with milestones.',
        category: 'Development',
        icon: <Target className="w-6 h-6" />,
        features: ['Milestone Tracking', 'Timeline View', 'Collaboration', 'Export Options'],
        status: 'available',
      },
      {
        id: 'nexus',
        name: 'Nexus App',
        path: '/nexus',
        url: 'https://nexux-app-delta.vercel.app',
        description: 'Integrated development environment for building modern applications.',
        category: 'Development',
        icon: <Database className="w-6 h-6" />,
        features: ['Code Editor', 'Live Preview', 'Version Control', 'Deployment'],
        status: 'available',
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    icon: <PieChart className="w-5 h-5" />,
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    tools: [
      {
        id: 'tax-submit',
        name: 'Tax Submission',
        path: '/tax-submit',
        url: 'https://tax-submit.vercel.app',
        description: 'Simplify tax preparation and submission with automated calculations.',
        category: 'Finance',
        icon: <FileText className="w-6 h-6" />,
        features: ['Tax Calculator', 'Form Generation', 'E-Filing', 'Document Storage'],
        status: 'available',
      },
      {
        id: 'erp',
        name: 'ERP System',
        path: '/erp',
        url: 'https://erp-omega-blush.vercel.app',
        description: 'Enterprise resource planning for managing business operations.',
        category: 'Finance',
        icon: <BarChart3 className="w-6 h-6" />,
        features: ['Inventory Management', 'Financial Accounting', 'HR Management', 'Reporting'],
        status: 'available',
      },
      {
        id: 'odoo',
        name: 'Odoo Integration',
        path: '/odoo',
        url: 'https://odoo-five.vercel.app',
        description: 'Connect and manage Odoo business applications.',
        category: 'Finance',
        icon: <PieChart className="w-6 h-6" />,
        features: ['CRM Integration', 'Sales Management', 'Accounting', 'Project Management'],
        status: 'available',
      },
      {
        id: 'accounting',
        name: 'Accounting Suite',
        path: '/accounting',
        url: 'https://accounting-bwvq.vercel.app',
        description: 'Complete accounting solution with invoicing and expense tracking.',
        category: 'Finance',
        icon: <FileText className="w-6 h-6" />,
        features: ['Invoicing', 'Expense Tracking', 'Financial Reports', 'Multi-Currency'],
        status: 'available',
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics & Data',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
    tools: [
      {
        id: 'excel',
        name: 'Excel Tools',
        path: '/excel',
        url: 'https://excel-ashen-ten.vercel.app',
        description: 'Advanced Excel utilities for data analysis and visualization.',
        category: 'Analytics',
        icon: <BarChart3 className="w-6 h-6" />,
        features: ['Data Analysis', 'Chart Generation', 'Formula Builder', 'Import/Export'],
        status: 'available',
      },
      {
        id: 'powerbi',
        name: 'Power BI',
        path: '/powerbi',
        url: 'https://powerbi-livid.vercel.app',
        description: 'Business intelligence and data visualization platform.',
        category: 'Analytics',
        icon: <PieChart className="w-6 h-6" />,
        features: ['Interactive Dashboards', 'Data Modeling', 'Real-time Analytics', 'Reports'],
        status: 'available',
      },
    ],
  },
  {
    id: 'business',
    name: 'Business & CRM',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    tools: [
      {
        id: 'ghl-crm',
        name: 'GHL CRM',
        path: '/ghl-crm',
        url: 'https://ghl-crm.vercel.app',
        description: 'Customer relationship management for sales and marketing teams.',
        category: 'Business',
        icon: <Users className="w-6 h-6" />,
        features: ['Contact Management', 'Pipeline Tracking', 'Email Integration', 'Analytics'],
        status: 'available',
      },
      {
        id: 'pos',
        name: 'POS System',
        path: '/pos',
        url: 'https://pos-eight-blush.vercel.app',
        description: 'Point of sale system for retail and restaurant businesses.',
        category: 'Business',
        icon: <Star className="w-6 h-6" />,
        features: ['Inventory Sync', 'Payment Processing', 'Receipt Printing', 'Sales Reports'],
        status: 'available',
      },
      {
        id: 'ecommerce',
        name: 'E-commerce',
        path: '/ecommerce',
        url: 'https://ecommerce-lac-five.vercel.app',
        description: 'Online store management with product catalog and orders.',
        category: 'Business',
        icon: <Database className="w-6 h-6" />,
        features: ['Product Management', 'Order Processing', 'Payment Gateway', 'Shipping'],
        status: 'available',
      },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity & Management',
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    tools: [
      {
        id: 'project-management',
        name: 'Project Management',
        path: '/project-management',
        url: 'https://project-management-chi-eight.vercel.app',
        description: 'Manage projects with tasks, timelines, and team collaboration.',
        category: 'Productivity',
        icon: <Target className="w-6 h-6" />,
        features: ['Task Management', 'Gantt Charts', 'Team Collaboration', 'Time Tracking'],
        status: 'available',
      },
      {
        id: 'typing',
        name: 'Typing Practice',
        path: '/typing',
        url: 'https://typing-kappa-gold.vercel.app',
        description: 'Improve typing speed and accuracy with interactive lessons.',
        category: 'Productivity',
        icon: <Keyboard className="w-6 h-6" />,
        features: ['Speed Tests', 'Accuracy Tracking', 'Custom Lessons', 'Progress Reports'],
        status: 'available',
      },
      {
        id: 'document-management',
        name: 'Document Management',
        path: '/document-management',
        url: 'https://document-management-ochre.vercel.app',
        description: 'Organize and manage documents with version control.',
        category: 'Productivity',
        icon: <FileText className="w-6 h-6" />,
        features: ['File Storage', 'Version Control', 'Search & Filter', 'Collaboration'],
        status: 'available',
      },
    ],
  },
  {
    id: 'hr',
    name: 'HR & Workforce',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    tools: [
      {
        id: 'hrms',
        name: 'HRMS',
        path: '/hrms',
        url: 'https://hrms-pi-virid.vercel.app',
        description: 'Human resource management system for employee administration.',
        category: 'HR',
        icon: <Users className="w-6 h-6" />,
        features: ['Employee Records', 'Leave Management', 'Payroll', 'Performance Reviews'],
        status: 'available',
      },
    ],
  },
  {
    id: 'workflow',
    name: 'Workflow & Processes',
    icon: <Workflow className="w-5 h-5" />,
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
    tools: [
      {
        id: 'af-workflow',
        name: 'AF Workflow',
        path: '/af-workflow',
        url: 'https://af-workflow.vercel.app',
        description: 'Automated workflow management for business processes.',
        category: 'Workflow',
        icon: <Workflow className="w-6 h-6" />,
        features: ['Process Designer', 'Automation Rules', 'Approval Workflows', 'Analytics'],
        status: 'available',
      },
      {
        id: 'hr-workflow',
        name: 'HR Workflow',
        path: '/hr-workflow',
        url: 'https://hr-workflow-gamma.vercel.app',
        description: 'Streamlined HR processes with automated workflows.',
        category: 'Workflow',
        icon: <Users className="w-6 h-6" />,
        features: ['Onboarding', 'Leave Requests', 'Performance Cycles', 'Document Management'],
        status: 'available',
      },
      {
        id: 'operations-tasks',
        name: 'Operations Tasks',
        path: '/operations-tasks',
        url: 'https://operations-tasks.vercel.app',
        description: 'Manage daily operations and task assignments.',
        category: 'Workflow',
        icon: <CheckCircle2 className="w-6 h-6" />,
        features: ['Task Assignment', 'Priority Management', 'Progress Tracking', 'Notifications'],
        status: 'available',
      },
      {
        id: 'sales-workflow',
        name: 'Sales Workflow',
        path: '/sales-workflow',
        url: 'https://sales-workflow.vercel.app',
        description: 'Optimize sales processes with automated workflows.',
        category: 'Workflow',
        icon: <Target className="w-6 h-6" />,
        features: ['Lead Management', 'Pipeline Automation', 'Follow-up Reminders', 'Sales Analytics'],
        status: 'available',
      },
      {
        id: 'appointment-booking',
        name: 'Appointment Booking',
        path: '/appointment-booking',
        url: 'https://appointment-booking-steel.vercel.app',
        description: 'Schedule and manage appointments with calendar integration.',
        category: 'Workflow',
        icon: <Calendar className="w-6 h-6" />,
        features: ['Online Booking', 'Calendar Sync', 'Reminders', 'Client Management'],
        status: 'available',
      },
      {
        id: 'application-tracking',
        name: 'Application Tracking',
        path: '/application-tracking',
        url: 'https://applicatrion-tracking.vercel.app',
        description: 'Track and manage applications with status updates.',
        category: 'Workflow',
        icon: <FileText className="w-6 h-6" />,
        features: ['Application Forms', 'Status Tracking', 'Document Upload', 'Notifications'],
        status: 'available',
      },
      {
        id: 'bpm',
        name: 'BPM',
        path: '/bpm',
        url: 'https://bpm-tau.vercel.app',
        description: 'Business process management for optimizing operations.',
        category: 'Workflow',
        icon: <Workflow className="w-6 h-6" />,
        features: ['Process Mapping', 'Performance Metrics', 'Continuous Improvement', 'Reporting'],
        status: 'available',
      },
    ],
  },
  {
    id: 'supply',
    name: 'Supply Chain',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    tools: [
      {
        id: 'business-supply',
        name: 'Business Supply',
        path: '/business-supply',
        url: 'https://business-supply.vercel.app',
        description: 'Manage business supplies and inventory efficiently.',
        category: 'Supply Chain',
        icon: <Database className="w-6 h-6" />,
        features: ['Inventory Management', 'Supplier Portal', 'Order Tracking', 'Analytics'],
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dept.tools.map((tool) => (
                      <Card
                        key={tool.id}
                        className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50 group"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className={`p-2 rounded-lg ${dept.color.replace('border-', 'bg-').replace('border-', 'text-')} bg-opacity-10`}>
                              {tool.icon}
                            </div>
                            {tool.status === 'coming-soon' && (
                              <Badge variant="secondary">Coming Soon</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg line-clamp-1">{tool.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {tool.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Features */}
                          <div className="space-y-2">
                            {tool.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Action Button */}
                          {tool.status === 'available' ? (
                            <Button
                              className="w-full group-hover:bg-primary/90 transition-colors"
                              asChild
                            >
                              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                Launch Tool
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full" disabled>
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
