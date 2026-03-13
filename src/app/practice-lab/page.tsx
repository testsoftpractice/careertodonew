'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Zap,
  Clock,
  ChevronRight,
  LayoutGrid,
  Users,
  Database,
  Workflow,
  Target,
  Mail,
  BarChart3,
  PieChart,
  Keyboard,
  ShoppingCart,
  FileText,
  Calendar,
  CheckCircle2,
  Building2,
  Truck,
  Package,
  Shield,
  Factory,
  Plane,
  Pill,
  Car,
  Stethoscope,
  ChevronDown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  duration?: string
}

const tools: PracticeTool[] = [
  // HR Tools
  {
    id: 'hr-workflow',
    name: 'HR Workflow',
    path: '/hr-workflow',
    url: '/hr-workflow',
    description: 'Employee onboarding, leave management, performance reviews.',
    category: 'HR',
    icon: <Users className="w-4 h-4" />,
    features: ['Onboarding', 'Leave', 'Reviews'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
  },
  {
    id: 'hrms',
    name: 'HRMS',
    path: '/hrms',
    url: '/hrms',
    description: 'Complete human resource management system.',
    category: 'HR',
    icon: <Users className="w-4 h-4" />,
    features: ['Records', 'Payroll', 'Attendance'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '4-5 hours',
  },
  {
    id: 'application-tracking',
    name: 'Application Tracking',
    path: '/application-tracking',
    url: '/application-tracking',
    description: 'Track job applications through recruitment.',
    category: 'HR',
    icon: <FileText className="w-4 h-4" />,
    features: ['Pipeline', 'Candidates', 'Scheduling'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
  },
  // Finance Tools
  {
    id: 'core-banking',
    name: 'Core Banking',
    path: '/core-banking',
    url: '/core-banking',
    description: 'Customer accounts, transactions, banking ops.',
    category: 'Finance',
    icon: <Database className="w-4 h-4" />,
    features: ['Accounts', 'Transactions', 'Loans'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '5-6 hours',
  },
  {
    id: 'af-workflow',
    name: 'AF Workflow',
    path: '/af-workflow',
    url: '/af-workflow',
    description: 'Financial reporting, expense tracking, budgeting.',
    category: 'Finance',
    icon: <FileText className="w-4 h-4" />,
    features: ['Reporting', 'Expenses', 'Budgeting'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
  },
  {
    id: 'accounting',
    name: 'Accounting',
    path: '/accounting',
    url: '/accounting',
    description: 'Financial management and bookkeeping.',
    category: 'Finance',
    icon: <Database className="w-4 h-4" />,
    features: ['Ledger', 'AP/AR', 'Statements'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '4-5 hours',
  },
  {
    id: 'tax-submit',
    name: 'Tax Submit',
    path: '/tax-submit',
    url: '/tax-submit',
    description: 'Tax preparation and submission platform.',
    category: 'Finance',
    icon: <FileText className="w-4 h-4" />,
    features: ['Calculation', 'Forms', 'E-Filing'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '3-4 hours',
  },
  // Operations Tools
  {
    id: 'operations-tasks',
    name: 'Operations Tasks',
    path: '/operations-tasks',
    url: '/operations-tasks',
    description: 'Manage daily business operations.',
    category: 'Operations',
    icon: <CheckCircle2 className="w-4 h-4" />,
    features: ['Tasks', 'Priorities', 'Tracking'],
    status: 'available',
    difficulty: 'Beginner',
    duration: '1-2 hours',
  },
  {
    id: 'erp',
    name: 'ERP System',
    path: '/erp',
    url: '/erp',
    description: 'Integrated business management system.',
    category: 'Operations',
    icon: <LayoutGrid className="w-4 h-4" />,
    features: ['Planning', 'Supply Chain', 'Inventory'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '6-8 hours',
  },
  {
    id: 'odoo',
    name: 'Odoo',
    path: '/odoo',
    url: '/odoo',
    description: 'Comprehensive business suite.',
    category: 'Operations',
    icon: <Workflow className="w-4 h-4" />,
    features: ['CRM', 'Sales', 'Accounting'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '5-7 hours',
  },
  {
    id: 'project-management',
    name: 'Project Management',
    path: '/project-management',
    url: '/project-management',
    description: 'Plan and track projects effectively.',
    category: 'Operations',
    icon: <BarChart3 className="w-4 h-4" />,
    features: ['Planning', 'Tasks', 'Gantt Charts'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
  },
  {
    id: 'bpm',
    name: 'Business Process Management',
    path: '/bpm',
    url: '/bpm',
    description: 'Design and optimize business processes.',
    category: 'Operations',
    icon: <Workflow className="w-4 h-4" />,
    features: ['Modeling', 'Automation', 'Analytics'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '4-5 hours',
  },
  {
    id: 'automation',
    name: 'Automation',
    path: '/automation',
    url: '/automation',
    description: 'Streamline workflows with automation.',
    category: 'Operations',
    icon: <Zap className="w-4 h-4" />,
    features: ['Workflows', 'Scheduling', 'Integrations'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
  },
  {
    id: 'document-management',
    name: 'Document Management',
    path: '/document-management',
    url: '/document-management',
    description: 'Secure document storage and management.',
    category: 'Operations',
    icon: <FileText className="w-4 h-4" />,
    features: ['Storage', 'Versioning', 'Access Control'],
    status: 'available',
    difficulty: 'Beginner',
    duration: '1-2 hours',
  },
  {
    id: 'business-supply',
    name: 'Business Supply',
    path: '/business-supply',
    url: '/business-supply',
    description: 'Supply chain and supplier management.',
    category: 'Operations',
    icon: <ShoppingCart className="w-4 h-4" />,
    features: ['Suppliers', 'Orders', 'Inventory'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
  },
  // Sales & Marketing Tools
  {
    id: 'sales-workflow',
    name: 'Sales Workflow',
    path: '/sales-workflow',
    url: '/sales-workflow',
    description: 'Manage sales processes and pipeline.',
    category: 'Sales',
    icon: <Target className="w-4 h-4" />,
    features: ['Leads', 'Pipeline', 'Analytics'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    path: '/email-marketing',
    url: '/email-marketing',
    description: 'Create and manage email campaigns.',
    category: 'Marketing',
    icon: <Mail className="w-4 h-4" />,
    features: ['Campaigns', 'Automation', 'Analytics'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
  },
  {
    id: 'email-management',
    name: 'Email Management',
    path: '/email-management',
    url: '/email-management',
    description: 'Manage and organize emails efficiently.',
    category: 'Marketing',
    icon: <Mail className="w-4 h-4" />,
    features: ['Inbox', 'Filters', 'Templates'],
    status: 'available',
    difficulty: 'Beginner',
    duration: '1-2 hours',
  },
  {
    id: 'study-pathways',
    name: 'Student Consulting CRM',
    path: '/study-pathways',
    url: '/study-pathways',
    description: 'Manage student relationships and projects.',
    category: 'Sales',
    icon: <Users className="w-4 h-4" />,
    features: ['Students', 'Projects', 'Scheduling'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
  },
  {
    id: 'ghl-crm',
    name: 'GHL CRM',
    path: '/ghl-crm',
    url: '/ghl-crm',
    description: 'Customer relationship management system.',
    category: 'Sales',
    icon: <Users className="w-4 h-4" />,
    features: ['Contacts', 'Leads', 'Marketing'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
  },
  {
    id: 'appointment-booking',
    name: 'Appointment Booking',
    path: '/appointment-booking',
    url: '/appointment-booking',
    description: 'Schedule appointments with reminders.',
    category: 'Sales',
    icon: <Calendar className="w-4 h-4" />,
    features: ['Booking', 'Sync', 'Reminders'],
    status: 'available',
    difficulty: 'Beginner',
    duration: '1-2 hours',
  },
  {
    id: 'pos',
    name: 'Point of Sale',
    path: '/pos',
    url: '/pos',
    description: 'Retail and restaurant POS system.',
    category: 'Sales',
    icon: <ShoppingCart className="w-4 h-4" />,
    features: ['Sales', 'Inventory', 'Payments'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    path: '/ecommerce',
    url: '/ecommerce',
    description: 'Online selling platform.',
    category: 'Sales',
    icon: <ShoppingCart className="w-4 h-4" />,
    features: ['Catalog', 'Cart', 'Orders'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
  },
  // Data & Analytics Tools
  {
    id: 'excel',
    name: 'Excel',
    path: '/excel',
    url: '/excel',
    description: 'Spreadsheet for data and analysis.',
    category: 'Data',
    icon: <BarChart3 className="w-4 h-4" />,
    features: ['Data', 'Formulas', 'Charts'],
    status: 'available',
    difficulty: 'Beginner',
    duration: '2-3 hours',
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    path: '/powerbi',
    url: '/powerbi',
    description: 'Business intelligence and visualization.',
    category: 'Analytics',
    icon: <PieChart className="w-4 h-4" />,
    features: ['Visualization', 'Dashboards', 'Reports'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '4-5 hours',
  },
  {
    id: 'gantt-chart',
    name: 'Gantt Chart',
    path: '/gantt-chart',
    url: '/gantt-chart',
    description: 'Project timeline visualization.',
    category: 'Analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    features: ['Timeline', 'Milestones', 'Dependencies'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
  },
  // Productivity Tools
  {
    id: 'typing',
    name: 'Typing Practice',
    path: '/typing',
    url: '/typing',
    description: 'Improve typing speed and accuracy.',
    category: 'Skills',
    icon: <Keyboard className="w-4 h-4" />,
    features: ['Speed', 'Accuracy', 'WPM'],
    status: 'available',
    difficulty: 'Beginner',
    duration: '1-2 hours',
  },
  {
    id: 'zap',
    name: 'Zap',
    path: '/zap',
    url: '/zap',
    description: 'Connect apps and automate workflows.',
    category: 'Productivity',
    icon: <Zap className="w-4 h-4" />,
    features: ['Integrations', 'Workflows', 'Automation'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
  },
  {
    id: 'roadmap',
    name: 'Roadmap',
    path: '/roadmap',
    url: '/roadmap',
    description: 'Strategic planning and tracking.',
    category: 'Planning',
    icon: <Target className="w-4 h-4" />,
    features: ['Planning', 'Milestones', 'Timeline'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
  },
  {
    id: 'nexus',
    name: 'Nexus',
    path: '/nexus',
    url: '/nexus',
    description: 'Centralized business app hub.',
    category: 'Productivity',
    icon: <Workflow className="w-4 h-4" />,
    features: ['Integration', 'Management', 'Sync'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '3-4 hours',
  },
  // Industry Tools
  {
    id: 'hospital-management',
    name: 'Hospital Management',
    path: '/hospital-management',
    url: '/hospital-management',
    description: 'Healthcare facility management.',
    category: 'Healthcare',
    icon: <Stethoscope className="w-4 h-4" />,
    features: ['Patients', 'Appointments', 'Records'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '5-6 hours',
  },
  {
    id: 'pharmacy-management',
    name: 'Pharmacy Management',
    path: '/pharmacy-management',
    url: '/pharmacy-management',
    description: 'Pharmacy operations and inventory.',
    category: 'Healthcare',
    icon: <Pill className="w-4 h-4" />,
    features: ['Medicines', 'Inventory', 'Prescriptions'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
  },
  {
    id: 'fleet-management',
    name: 'Fleet Management',
    path: '/fleet-management',
    url: '/fleet-management',
    description: 'Vehicle fleet tracking and management.',
    category: 'Logistics',
    icon: <Car className="w-4 h-4" />,
    features: ['Tracking', 'Maintenance', 'Drivers'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '4-5 hours',
  },
  {
    id: 'procurement-management',
    name: 'Procurement Management',
    path: '/procurement-management',
    url: '/procurement-management',
    description: 'Procurement and purchasing management.',
    category: 'Operations',
    icon: <Package className="w-4 h-4" />,
    features: ['Purchasing', 'Vendors', 'Approvals'],
    status: 'available',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
  },
  {
    id: 'custom-erp',
    name: 'Custom ERP',
    path: '/custom-erp',
    url: '/custom-erp',
    description: 'Custom enterprise resource planning.',
    category: 'Operations',
    icon: <Building2 className="w-4 h-4" />,
    features: ['Customization', 'Integration', 'Scalability'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '6-8 hours',
  },
  {
    id: 'airline-management',
    name: 'Airline Management',
    path: '/airline-management',
    url: '/airline-management',
    description: 'Airline operations and management.',
    category: 'Aviation',
    icon: <Plane className="w-4 h-4" />,
    features: ['Flights', 'Bookings', 'Crew'],
    status: 'available',
    difficulty: 'Advanced',
    duration: '6-8 hours',
  },
]

const categories = [
  { id: 'all', name: 'All Tools' },
  { id: 'HR', name: 'HR' },
  { id: 'Finance', name: 'Finance' },
  { id: 'Operations', name: 'Operations' },
  { id: 'Sales', name: 'Sales' },
  { id: 'Marketing', name: 'Marketing' },
  { id: 'Data', name: 'Data' },
  { id: 'Analytics', name: 'Analytics' },
  { id: 'Skills', name: 'Skills' },
  { id: 'Productivity', name: 'Productivity' },
  { id: 'Planning', name: 'Planning' },
  { id: 'Healthcare', name: 'Healthcare' },
  { id: 'Logistics', name: 'Logistics' },
  { id: 'Aviation', name: 'Aviation' },
]

export default function PracticeLabPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  // Filter tools
  const filteredTools = tools.filter(tool => {
    const matchesSearch =
      searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'Intermediate': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-950 dark:via-sky-950/20 dark:to-blue-950/20 flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-blue-500/5 to-cyan-500/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>

          <div className="container mx-auto px-4 py-8 sm:py-10 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-3 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 px-5 py-1.5 rounded-full text-sm">
                  <Zap className="w-3 h-3 mr-1.5" />
                  Practice Lab
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-slate-800 dark:text-white">
                  Master{' '}
                  <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    36 Real-World Tools
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                  Access professional-grade software tools and practice scenarios to build hands-on experience across multiple departments.
                </p>
              </motion.div>

              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 text-sm border-sky-200/50 focus:border-sky-400 bg-white/60 backdrop-blur-md shadow-sm"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px] h-10 bg-white/60 backdrop-blur-md border-sky-200/50 focus:border-sky-400">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">{tools.length}</strong> Tools
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-1 rounded-full">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">{categories.length}</strong> Categories
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-sky-500 to-blue-500 p-1 rounded-full">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">24/7</strong> Access
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Category Filter Pills - Compact */}
        <section className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              {categories.length > 8 && (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-7 w-[100px] bg-slate-100 dark:bg-slate-800 border-0 text-xs">
                    <SelectValue placeholder="More" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(8).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </section>

        {/* Tools Grid - Smaller Cards */}
        <section className="container mx-auto px-4 py-6">
          {searchQuery && filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">No tools found</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Try adjusting your search terms or browse all categories.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
            >
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ y: -3 }}
                  className="group"
                >
                  <Card className="border border-sky-200/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-lg hover:border-sky-300 transition-all duration-300 h-full overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500" />
                    <CardHeader className="pb-2 pt-3 px-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {tool.icon}
                        </div>
                        {tool.status === 'coming-soon' && (
                          <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600 h-5 px-1.5">Soon</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xs font-semibold text-slate-800 dark:text-white line-clamp-1 leading-tight">
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3 px-3">
                      <CardDescription className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 mb-2 leading-tight">
                        {tool.description}
                      </CardDescription>

                      {/* Features - Compact */}
                      <div className="flex flex-wrap gap-0.5 mb-2">
                        {tool.features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[8px] px-1 py-0 bg-sky-50/50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200/50 leading-tight">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Difficulty & Duration */}
                      <div className="flex items-center justify-between mb-2">
                        {tool.difficulty && (
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${getDifficultyColor(tool.difficulty)}`}>
                            {tool.difficulty}
                          </span>
                        )}
                        {tool.duration && (
                          <span className="text-[8px] text-slate-500 dark:text-slate-500 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {tool.duration}
                          </span>
                        )}
                      </div>

                      {/* Action Button - Compact */}
                      {tool.status === 'available' ? (
                        <Button
                          size="sm"
                          className="w-full h-7 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white text-xs shadow-md shadow-sky-200/50 hover:shadow-lg hover:shadow-sky-300/50 transition-all duration-300"
                          onClick={() => router.push(tool.path)}
                        >
                          Launch
                          <ChevronRight className="ml-1 w-3 h-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full h-7 text-xs" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Info Section */}
        <section className="bg-gradient-to-br from-sky-50/50 via-white/50 to-blue-50/50 dark:from-slate-900/30 dark:via-sky-950/20 dark:to-blue-950/20 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-white/60 to-sky-50/60 dark:from-gray-900/60 dark:to-sky-900/30 backdrop-blur-md border border-sky-200/50 dark:border-sky-800/50">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-sky-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-200/50">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-800 dark:text-white">Start Practicing Today</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
                    These tools provide hands-on experience with real-world software. Practice at your own pace and build skills that employers value.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-0.5 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span>No installation required</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-0.5 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span>Real software environment</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-0.5 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span>Learn by doing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
