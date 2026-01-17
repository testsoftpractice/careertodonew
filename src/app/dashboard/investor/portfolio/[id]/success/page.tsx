'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, Wallet, FileText, Home, Bell, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function InvestmentSuccessPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard/investor/portfolio')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Card */}
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-24 w-24 mx-auto mb-6 text-green-500" />
            <h1 className="text-4xl font-bold mb-4 text-green-600">Interest Expressed!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your investment interest in this project
            </p>

            <div className="p-6 bg-white rounded-lg border text-left space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Investment Type</div>
                  <div className="font-semibold">Equity</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Investment Amount</div>
                  <div className="font-semibold text-green-600">$50,000</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Equity Stake</div>
                  <div className="font-semibold">5%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/marketplace">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Marketplace
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/dashboard/investor/portfolio">
                  <Wallet className="mr-2 h-4 w-4" />
                  View Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              What Happens Next?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-primary text-white rounded-full text-base font-bold shrink-0">1</div>
                <div>
                  <div className="font-medium">Project Team Review</div>
                  <div className="text-sm text-muted-foreground">The project team will review your investment expression and evaluate fit</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-primary text-white rounded-full text-base font-bold shrink-0">2</div>
                <div>
                  <div className="font-medium">Contact & Discussion</div>
                  <div className="text-sm text-muted-foreground">Expect to be contacted within 48-72 hours to discuss details</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-primary text-white rounded-full text-base font-bold shrink-0">3</div>
                <div>
                  <div className="font-medium">Agreement Preparation</div>
                  <div className="text-sm text-muted-foreground">Investment terms and agreements will be prepared for your review</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-primary text-white rounded-full text-base font-bold shrink-0">4</div>
                <div>
                  <div className="font-medium">Sign Agreement</div>
                  <div className="text-sm text-muted-foreground">Finalize investment by signing legal agreement and funding</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Bell className="h-6 w-6 text-purple-500 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold mb-1">Enable Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Stay updated on your investment status, agreement changes, and funding milestones by enabling notifications in your settings
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold mb-3">Quick Resources</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/investor/portfolio">
                  <Users className="mr-2 h-4 w-4" />
                  View All Investments
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/investor/analytics">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auto-redirect */}
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Redirecting to your portfolio in {countdown} seconds...
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(10 - countdown) * 10}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
