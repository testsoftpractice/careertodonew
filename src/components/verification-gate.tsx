'use client'

import { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Shield, Lock, CheckCircle2, Clock, XCircle } from 'lucide-react'

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'BANNED'

interface VerificationGateProps {
  user: {
    verificationStatus: VerificationStatus
    role: string
  } | null
  children: ReactNode
  fallback?: ReactNode
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
  const isUnverified = !isVerified && user?.verificationStatus !== 'BANNED'
  const isBanned = user?.verificationStatus === 'BANNED'

  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          variant: 'default' as const,
          title: 'Account Pending Verification',
          description: customMessage || 'Your account is pending verification. You can view the dashboard but actions are restricted until verified.',
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
          description: 'Your account is verified. You have full access to all features.',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900',
        }
      case 'REJECTED':
        return {
          icon: XCircle,
          variant: 'destructive' as const,
          title: 'Verification Rejected',
          description: customMessage || 'Your account verification was rejected. Please contact support for more information.',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
        }
      case 'BANNED':
        return {
          icon: Lock,
          variant: 'destructive' as const,
          title: 'Account Suspended',
          description: customMessage || 'Your account has been suspended. You cannot perform any actions. Please contact support.',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
        }
    }
  }

  const statusConfig = user ? getStatusConfig(user.verificationStatus) : null
  const StatusIcon = statusConfig?.icon

  if (isBanned && restrictActions) {
    return (
      <Alert className={statusConfig?.bgColor} variant="outline">
        <StatusIcon className={`h-4 w-4 ${statusConfig?.color}`} />
        <AlertTitle className={statusConfig?.color}>{statusConfig?.title}</AlertTitle>
        <AlertDescription>{statusConfig?.description}</AlertDescription>
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <a href="/contact">Contact Support</a>
          </Button>
        </div>
      </Alert>
    )
  }

  if (isUnverified && restrictActions) {
    return (
      <div className="space-y-4">
        {showBadge && statusConfig && (
          <Alert className={statusConfig.bgColor} variant="outline">
            <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
            <AlertTitle className={statusConfig.color}>{statusConfig.title}</AlertTitle>
            <AlertDescription>{statusConfig.description}</AlertDescription>
          </Alert>
        )}
        <div className={`transition-opacity duration-300 ${restrictActions ? 'opacity-50 pointer-events-none' : ''}`}>
          {fallback || children}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
