import { Mail, HelpCircle, BookOpen, FileText, Users, GraduationCap, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader title="Support" />

      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-6 text-center">
            How Can We Help?
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-12 text-center">
            We're here to help you succeed on the CareerToDo Platform.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {/* Email Support */}
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Email Support</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    For general inquiries, account assistance, or feedback about the platform.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    We typically respond to all email inquiries within 24-48 hours during business days.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">Email Support Team</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Documentation */}
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Documentation</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Browse our comprehensive documentation, guides, and self-help resources to find answers to common questions.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access FAQs, troubleshooting guides, and platform documentation.
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span className="font-medium">Browse Help Center</span>
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors w-full"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">View Documentation</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Getting Started</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    New to the platform? Learn how to make the most of all the features.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get started with your account and explore the platform's capabilities.
                  </p>
                  <Link
                    href="/auth"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors w-full"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Start Learning</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Additional Resources</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card text-card-foreground rounded-lg p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Tutorials & Guides
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to make the most of the platform with step-by-step tutorials and guides.
                </p>
                <Link
                  href="/"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Tutorials <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="bg-card text-card-foreground rounded-lg p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other users, share experiences, and get help from the community.
                </p>
                <Link
                  href="/contact"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Join Community <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
