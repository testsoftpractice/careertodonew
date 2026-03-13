'use client'

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Building2,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  Users,
  ChartBar,
  Award,
  Globe,
  Rocket,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const scaleOnHover = {
  scale: 1.03,
  transition: { duration: 0.3 },
}

export default function Solutions() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('students')

  const tabs = [
    { id: 'students', name: 'Students', icon: GraduationCap },
    { id: 'universities', name: 'Universities', icon: Building2 },
    { id: 'employers', name: 'Employers', icon: Briefcase },
    { id: 'investors', name: 'Investors', icon: TrendingUp },
  ]

  const solutions = {
    students: [
      {
        icon: Rocket,
        title: 'Real Roles & Responsibilities',
        description: 'Take on actual positions in student-run organizations—HR, Marketing, Finance, CEO, and more.',
        benefits: [
          'Real-world experience from day one',
          'Leadership opportunities',
          'Portfolio building',
          'Skill development',
        ],
      },
      {
        icon: Award,
        title: 'Verified Career Track Record',
        description: 'Every achievement, role, and contribution is permanently recorded on an immutable ledger.',
        benefits: [
          'Employer-verified credentials',
          'Blockchain-secured records',
          'Multi-dimensional reputation scores',
          'Transparent work history',
        ],
      },
      {
        icon: Users,
        title: 'Network & Mentorship',
        description: 'Connect with peers, alumni, and industry mentors to accelerate your career growth.',
        benefits: [
          'Peer collaboration',
          'Expert mentorship',
          'Industry connections',
          'Professional community',
        ],
      },
      {
        icon: Target,
        title: 'Job Opportunities',
        description: 'Access exclusive job opportunities and internships from partner companies.',
        benefits: [
          'Early career access',
          'Direct employer connections',
          'Internship programs',
          'Placement assistance',
        ],
      },
    ],
    universities: [
      {
        icon: ChartBar,
        title: 'Student Analytics Dashboard',
        description: 'Track individual student performance, engagement, and outcomes with detailed metrics.',
        benefits: [
          'Real-time performance tracking',
          'Engagement analytics',
          'Outcome measurement',
          'Comparative insights',
        ],
      },
      {
        icon: Globe,
        title: 'University Rankings & Reputation',
        description: 'Showcase your institution\'s success through data-driven public leaderboards.',
        benefits: [
          'Global visibility',
          'Data-backed rankings',
          'Employment metrics',
          'Impact demonstration',
        ],
      },
      {
        icon: Users,
        title: 'Student Management',
        description: 'Efficiently manage student verification, projects, and platform access.',
        benefits: [
          'Bulk verification',
          'Role-based permissions',
          'Activity monitoring',
          'Compliance tracking',
        ],
      },
      {
        icon: Zap,
        title: 'Partnership Opportunities',
        description: 'Connect with employers and investors for internship and funding opportunities.',
        benefits: [
          'Industry partnerships',
          'Student startup funding',
          'Research collaborations',
          'Talent pipeline',
        ],
      },
    ],
    employers: [
      {
        icon: Target,
        title: 'Verified Talent Discovery',
        description: 'Find candidates with proven track records and cryptographically verified achievements.',
        benefits: [
          'Verified work history',
          'Skills assessment data',
          'Performance metrics',
          'Cultural fit insights',
        ],
      },
      {
        icon: Users,
        title: 'Direct Talent Engagement',
        description: 'Connect with students through projects, mentorships, and recruitment events.',
        benefits: [
          'Early talent access',
          'Long-term relationship building',
          'Brand visibility',
          'Reduced hiring costs',
        ],
      },
      {
        icon: ChartBar,
        title: 'Analytics & Insights',
        description: 'Access comprehensive analytics on talent pipeline, diversity, and hiring success.',
        benefits: [
          'Recruitment metrics',
          'Diversity tracking',
          'ROI analytics',
          'Predictive insights',
        ],
      },
      {
        icon: Globe,
        title: 'Global Talent Access',
        description: 'Connect with students and graduates from universities worldwide through one platform.',
        benefits: [
          'Multi-institution access',
          'Global reach',
          'Standardized evaluation',
          'Cross-border hiring',
        ],
      },
    ],
    investors: [
      {
        icon: Rocket,
        title: 'Student Startup Investment',
        description: 'Discover and invest in promising student-run ventures with verified traction.',
        benefits: [
          'Early-stage opportunities',
          'Performance tracking',
          'Due diligence tools',
          'Portfolio management',
        ],
      },
      {
        icon: ChartBar,
        title: 'Real-Time Performance Data',
        description: 'Access live performance metrics, growth indicators, and financial projections.',
        benefits: [
          'Live dashboards',
          'KPI monitoring',
          'Trend analysis',
          'Risk assessment',
        ],
      },
      {
        icon: Award,
        title: 'Success Stories & Case Studies',
        description: 'Learn from successful investments and see how student ventures scale and succeed.',
        benefits: [
          'Proven strategies',
          'Best practices',
          'Success metrics',
          'Industry benchmarks',
        ],
      },
      {
        icon: Globe,
        title: 'Global Investment Network',
        description: 'Connect with co-investors, mentors, and industry experts worldwide.',
        benefits: [
          'Co-investment opportunities',
          'Mentor access',
          'Industry insights',
          'Deal flow',
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      <PublicHeader title="Solutions" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-sky-950/20 dark:to-cyan-950/20">
          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge className="mb-6 inline-flex items-center gap-2 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4" />
                Solutions for Everyone
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Tailored Solutions for{' '}
                <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Every Stakeholder</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                From students building careers to universities tracking outcomes, from employers finding talent
                to investors discovering opportunities—we have solutions designed for you.
              </p>
              <Button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 transition-all duration-300" asChild>
                <Link href="/auth">
                  Find Your Solution <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="border-b bg-white/60 dark:bg-slate-950/60 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4 py-4 overflow-x-auto">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-lg border transition-all whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-transparent shadow-lg shadow-sky-200/50'
                      : 'bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200/50 hover:border-sky-300 hover:bg-white/80 dark:hover:bg-slate-900/80'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 dark:from-slate-950 dark:via-sky-950/30 dark:to-blue-950/30">
          <div className="container mx-auto px-4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
            >
              {solutions[activeTab as keyof typeof solutions].map((solution, index) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group"
                >
                  <Card className="border border-slate-200/50 hover:shadow-xl hover:border-sky-300 transition-all duration-300 h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md group-hover:bg-white/80 dark:group-hover:bg-slate-900/80 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-sky-500 to-blue-500" />
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                          <solution.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                          {solution.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                        {solution.description}
                      </p>
                      <div className="space-y-3">
                        <p className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">Key Benefits:</p>
                        <ul className="space-y-2">
                          {solution.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-sky-950/20 dark:to-cyan-950/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 px-6 py-2 rounded-full">Proven Results</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Real Impact, Real Success
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                See the numbers behind our success across all stakeholder groups.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {[
                { value: '15K+', label: 'Active Students', icon: Users },
                { value: '450+', label: 'Partner Universities', icon: Building2 },
                { value: '8K+', label: 'Employers Connected', icon: Briefcase },
                { value: '92%', label: 'Placement Success', icon: Target },
                { value: '12K+', label: 'Projects Completed', icon: Rocket },
                { value: '3.2M', label: 'Hours of Work', icon: Zap },
                { value: '500+', label: 'Startups Funded', icon: TrendingUp },
                { value: '4.8★', label: 'Average Rating', icon: Award },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <Card className="border border-slate-200/50 hover:shadow-xl hover:border-sky-300 transition-all duration-300 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-slate-900/80 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-sky-400 to-blue-500" />
                    <CardContent className="p-8">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md mx-auto mb-4">
                        <metric.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">{metric.value}</div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">{metric.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Help Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 dark:from-slate-950 dark:via-sky-950/30 dark:to-blue-950/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 px-6 py-2 rounded-full">How We Help You Succeed</Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Comprehensive Support Every Step of the Way
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Our platform provides more than just features—we provide a complete ecosystem for success.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    title: 'Onboarding & Setup',
                    icon: Rocket,
                    description: 'Quick setup with guided tutorials and 24/7 support to get you started fast.',
                    gradient: 'from-sky-500 to-blue-600',
                  },
                  {
                    title: 'Best Practices',
                    icon: Award,
                    description: 'Industry-leading practices and templates proven to drive success.',
                    gradient: 'from-blue-500 to-cyan-600',
                  },
                  {
                    title: 'Dedicated Support',
                    icon: Users,
                    description: 'Personal support from experts who understand your specific needs and challenges.',
                    gradient: 'from-cyan-500 to-teal-600',
                  },
                  {
                    title: 'Analytics & Reporting',
                    icon: ChartBar,
                    description: 'Comprehensive dashboards and reports to track progress and ROI.',
                    gradient: 'from-teal-500 to-emerald-600',
                  },
                  {
                    title: 'Integration & API',
                    icon: Globe,
                    description: 'Seamless integration with your existing tools and full API access.',
                    gradient: 'from-emerald-500 to-green-600',
                  },
                  {
                    title: 'Training & Resources',
                    icon: Zap,
                    description: 'Extensive documentation, tutorials, and training resources available.',
                    gradient: 'from-green-500 to-lime-600',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    className="group"
                  >
                    <Card className="border border-slate-200/50 hover:shadow-xl hover:border-sky-300 transition-all duration-300 h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md group-hover:bg-white/80 dark:group-hover:bg-slate-900/80 overflow-hidden">
                      <div className={`h-1.5 bg-gradient-to-r ${item.gradient}`} />
                      <CardContent className="p-8">
                        <div className={`bg-gradient-to-br ${item.gradient} w-12 h-12 rounded-xl flex items-center justify-center shadow-md mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 dark:from-sky-900 dark:via-blue-900 dark:to-cyan-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Join 15,000+ Students</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                Ready to Transform Your Future?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join the platform that's revolutionizing education and career development.
              </p>
              <Button className="bg-white text-sky-600 hover:bg-white/90 text-base px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300" asChild>
                <Link href="/auth">
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
