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
        <section className="relative overflow-hidden border-b bg-primary/5">
          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge variant="outline" className="mb-6 inline-flex items-center gap-2">
                <Target className="w-4 h-4" />
                Our Mission
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Empowering the Next Generation of{' '}
                <span className="text-primary">Real-World Leaders</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                CareerToDo bridges the gap between education and industry by providing students
                with real opportunities to build verifiable professional portfolios from day one.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link href="/features">
                    Explore Features <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-2" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-background">
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
        <section className="py-20 bg-primary/[0.03]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid gap-12 md:grid-cols-2"
              >
                <Card className="border-2 hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="font-semibold text-2xl">Our Mission</h2>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      To transform how education connects to industry by providing every student with opportunities to execute
                      real work, build verifiable professional portfolios, and transition seamlessly into meaningful careers or
                      entrepreneurship.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Enable real-world execution for students at scale</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Create verifiable career records that employers trust</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Bridge the gap between education and industry needs</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Rocket className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="font-semibold text-2xl">Our Vision</h2>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      A world where every student's professional journey is documented, verified, and valued from their first
                      day of college, creating a more transparent, efficient, and fair talent marketplace for everyone.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Transparent verification of all professional achievements</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Fair and data-driven talent evaluation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Seamless education-to-career pathways</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">What Makes Us Different</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Unique Approach to Career Development
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                },
                {
                  icon: Users,
                  title: 'Multi-Dimensional Rating',
                  desc: 'Beyond simple scores, we measure execution, collaboration, leadership, ethics and reliability across multiple dimensions.',
                },
                {
                  icon: TrendingUp,
                  title: 'Real-Time Growth',
                  desc: 'Track your progress, reputation, and career growth in real-time with actionable insights and recommendations.',
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
                        <div className="bg-green-100 p-3 rounded-lg">
                          <feature.icon className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-xl">{feature.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="py-20 bg-primary/[0.03]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">Our Impact</Badge>
              <h2 className="text-3xl font-bold mb-4">Making a Difference</h2>
              <p className="text-xl text-muted-foreground">Transforming education and career development</p>
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
                { value: '2,500+', label: 'Projects', desc: 'Real execution opportunities' },
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

        {/* Our Values */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge variant="outline" className="mb-4">Our Values</Badge>
              <h2 className="text-3xl font-bold mb-4">The Principles That Guide Everything We Do</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                { icon: Shield, title: 'Trust & Transparency', desc: 'Complete transparency. Every record, rating, and achievement is verifiable and traceable.' },
                { icon: Users, title: 'Student-First', desc: 'Our platform is built around student needs and success. Everything we do starts with how we can better serve students.' },
                { icon: TrendingUp, title: 'Continuous Innovation', desc: "We're constantly improving our platform with new features, integrations, and capabilities based on user feedback." },
                { icon: Globe, title: 'Global Impact', desc: 'Our platform is accessible worldwide, helping students and institutions across the globe bridge the education-employment gap.' },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border hover:shadow-lg transition-all">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <value.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">{value.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{value.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
                Ready to Transform Your Career Journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of students already building their professional future on CareerToDo Platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-base" asChild>
                  <Link href="/auth">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-2 text-base" asChild>
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
