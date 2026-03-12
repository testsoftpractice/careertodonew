'use client'

import { motion } from 'framer-motion'
import { Sparkles, Target, CheckCircle2, TrendingUp } from 'lucide-react'

const steps = [
  {
    icon: Sparkles,
    title: 'Create Your Account',
    desc: 'Sign up as a student, university, employer, or investor. Complete your profile to get personalized recommendations.',
    gradient: 'from-purple-500 to-violet-600',
    number: '01',
  },
  {
    icon: Target,
    title: 'Discover Opportunities',
    desc: 'Browse projects, jobs, or investment opportunities that match your goals and expertise.',
    gradient: 'from-pink-500 to-rose-600',
    number: '02',
  },
  {
    icon: CheckCircle2,
    title: 'Execute & Verify',
    desc: 'Complete tasks, deliver results, and earn verified credentials that build your professional reputation.',
    gradient: 'from-orange-500 to-amber-600',
    number: '03',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Career',
    desc: 'Track your progress, showcase your achievements, and unlock new opportunities as your reputation grows.',
    gradient: 'from-cyan-500 to-blue-600',
    number: '04',
  },
]

export default function StunningHowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/30 to-cyan-950/30">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Animated lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"
            style={{ left: `${20 + i * 15}%` }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

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
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-500/30 text-cyan-300 font-semibold text-lg mb-6"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Simple Steps to Success
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Getting started is easy. Create your account and start building your professional journey.
          </motion.p>
        </motion.div>

        {/* Steps Grid with Creative Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative"
                >
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 right-0 w-16 h-0.5 bg-gradient-to-r from-white/20 to-transparent md:block hidden" />
                  )}

                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-white/30 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
                    {/* Number badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-2xl"
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                      className={`relative w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{step.desc}</p>

                    {/* Decorative elements */}
                    <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Icon className="w-32 h-32 text-white" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-gray-400 text-lg mb-8">Ready to start your journey?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
