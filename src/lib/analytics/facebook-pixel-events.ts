import { trackFacebookEvent, trackFacebookCustomEvent } from '@/components/analytics/facebook-pixel'

/**
 * Facebook Pixel Event Tracking Utilities
 *
 * Usage:
 * import { trackPurchase, trackSignup, trackViewContent } from '@/lib/analytics/facebook-pixel-events'
 *
 * Track events in your components:
 * trackPurchase({ value: 2999, currency: 'BDT' })
 */

// Standard Facebook Pixel Events
export const trackViewContent = (params?: {
  content_name?: string
  content_category?: string
  content_ids?: string[]
  value?: number
  currency?: string
}) => {
  trackFacebookEvent('ViewContent', params)
}

export const trackSearch = (params?: {
  search_string?: string
  content_category?: string
}) => {
  trackFacebookEvent('Search', params)
}

export const trackAddToCart = (params?: {
  content_name?: string
  content_category?: string
  content_ids?: string[]
  value?: number
  currency?: string
}) => {
  trackFacebookEvent('AddToCart', params)
}

export const trackAddToWishlist = (params?: {
  content_name?: string
  content_category?: string
  content_ids?: string[]
  value?: number
  currency?: string
}) => {
  trackFacebookEvent('AddToWishlist', params)
}

export const trackInitiateCheckout = (params?: {
  content_name?: string
  content_category?: string
  content_ids?: string[]
  value?: number
  currency?: string
  num_items?: number
}) => {
  trackFacebookEvent('InitiateCheckout', params)
}

export const trackAddPaymentInfo = (params?: {
  content_category?: string
  content_ids?: string[]
  value?: number
  currency?: string
}) => {
  trackFacebookEvent('AddPaymentInfo', params)
}

export const trackPurchase = (params: {
  value: number
  currency: string
  content_name?: string
  content_ids?: string[]
  num_items?: number
}) => {
  trackFacebookEvent('Purchase', params)
}

export const trackLead = (params?: {
  content_name?: string
  content_category?: string
  value?: number
  currency?: string
}) => {
  trackFacebookEvent('Lead', params)
}

export const trackCompleteRegistration = (params?: {
  content_name?: string
  status?: string
  value?: number
  currency?: string
}) => {
  trackFacebookEvent('CompleteRegistration', params)
}

export const trackLogin = () => {
  trackFacebookEvent('Login', {})
}

// Custom Events for CareerTodo
export const trackUserSignup = (role?: string) => {
  trackFacebookCustomEvent('UserSignup', {
    role,
    timestamp: new Date().toISOString(),
  })
}

export const trackPaymentSubmitted = (params: {
  userId: string
  transactionId: string
  value: number
  currency: string
}) => {
  trackFacebookCustomEvent('PaymentSubmitted', {
    ...params,
    timestamp: new Date().toISOString(),
  })
}

export const trackPaymentVerified = (params: {
  userId: string
  transactionId: string
  value: number
  currency: string
}) => {
  trackFacebookCustomEvent('PaymentVerified', {
    ...params,
    timestamp: new Date().toISOString(),
  })
}

export const trackProjectCreated = (params: {
  userId: string
  projectId: string
  category?: string
}) => {
  trackFacebookCustomEvent('ProjectCreated', {
    ...params,
    timestamp: new Date().toISOString(),
  })
}

export const trackJobApplied = (params: {
  userId: string
  jobId: string
  jobTitle?: string
}) => {
  trackFacebookCustomEvent('JobApplied', {
    ...params,
    timestamp: new Date().toISOString(),
  })
}

export const trackDashboardVisit = (params: {
  userId: string
  userRole: string
  dashboardType: string
}) => {
  trackFacebookCustomEvent('DashboardVisit', {
    ...params,
    timestamp: new Date().toISOString(),
  })
}
