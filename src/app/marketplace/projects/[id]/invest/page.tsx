'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function MarketInvestmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [investing, setInvesting] = useState(false)
  const [amount, setAmount] = useState('')
  const [equity, setEquity] = useState('')
  const [terms, setTerms] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      if (!user || !params.id) return

      try {
        setLoading(true)
        const response = await fetch(`/api/projects/${params.id}`)
        const data = await response.json()

        if (data.success) {
          setProject(data.data)
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to load project details',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Fetch project error:', error)
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [user, resolvedParams.id])

  const handleInvest = async () => {
    if (!user || !project) return

    try {
      setInvesting(true)
      const response = await fetch('/api/investments/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          projectId: project.id,
          investorId: user.id,
          investmentType: 'EQUITY',
          amount: parseFloat(amount) || 0,
          equity: parseFloat(equity) || 0,
          terms,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Investment interest submitted successfully!',
        })
        // Redirect to success page
        setTimeout(() => {
          window.location.href = `/invest-success?project=${project.id}`
        }, 1000)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit investment interest',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Submit investment error:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit investment interest',
        variant: 'destructive',
      })
    } finally {
      setInvesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Invest in Project</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/marketplace">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Back to Marketplace</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {loading ? (
            <div className="animate-pulse text-center py-8 sm:py-12">
              <div className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-t-green-500 border-r-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading project details...</p>
            </div>
          ) : project ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle className="text-base sm:text-lg md:text-xl truncate">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {project.category} • Seeking {project.seekingInvestment ? '$' + (project.investmentGoal || 'N/A') : 'Contributors'}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className="text-xs w-fit"
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">Description</div>
                    <div className="text-sm sm:text-base line-clamp-3">
                      {project.description}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm text-muted-foreground">Team Size</div>
                      <div className="text-2xl sm:text-3xl font-bold">
                        {project.teamSize || 0}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm text-muted-foreground">Completion</div>
                      <div className="text-2xl sm:text-3xl font-bold">
                        {project.completionRate || 0}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm text-muted-foreground">Project Lead</div>
                      <div className="text-sm sm:text-base font-medium truncate">
                        {project.projectLead?.name || 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {project.investmentGoal && (
                    <div className="p-4 sm:p-6 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                        <div>
                          <div className="text-base sm:text-lg font-semibold">
                            {project.investmentGoal.toLocaleString()}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Investment Goal
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                            {project.investmentRaised ? (
                              <>
                                ${project.investmentRaised.toLocaleString()} raised
                              </>
                            ) : 'No investments yet'}
                          </div>
                          <div className="text-sm sm:text-base font-semibold text-green-600">
                            {project.investmentGoal
                              ? Math.round((project.investmentRaised || 0) / project.investmentGoal * 100)
                              : 0}% raised
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Remaining</div>
                          <div className="text-sm sm:text-lg font-semibold">
                            {project.investmentGoal && project.investmentRaised
                              ? (project.investmentGoal - project.investmentRaised).toLocaleString()
                              : project.investmentGoal?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg md:text-xl">Express Investment Interest</CardTitle>
                  <CardDescription>
                    Submit your investment proposal for this project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleInvest(); }}>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm sm:text-base font-medium block mb-1 sm:mb-2">
                          Investment Amount ($)
                        </label>
                        <input
                          id="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter investment amount"
                          className="w-full px-3 py-2 sm:py-3 border rounded-md text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="equity" className="text-sm sm:text-base font-medium block mb-1 sm:mb-2">
                          Equity Percentage (%)
                        </label>
                        <input
                          id="equity"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={equity}
                          onChange={(e) => setEquity(e.target.value)}
                          placeholder="Enter equity percentage"
                          className="w-full px-3 py-2 sm:py-3 border rounded-md text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="terms" className="text-sm sm:text-base font-medium block mb-1 sm:mb-2">
                        Investment Terms
                      </label>
                      <textarea
                        id="terms"
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                        placeholder="Describe your investment terms, conditions, and expectations..."
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md text-sm sm:text-base resize-none"
                        required
                      />
                    </div>

                    <div className="pt-4 sm:pt-6 border-t space-y-3 sm:space-y-4">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-3">
                        By submitting this investment interest, you agree to platform's terms of service.
                        Your investment proposal will be reviewed by the project team.
                      </div>

                      <div className="flex gap-3 sm:gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 text-sm sm:text-base"
                          onClick={() => window.history.back()}
                          disabled={investing}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 text-sm sm:text-base"
                          disabled={investing || !amount || !equity}
                        >
                          {investing ? (
                            <>
                              <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Submit Proposal
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Project Team</CardTitle>
                  <CardDescription>Key team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm sm:text-base">
                          {project.projectLead?.name || 'Unknown'}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Project Lead • {project.projectLead?.university?.name || 'Unknown University'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full text-sm sm:text-base" variant="outline" asChild>
                      <Link href={`/projects/${project.id}`}>
                        View Full Project Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <DollarSign className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Project Not Found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  The project you're looking for doesn't exist or has been removed.
                </p>
                <Button variant="outline" className="text-sm sm:text-base" asChild>
                  <Link href="/marketplace">
                    Back to Marketplace
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
