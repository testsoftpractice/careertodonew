'use client'

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Shield, CheckCircle2, Clock, XCircle } from 'lucide-react'

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED'

interface VerificationGateProps {
  user: {
    verificationStatus: VerificationStatus
  } | null
  children: React.ReactNode
  fallback?: React.ReactNode
  showBadge?: boolean
  restrictActions?: boolean
  customMessage?: string
}

export function VerificationGate({
  user,
  children,
  fallback = null,
  showBadge = true,
  restrictActions = true,
  customMessage,
}: VerificationGateProps) {
  const isVerified = user?.verificationStatus === 'VERIFIED'

  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          variant: 'default' as const,
          title: 'Account Pending Verification',
          description: customMessage || 'Your account is pending verification. Please complete verification process.',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
        }
      case 'UNDER_REVIEW':
        return {
          icon: Shield,
          variant: 'default' as const,
          title: 'Account Under Review',
          description: customMessage || 'Your account is under review by our team. This process typically takes 1-3 business days.',
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
        }
      case 'VERIFIED':
        return {
          icon: CheckCircle2,
          variant: 'default' as const,
          title: 'Account Verified',
          description: customMessage || 'Your account is verified. You have full access to all features.',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900',
        }
      case 'REJECTED':
        return {
          icon: XCircle,
          variant: 'destructive' as const,
          title: 'Verification Rejected',
          description: customMessage || 'Your verification was rejected. Please update your information and re-apply.',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
        }
      default:
        return {
          icon: Clock,
          variant: 'default' as const,
          title: 'Account Verification',
          description: customMessage || 'Please complete your verification process.',
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
        }
    }
  }

  const statusConfig = user ? getStatusConfig(user.verificationStatus) : null
  const StatusIcon = statusConfig?.icon

  // Early return if user is null or statusConfig is null
  if (!user || !statusConfig) {
    return <div className={`transition-opacity duration-300 ${restrictActions ? 'opacity-50 pointer-events-none' : ''}`}>
      {fallback || children}
    </div>
  }

  // If restrictActions is true and user is not verified, show dashboard with opacity + alert on top
  if (restrictActions && !isVerified) {
    return (
      <div className="space-y-4">
        <Alert className={statusConfig.bgColor} variant="outline">
          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
          <AlertTitle className={statusConfig.color}>{statusConfig.title}</AlertTitle>
          <AlertDescription>{statusConfig.description}</AlertDescription>
        </Alert>
        <div className={`transition-opacity duration-300 opacity-50 pointer-events-none`}>
          {children}
        </div>
      </div>
    )
  }

  // If restrictActions is false and user is not verified, show status + children normally
  if (!restrictActions && !isVerified) {
    return (
      <div className="space-y-4">
        {showBadge && (
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
            <span className="text-sm font-medium text-muted-foreground">{statusConfig.title}</span>
          </div>
        )}
        <Alert className={statusConfig.bgColor} variant="outline">
          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
          <AlertTitle>{statusConfig.title}</AlertTitle>
          <AlertDescription>{statusConfig.description}</AlertDescription>
        </Alert>
        {children}
      </div>
    )
  }

  // User is verified, show children normally
  return <div className={`transition-opacity duration-300`}>
    {fallback || children}
  </div>
}
