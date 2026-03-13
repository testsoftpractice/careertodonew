'use client'

import Link from 'next/link'
import {
  Briefcase,
  Zap,
  BookOpen,
  Users,
  Shield,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronRight,
  ArrowUpRight,
  Linkedin,
  Video,
  X,
} from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="border-t border-sky-200/50 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 backdrop-blur-xl relative">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CareerToDo
            </span>
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Platform Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-sky-600" />
              <h3 className="font-bold text-lg">Platform</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connecting students, universities, employers, and investors to create real-world impact through verifiable credentials.
            </p>
            <div className="space-y-3 pt-2">
              <Link
                href="/about"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                About Us
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Features
              </Link>
              <Link
                href="/solutions"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Solutions
              </Link>
            </div>
          </div>

          {/* Products & Services Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-sky-600" />
              <h3 className="font-bold text-lg">Products</h3>
            </div>
            <div className="space-y-3 pt-2">
              <Link
                href="/solutions#students"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <Users className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Student Platform
              </Link>
              <Link
                href="/solutions#universities"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <BookOpen className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                University Partners
              </Link>
              <Link
                href="/solutions#employers"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <Briefcase className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Employer Solutions
              </Link>
              <Link
                href="/solutions#investors"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Investor Portal
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <Zap className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                All Features
              </Link>
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-sky-600" />
              <h3 className="font-bold text-lg">Resources</h3>
            </div>
            <div className="space-y-3 pt-2">
              <Link
                href="/contact"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <Mail className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Contact Support
              </Link>
              <Link
                href="/terms"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <Shield className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <Shield className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Privacy Policy
              </Link>
              <Link
                href="/auth"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <Users className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Login / Sign Up
              </Link>
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-sky-600" />
              <h3 className="font-bold text-lg">Connect</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Join our community and stay updated with the latest news and updates.
            </p>
            <div className="space-y-3 pt-2">
              <Link
                href="mailto:support@careertodo.com"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-all duration-300 group"
              >
                <Mail className="h-4 w-4" />
                <span>support@careertodo.com</span>
              </Link>
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-600 mb-3">Follow Us</p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="https://www.facebook.com/careertodo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/50 hover:bg-sky-500/10 text-slate-600 hover:text-sky-600 transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="https://x.com/CareerToDo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/50 hover:bg-sky-500/10 text-slate-600 hover:text-sky-600 transition-all duration-300 hover:scale-110"
                    aria-label="X (Twitter)"
                  >
                    <X className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/career.todo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/50 hover:bg-sky-500/10 text-slate-600 hover:text-sky-600 transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.youtube.com/@careertodo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/50 hover:bg-sky-500/10 text-slate-600 hover:text-sky-600 transition-all duration-300 hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/careertodo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/50 hover:bg-sky-500/10 text-slate-600 hover:text-sky-600 transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@careertodo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/50 hover:bg-sky-500/10 text-slate-600 hover:text-sky-600 transition-all duration-300 hover:scale-110"
                    aria-label="TikTok"
                  >
                    <Video className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.pinterest.com/careertodo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/50 hover:bg-sky-500/10 text-slate-600 hover:text-sky-600 transition-all duration-300 hover:scale-110"
                    aria-label="Pinterest"
                  >
                    <span className="text-xs font-bold">P</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-sky-200/50 pt-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
              <p className="text-sm text-slate-600">
                © {new Date().getFullYear()} CareerToDo Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
