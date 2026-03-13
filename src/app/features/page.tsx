'use client'

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  GraduationCap,
  Building2,
  Briefcase,
  TrendingUp,
  Shield,
  Users,
  Target,
  Award,
  CheckCircle2,
  Globe,
  ChartBar,
  Lock,
  Database,
  Play,
  ArrowRight,
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

export default function Features() {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState('students')

  const categories = [
    { id: 'students', name: 'Students', icon: GraduationCap },
    { id: 'universities', name: 'Universities', icon: Building2 },
    { id: 'employers', name: 'Employers', icon: Briefcase },
    { id: 'investors', name: 'Investors', icon: TrendingUp },
  ]

  const features = {
    students: [
      {
        icon: Zap,
        title: 'Real-World Experience',
        description: 'Step beyond theory into actual execution. Hold real roles: HR, Marketing, Finance, CEO, and more.',
      },
      {
        icon: Database,
        title: 'Career Portfolio',
        description: 'Build a comprehensive professional portfolio with verified achievements, roles, and projects.',
      },
      {
        icon: Users,
        title: 'Network Building',
        description: 'Connect with peers, mentors, and industry professionals to grow your network.',
      },
      {
        icon: Award,
        title: 'Earn Badges',
        description: 'Receive industry-recognized badges for demonstrating specific skills and competencies.',
      },
    ],
    universities: [
      {
        icon: ChartBar,
        title: 'Student Analytics',
        description: 'Track individual student performance, engagement, and outcomes with detailed dashboards.',
      },
      {
        icon: Globe,
        title: 'University Rankings',
        description: 'Showcase your institution\'s success through data-driven leaderboards and metrics.',
      },
      {
        icon: Shield,
        title: 'Quality Control',
        description: 'Ensure project quality and professional standards through automated governance.',
      },
      {
        icon: Database,
        title: 'Outcome Tracking',
        description: 'Measure real-world outcomes: job placements, project success, and student satisfaction.',
      },
    ],
    employers: [
      {
        icon: Target,
        title: 'Talent Discovery',
        description: 'Find verified candidates with proven track records and measurable achievements.',
      },
      {
        icon: Shield,
        title: 'Verified Credentials',
        description: 'Access cryptographically verified work history and skills for every candidate.',
      },
      {
        icon: Users,
        title: 'Diverse Talent Pool',
        description: 'Access candidates from multiple universities with varied backgrounds and skills.',
      },
      {
        icon: Zap,
        title: 'Direct Engagement',
        description: 'Connect directly with candidates through projects, mentorships, and internships.',
      },
    ],
    investors: [
      {
        icon: TrendingUp,
        title: 'Startup Opportunities',
        description: 'Discover and invest in promising student-run ventures with verified traction.',
      },
      {
        icon: ChartBar,
        title: 'Performance Metrics',
        description: 'Access real-time performance data, growth metrics, and financial projections.',
      },
      {
        icon: Shield,
        title: 'Risk Assessment',
        description: 'AI-powered risk analysis and due diligence tools for informed decisions.',
      },
      {
        icon: Database,
        title: 'Portfolio Management',
        description: 'Track and manage your investment portfolio with comprehensive analytics.',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader title="Features" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge className="mb-6 inline-flex items-center gap-2 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 dark:from-sky-900/30 dark:to-blue-900/30 dark:text-sky-300 dark:border-sky-700">
                <Zap className="w-4 h-4" />
                Platform Features
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Powerful Tools for{' '}
                <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Every Stakeholder</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                Comprehensive features designed to accelerate career growth, institutional success, and meaningful connections.
              </p>
              <Button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg shadow-sky-500/30 transition-all duration-300" asChild>
                <Link href="/auth">
                  Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4 py-4 overflow-x-auto">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-lg border transition-all whitespace-nowrap duration-300
                    ${activeCategory === cat.id
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-600 shadow-lg shadow-sky-500/30'
                      : 'bg-white/60 dark:bg-gray-800/60 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md'
                    }
                  `}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <cat.icon className="w-5 h-5" />
                  <span className="font-medium">{cat.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gradient-to-br from-sky-50/50 via-blue-50/30 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
          <div className="container mx-auto px-4">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
            >
              {features[activeCategory as keyof typeof features].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="border border-slate-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 h-full group">
                    <CardHeader className="p-8 pb-4">
                      <div className="w-12 h-1 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-6"></div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 flex items-center justify-center shadow-lg shadow-sky-500/20">
                          <feature.icon className="w-7 h-7 bg-gradient-to-br from-sky-600 to-blue-600 bg-clip-text text-transparent" />
                        </div>
                        <CardTitle className="text-2xl group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {feature.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-0">
                      <ul className="space-y-3">
                        {[
                          'Real-time updates and notifications',
                          'Cross-platform accessibility',
                          'Mobile-optimized experience',
                          'AI-powered recommendations',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-600 dark:text-slate-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-sky-50/50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 dark:from-sky-900/30 dark:to-blue-900/30 dark:text-sky-300 dark:border-sky-700">Why Choose Us</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Built Different, Built Better
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Every feature is designed with you in mind—students, institutions, employers, and investors.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {[
                { icon: Shield, title: 'Secure & Private', desc: 'Enterprise-grade security with end-to-end encryption for all your data.' },
                { icon: Zap, title: 'Lightning Fast', desc: 'Optimized performance ensuring quick load times and seamless interactions.' },
                { icon: Globe, title: 'Always Available', desc: 'Cloud-based platform accessible from anywhere, anytime.' },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="border border-slate-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 h-full">
                    <CardContent className="p-8 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 flex items-center justify-center shadow-lg shadow-sky-500/20 mx-auto mb-4">
                        <benefit.icon className="w-6 h-6 bg-gradient-to-br from-sky-600 to-blue-600 bg-clip-text text-transparent" />
                      </div>
                      <div className="w-12 h-1 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mx-auto mb-4"></div>
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{benefit.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 bg-gradient-to-br from-cyan-50/50 via-sky-50/30 to-blue-50/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 dark:from-sky-900/30 dark:to-blue-900/30 dark:text-sky-300 dark:border-sky-700">Powered by Innovation</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Technology That Works For You
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Cutting-edge technology powering every feature on our platform.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border border-slate-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-1 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-6"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 flex items-center justify-center shadow-lg shadow-sky-500/20">
                      <Database className="w-7 h-7 bg-gradient-to-br from-sky-600 to-blue-600 bg-clip-text text-transparent" />
                    </div>
                    <h3 className="text-2xl font-bold">Immutable Ledger</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    Every achievement is cryptographically hashed and permanently recorded, creating a tamper-proof
                    ledger of professional accomplishments that employers can verify.
                  </p>
                  <ul className="space-y-2">
                    {['Blockchain verification', 'Tamper-proof records', 'Instant verification'].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-slate-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-1 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full mb-6"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 flex items-center justify-center shadow-lg shadow-sky-500/20">
                      <Shield className="w-7 h-7 bg-gradient-to-br from-sky-600 to-blue-600 bg-clip-text text-transparent" />
                    </div>
                    <h3 className="text-2xl font-bold">AI Governance</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    AI-powered quality control ensures fair play, prevents fraud, and maintains professional
                    standards across all platform interactions.
                  </p>
                  <ul className="space-y-2">
                    {['Automated moderation', 'Quality scoring system', 'Fraud detection'].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-4">
                Ready to Explore All Features?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                Join thousands of students, universities, and employers already benefiting from our platform.
              </p>
              <Button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg shadow-sky-500/30 transition-all duration-300 text-base px-8" asChild>
                <Link href="/auth">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
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
