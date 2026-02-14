'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  TrendingUp,
  Shield,
  Briefcase,
  GraduationCap,
  Star,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'

export default function CoFounderDiscoveryPage() {
  const { user } = useAuth()

  // Role-based access control
  useRoleAccess(['STUDENT', 'MENTOR', 'PLATFORM_ADMIN'])

  const [loading, setLoading] = useState(true)
  const [coFounders, setCoFounders] = useState<any[]>([])
  const [filters, setFilters] = useState({
    search: '',
    university: '',
    minReputation: 0,
    skills: '',
  })

  useEffect(() => {
    fetchCoFounders()
  }, [filters])

  const fetchCoFounders = async () => {
    if (!user) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: 'cofounders',
        userId: user.id,
        limit: '20',
      })

      const response = await fetch(`/api/collaborations?${params}`)
      const data = await response.json()

      if (data.success) {
        setCoFounders(data.data)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch potential co-founders',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch co-founders error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch potential co-founders',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const sendCollaborationRequest = async (recipientId: string, recipientName: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: user.id,
          recipientId,
          type: 'CO_FOUNDER',
          message: `Hi ${recipientName}, I'd like to discuss a potential co-founder opportunity.`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Request Sent',
          description: `Collaboration request sent to ${recipientName}`,
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to send request',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Send collaboration request error:', error)
      toast({
        title: 'Error',
        description: 'Failed to send request',
        variant: 'destructive',
      })
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-blue-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold">Find Co-Founders</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard/student">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/">Home</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
              <CardDescription>Find co-founders based on skills, reputation, and university</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or skill..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">University</label>
                  <Select value={filters.university} onValueChange={(value) => setFilters({ ...filters, university: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All universities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="same">My university</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Reputation</label>
                  <Select value={filters.minReputation.toString()} onValueChange={(value) => setFilters({ ...filters, minReputation: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All levels</SelectItem>
                      <SelectItem value="2">2+ stars</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills</label>
                  <Input
                    placeholder="Filter by skills..."
                    value={filters.skills}
                    onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Searching for potential co-founders...</p>
            </div>
          ) : coFounders.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No co-founders found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {coFounders.map((coFounder, index) => (
                <motion.div
                  key={coFounder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Match Score */}
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="text-xs">
                          Match Score
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">{coFounder.matchScore}%</div>
                          <div className={`w-3 h-3 rounded-full ${getMatchColor(coFounder.matchScore)}`} />
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage src={coFounder.avatar} />
                          <AvatarFallback>
                            {coFounder.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">{coFounder.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {coFounder.bio || 'No bio available'}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              {coFounder.university?.name || 'No university'}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {coFounder.role}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Reputation */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">Reputation</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Exec</div>
                            <div className="text-sm font-semibold">{coFounder.executionScore.toFixed(1)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Collab</div>
                            <div className="text-sm font-semibold">{coFounder.collaborationScore.toFixed(1)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Lead</div>
                            <div className="text-sm font-semibold">{coFounder.leadershipScore.toFixed(1)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Ethics</div>
                            <div className="text-sm font-semibold">{coFounder.ethicsScore.toFixed(1)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Reliab</div>
                            <div className="text-sm font-semibold">{coFounder.reliabilityScore.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {coFounder.skills?.slice(0, 4).map((skill: any) => (
                            <Badge key={skill.id} variant="secondary" className="text-xs">
                              {skill.name}
                            </Badge>
                          )) || []}
                          {coFounder.skills?.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{coFounder.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => sendCollaborationRequest(coFounder.id, coFounder.name)}
                          disabled={coFounder.hasPendingRequest}
                          className="flex-1"
                        >
                          {coFounder.hasPendingRequest ? 'Pending' : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Request
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/dashboard/student/profile?userId=${coFounder.id}`}>
                            View Profile
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
