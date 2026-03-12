'use client'

import { motion } from 'framer-motion'
import { Link } from 'next/link'
import { ArrowRight, GraduationCap, Building2, Briefcase, ChartLine, Shield, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: GraduationCap,
    title: 'For Students',
    desc: 'Build your professional portfolio with real projects, earn verifiable credentials, and showcase your skills to employers.',
    link: '/solutions#students',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/50',
  },
  {
    icon: Building2,
    title: 'For Universities',
    desc: 'Track student progress, manage projects, and connect students with industry opportunities.',
    link: '/solutions#universities',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'shadow-cyan-500/50',
  },
  {
    icon: Briefcase,
    title: 'For Employers',
    desc: 'Find verified talent with proven skills, access detailed candidate portfolios, and make data-driven hiring decisions.',
    link: '/solutions#employers',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-500/50',
  },
  {
    icon: ChartLine,
    title: 'For Investors',
    desc: 'Discover and invest in promising student-led projects with transparent progress tracking and ROI metrics.',
    link: '/solutions#investors',
    gradient: 'from-orange-500 to-amber-600',
    glow: 'shadow-orange-500/50',
  },
  {
    icon: Shield,
    title: 'Immutable Records',
    desc: 'Every achievement is cryptographically verified and permanently recorded, creating tamper-proof credentials.',
    link: '/features',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/50',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Track progress, growth, and performance with comprehensive dashboards and actionable insights.',
    link: '/features',
    gradient: 'from-indigo-500 to-purple-600',
    glow: 'shadow-indigo-500/50',
  },
]

export default function StunningFeatures() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-cyan-950/50" />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 text-purple-300 font-semibold text-lg mb-6"
          >
            Platform Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            A comprehensive platform that connects all stakeholders in the career development ecosystem.
          </motion.p>
        </motion.div>

        {/* Creative Grid Layout */}
        <div className="max-w-7xl mx-auto">
          {/* Top row with overlap */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {features.slice(0, 2).map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -2 : 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -10, rotate: index % 2 === 0 ? 1 : -1 }}
                  className="group relative"
                >
                  <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-white/30 transition-all duration-500">
                    {/* Animated gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                      className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mb-8 shadow-2xl ${feature.glow}`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">{feature.desc}</p>

                    {/* CTA */}
                    <Link
                      href={feature.link}
                      className={`inline-flex items-center gap-2 text-white font-semibold text-lg group/link hover:gap-4 transition-all duration-300`}
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                    </Link>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white/10 rounded-full group-hover:scale-150 group-hover:rotate-90 transition-all duration-500" />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Middle row - centered card */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -10 }}
              className="group relative lg:max-w-2xl w-full"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-10 hover:border-purple-400/50 transition-all duration-500">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/50"
                >
                  <Briefcase className="w-10 h-10 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-3xl font-bold text-white mb-4">For Employers</h3>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Find verified talent with proven skills, access detailed candidate portfolios, and make data-driven hiring decisions.
                </p>

                {/* CTA */}
                <Link
                  href="/solutions#employers"
                  className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all hover:gap-4 duration-300"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl"
                >
                  <ChartLine className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom row */}
          <div className="grid lg:grid-cols-3 gap-8">
            {features.slice(3).map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -10 }}
                  className="group relative"
                >
                  <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all duration-500 h-full">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                      className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl ${feature.glow}`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-base mb-6 leading-relaxed">{feature.desc}</p>

                    {/* CTA */}
                    <Link
                      href={feature.link}
                      className={`inline-flex items-center gap-2 bg-gradient-to-r ${feature.gradient} text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all hover:gap-4 duration-300`}
                    >
                      <span>Learn</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
