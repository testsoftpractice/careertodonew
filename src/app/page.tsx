'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Calculator,
  TrendingUp,
  Briefcase,
  Headphones,
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Package,
  Truck,
  Factory,
  ShieldCheck,
  CheckCircle2,
  Target,
  BarChart3,
  Award,
  Shield,
  Star,
  Building2,
  GraduationCap,
  ChartLine,
  Flame,
  Rocket,
  Zap,
  FileText,
  ChartColumn,
  DollarSign,
  Building,
  Globe,
  Warehouse,
  Settings,
  Layers,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'
import { useState, useEffect, useRef } from 'react'

// Job cards data - Corporate focused roles
const jobCards = [
  {
    icon: Package,
    title: 'Procurement Specialist',
    department: 'Procurement',
    skills: ['Supplier Management', 'Cost Negotiation', 'Contract Review'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Truck,
    title: 'Supply Chain Manager',
    department: 'Supply Chain',
    skills: ['Logistics Planning', 'Inventory Control', 'Vendor Relations'],
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Factory,
    title: 'Operations Manager',
    department: 'Manufacturing',
    skills: ['Production Planning', 'Quality Control', 'Process Optimization'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'HR Manager',
    department: 'Human Resources',
    skills: ['Recruitment', 'Performance Management', 'Employee Relations'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calculator,
    title: 'Financial Analyst',
    department: 'Finance & Accounting',
    skills: ['Budget Planning', 'Financial Analysis', 'Risk Assessment'],
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Sales Executive',
    department: 'Sales & Marketing',
    skills: ['Lead Generation', 'Client Meetings', 'Sales Targets'],
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Briefcase,
    title: 'Project Manager',
    department: 'Operations',
    skills: ['Project Planning', 'Team Coordination', 'Deadline Management'],
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    department: 'Customer Service',
    skills: ['Customer Queries', 'Problem Solving', 'Service Quality'],
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: DollarSign,
    title: 'Business Analyst',
    department: 'Business Development',
    skills: ['Market Research', 'Business Modeling', 'Stakeholder Management'],
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: Building,
    title: 'Corporate Manager',
    department: 'Corporate Administration',
    skills: ['Strategic Planning', 'Policy Implementation', 'Team Leadership'],
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'International Trade Specialist',
    department: 'International Business',
    skills: ['Import/Export', 'Compliance', 'Cross-border Operations'],
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Warehouse,
    title: 'Warehouse Manager',
    department: 'Logistics',
    skills: ['Inventory Management', 'Stock Control', 'Team Supervision'],
    gradient: 'from-slate-500 to-gray-600',
  },
]

// Animated background dots
const backgroundDots = [
  { left: '28.194%', top: '33.7628%' },
  { left: '38.3851%', top: '56.6552%' },
  { left: '40.2894%', top: '52.3404%' },
  { left: '16.9146%', top: '24.3309%' },
  { left: '5.50247%', top: '55.7567%' },
  { left: '98.47%', top: '87.5676%' },
  { left: '15.7675%', top: '12.0089%' },
  { left: '91.1476%', top: '50.6483%' },
  { left: '98.3102%', top: '5.46519%' },
  { left: '76.2986%', top: '72.3563%' },
  { left: '40.6412%', top: '4.75989%' },
  { left: '42.7417%', top: '70.3738%' },
  { left: '45.1222%', top: '93.5389%' },
  { left: '88.4659%', top: '78.4211%' },
  { left: '70.0399%', top: '44.0857%' },
  { left: '60.7769%', top: '94.0317%' },
  { left: '59.0192%', top: '29.3125%' },
  { left: '8.2963%', top: '51.7464%' },
  { left: '53.0128%', top: '25.2921%' },
  { left: '93.9046%', top: '16.9862%' },
]

// Company logos for Tools You'll Master section
const companyLogos = [
  'ERP', 'CRM', 'Project Management', 'Ecommerce', 'Supplychain',
  'SAP', 'Oracle', 'Salesforce', 'Workday', 'Microsoft Dynamics',
  'Jira', 'Asana', 'Monday', 'Trello', 'Slack',
  'Teams', 'Zoom', 'Google Workspace', 'Tableau', 'Power BI',
  'Excel', 'QuickBooks', 'Xero', 'NetSuite', 'Zoho',
  'HubSpot', 'Mailchimp', 'Hootsuite', 'Canva', 'Figma',
]

// Auto-scrolling logo row component
interface ToolsScrollRowProps {
  logos: string[]
  direction: 'left' | 'right'
  speed: number
}

function ToolsScrollRow({ logos, direction, speed }: ToolsScrollRowProps) {
  const duplicatedLogos = [...logos, ...logos, ...logos]
  
  // Color mapping for different tools
  const getColorClass = (logo: string) => {
    const lower = logo.toLowerCase()
    if (lower.includes('erp')) return 'text-red-700'
    if (lower.includes('crm')) return 'text-gray-800'
    if (lower.includes('project')) return 'text-blue-600'
    if (lower.includes('ecommerce') || lower.includes('shopify') || lower.includes('woocommerce')) return 'text-sky-500'
    if (lower.includes('supply') || lower.includes('chain')) return 'text-orange-500'
    if (lower.includes('sequoia') || lower.includes('capital')) return 'text-green-700'
    if (lower.includes('sap')) return 'text-blue-700'
    if (lower.includes('oracle')) return 'text-red-600'
    if (lower.includes('salesforce')) return 'text-sky-600'
    if (lower.includes('microsoft')) return 'text-blue-500'
    if (lower.includes('aws')) return 'text-orange-600'
    if (lower.includes('azure')) return 'text-blue-800'
    if (lower.includes('google')) return 'text-red-500'
    if (lower.includes('stripe')) return 'text-indigo-600'
    if (lower.includes('paypal')) return 'text-blue-600'
    return 'text-gray-800'
  }

  return (
    <div className="relative overflow-hidden py-3">
      <div
        className={`flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300 ${
          direction === 'left'
            ? 'animate-scroll-left'
            : 'animate-scroll-right'
        }`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo}-${index}`}
            className={`font-bold text-lg cursor-pointer hover:opacity-100 transition-all ${getColorClass(logo)}`}
          >
            {logo}
          </div>
        ))}
      </div>
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent pointer-events-none" />
    </div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const scrollLeftRef = useRef<HTMLDivElement>(null)
  const scrollRightRef = useRef<HTMLDivElement>(null)
  const [scrollLeftY, setScrollLeftY] = useState(0)
  const [scrollRightY, setScrollRightY] = useState(0)

  // Auto-scroll animation - left column scrolls up, right column scrolls down
  useEffect(() => {
    const interval = setInterval(() => {
      const cardHeight = 189
      const totalHeight = jobCards.length * cardHeight
      setScrollLeftY((prev) => (prev + cardHeight) % totalHeight)
      setScrollRightY((prev) => (prev - cardHeight + totalHeight) % totalHeight)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getDashboardLink = () => {
    if (!user) return '/auth'
    const roleDashboards: Record<string, string> = {
      'STUDENT': '/dashboard/student',
      'UNIVERSITY_ADMIN': '/dashboard/university',
      'EMPLOYER': '/dashboard/employer',
      'INVESTOR': '/dashboard/investor',
      'PLATFORM_ADMIN': '/admin',
    }
    return roleDashboards[user.role] || '/auth'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-950 dark:via-sky-950/20 dark:to-blue-950/20 flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
          {/* Animated background dots */}
          <div className="absolute inset-0">
            {backgroundDots.map((dot, index) => (
              <div
                key={index}
                className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-sky-300/30 rounded-full"
                style={{ left: dot.left, top: dot.top }}
              />
            ))}
          </div>

          {/* Radial gradient overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(125,211,252,0.08),transparent_70%)]" />

          <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 mt-8 sm:mt-10 md:mt-12">
            <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center min-h-[600px]">
              {/* Left Content */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-sky-100 to-blue-100 border border-sky-200 mb-2 sm:mb-3 md:mb-4"
                >
                  <Sparkles className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 text-sky-600" />
                  <span className="text-sm sm:text-xs md:text-sm font-semibold text-sky-700">
                    Job Simulation Platform
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-800 leading-tight mb-2 sm:mb-3 md:mb-4"
                >
                  <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 bg-clip-text text-transparent">
                    Learn by Doing, Not by Watching
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base sm:text-base md:text-lg lg:text-xl text-slate-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed"
                >
                  No classrooms. No lectures. Just real work practice. Build HR, finance, product, and sales skills in a safe environment.
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-3 sm:mb-4 md:mb-6"
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-sky-600">11%</div>
                    <div className="text-base text-slate-600">Graduate Unemployment</div>
                  </div>
                  <div className="h-3 sm:h-4 md:h-6 lg:h-8 w-px bg-sky-200"></div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-blue-600">2M+</div>
                    <div className="text-base text-slate-600">Tech Jobs by 2030</div>
                  </div>
                  <div className="h-3 sm:h-4 md:h-6 lg:h-8 w-px bg-sky-200 hidden sm:block"></div>
                  <div className="text-center hidden sm:block">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-sky-700">$850M</div>
                    <div className="text-xs text-slate-600">World Bank Support</div>
                  </div>
                </motion.div>

                {/* Mobile stat */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="flex justify-center lg:hidden mb-3 sm:mb-4"
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-black text-sky-700">$850M</div>
                    <div className="text-xs text-slate-600">World Bank Support</div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start mt-6"
                >
                  <Button
                    className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-sm sm:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 transition-all duration-300 w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/signup">
                      Start Simulating <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Right - Job Cards Carousel (Desktop) */}
              <div className="relative lg:h-[600px] hidden lg:block order-1 lg:order-2">
                <div className="relative w-full h-full">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full max-w-4xl mx-auto flex gap-5 lg:gap-6 justify-center">
                      {/* Left Column - Scrolls Up */}
                      <div className="relative w-[480px] h-[550px] overflow-hidden">
                        <div
                          ref={scrollLeftRef}
                          className="absolute inset-x-0 transition-transform duration-[3000ms] ease-in-out"
                          style={{
                            transform: `translateY(-${scrollLeftY}px)`,
                          }}
                        >
                          {[...jobCards, ...jobCards].map((job, index) => {
                            const CardIcon = job.icon
                            return (
                              <div
                                key={`left-${index}`}
                                className="absolute px-2 py-2"
                                style={{ top: `${index * 189}px`, left: 0, right: 0 }}
                              >
                                <div className="flex flex-col items-start gap-2 bg-white rounded-2xl shadow-lg p-4 border border-slate-200 hover:shadow-xl hover:border-sky-300 transition-all duration-300 w-[260px] mx-auto">
                                  <div className="flex items-center gap-2 w-full">
                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${job.gradient} flex items-center justify-center shadow-sm`}>
                                      <CardIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-slate-900 text-sm">{job.title}</h4>
                                      <p className="text-xs text-slate-600">{job.department}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {job.skills.map((skill) => (
                                      <span
                                        key={skill}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-xs text-sky-800 font-medium border border-sky-200"
                                      >
                                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      {/* Right Column - Scrolls Down */}
                      <div className="relative w-[480px] h-[550px] overflow-hidden">
                        <div
                          ref={scrollRightRef}
                          className="absolute inset-x-0 transition-transform duration-[3000ms] ease-in-out"
                          style={{
                            transform: `translateY(-${scrollRightY}px)`,
                          }}
                        >
                          {[...jobCards, ...jobCards].map((job, index) => {
                            const CardIcon = job.icon
                            return (
                              <div
                                key={`right-${index}`}
                                className="absolute px-2 py-2"
                                style={{ top: `${index * 189}px`, left: 0, right: 0 }}
                              >
                                <div className="flex flex-col items-start gap-2 bg-white rounded-2xl shadow-lg p-4 border border-slate-200 hover:shadow-xl hover:border-sky-300 transition-all duration-300 w-[260px] mx-auto">
                                  <div className="flex items-center gap-2 w-full">
                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${job.gradient} flex items-center justify-center shadow-sm`}>
                                      <CardIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-slate-900 text-sm">{job.title}</h4>
                                      <p className="text-xs text-slate-600">{job.department}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {job.skills.map((skill) => (
                                      <span
                                        key={skill}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-xs text-sky-800 font-medium border border-sky-200"
                                      >
                                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Cards Carousel (Mobile) - Two columns, opposite directions */}
              <div className="lg:hidden -mt-12 order-1">
                <div className="relative w-full h-[500px]">
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-sky-50 via-sky-50/80 to-transparent z-10 pointer-events-none"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full max-w-lg mx-auto flex gap-3 justify-center">
                      {/* Mobile Left Column - Scrolls Up */}
                      <div className="relative w-[140px] h-[480px] overflow-hidden">
                        <div
                          ref={scrollLeftRef}
                          className="absolute inset-x-0 transition-transform duration-[3000ms] ease-in-out"
                          style={{
                            transform: `translateY(-${scrollLeftY}px)`,
                          }}
                        >
                          {[...jobCards, ...jobCards].map((job, index) => {
                            const CardIcon = job.icon
                            return (
                              <div
                                key={`mobile-left-${index}`}
                                className="absolute px-1 py-1"
                                style={{ top: `${index * 189}px`, left: 0, right: 0 }}
                              >
                                <div className="flex flex-col items-start gap-1 bg-white rounded-xl shadow-md p-3 border border-slate-200 hover:shadow-lg hover:border-sky-300 transition-all duration-300 w-[120px]">
                                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${job.gradient} flex items-center justify-center shadow-sm mb-1`}>
                                    <CardIcon className="w-3 h-3 text-white" />
                                  </div>
                                  <h4 className="font-semibold text-slate-900 text-xs leading-tight">{job.title}</h4>
                                  <p className="text-[10px] text-slate-600">{job.department}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      {/* Mobile Right Column - Scrolls Down */}
                      <div className="relative w-[140px] h-[480px] overflow-hidden">
                        <div
                          ref={scrollRightRef}
                          className="absolute inset-x-0 transition-transform duration-[3000ms] ease-in-out"
                          style={{
                            transform: `translateY(-${scrollRightY}px)`,
                          }}
                        >
                          {[...jobCards, ...jobCards].map((job, index) => {
                            const CardIcon = job.icon
                            return (
                              <div
                                key={`mobile-right-${index}`}
                                className="absolute px-1 py-1"
                                style={{ top: `${index * 189}px`, left: 0, right: 0 }}
                              >
                                <div className="flex flex-col items-start gap-1 bg-white rounded-xl shadow-md p-3 border border-slate-200 hover:shadow-lg hover:border-sky-300 transition-all duration-300 w-[120px]">
                                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${job.gradient} flex items-center justify-center shadow-sm mb-1`}>
                                    <CardIcon className="w-3 h-3 text-white" />
                                  </div>
                                  <h4 className="font-semibold text-slate-900 text-xs leading-tight">{job.title}</h4>
                                  <p className="text-[10px] text-slate-600">{job.department}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools You'll Master Section */}
        <section className="border-t border-slate-200 pt-12 pb-12 bg-white/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 uppercase tracking-wider">
              Tools You'll Master
            </p>
            {/* Auto-scrolling logo rows */}
            <div className="space-y-6 overflow-hidden">
              {[0, 1, 2].map((rowIndex) => (
                <ToolsScrollRow
                  key={rowIndex}
                  logos={companyLogos.slice(rowIndex * 10, (rowIndex + 1) * 10)}
                  direction={rowIndex % 2 === 0 ? 'left' : 'right'}
                  speed={30}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 dark:from-slate-950 dark:via-sky-950/30 dark:to-blue-950/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content - Steps */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 px-6 py-2 rounded-full">
                    How It Works
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Simple Steps to{' '}
                    <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                      Success
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                    Getting started is easy. Create your account and start building your professional journey.
                  </p>
                </motion.div>

                {/* Steps List */}
                <div className="space-y-6">
                  {[
                    {
                      step: '1',
                      title: 'Create Your Account',
                      desc: 'Sign up as a student, university, employer, or investor.',
                      icon: Sparkles,
                      gradient: 'from-sky-500 to-blue-600',
                    },
                    {
                      step: '2',
                      title: 'Discover Opportunities',
                      desc: 'Browse projects, jobs, or investment opportunities.',
                      icon: Target,
                      gradient: 'from-blue-500 to-cyan-600',
                    },
                    {
                      step: '3',
                      title: 'Execute & Verify',
                      desc: 'Complete tasks and earn verified credentials.',
                      icon: CheckCircle2,
                      gradient: 'from-cyan-500 to-teal-600',
                    },
                    {
                      step: '4',
                      title: 'Grow Your Career',
                      desc: 'Track progress and unlock new opportunities.',
                      icon: TrendingUp,
                      gradient: 'from-teal-500 to-cyan-600',
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center font-bold text-lg shadow-lg`}>
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Content - Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500 p-1">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=700&fit=crop"
                      alt="Career Growth Journey"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-sky-200 dark:bg-sky-800 rounded-full blur-2xl opacity-50" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-2xl opacity-50" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 px-6 py-2 rounded-full">
                Key Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything You Need for{' '}
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Career Success
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                A comprehensive platform that connects all stakeholders in the career development ecosystem.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {[
                {
                  icon: GraduationCap,
                  title: 'For Students',
                  desc: 'Build your professional portfolio with real projects, earn verifiable credentials, and showcase your skills to employers.',
                  link: '/solutions#students',
                  gradient: 'from-sky-500 to-blue-600',
                  bgGradient: 'from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30',
                },
                {
                  icon: Building2,
                  title: 'For Universities',
                  desc: 'Track student progress, manage projects, and connect students with industry opportunities.',
                  link: '/solutions#universities',
                  gradient: 'from-blue-500 to-cyan-600',
                  bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
                },
                {
                  icon: Briefcase,
                  title: 'For Employers',
                  desc: 'Find verified talent with proven skills, access detailed candidate portfolios, and make data-driven hiring decisions.',
                  link: '/solutions#employers',
                  gradient: 'from-pink-500 to-rose-600',
                  bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
                },
                {
                  icon: ChartLine,
                  title: 'For Investors',
                  desc: 'Discover and invest in promising student-led projects with transparent progress tracking and ROI metrics.',
                  link: '/solutions#investors',
                  gradient: 'from-orange-500 to-amber-600',
                  bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
                },
                {
                  icon: Shield,
                  title: 'Immutable Records',
                  desc: 'Every achievement is cryptographically verified and permanently recorded, creating tamper-proof credentials.',
                  link: '/features',
                  gradient: 'from-emerald-500 to-teal-600',
                  bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
                },
                {
                  icon: BarChart3,
                  title: 'Real-Time Analytics',
                  desc: 'Track progress, growth, and performance with comprehensive dashboards and actionable insights.',
                  link: '/features',
                  gradient: 'from-violet-500 to-purple-600',
                  bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group"
                >
                  <Card className={`border-2 hover:shadow-2xl transition-all duration-300 h-full overflow-hidden bg-gradient-to-br ${feature.bgGradient}`}>
                    <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
                    <CardContent className="p-8">
                      <div className={`bg-gradient-to-br ${feature.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-2xl mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{feature.desc}</p>
                      <Link
                        href={feature.link}
                        className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent font-semibold hover:underline flex items-center gap-2 text-lg`}
                      >
                        Learn More <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 dark:from-sky-900 dark:via-blue-900 dark:to-cyan-900" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

          {/* Animated shapes */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <Rocket className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Get Started Today</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students, universities, employers, and investors who are already building
                the future of career development.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  className="bg-white text-sky-600 hover:bg-white/90 px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  asChild
                >
                  <Link href={getDashboardLink()}>
                    {user ? 'Go to Dashboard' : 'Start Free'} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-semibold text-lg hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
                  asChild
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 px-6 py-2 rounded-full">
                Platform Benefits
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  CareerToDo?
                </span>
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              {[
                {
                  icon: Award,
                  title: 'Verified Credentials',
                  desc: 'Every achievement is cryptographically verified and permanently recorded, creating a tamper-proof ledger of your professional accomplishments.',
                  gradient: 'from-sky-500 to-indigo-600',
                  bgGradient: 'from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30',
                },
                {
                  icon: Shield,
                  title: 'Privacy First',
                  desc: 'Your data is encrypted and secure. You control what information you share with employers and institutions.',
                  gradient: 'from-emerald-500 to-teal-600',
                  bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
                },
                {
                  icon: Star,
                  title: 'Reputation System',
                  desc: 'Build a comprehensive reputation based on execution, collaboration, leadership, ethics, and reliability.',
                  gradient: 'from-teal-500 to-cyan-600',
                  bgGradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30',
                },
                {
                  icon: Target,
                  title: 'Goal-Oriented',
                  desc: 'Set clear goals, track progress, and achieve milestones with personalized recommendations and insights.',
                  gradient: 'from-pink-500 to-rose-600',
                  bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className={`border-2 hover:shadow-2xl transition-all duration-300 h-full overflow-hidden bg-gradient-to-br ${benefit.bgGradient}`}>
                    <CardContent className="p-8">
                      <div className={`bg-gradient-to-br ${benefit.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                        <benefit.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-2xl mb-4 text-gray-900 dark:text-white">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-card via-background to-card relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 px-6 py-2 rounded-full">
                Pricing
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                Simple,{' '}
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Transparent Pricing
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Choose the plan that fits your career goals
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="group relative">
                <div className="absolute -top-5 left-0 right-0 flex justify-center z-10">
                  <div className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold animate-pulse">
                    🎉 Limited Time Early Access Offer
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
                <div className="relative bg-card/80 backdrop-blur-xl border-2 border-purple-500 rounded-3xl p-8 md:p-12">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 mx-auto">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black mb-4">Early Access Special</h3>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                      Limited time offer - Get 6 months of full access at our special launch price!
                    </p>
                    <div className="mb-8">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <span className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                          ৳2,999
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-xl text-muted-foreground line-through">৳12,000</span>
                        <span className="text-lg text-muted-foreground">6 months</span>
                      </div>
                      <div className="mt-3 inline-flex items-center px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                        Save 75%
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {[
                      'Access to all 20+ professional simulations',
                      'ERP, CRM, HRMS, Accounting & more tools',
                      'Progress tracking dashboard',
                      'Community forum access',
                      'Priority email support',
                      'Certificate of completion',
                      'Job placement assistance',
                      'Mobile app access',
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-500/90 hover:to-pink-500/90 text-white text-lg py-6 rounded-xl"
                    asChild
                  >
                    <Link href="/signup">Get Started Now</Link>
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-center mt-12 text-muted-foreground">
              Early Access Limited time offer
            </p>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  )
}
