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
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader title="Solutions" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-primary/5">
          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge variant="outline" className="mb-6 inline-flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Solutions for Everyone
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Tailored Solutions for{' '}
                <span className="text-primary">Every Stakeholder</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                From students building careers to universities tracking outcomes, from employers finding talent
                to investors discovering opportunities—we have solutions designed for you.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/auth">
                  Find Your Solution <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="border-b bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4 py-4 overflow-x-auto">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-lg border-2 transition-all whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-muted hover:border-primary/50'
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
        <section className="py-20">
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
                  whileHover={scaleOnHover}
                >
                  <Card className="border-2 hover:shadow-xl transition-all h-full group">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <solution.icon className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                          {solution.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                        {solution.description}
                      </p>
                      <div className="space-y-3">
                        <p className="font-semibold text-sm mb-2">Key Benefits:</p>
                        <ul className="space-y-2">
                          {solution.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{benefit}</span>
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
        <section className="py-20 bg-primary/[0.03]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">Proven Results</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Real Impact, Real Success
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                  <Card className="border-2 hover:shadow-xl">
                    <CardContent className="p-8">
                      <metric.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                      <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
                      <div className="text-muted-foreground text-sm">{metric.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Help Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">How We Help You Succeed</Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Comprehensive Support Every Step of the Way
                </h2>
                <p className="text-xl text-muted-foreground">
                  Our platform provides more than just features—we provide a complete ecosystem for success.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    title: 'Onboarding & Setup',
                    icon: Rocket,
                    description: 'Quick setup with guided tutorials and 24/7 support to get you started fast.',
                  },
                  {
                    title: 'Best Practices',
                    icon: Award,
                    description: 'Industry-leading practices and templates proven to drive success.',
                  },
                  {
                    title: 'Dedicated Support',
                    icon: Users,
                    description: 'Personal support from experts who understand your specific needs and challenges.',
                  },
                  {
                    title: 'Analytics & Reporting',
                    icon: ChartBar,
                    description: 'Comprehensive dashboards and reports to track progress and ROI.',
                  },
                  {
                    title: 'Integration & API',
                    icon: Globe,
                    description: 'Seamless integration with your existing tools and full API access.',
                  },
                  {
                    title: 'Training & Resources',
                    icon: Zap,
                    description: 'Extensive documentation, tutorials, and training resources available.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={scaleOnHover}
                  >
                    <Card className="border-2 hover:shadow-xl h-full">
                      <CardContent className="p-8">
                        <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t bg-primary/[0.05]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Future?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the platform that's revolutionizing education and career development.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8" asChild>
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
