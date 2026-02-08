'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Target,
  GraduationCap,
  CheckCircle2,
  Clock,
  Filter,
  ArrowUp,
  ArrowDown,
  Medal,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { authFetch } from '@/lib/api-response'

export default function UniversityPerformanceDashboard() {
  const { user } = useAuth()

  // Role-based access control
  useRoleAccess(['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN', 'INVESTOR'])

  const [loading, setLoading] = useState(true)
  const [universities, setUniversities] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [sortField, setSortField] = useState('rankingScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchUniversityPerformance()
  }, [])

  const fetchUniversityPerformance = async () => {
    setLoading(true)
    try {
      const response = await authFetch('/api/dashboard/university/performance')
      const data = await response.json()

      if (data.success) {
        setUniversities(data.data)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch university performance',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch university performance error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch university performance',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getRankingBadge = (position: number) => {
    if (position === 1) return <Badge className="bg-yellow-500 text-yellow-950"><Medal className="w-3 h-3 mr-1" />1st</Badge>
    if (position === 2) return <Badge variant="secondary">2nd</Badge>
    if (position === 3) return <Badge variant="outline">3rd</Badge>
    return <Badge variant="outline">{position}th</Badge>
  }

  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <ArrowUp className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDown className="w-4 h-4 text-red-500" />
    )
  }

  const sortedUniversities = [...universities].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1
    return (b[sortField] - a[sortField]) * multiplier
  })

  const overallStats = {
    totalUniversities: universities.length,
    totalStudents: universities.reduce((sum, u) => sum + (u.totalStudents || 0), 0),
    totalProjects: universities.reduce((sum, u) => sum + (u.totalProjects || 0), 0),
    totalMilestones: universities.reduce((sum, u) => sum + (u.totalMilestones || 0), 0),
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold">University Performance</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard/university">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">My University</span>
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
          {/* Overview Stats */}
          {activeTab === 'overview' && (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Universities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{overallStats.totalUniversities}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{overallStats.totalStudents.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{overallStats.totalProjects}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Milestones Achieved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{overallStats.totalMilestones}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rankings">Rankings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                    <div className="col-span-full text-center py-12">
                      <Clock className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  ) : sortedUniversities.slice(0, 6).map((university, index) => (
                    <motion.div
                      key={university.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {university.logo ? (
                                <img src={university.logo} alt={university.name} className="h-10 w-10 rounded-full object-cover" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <GraduationCap className="w-5 h-5 text-primary" />
                                </div>
                              )}
                              <div>
                                <CardTitle className="text-base">{university.name}</CardTitle>
                                <CardDescription className="text-xs">{university.location || 'No location'}</CardDescription>
                              </div>
                            </div>
                            {getRankingBadge(university.rankingPosition)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Students</div>
                              <div className="text-lg font-semibold">{university.totalStudents}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Avg Rep</div>
                              <div className="text-lg font-semibold">{university.avgReputation.toFixed(1)}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Avg Points</div>
                              <div className="text-lg font-semibold">{university.avgPoints.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Projects</div>
                              <div className="text-lg font-semibold">{university.totalProjects}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Active</div>
                              <div className="text-lg font-semibold">{university.activeProjects}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Completed</div>
                              <div className="text-lg font-semibold">{university.completedProjects}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rankings" className="mt-6">
                <div className="space-y-4">
                  {/* Sort Controls */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium">Sort by:</span>
                    <select
                      value={sortField}
                      onChange={(e) => setSortField(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="rankingScore">Overall Score</option>
                      <option value="totalStudents">Total Students</option>
                      <option value="totalProjects">Total Projects</option>
                      <option value="avgReputation">Avg Reputation</option>
                      <option value="avgPoints">Avg Points</option>
                    </select>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>

                  {/* Rankings Table */}
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-10">Rank</TableHead>
                            <TableHead>University</TableHead>
                            <TableHead>Students</TableHead>
                            <TableHead>Avg Rep</TableHead>
                            <TableHead>Avg Pts</TableHead>
                            <TableHead>Projects</TableHead>
                            <TableHead>Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                <Clock className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                              </TableCell>
                            </TableRow>
                          ) : sortedUniversities.map((university) => (
                            <TableRow key={university.id}>
                              <TableCell>
                                {getRankingBadge(university.rankingPosition)}
                              </TableCell>
                              <TableCell>{university.totalStudents}</TableCell>
                              <TableCell>{university.avgReputation.toFixed(2)}</TableCell>
                              <TableCell>{university.avgPoints.toLocaleString()}</TableCell>
                              <TableCell>{university.totalProjects}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={Math.min(100, university.rankingScore)} className="w-24" />
                                  <span className="text-sm font-semibold ml-2">{university.rankingScore.toFixed(0)}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  )
}
