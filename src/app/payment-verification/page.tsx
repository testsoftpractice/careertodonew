'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { authFetch } from '@/lib/api-response'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Clock, CheckCircle2, Loader2, Phone, ArrowRight } from 'lucide-react'
import { trackPaymentSubmitted, trackInitiateCheckout, trackPaymentVerified, trackPurchase } from '@/lib/analytics/facebook-pixel-events'

export default function PaymentVerificationPage() {
  const router = useRouter()
  const { user, loading, refreshUser, login } = useAuth()
  const [transactionId, setTransactionId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showWaitingMessage, setShowWaitingMessage] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Countdown timer for early access offer
  useEffect(() => {
    const targetDate = new Date('2025-04-10T23:59:59')

    const updateTimer = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        // Offer has ended
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  // Start polling function
  const startPolling = useCallback(() => {
    console.log('[PAYMENT_VERIFICATION] Starting polling for user:', user?.id)

    if (!user?.id) return null

    // Clear any existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }

    // Poll for verification status every 5 seconds
    pollIntervalRef.current = setInterval(async () => {
      try {
        console.log('[PAYMENT_VERIFICATION] Polling verification status...')
        const checkResponse = await authFetch(`/api/student/early-access/status?userId=${user.id}`)
        const checkData = await checkResponse.json()

        console.log('[PAYMENT_VERIFICATION] Poll result:', {
          success: checkData.success,
          status: checkData.data?.verificationStatus,
          hasTransactionId: !!checkData.data?.transactionId
        })

        if (checkData.success && checkData.data.verificationStatus === 'VERIFIED') {
          console.log('[PAYMENT_VERIFICATION] Payment verified! Stopping polling.')

          // Stop polling
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }

          // Track Facebook Pixel events for purchase/conversion
          trackPaymentVerified({
            userId: user.id,
            transactionId: user?.transactionId || '',
            value: 2999,
            currency: 'BDT',
          })

          trackPurchase({
            value: 2999,
            currency: 'BDT',
            content_name: 'Early Access Package',
            content_ids: [user?.transactionId || ''],
            num_items: 1,
          })

          // Refresh token with updated verification status
          try {
            console.log('[PAYMENT_VERIFICATION] Refreshing token...')
            const refreshResponse = await authFetch('/api/auth/refresh-token', {
              method: 'POST',
            })

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json()
              console.log('[PAYMENT_VERIFICATION] Token refreshed successfully')
              console.log('[PAYMENT_VERIFICATION] New token status:', refreshData.user?.verificationStatus)

              // Update auth context with fresh data
              if (refreshData.success && refreshData.user) {
                login(refreshData.user, refreshData.token)
              }
            } else {
              console.error('[PAYMENT_VERIFICATION] Failed to refresh token:', refreshResponse.status)
            }
          } catch (error) {
            console.error('[PAYMENT_VERIFICATION] Error refreshing token:', error)
          }

          setIsVerified(true)
          toast({
            title: 'Success',
            description: 'আপনার পেমেন্ট ভেরিফাই হয়েছে!',
          })

          // Redirect to thank you page after 2 seconds
          setTimeout(() => {
            console.log('[PAYMENT_VERIFICATION] Redirecting to thank you page...')
            router.push('/thank-you')
          }, 2000)
        }
      } catch (error) {
        console.error('[PAYMENT_VERIFICATION] Poll error:', error)
      }
    }, 5000)

    // Stop polling after 10 minutes
    setTimeout(() => {
      console.log('[PAYMENT_VERIFICATION] Polling stopped after 10 minutes')
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }, 600000)

    return pollIntervalRef.current
  }, [user?.id, router, toast, login])

  // Redirect to thank you page if user is verified
  useEffect(() => {
    if (!loading && user && user.verificationStatus === 'VERIFIED') {
      router.push('/thank-you')
    }
  }, [user, loading, router])

  // Redirect if user is already in UNDER_REVIEW status
  useEffect(() => {
    if (!loading && user) {
      console.log('[PAYMENT_VERIFICATION] User loaded:', {
        userId: user.id,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        hasTransactionId: !!user.transactionId
      })

      if (user.verificationStatus === 'UNDER_REVIEW') {
        console.log('[PAYMENT_VERIFICATION] User already in UNDER_REVIEW, showing waiting message and starting poll')
        // Already submitted, show waiting message
        setShowWaitingMessage(true)
        // Start polling immediately
        startPolling()
      }
    }
  }, [user, loading, startPolling])

  // Redirect if not a student
  useEffect(() => {
    if (!loading && user && user.role !== 'STUDENT') {
      router.push('/')
    }
  }, [user, loading, router])

  // Cleanup: Clear poll interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        console.log('[PAYMENT_VERIFICATION] Cleaning up poll interval on unmount')
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [pollIntervalRef])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // If already verified, show redirecting message
  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold">Payment Verified!</h2>
            <p className="text-muted-foreground">
              আপনার পেমেন্ট সফলত করা হয়েছে। ধন্যবাদ পেজে রিডাইরেক্ট হচ্ছে...
            </p>
            <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleVerify = async () => {
    if (!transactionId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your Transaction ID',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Submit transaction ID for verification
      const response = await authFetch('/api/student/early-access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: transactionId.trim(),
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to verify transaction')
      }

      const data = await response.json()

      if (data.success) {
        setShowWaitingMessage(true)

        // Refresh user data from server to get updated verification status
        await refreshUser()

        // Track Facebook Pixel events for payment submission
        trackPaymentSubmitted({
          userId: user.id,
          transactionId: transactionId.trim(),
          value: 2999,
          currency: 'BDT',
        })

        trackInitiateCheckout({
          content_name: 'Early Access Package',
          content_category: 'Subscription',
          value: 2999,
          currency: 'BDT',
          num_items: 1,
        })

        console.log('[PAYMENT_VERIFICATION] Transaction submitted, user refreshed:', {
          userId: user.id,
          transactionId: transactionId.trim(),
          statusAfterRefresh: user.verificationStatus
        })

        toast({
          title: 'Transaction Submitted',
          description: 'আপনার ট্রান্স্যাকশন আইড জমা হয়েছে। কিছুটি কিছুনি আইড যাচাই করছি...',
        })

        // Start polling for verification status
        startPolling()
      } else {
        console.error('[PAYMENT_VERIFICATION] Submit failed:', data.error)
        toast({
          title: 'Error',
          description: data.error || 'Failed to verify transaction',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to verify transaction. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950/20 p-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* Back to Dashboard Link */}
        {!showWaitingMessage && !isVerified && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Dashboard
            </Button>
          </div>
        )}

        {/* Waiting State */}
        {showWaitingMessage ? (
          <Card className="border-2 border-purple-200 dark:border-purple-800 overflow-hidden shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <Clock className="h-16 w-16 text-purple-600 animate-pulse" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                  ট্রান্স্যাকশন আইড জমা হয়েছে!
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  আপনার পেমেন্ট যাচাই করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  যাচাই সম্পন্ন হলে আপনাকে ধন্যবাদ পেজে রিডাইরেক্ট করা হবে।
                </p>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <AlertTitle className="text-blue-900 dark:text-blue-100 text-base font-semibold">
                  ⏱️ প্রক্রিয়াকরণের সময়
                </AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  সাধারণত ৫-১০ মিনিটের মধ্যে যাচাই সম্পন্ন হয়। যদি দীর্ঘ সময় লাগে, তবে নিচের নম্বরে যোগাযোগ করুন।
                </AlertDescription>
              </Alert>

              <Alert className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                <Phone className="h-5 w-5 text-purple-600 mb-2" />
                <AlertTitle className="text-purple-900 dark:text-purple-100 text-lg">
                  সহায়তার জন্য এই নম্বারে কল করুন
                </AlertTitle>
                <AlertDescription className="text-purple-800 dark:text-purple-200 text-base">
                  পেমেন্ট ভেরিফিকেশন বা সহায়তার জন্য যোগাযোগ করুন:
                  <div className="font-bold text-purple-900 dark:text-purple-100 text-xl mt-2">
                    <a href="tel:01306655069" className="hover:underline">01306655069</a>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                যাচাই অবস্থা পরীক্ষা করা হচ্ছে...
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                আপনার ট্রান্স্যাকশন আইড: <span className="font-mono font-semibold">{user?.transactionId || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-lg mx-auto overflow-hidden shadow-2xl border-2 border-purple-200 dark:border-purple-800">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Early Access Special</h1>
              <p className="text-sm opacity-95">
                Limited time offer - Get 6 months of full access at our special launch price!
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 p-6">
              <div className="text-center">
                <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                  অফার শেষ! Early Access Offer Ends:
                </p>
                <div className="flex justify-center gap-3">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[70px]">
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-white/80 uppercase mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
                </div>
                <p className="text-white/90 text-xs mt-3">
                  অফার শেষ: April 10, 2025
                </p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              {/* Pricing Section */}
              <div className="text-center mb-8 pb-8 border-b-2 border-gray-100 dark:border-gray-800">
                <div className="inline-flex gap-3 mb-3">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-600 text-white">
                    6 months
                  </span>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-pink-500 text-white">
                    Save 75%
                  </span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl text-gray-400 line-through">৳12,000</span>
                  <span className="text-5xl font-bold text-purple-600">৳2,999</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {[
                  { icon: '📈', text: '40+ প্রফেশনাল সিমুলেশেনে অ্যাক্সেস' },
                  { icon: '🛠️', text: 'ERP, CRM, HRMS, অ্যাকাউন্টিং ও আরও টুলস' },
                  { icon: '👥', text: 'কমিউনিটি ফোরাম অ্যাক্সেস' },
                  { icon: '✉️', text: 'প্রায়োরিটি সাপোর্ট' },
                  { icon: '📄', text: 'সিভি তৈরিতে সহায়তা' },
                  { icon: '💼', text: 'জব প্লেসমেন্ট সহায়তা' },
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-4 pb-4 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-base">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* Payment Section */}
              <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-5 flex-wrap justify-center">
                  <div className="text-3xl font-bold text-pink-600">bKash</div>
                  <div className="text-center flex-1">
                    <span className="text-base text-gray-700 dark:text-gray-300">
                      এই নম্বরে bKash সেন্ড মানি করুন:{' '}
                      <span className="font-bold text-pink-600">01306655069</span>
                    </span>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    হেল্পলাইন: <a href="tel:01306655069" className="text-purple-600 hover:underline font-semibold">01306655069</a>
                  </p>
                </div>
                <Input
                  type="text"
                  placeholder="Enter your Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full mb-4 h-12 text-base border-2 focus:ring-2 focus:ring-purple-500"
                />
                <Button
                  onClick={handleVerify}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-base"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Contact Information */}
        {!showWaitingMessage && !isVerified && (
          <Alert className="mt-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <Phone className="h-5 w-5 text-blue-600 mb-2" />
            <AlertTitle className="text-blue-900 dark:text-blue-100 text-lg">
              সহায়তার জন্য যোগাযোগ করুন
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200 text-base">
              পেমেন্ট সংক্রান্ত যেকোনো সহায়তার জন্য:
              <div className="font-bold text-blue-900 dark:text-blue-100 text-xl mt-2">
                হেল্পলাইন: <a href="tel:01306655069" className="hover:underline">01306655069</a>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
