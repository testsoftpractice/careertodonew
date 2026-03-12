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
  Flame,
  Sparkles,
  Building2,
  GraduationCap,
  ChartLine,
  Award,
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

// Gradient animations
const gradientVariants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: 'linear',
    },
  },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950/30 dark:to-cyan-950/30 flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-purple-900 dark:via-pink-800 dark:to-orange-900 opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 dark:from-cyan-900 dark:via-blue-900 dark:to-purple-900 opacity-5" />

          {/* Animated shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm border border-purple-200 dark:border-purple-800 px-6 py-3 rounded-full mb-8 shadow-lg"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent font-semibold">
                  Trusted by 500+ Companies Worldwide
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
              >
                Build Your Professional Portfolio{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
                  From Day One
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
              >
                Connect students, universities, employers, and investors in a unified ecosystem where real-world
                experience is verified, tracked, and valued.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex justify-center gap-4 flex-wrap mb-12"
              >
                <Button
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  asChild
                >
                  <Link href={getDashboardLink()}>
                    {user ? 'Go to Dashboard' : 'Get Started'} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 px-10 py-4 rounded-xl font-semibold text-lg hover:-translate-y-1 transition-all duration-300"
                  asChild
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-8"
              >
                {[
                  { icon: Zap, text: 'Free to Start' },
                  { icon: Shield, text: 'Verified Credentials' },
                  { icon: Sparkles, text: 'AI-Powered Insights' },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 px-4 py-2 rounded-full backdrop-blur-sm"
                  >
                    <item.icon className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900 relative overflow-hidden">
          {/* Animated overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Students', desc: 'Building careers', color: 'from-white/20 to-white/10' },
                { value: '500+', label: 'Universities', desc: 'Partner institutions', color: 'from-cyan-500/20 to-cyan-500/10' },
                { value: '2,500+', label: 'Projects', desc: 'Real opportunities', color: 'from-purple-500/20 to-purple-500/10' },
                { value: '98%', label: 'Satisfaction', desc: 'From our partners', color: 'from-pink-500/20 to-pink-500/10' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl p-6 md:p-8 hover:scale-105 transition-transform duration-300`}>
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-white/90 font-semibold text-lg">{stat.label}</div>
                    <div className="text-white/70 text-sm">{stat.desc}</div>
                  </div>
                </motion.div>
              ))}
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
              <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 px-6 py-2 rounded-full">
                Key Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything You Need for{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
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
                  gradient: 'from-purple-500 to-purple-600',
                  bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30',
                },
                {
                  icon: Building2,
                  title: 'For Universities',
                  desc: 'Track student progress, manage projects, and connect students with industry opportunities.',
                  link: '/solutions#universities',
                  gradient: 'from-cyan-500 to-blue-600',
                  bgGradient: 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30',
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

        {/* How It Works Section */}
        <section className="py-24 bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950/30 dark:to-cyan-950/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-900/50 dark:to-cyan-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 px-6 py-2 rounded-full">
                How It Works
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Simple Steps to{' '}
                <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Success
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Getting started is easy. Create your account and start building your professional journey.
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500 rounded-full hidden md:block" />

                {[
                  {
                    step: '1',
                    title: 'Create Your Account',
                    desc: 'Sign up as a student, university, employer, or investor. Complete your profile to get personalized recommendations.',
                    icon: Sparkles,
                    gradient: 'from-purple-500 to-purple-600',
                  },
                  {
                    step: '2',
                    title: 'Discover Opportunities',
                    desc: 'Browse projects, jobs, or investment opportunities that match your goals and expertise.',
                    icon: Target,
                    gradient: 'from-pink-500 to-pink-600',
                  },
                  {
                    step: '3',
                    title: 'Execute & Verify',
                    desc: 'Complete tasks, deliver results, and earn verified credentials that build your professional reputation.',
                    icon: CheckCircle2,
                    gradient: 'from-orange-500 to-orange-600',
                  },
                  {
                    step: '4',
                    title: 'Grow Your Career',
                    desc: 'Track your progress, showcase your achievements, and unlock new opportunities as your reputation grows.',
                    icon: TrendingUp,
                    gradient: 'from-cyan-500 to-cyan-600',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex items-start gap-6 mb-12 last:mb-0"
                  >
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center font-bold text-2xl shadow-xl hover:scale-110 transition-transform duration-300 z-10`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-800">
                      <h3 className="font-bold text-2xl mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900" />
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
                  className="bg-white text-purple-600 hover:bg-white/90 px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
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
              <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-900/50 dark:to-cyan-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 px-6 py-2 rounded-full">
                Platform Benefits
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
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
                  gradient: 'from-purple-500 to-violet-600',
                  bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30',
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
                  gradient: 'from-amber-500 to-orange-600',
                  bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
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

        {/* Demo Task Management */}
        <section className="py-16 bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950/30 dark:to-cyan-950/30 border-t border-purple-100 dark:border-purple-900/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 border-2 border-purple-200 dark:border-purple-800 rounded-3xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Enterprise Task Management Demo
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Explore a comprehensive task management system with Kanban board, dependencies, time tracking, and more.
                  </p>
                </div>
                <Button
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
                  asChild
                >
                  <Link href="/projects/demo-task-management">
                    View Demo <ArrowRight className="ml-2 h-5 w-5" />
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
