'use client'

import Link from 'next/link'
import {
  Briefcase,
  Zap,
  BookOpen,
  Users,
  Shield,
  Mail,
  Github,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Platform Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Platform</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting students, universities, employers, and investors to create real-world impact through verifiable credentials.
            </p>
            <div className="space-y-3 pt-2">
              <Link
                href="/about"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                About Us
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Features
              </Link>
              <Link
                href="/solutions"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Solutions
              </Link>
            </div>
          </div>

          {/* Products & Services Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Products</h3>
            </div>
            <div className="space-y-3 pt-2">
              <Link
                href="/solutions#students"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Users className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Student Platform
              </Link>
              <Link
                href="/solutions#universities"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <BookOpen className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                University Partners
              </Link>
              <Link
                href="/solutions#employers"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Briefcase className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Employer Solutions
              </Link>
              <Link
                href="/solutions#investors"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Investor Portal
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Zap className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                All Features
              </Link>
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Resources</h3>
            </div>
            <div className="space-y-3 pt-2">
              <Link
                href="/contact"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Mail className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Contact Support
              </Link>
              <Link
                href="/terms"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Shield className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Shield className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Privacy Policy
              </Link>
              <Link
                href="/auth"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Users className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Login / Sign Up
              </Link>
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Connect</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Join our community and stay updated with the latest news and updates.
            </p>
            <div className="space-y-3 pt-2">
              <Link
                href="mailto:support@careertodo.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Mail className="h-4 w-4" />
                <span>support@careertodo.com</span>
              </Link>
              <div className="pt-2">
                <p className="text-xs font-medium text-muted-foreground mb-3">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} CareerToDo Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
