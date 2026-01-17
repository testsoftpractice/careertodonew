'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, CheckCircle2, Upload, Users } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

export default function AssignTaskPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [assigneeId, setAssigneeId] = useState('')
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!params.id) return
      
      try {
        setLoadingMembers(true)
        const response = await fetch(`/api/projects/${params.id}/members`)
        const data = await response.json()
        
        if (data.success) {
          setTeamMembers(data.data || [])
        }
      } catch (error) {
        console.error('Fetch team members error:', error)
        toast({ title: 'Error', description: 'Failed to fetch team members', variant: 'destructive' })
      } finally {
        setLoadingMembers(false)
      }
    }

    fetchTeamMembers()
  }, [params.id])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!assigneeId) {
      toast({ title: 'Error', description: 'Please select a team member', variant: 'destructive' })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/tasks/${params.taskId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assigneeId }),
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: 'Task assigned successfully!' })
        router.push(`/projects/${params.id}/tasks`)
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to assign task', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Assign task error:', error)
      toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/projects/${params.id}/tasks`} className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold text-xl">Assign Task</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Assign Task to Team Member</CardTitle>
            <CardDescription>
              Choose a team member to assign this task. The member will receive an in-app notification and email alert.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingMembers ? (
              <div className="animate-pulse text-center py-8">
                <div className="h-12 w-12 border-4 border-t-blue-500 border-r-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Loading team members...</p>
              </div>
            ) : teamMembers.length > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assignee">Select Team Member</Label>
                  <Select value={assigneeId} onValueChange={setAssigneeId} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                              {member.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-medium">{member.user?.name || 'Unknown'}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.user?.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Assigning this task will notify the team member and mark it as "Pending" status.
                    They will be able to view the task in their project dashboard.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/projects/${params.id}/tasks`)}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !assigneeId}
                    className="flex-1"
                  >
                    {loading ? 'Assigning...' : 'Assign Task'}
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  There are no team members in this project yet. You need to add team members before you can assign tasks.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/projects/${params.id}`)}
                    disabled={loading}
                    className="flex-1"
                  >
                    Back to Project
                  </Button>
                  <Button
                    variant="default"
                    asChild
                    className="flex-1"
                  >
                    <Link href={`/projects/${params.id}/team`}>
                      Manage Team
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
