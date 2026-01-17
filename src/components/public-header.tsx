'use client'

// Unified public header with CareerToDo branding
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap, Sparkles, ArrowRight, Menu, X, Info, BarChart3, HelpCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface PublicHeaderProps {
  title?: string
}

export default function PublicHeader({ title }: PublicHeaderProps) {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  const navLinks = [
    { name: 'About', href: '/about', icon: Info },
    { name: 'Features', href: '/features', icon: Zap },
    { name: 'Solutions', href: '/solutions', icon: BarChart3 },
    { name: 'Contact', href: '/contact', icon: HelpCircle },
  ]

  const getDashboardLink = (role: string) => {
    if (!user) return '/auth'
    const roleDashboards: Record<string, string> = {
      'STUDENT': '/dashboard/student',
      'UNIVERSITY': '/dashboard/university',
      'EMPLOYER': '/dashboard/employer',
      'INVESTOR': '/dashboard/investor',
      'ADMIN': '/admin',
    }
    return roleDashboards[user.role] || '/auth'
  }

  return (
    <motion.header
      style={{ opacity: headerOpacity }}
      className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 relative"
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

          {/* Auth Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm" asChild>
                  <Link href={getDashboardLink(user.role)}>
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

        {/* Mobile Menu - inside header container */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t pt-4 pb-4 overflow-hidden bg-background"
          >
            <div className="flex flex-col gap-4">
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
  )
}
