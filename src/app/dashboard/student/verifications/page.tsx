'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, FileText, ArrowLeft, Bell, Filter, Plus, Info, CheckCircle2, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export default function StudentVerificationsPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/student" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Verification Requests</span>
            </Link>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/student">Settings</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">Verification Requests</h1>
              <p className="text-muted-foreground">Manage employer verification requests for your professional records</p>
            </div>
            <Badge variant="outline">0 requests</Badge>
          </div>

          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Verification Requests</h3>
              <p className="text-muted-foreground mb-6">
                {`You don't have any verification requests yet.`}
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/records/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Professional Record
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium mb-1">Verification Guidelines</div>
                <div className="text-sm text-muted-foreground">
                  Review before approving: Always review the employer&apos;s purpose and requested access duration before approving verification requests.
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link href="/dashboard/student" className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
