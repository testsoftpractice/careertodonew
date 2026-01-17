'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, CheckCircle2, Filter, Shield, Home } from 'lucide-react'

export default function EmployerVerificationRequestsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/employer" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Verification Requests</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Verification Requests</h1>
          <p className="text-muted-foreground">
            Manage your background check requests for candidates
          </p>

          <Card className="p-8 text-center">
            <CardContent className="p-8 space-y-4">
              <CheckCircle2 className="h-20 w-20 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-bold mb-2">Feature Simplified</h2>
              <p className="text-muted-foreground mb-6">
                The verification request management interface has been temporarily simplified for development.
              </p>

              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/dashboard/employer">
                    <Plus className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/marketplace">
                    <Filter className="mr-2 h-4 w-4" />
                    Browse Marketplace
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
