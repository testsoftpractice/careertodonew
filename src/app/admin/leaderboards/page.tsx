'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  GraduationCap,
  Building2,
  TrendingUp,
  Loader2,
  Download,
  RefreshCw,
  Star,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface StudentLeaderboard {
  rank: number
  id: string
  name: string
  email: string
  university: string
  major: string
  overallReputation: number
  breakdown: {
    execution: number
    collaboration: number
    leadership: number
    ethics: number
    reliability: number
  }
  projectCount: number
}

interface UniversityLeaderboard {
  rank: number
  id: string
  name: string
  code: string
  description?: string
  totalStudents: number
  totalReputation: number
  avgReputation: number
  totalProjects: number
}

export default function AdminLeaderboardsPage() {
  const [activeTab, setActiveTab] = useState('students')
  const [loading, setLoading] = useState(true)

  const [studentLeaderboard, setStudentLeaderboard] = useState<StudentLeaderboard[]>([])
  const [universityLeaderboard, setUniversityLeaderboard] = useState<UniversityLeaderboard[]>([])

  // Fetch student leaderboard
  useEffect(() => {
    if (activeTab === 'students') {
      const fetchStudentLeaderboard = async () => {
        try {
          setLoading(true)
          const response = await fetch('/api/leaderboards?category=students&limit=100')
          const data = await response.json()
          if (data.success) {
            setStudentLeaderboard(data.data?.users || [])
          }
        } catch (error) {
          console.error('Fetch student leaderboard error:', error)
          toast({
            title: 'Error',
            description: 'Failed to fetch student leaderboard',
            variant: 'destructive'
          })
        } finally {
          setLoading(false)
        }
      }

      fetchStudentLeaderboard()
    }
  }, [activeTab])

  // Fetch university leaderboard
  useEffect(() => {
    if (activeTab === 'universities') {
      const fetchUniversityLeaderboard = async () => {
        try {
          setLoading(true)
          const response = await fetch('/api/leaderboards/universities?limit=100')
          const data = await response.json()
          if (data.success) {
            setUniversityLeaderboard(data.data?.universities || [])
          }
        } catch (error) {
          console.error('Fetch university leaderboard error:', error)
          toast({
            title: 'Error',
            description: 'Failed to fetch university leaderboard',
            variant: 'destructive'
          })
        } finally {
          setLoading(false)
        }
      }

      fetchUniversityLeaderboard()
    }
  }, [activeTab])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return null
  }

  const getReputationBadge = (score: number) => {
    if (score >= 100) return <Badge className="bg-purple-500">Elite</Badge>
    if (score >= 75) return <Badge className="bg-blue-500">Excellent</Badge>
    if (score >= 50) return <Badge className="bg-green-500">Good</Badge>
    if (score >= 25) return <Badge className="bg-yellow-500">Average</Badge>
    return <Badge variant="secondary">Developing</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Back to Admin Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold">Admin Leaderboards</h1>
                <p className="text-sm text-muted-foreground">Monitor platform rankings and performance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/leaderboards">
                  <Download className="h-4 w-4 mr-2" />
                  Public View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students Ranked</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentLeaderboard.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active in rankings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Universities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{universityLeaderboard.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Represented on platform</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentLeaderboard.length > 0 ? studentLeaderboard[0].overallReputation.toFixed(1) : '0'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Highest reputation score</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="students" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="universities" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Universities
              </TabsTrigger>
            </TabsList>

            {/* Students Leaderboard */}
            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Rankings</CardTitle>
                  <CardDescription>Students ranked by total points and multi-dimensional performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {studentLeaderboard.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No students ranked yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Top 3 */}
                      {studentLeaderboard.slice(0, 3).length > 0 && (
                        <div className="grid gap-4 md:grid-cols-3 mb-6">
                          {studentLeaderboard.slice(0, 3).map((student) => (
                            <Card
                              key={student.id}
                              className={`relative overflow-hidden border-2 ${
                                student.rank === 1 ? 'border-yellow-500 bg-yellow-500/5' :
                                student.rank === 2 ? 'border-gray-400 bg-gray-400/5' :
                                student.rank === 3 ? 'border-amber-600 bg-amber-600/5' :
                                ''
                              }`}
                            >
                              <CardContent className="p-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                  <Badge className="text-lg px-4 py-1">
                                    #{student.rank}
                                  </Badge>
                                  {getRankIcon(student.rank)}
                                </div>
                                <Avatar className="h-20 w-20 mx-auto mb-3 border-4">
                                  <AvatarFallback className="text-2xl">
                                    {student.name?.split(' ').map(n => n[0]).join('') || 'S'}
                                  </AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-bold mb-1">{student.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{student.university}</p>
                                <div className="flex items-center justify-center gap-1 text-2xl font-bold mb-2">
                                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                                  {student.overallReputation.toFixed(1)}
                                </div>
                                {getReputationBadge(student.overallReputation)}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Full List */}
                      <div className="space-y-2">
                        {studentLeaderboard.slice(3).map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 text-center">
                                <span className={`text-lg font-bold ${
                                  student.rank <= 3 ? 'text-primary' : ''
                                }`}>
                                  #{student.rank}
                                </span>
                              </div>
                              <Avatar>
                                <AvatarFallback>
                                  {student.name?.split(' ').map(n => n[0]).join('') || 'S'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.university}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {getReputationBadge(student.overallReputation)}
                              <div className="text-right">
                                <div className="flex items-center gap-1 font-bold">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  {student.overallReputation.toFixed(1)}
                                </div>
                                <div className="text-xs text-muted-foreground">{student.projectCount} projects</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Universities Leaderboard */}
            <TabsContent value="universities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>University Rankings</CardTitle>
                  <CardDescription>Universities ranked by average student performance and total impact</CardDescription>
                </CardHeader>
                <CardContent>
                  {universityLeaderboard.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No universities ranked yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {universityLeaderboard.map((uni) => (
                        <div key={uni.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 text-center">
                              <span className={`text-lg font-bold ${
                                uni.rank <= 3 ? 'text-primary' : ''
                              }`}>
                                #{uni.rank}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{uni.name}</div>
                              <div className="text-sm text-muted-foreground">
                                <Badge variant="outline">{uni.code}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="flex items-center gap-1 justify-center font-bold">
                                <Star className="h-4 w-4 text-yellow-500" />
                                {uni.avgReputation.toFixed(1)}
                              </div>
                              <div className="text-xs text-muted-foreground">Avg Score</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold">{uni.totalStudents}</div>
                              <div className="text-xs text-muted-foreground">Students</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold">{uni.totalProjects}</div>
                              <div className="text-xs text-muted-foreground">Projects</div>
                            </div>
                            {getRankIcon(uni.rank)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
