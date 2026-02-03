'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Target,
  TrendingUp,
  Shield,
  Star,
  BookOpen,
  BarChart3,
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

export default function HomePage() {
  const { user } = useAuth()

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
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary/[0.02] border-b">
          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="outline" className="mb-6 inline-flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Transform Career Development
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Build Your Professional Portfolio{' '}
                <span className="text-primary">From Day One</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Connect students, universities, employers, and investors in a unified ecosystem where real-world
                experience is verified, tracked, and valued.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link href={getDashboardLink()}>
                    {user ? 'Go to Dashboard' : 'Get Started'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-2" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">Key Features</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Everything You Need for Career Success
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A comprehensive platform that connects all stakeholders in the career development ecosystem.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
            >
              {[
                {
                  icon: Users,
                  title: 'For Students',
                  desc: 'Build your professional portfolio with real projects, earn verifiable credentials, and showcase your skills to employers.',
                  link: '/solutions#students',
                },
                {
                  icon: BookOpen,
                  title: 'For Universities',
                  desc: 'Track student progress, manage projects, and connect students with industry opportunities.',
                  link: '/solutions#universities',
                },
                {
                  icon: Briefcase,
                  title: 'For Employers',
                  desc: 'Find verified talent with proven skills, access detailed candidate portfolios, and make data-driven hiring decisions.',
                  link: '/solutions#employers',
                },
                {
                  icon: TrendingUp,
                  title: 'For Investors',
                  desc: 'Discover and invest in promising student-led projects with transparent progress tracking and ROI metrics.',
                  link: '/solutions#investors',
                },
                {
                  icon: Shield,
                  title: 'Immutable Records',
                  desc: 'Every achievement is cryptographically verified and permanently recorded, creating tamper-proof credentials.',
                  link: '/features',
                },
                {
                  icon: BarChart3,
                  title: 'Real-Time Analytics',
                  desc: 'Track progress, growth, and performance with comprehensive dashboards and actionable insights.',
                  link: '/features',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card className="border-2 hover:shadow-xl transition-all h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-xl">{feature.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-6">{feature.desc}</p>
                      <Link
                        href={feature.link}
                        className="text-primary font-medium hover:underline flex items-center gap-2"
                      >
                        Learn More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary/[0.03]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">Platform Impact</Badge>
              <h2 className="text-3xl font-bold mb-4">Making a Real Difference</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-8 md:grid-cols-4 max-w-5xl mx-auto"
            >
              {[
                { value: '10K+', label: 'Students', desc: 'Building careers' },
                { value: '500+', label: 'Universities', desc: 'Partner institutions' },
                { value: '2,500+', label: 'Projects', desc: 'Real opportunities' },
                { value: '98%', label: 'Satisfaction', desc: 'From our partners' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">How It Works</Badge>
              <h2 className="text-3xl font-bold mb-4">Simple Steps to Success</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Getting started is easy. Create your account and start building your professional journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {[
                {
                  step: '1',
                  title: 'Create Your Account',
                  desc: 'Sign up as a student, university, employer, or investor. Complete your profile to get personalized recommendations.',
                },
                {
                  step: '2',
                  title: 'Discover Opportunities',
                  desc: 'Browse projects, jobs, or investment opportunities that match your goals and expertise.',
                },
                {
                  step: '3',
                  title: 'Execute & Verify',
                  desc: 'Complete tasks, deliver results, and earn verified credentials that build your professional reputation.',
                },
                {
                  step: '4',
                  title: 'Grow Your Career',
                  desc: 'Track your progress, showcase your achievements, and unlock new opportunities as your reputation grows.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/[0.02] border-t">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 inline-flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Get Started Today
              </Badge>
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students, universities, employers, and investors who are already building
                the future of career development.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link href={getDashboardLink()}>
                    {user ? 'Go to Dashboard' : 'Start Free'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-2" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">Platform Benefits</Badge>
              <h2 className="text-3xl font-bold mb-4">Why Choose CareerToDo?</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto"
            >
              {[
                {
                  icon: CheckCircle2,
                  title: 'Verified Credentials',
                  desc: 'Every achievement is cryptographically verified and permanently recorded, creating a tamper-proof ledger of your professional accomplishments.',
                },
                {
                  icon: Shield,
                  title: 'Privacy First',
                  desc: 'Your data is encrypted and secure. You control what information you share with employers and institutions.',
                },
                {
                  icon: Star,
                  title: 'Reputation System',
                  desc: 'Build a comprehensive reputation based on execution, collaboration, leadership, ethics, and reliability.',
                },
                {
                  icon: Target,
                  title: 'Goal-Oriented',
                  desc: 'Set clear goals, track progress, and achieve milestones with personalized recommendations and insights.',
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-2 hover:shadow-xl transition-all h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <benefit.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-xl">{benefit.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{benefit.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Demo Task Management */}
        <section className="py-16 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between p-6 border rounded-lg bg-background">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Enterprise Task Management Demo</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore a comprehensive task management system with Kanban board, dependencies, time tracking, and more.
                  </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90" asChild>
                  <Link href="/projects/demo-task-management">
                    View Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  )
}
