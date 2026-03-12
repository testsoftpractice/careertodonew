'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  delay?: number
}

export default function GlassCard({ children, className = '', hover = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      whileHover={hover ? { scale: 1.02, y: -8 } : {}}
      className={`
        relative overflow-hidden
        backdrop-blur-xl
        bg-white/10 dark:bg-white/5
        border border-white/20 dark:border-white/10
        rounded-3xl
        p-8
        shadow-2xl
        hover:shadow-3xl
        transition-all duration-500
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-orange-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl opacity-20 blur-xl" />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
