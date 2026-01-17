'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
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
  Rocket,
  Globe,
  ChartBar,
  Play,
  Menu,
  X,
  ChevronDown,
  Star,
  Info,
  Sparkles,
  Video,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import PublicFooter from '@/components/public-footer'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  scale: 1.03,
  transition: { duration: 0.3 },
}

// Animated Counter Component
function AnimatedCounter({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          current = value
          clearInterval(timer)
        }
        setCount(Math.floor(current))
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="text-5xl md:text-6xl font-bold text-primary mb-2"
      >
        {count}{suffix}
      </motion.div>
      <p className="text-muted-foreground font-medium">{label}</p>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={scaleOnHover}
    >
      <Card className="group relative overflow-hidden border hover:shadow-xl transition-all duration-300 h-full">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="relative p-8">
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.6 }}
            className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-6 shadow-lg"
          >
            <Icon className="w-7 h-7 text-primary-foreground" />
          </motion.div>
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Testimonial Card
function TestimonialCard({ name, role, content, avatar, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={scaleOnHover}
    >
      <Card className="h-full hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-8">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">"{content}"</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              {name.charAt(0)}
            </div>
            <div>
              <p className="font-bold">{name}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  const navLinks = [
    { name: 'About', href: '/about', icon: Info },
    { name: 'Features', href: '/features', icon: Zap },
    { name: 'Solutions', href: '/solutions', icon: ChartBar },
  ]

  const features = [
    {
      icon: GraduationCap,
      title: 'Real-World Experience',
      description: 'Students operate real organizations with actual roles, responsibilities, and measurable impact from day one.',
      delay: 0,
    },
    {
      icon: Award,
      title: 'Verified Credentials',
      description: 'Every achievement, role, and contribution is permanently recorded on an immutable ledger with employer verification.',
      delay: 0.1,
    },
    {
      icon: Shield,
      title: 'Governed Ecosystem',
      description: 'AI-powered governance ensures fair play, quality standards, and professional conduct across all interactions.',
      delay: 0.2,
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Connect with universities, employers, and investors worldwide in a unified platform for career growth.',
      delay: 0.3,
    },
    {
      icon: ChartBar,
      title: 'Data-Driven Insights',
      description: 'Comprehensive analytics for students, institutions, and employers to track progress and make informed decisions.',
      delay: 0.4,
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Build meaningful professional relationships and grow your network through collaborative projects and mentorship.',
      delay: 0.5,
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'CareerToDo transformed my university experience. I led a team of 15 students in a real startup and now have a verified track record that helped me land my dream job.',
      delay: 0,
    },
    {
      name: 'Michael Chen',
      role: 'Employer, Tech Company',
      content: 'The quality of students from CareerToDo is outstanding. We can verify their actual work history, skills, and contributions before even interviewing.',
      delay: 0.2,
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'University Dean',
      content: 'We finally have real data to showcase our student outcomes. Our employability metrics have increased by 67% since partnering with CareerToDo.',
      delay: 0.4,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Animated Background with subtle pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
      </div>

      {/* Navigation Header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
              >
                <Zap className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <span className="font-bold text-lg sm:text-xl text-primary">CareerToDo</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.div key={link.href} whileHover={{ y: -2, scale: 1.05 }} whileTap={{ y: 0, scale: 1 }}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm" asChild>
                    <Link href="/dashboard/student">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                </motion.div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth">Sign In</Link>
                  </Button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm" asChild>
                      <Link href="/auth">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t pt-4 overflow-hidden"
            >
              <div className="flex flex-col gap-4 pb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-primary/5">
          <div className="container mx-auto px-4 py-20 md:py-32 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <Badge variant="outline" className="border-0 bg-transparent text-primary font-medium">
                    Platform of Future
                  </Badge>
                </motion.div>

                <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
                  Where Education Meets{' '}
                  <span className="text-primary">Real-World Execution</span>
                </h1>

                <p className="mb-10 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto leading-relaxed">
                  A governed ecosystem where students operate real organizations, build verifiable careers from university onward, and transition seamlessly into industry or entrepreneurship.
                </p>

                <motion.div
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="text-base px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" asChild>
                      <Link href="/auth">
                        Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" variant="outline" className="text-base px-8 border-2" asChild>
                      <Link href="#features">
                        Explore Features <ChevronDown className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Free for students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Verified credentials</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* YouTube Video Section */}
        <section className="relative overflow-hidden border-b bg-background">
          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge variant="outline" className="mb-4">See It In Action</Badge>
              <h2 className="mb-4 text-4xl md:text-5xl font-bold">
                Watch How It Works
              </h2>
              <p className="mb-12 text-xl text-muted-foreground max-w-2xl mx-auto">
                See real students transforming their education into meaningful careers with CareerToDo
              </p>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-primary/10"
              >
                <div className="relative aspect-video bg-muted/20 rounded-2xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1"
                    title="CareerToDo Platform Overview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative overflow-hidden border-b bg-primary/[0.03]">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
            >
              <AnimatedCounter value={50000} suffix="+" label="Students" />
              <AnimatedCounter value={500} suffix="+" label="Universities" />
              <AnimatedCounter value={10000} suffix="+" label="Projects" />
              <AnimatedCounter value={1000} suffix="+" label="Employers" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative overflow-hidden border-b py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="mb-4 text-4xl md:text-5xl font-bold">
                Everything You Need to{' '}
                <span className="text-primary">Succeed</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful tools and features designed to accelerate your career growth and professional development.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative overflow-hidden border-b bg-primary/[0.03] py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4">How It Works</Badge>
              <h2 className="mb-4 text-4xl md:text-5xl font-bold">
                Get Started in{' '}
                <span className="text-primary">4 Simple Steps</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Launch your journey in minutes with our streamlined onboarding process.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-8">
              {[
                { number: '01', icon: Rocket, title: 'Sign Up & Get Verified', desc: 'Create your account, complete your profile, and get verified by your university or organization.', delay: 0 },
                { number: '02', icon: Target, title: 'Explore & Apply', desc: 'Browse available projects, roles, and opportunities that match your interests and skill level.', delay: 0.2 },
                { number: '03', icon: Zap, title: 'Execute & Learn', desc: 'Take on real responsibilities, contribute to projects, and gain hands-on experience with guidance.', delay: 0.4 },
                { number: '04', icon: Award, title: 'Get Recognized', desc: 'Earn badges, certifications, and build your professional reputation with verified achievements.', delay: 0.6 },
              ].map((step) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: step.delay }}
                  className="flex gap-6 items-start"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-xl">
                      {step.number}
                    </div>
                    <div className="absolute top-16 left-1/2 w-0.5 h-full bg-primary/50 -translate-x-1/2 hidden last:hidden" />
                  </div>
                  <Card className="flex-1 hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <step.icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stakeholders Section */}
        <section className="relative overflow-hidden border-b py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4">Built For Everyone</Badge>
              <h2 className="mb-4 text-4xl md:text-5xl font-bold">
                Empowering{' '}
                <span className="text-primary">Every Stakeholder</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Whether you're a student, university, employer, or investor, we have tools tailored for you.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { icon: GraduationCap, title: 'Students', desc: 'Build real careers from university with verified experience' },
                { icon: Building2, title: 'Universities', desc: 'Track outcomes and showcase student success' },
                { icon: Briefcase, title: 'Employers', desc: 'Find verified talent with proven track records' },
                { icon: TrendingUp, title: 'Investors', desc: 'Discover opportunities in student ventures' },
              ].map((stakeholder, index) => (
                <motion.div
                  key={stakeholder.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={scaleOnHover}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 group">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        whileHover={{ rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-xl"
                      >
                        <stakeholder.icon className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3">{stakeholder.title}</h3>
                      <p className="text-muted-foreground">{stakeholder.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative overflow-hidden border-b bg-primary/[0.03] py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4">Testimonials</Badge>
              <h2 className="mb-4 text-4xl md:text-5xl font-bold">
                Loved by{' '}
                <span className="text-primary">Thousands</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See what our community members are saying about their experience.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-primary/[0.05]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary flex items-center justify-center shadow-2xl"
              >
                <Rocket className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <h2 className="mb-6 text-4xl md:text-5xl font-bold">
                Ready to Transform Your{' '}
                <span className="text-primary">Career?</span>
              </h2>

              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of students already building their professional future on CareerToDo Platform.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex"
              >
                <Button size="lg" className="text-base px-10 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20" asChild>
                  <Link href="/auth">
                    Start Your Journey Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>

              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required • Free for students • Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
