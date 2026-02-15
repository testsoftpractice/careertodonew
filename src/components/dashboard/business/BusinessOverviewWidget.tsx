'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, FolderKanban, Briefcase, Calendar, MapPin, Globe, Shield } from 'lucide-react'

interface BusinessOverviewWidgetProps {
  business: {
    id: string
    name: string
    description?: string
    industry?: string
    location?: string
    website?: string
    size?: string
    status: string
    verifiedAt?: string | Date
    createdAt: string | Date
    myRole?: string
    _count?: {
      members: number
      projects: number
      jobs: number
    }
  }
}

export function BusinessOverviewWidget({ business }: BusinessOverviewWidgetProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20'
      case 'UNDER_REVIEW':
        return 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20'
      case 'REJECTED':
        return 'bg-red-500/10 text-red-700 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20'
    }
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          Business Overview
        </CardTitle>
        {business.myRole && (
          <Badge variant="outline" className="ml-2">
            {business.myRole}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Business Name & Status */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold">{business.name}</h3>
            {business.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {business.description}
              </p>
            )}
          </div>
          <Badge className={getStatusColor(business.status)}>
            {business.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <Users className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-2xl font-bold">{business._count?.members || 0}</span>
            <span className="text-xs text-muted-foreground">Members</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <FolderKanban className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-2xl font-bold">{business._count?.projects || 0}</span>
            <span className="text-xs text-muted-foreground">Projects</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <Briefcase className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-2xl font-bold">{business._count?.jobs || 0}</span>
            <span className="text-xs text-muted-foreground">Jobs</span>
          </div>
        </div>

        {/* Business Details */}
        <div className="space-y-3">
          {business.industry && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Industry:</span>
              <span className="text-muted-foreground">{business.industry}</span>
            </div>
          )}
          {business.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Location:</span>
              <span className="text-muted-foreground">{business.location}</span>
            </div>
          )}
          {business.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Website:</span>
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {business.website}
              </a>
            </div>
          )}
          {business.size && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Size:</span>
              <span className="text-muted-foreground">{business.size}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Created:</span>
            <span className="text-muted-foreground">{formatDate(business.createdAt)}</span>
          </div>
          {business.status === 'VERIFIED' && business.verifiedAt && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-700">Verified:</span>
              <span className="text-green-700">{formatDate(business.verifiedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
