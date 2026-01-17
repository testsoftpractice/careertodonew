'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  GraduationCap,
  Building2,
  Briefcase,
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  Star,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface StudentLeaderboard {
  rank: number
  id: string
  name: string
  university: string
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
  name: string
  code: string
  students: number
  projects: number
  score: number
}

interface ProjectLeaderboard {
  rank: number
  name: string
  university: string
  category: string
  score: number
  teamSize: number
  completion: number
}

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState('students')
  const [timePeriod, setTimePeriod] = useState('all-time')
  const [loading, setLoading] = useState(true)

  const [studentLeaderboard, setStudentLeaderboard] = useState<StudentLeaderboard[]>([])
  const [universityLeaderboard, setUniversityLeaderboard] = useState<UniversityLeaderboard[]>([])
  const [projectLeaderboard, setProjectLeaderboard] = useState<ProjectLeaderboard[]>([])

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        setLoading(true)

        // Fetch student leaderboard
        const studentRes = await fetch('/api/leaderboards?category=students&limit=50')
        const studentData = await studentRes.json()
        if (studentData.success) {
          setStudentLeaderboard(studentData.data.users || [])
        }

        // Fetch university leaderboard (using same API with category filter)
        const universityRes = await fetch('/api/leaderboards?category=universities&limit=50')
        const universityData = await universityRes.json()
        if (universityData.success) {
          setUniversityLeaderboard(universityData.data.users || [])
        }

        // For projects, we'll use the projects API and sort by reputation
        const projectsRes = await fetch('/api/projects')
        const projectsData = await projectsRes.json()
        if (projectsData.success) {
          const projects = (projectsData.data?.projects || [])
            .sort((a: any, b: any) => (b.teamReputation || 0) - (a.teamReputation || 0))
            .slice(0, 10)
            .map((p: any, index: number) => ({
              rank: index + 1,
              name: p.title || 'Untitled Project',
              university: p.university?.name || 'Unknown',
              category: p.category || 'General',
              score: p.teamReputation || 0,
              teamSize: p.teamSize || 0,
              completion: p.status === 'COMPLETED' ? 100 : p.status === 'IN_PROGRESS' ? 50 : 0,
            }))
          setProjectLeaderboard(projects)
        }
      } catch (error) {
        console.error('Fetch leaderboards error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch leaderboard data',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboards()
  }, [timePeriod])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Leaderboards</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Period:</span>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="rounded-md border px-3 py-1.5 text-sm"
                >
                  <option value="all-time">All Time</option>
                  <option value="monthly">This Month</option>
                  <option value="weekly">This Week</option>
                </select>
              </div>
              <Button variant="outline" size="sm" disabled>
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Platform Rankings</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track top performers across students, universities, and projects based on execution, collaboration, and real-world impact
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="students" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="universities" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Universities
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Projects
              </TabsTrigger>
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Top Students</h2>
                  <p className="text-muted-foreground">Ranked by multi-dimensional reputation scores</p>
                </div>
              </div>

              {/* Top 3 Podium */}
              {studentLeaderboard.slice(0, 3).length > 0 && (
                <div className="grid gap-6 md:grid-cols-3">
                  {studentLeaderboard.slice(0, 3).map((student) => (
                    <Card
                      key={student.id}
                      className={`relative overflow-hidden ${
                        student.rank === 1 ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-background' :
                        student.rank === 2 ? 'border-gray-400 bg-gradient-to-br from-gray-400/10 to-background' :
                        student.rank === 3 ? 'border-amber-600 bg-gradient-to-br from-amber-600/10 to-background' :
                        ''
                      }`}
                    >
                      {student.rank === 1 && (
                        <div className="absolute top-0 right-0">
                          <Trophy className="h-12 w-12 text-yellow-500" />
                        </div>
                      )}
                      <CardHeader className="text-center pb-4">
                        <Avatar className="h-24 w-24 mx-auto mb-4 border-4">
                          <AvatarFallback className="text-2xl">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Badge className="text-lg px-3 py-1">
                            #{student.rank}
                          </Badge>
                          {getRankIcon(student.rank)}
                        </div>
                        <CardTitle className="text-xl">{student.name}</CardTitle>
                        <CardDescription>
                          {student.university}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-1 text-3xl font-bold">
                          <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                          {student.overallReputation.toFixed(1)}
                        </div>
                        <div className="flex justify-center gap-6 text-sm">
                          <div>
                            <div className="font-medium">{student.projectCount}</div>
                            <div className="text-muted-foreground">Projects</div>
                          </div>
                          <div>
                            <div className="font-medium">Top Performer</div>
                            <div className="text-muted-foreground">Level</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Full Ranking Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Reputation</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentLeaderboard.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${
                                student.rank <= 3 ? 'text-primary' : ''
                              }`}>
                                #{student.rank}
                              </span>
                              {getRankIcon(student.rank)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{student.university}</TableCell>
                          <TableCell>{student.projectCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-bold">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {student.overallReputation.toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {studentLeaderboard.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No students ranked yet. Be the first to build your reputation!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Universities Tab */}
            <TabsContent value="universities" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Top Universities</h2>
                  <p className="text-muted-foreground">Ranked by student outcomes and execution</p>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      University Rankings
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">Based on average student reputation</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Rank</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Avg Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {universityLeaderboard.map((uni) => (
                        <TableRow key={uni.rank}>
                          <TableCell>
                            <div className={`flex items-center gap-2 text-lg font-bold ${
                              uni.rank <= 3 ? 'text-primary' : ''
                            }`}>
                              #{uni.rank}
                              {getRankIcon(uni.rank)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{uni.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{uni.code}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {uni.students}
                            </div>
                          </TableCell>
                          <TableCell>{uni.projects}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-bold">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {uni.score.toFixed(1)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {universityLeaderboard.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No universities ranked yet. Students need to join projects first!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Top Projects</h2>
                  <p className="text-muted-foreground">Ranked by team reputation and execution</p>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Project Rankings
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">Based on team reputation scores</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Rank</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectLeaderboard.map((project) => (
                        <TableRow key={project.rank}>
                          <TableCell>
                            <div className={`flex items-center gap-2 text-lg font-bold ${
                              project.rank <= 3 ? 'text-primary' : ''
                            }`}>
                              #{project.rank}
                              {getRankIcon(project.rank)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{project.university}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{project.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {project.teamSize}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-bold">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {project.score.toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href="/projects">
                                View <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {projectLeaderboard.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No projects ranked yet. Start a project to build your team reputation!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
