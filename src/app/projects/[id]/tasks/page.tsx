'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { FileText, Calendar, User, Save, X, ArrowLeft, Plus, CheckCircle2, Bell, Filter } from 'lucide-react'

export default function ProjectTasksPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/student" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-bold text-xl">Back to Project</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Card className="max-w-md">
            <CardContent className="p-12">
              <FileText className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-xl font-bold mb-2">Task Management</h2>
              <p className="text-muted-foreground mb-6">
                Task management features have been temporarily moved. View tasks from the project dashboard.
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link href={`/projects/${params.id}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    View Project
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/student">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
