'use client'

import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Target,
  Rocket,
  Shield,
  Users,
  TrendingUp,
  Globe,
  CheckCircle2,
  X,
  Menu,
  ArrowRight,
  Zap,
  Heart,
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

export default function About() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader title="About" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge className="mb-6 inline-flex items-center gap-2 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 px-6 py-2 rounded-full">
                <Target className="w-4 h-4" />
                Our Mission
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Empowering the Next Generation of{' '}
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 bg-clip-text text-transparent">Real-World Leaders</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                CareerToDo bridges the gap between education and industry by providing students
                with real opportunities to build verifiable professional portfolios from day one.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white" asChild>
                  <Link href="/features">
                    Explore Features <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-2 border-sky-300 text-slate-700 hover:bg-sky-50" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid gap-12 md:grid-cols-2"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="text-lg leading-relaxed">
                      Founded with a simple yet powerful idea: students shouldn't have to wait until graduation to gain
                      real-world experience. They should be building their professional portfolio and proving
                      their capabilities from day one of college.
                    </p>
                    <p className="text-lg leading-relaxed">
                      We recognized that employers need more than degrees—they need proof of execution, collaboration,
                      leadership, and reliability. Traditional educational systems focus on grades, but the real world
                      cares about what you can actually do.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6">The Problem</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <X className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Resume Inflation</h3>
                        <p className="text-muted-foreground">
                          Employers struggle to verify the authenticity of candidate resumes and experience claims.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <X className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Experience Gap</h3>
                        <p className="text-muted-foreground">
                          Students graduate with theoretical knowledge but no practical execution history.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <X className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">No Verification</h3>
                        <p className="text-muted-foreground">
                          No standardized way to verify skills and experience across institutions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-sky-950/20 dark:to-cyan-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid gap-12 md:grid-cols-2"
              >
                <Card className="border border-sky-200/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:border-sky-300 transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-sky-500/30">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="font-semibold text-2xl text-slate-800 dark:text-white">Our Mission</h2>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                      To transform how education connects to industry by providing every student with opportunities to execute
                      real work, build verifiable professional portfolios, and transition seamlessly into meaningful careers or
                      entrepreneurship.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">Enable real-world execution for students at scale</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">Create verifiable career records that employers trust</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">Bridge the gap between education and industry needs</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-sky-200/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:border-sky-300 transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
                        <Rocket className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="font-semibold text-2xl text-slate-800 dark:text-white">Our Vision</h2>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                      A world where every student's professional journey is documented, verified, and valued from their first
                      day of college, creating a more transparent, efficient, and fair talent marketplace for everyone.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">Transparent verification of all professional achievements</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">Fair and data-driven talent evaluation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">Seamless education-to-career pathways</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-20 bg-white/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 px-6 py-2 rounded-full">What Makes Us Different</Badge>
              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">
                Unique Approach to Career Development
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Our platform combines cutting-edge technology with a deep understanding of both education and industry needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto"
            >
              {[
                {
                  icon: Shield,
                  title: 'Immutable Records',
                  desc: 'Every achievement is cryptographically hashed and permanently recorded, creating a tamper-proof ledger of professional accomplishments.',
                  gradient: 'from-emerald-500 to-teal-600',
                },
                {
                  icon: Users,
                  title: 'Multi-Dimensional Rating',
                  desc: 'Beyond simple scores, we measure execution, collaboration, leadership, ethics and reliability across multiple dimensions.',
                  gradient: 'from-violet-500 to-purple-600',
                },
                {
                  icon: TrendingUp,
                  title: 'Real-Time Growth',
                  desc: 'Track your progress, reputation, and career growth in real-time with actionable insights and recommendations.',
                  gradient: 'from-orange-500 to-amber-600',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                >
                  <Card className="border border-slate-200/50 hover:border-sky-300 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl transition-all h-full">
                    <CardContent className="p-8">
                      <div className={`w-12 h-1 bg-gradient-to-r ${feature.gradient} mb-6`}></div>
                      <div className={`bg-gradient-to-br ${feature.gradient} w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-xl mb-3 text-slate-800 dark:text-white">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-sky-950/20 dark:to-cyan-950/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 px-6 py-2 rounded-full">Our Impact</Badge>
              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">Making a Difference</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Transforming education and career development</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-8 md:grid-cols-4 max-w-5xl mx-auto"
            >
              {[
                { value: '10K+', label: 'Students', desc: 'Building careers', color: 'text-sky-600' },
                { value: '500+', label: 'Universities', desc: 'Partner institutions', color: 'text-blue-600' },
                { value: '2,500+', label: 'Projects', desc: 'Real execution opportunities', color: 'text-cyan-600' },
                { value: '98%', label: 'Satisfaction', desc: 'From our partners', color: 'text-emerald-600' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-slate-200/50 hover:shadow-xl transition-all"
                >
                  <div className={`text-5xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-slate-700 dark:text-slate-300 font-medium">{stat.label}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-white/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 px-6 py-2 rounded-full">Our Values</Badge>
              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">The Principles That Guide Everything We Do</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Our core values shape our decisions and actions every day.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto"
            >
              {[
                { icon: Shield, title: 'Trust & Transparency', desc: 'Complete transparency. Every record, rating, and achievement is verifiable and traceable.', gradient: 'from-sky-500 to-blue-600' },
                { icon: Users, title: 'Student-First', desc: 'Our platform is built around student needs and success. Everything we do starts with how we can better serve students.', gradient: 'from-blue-500 to-cyan-600' },
                { icon: TrendingUp, title: 'Continuous Innovation', desc: "We're constantly improving our platform with new features, integrations, and capabilities based on user feedback.", gradient: 'from-violet-500 to-purple-600' },
                { icon: Globe, title: 'Global Impact', desc: 'Our platform is accessible worldwide, helping students and institutions across the globe bridge the education-employment gap.', gradient: 'from-emerald-500 to-teal-600' },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="border border-slate-200/50 hover:border-sky-300 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl transition-all">
                    <CardContent className="p-8">
                      <div className={`w-12 h-1 bg-gradient-to-r ${value.gradient} mb-4`}></div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`bg-gradient-to-br ${value.gradient} w-10 h-10 rounded-xl flex items-center justify-center shadow-md`}>
                          <value.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{value.title}</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{value.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 dark:from-sky-900 dark:via-blue-900 dark:to-cyan-900" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">
                Ready to Transform Your Career Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of students already building their professional future on CareerToDo Platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-sky-600 hover:bg-white/90 text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all" asChild>
                  <Link href="/auth">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 text-base hover:-translate-y-1 transition-all backdrop-blur-sm" asChild>
                  <Link href="/solutions">Explore Solutions</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
