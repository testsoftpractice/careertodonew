'use client'

import { useAuth } from '@/contexts/auth-context'
import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'
import Stunning3DBackground from '@/components/stunning-3d-background'
import StunningHero from '@/components/stunning-hero'
import StunningStats from '@/components/stunning-stats'
import StunningFeatures from '@/components/stunning-features'
import StunningHowItWorks from '@/components/stunning-how-it-works'
import StunningCTA from '@/components/stunning-cta'
import { Flame, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Stunning3DBackground />
      <PublicHeader />

      <main className="flex-1">
        <StunningHero getDashboardLink={getDashboardLink} user={user} />
        <StunningStats />
        <StunningFeatures />
        <StunningHowItWorks />
        <StunningCTA getDashboardLink={getDashboardLink} user={user} />

        {/* Demo Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-cyan-950/50" />

          {/* Animated orbs */}
          <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 overflow-hidden group">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/50"
                      >
                        <Flame className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">Enterprise Task Management</h3>
                        <p className="text-gray-400">
                          Explore a comprehensive system with Kanban board, dependencies, time tracking, and more.
                        </p>
                      </div>
                    </div>

                    <Button
                      className="group/btn bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105"
                      asChild
                    >
                      <Link href="/projects/demo-task-management">
                        <span className="flex items-center gap-3">
                          Launch Demo
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.span>
                        </span>
                      </Link>
                    </Button>
                  </div>

                  {/* Decorative 3D element representation */}
                  <div className="relative w-48 h-48 hidden lg:block">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-4 border-2 border-white/10 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-xl"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
