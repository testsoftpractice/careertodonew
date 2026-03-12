'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Users, Building2, FolderOpen, Heart } from 'lucide-react'

interface StatItem {
  value: string
  label: string
  desc: string
  icon: any
  gradient: string
}

export default function StunningStats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [counters, setCounters] = useState({ students: 0, universities: 0, projects: 0, satisfaction: 0 })

  useEffect(() => {
    if (isInView) {
      const animateCounter = (target: number, duration: number) => {
        let start = 0
        const increment = target / (duration / 16)
        const timer = setInterval(() => {
          start += increment
          if (start >= target) {
            clearInterval(timer)
            start = target
          }
          return start
        }, 16)
        return timer
      }

      const timer1 = setInterval(() => {
        setCounters(prev => ({ ...prev, students: Math.min(prev.students + 100, 10000) }))
      }, 16)

      const timer2 = setInterval(() => {
        setCounters(prev => ({ ...prev, universities: Math.min(prev.universities + 5, 500) }))
      }, 16)

      const timer3 = setInterval(() => {
        setCounters(prev => ({ ...prev, projects: Math.min(prev.projects + 25, 2500) }))
      }, 16)

      const timer4 = setInterval(() => {
        setCounters(prev => ({ ...prev, satisfaction: Math.min(prev.satisfaction + 1, 98) }))
      }, 20)

      const timeout = setTimeout(() => {
        clearInterval(timer1)
        clearInterval(timer2)
        clearInterval(timer3)
        clearInterval(timer4)
        setCounters({ students: 10000, universities: 500, projects: 2500, satisfaction: 98 })
      }, 2000)

      return () => {
        clearInterval(timer1)
        clearInterval(timer2)
        clearInterval(timer3)
        clearInterval(timer4)
        clearTimeout(timeout)
      }
    }
  }, [isInView])

  const stats: StatItem[] = [
    {
      value: `${(counters.students / 1000).toFixed(0)}K+`,
      label: 'Students',
      desc: 'Building careers',
      icon: Users,
      gradient: 'from-purple-500 to-violet-600',
    },
    {
      value: `${counters.universities}+`,
      label: 'Universities',
      desc: 'Partner institutions',
      icon: Building2,
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      value: `${(counters.projects / 1000).toFixed(1)}K+`,
      label: 'Projects',
      desc: 'Real opportunities',
      icon: FolderOpen,
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      value: `${counters.satisfaction}%`,
      label: 'Satisfaction',
      desc: 'From our partners',
      icon: Heart,
      gradient: 'from-orange-500 to-amber-600',
    },
  ]

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-orange-900/90 backdrop-blur-3xl" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative"
              >
                {/* Glass card */}
                <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-white/40 transition-all duration-300">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className={`relative w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="text-5xl lg:text-6xl font-bold text-white mb-2"
                  >
                    {stat.value}
                  </motion.div>

                  {/* Label */}
                  <div className="text-xl font-semibold text-white/90 mb-1">{stat.label}</div>
                  <div className="text-sm text-white/60">{stat.desc}</div>
                </div>

                {/* Floating ring animation */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl -z-10`}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
