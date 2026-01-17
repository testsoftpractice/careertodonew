'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DollarSign,
  ArrowLeft,
  TrendingUp,
  Calendar,
  Target,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function InvestorPortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()
  const [investment, setInvestment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const resolvedParams = React.use(params)

  useEffect(() => {
    const fetchInvestment = async () => {
      if (!user || !resolvedParams.id) return

      try {
        setLoading(true)
        const response = await fetch(`/api/investments/${resolvedParams.id}`)
        const data = await response.json()

        if (data.success) {
          setInvestment(data.data)
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to load investment details',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Fetch investment error:', error)
        toast({
          title: 'Error',
          description: 'Failed to load investment details',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInvestment()
  }, [user, resolvedParams.id])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Investment Details</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/investor/portfolio">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Back to Portfolio</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="animate-pulse text-center py-8 sm:py-12">
              <div className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-t-green-500 border-r-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading investment details...</p>
            </div>
          ) : investment ? (
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle className="text-base sm:text-lg md:text-xl truncate">
                        {investment.projectName || 'Untitled Project'}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Invested on {new Date(investment.investedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={investment.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className="text-xs w-fit"
                    >
                      {investment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4">Investment Type</div>
                      <Badge variant="outline" className="text-base sm:text-lg w-full">
                        {investment.investmentType || 'EQUITY'}
                      </Badge>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4">Investment Amount</div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600 break-words">
                        ${investment.amount ? investment.amount.toLocaleString() : '$0'}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4">Equity Split</div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold break-words">
                        {investment.equitySplit || 0}%
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4">Projected Return</div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600 break-words">
                        {investment.projectedReturn ? investment.projectedReturn.toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 pt-4 sm:pt-6 border-t">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 break-words">
                        {investment.roi || 0}%
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">ROI</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-600 break-words">
                        {investment.duration || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Duration (Months)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold break-words">
                        {investment.riskLevel || 'Medium'}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Risk Level</div>
                    </div>
                  </div>

                  {investment.terms && (
                    <div className="space-y-2 pt-4 sm:pt-6 border-t">
                      <div className="text-sm sm:text-base font-medium mb-2">Terms & Conditions</div>
                      <div className="text-xs sm:text-sm text-muted-foreground space-y-2 bg-muted/30 p-4 rounded">
                        {typeof investment.terms === 'string' ? (
                          <p>{investment.terms}</p>
                        ) : (
                          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(JSON.parse(investment.terms), null, 2)}</pre>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Details about the project you invested in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs sm:text-sm text-muted-foreground">Project Name</div>
                    <div className="text-base sm:text-lg font-medium truncate">
                      {investment.projectName || 'N/A'}
                    </div>
                  </div>

                  {investment.projectDescription && (
                    <div className="space-y-2">
                      <div className="text-xs sm:text-sm text-muted-foreground">Description</div>
                      <div className="text-sm sm:text-base line-clamp-3">
                        {investment.projectDescription}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-sm text-muted-foreground">Team Size</div>
                      <div className="text-base sm:text-lg font-medium">
                        {investment.teamSize || 0} members
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-sm text-muted-foreground">Completion</div>
                      <div className="text-base sm:text-lg font-medium">
                        {investment.completionRate || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t">
                    <Button className="w-full text-sm sm:text-base" asChild>
                      <Link href={`/projects/${investment.projectId}`}>
                        <Target className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">View Project Details</span>
                        <span className="sm:hidden">View Project</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>Manage your investment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <Button variant="outline" className="text-sm sm:text-base" asChild>
                      <Link href={`/projects/${investment.projectId}`}>
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">View Agreement</span>
                        <span className="sm:hidden">Agreement</span>
                      </Link>
                    </Button>
                    <Button variant="default" className="text-sm sm:text-base" asChild>
                      <Link href="/dashboard/investor/portfolio">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">View All Investments</span>
                        <span className="sm:hidden">All Investments</span>
                      </Link>
                    </Button>
                  </div>

                  <div className="pt-4 sm:pt-6 border-t">
                    <div className="text-xs sm:text-sm text-muted-foreground text-center">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Investment made on {new Date(investment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <DollarSign className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Investment Not Found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  The investment you're looking for doesn't exist or has been removed.
                </p>
                <Button variant="outline" className="text-sm sm:text-base" asChild>
                  <Link href="/dashboard/investor/portfolio">
                    Back to Portfolio
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
