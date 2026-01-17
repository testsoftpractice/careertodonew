'use client'

import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Redirecting to governance page...
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="w-3 h-3 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500/10 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-blue-500/10 rounded-full animate-pulse delay-200"></div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-8">
          If you're not redirected automatically, <a href="/admin/governance" className="text-primary hover:underline">click here</a>.
        </p>
      </div>
    </div>
  )
}
