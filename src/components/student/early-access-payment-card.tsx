'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/api-response'

interface EarlyAccessPaymentCardProps {
  userId?: string
  onSuccess?: () => void
}

export function EarlyAccessPaymentCard({ userId, onSuccess }: EarlyAccessPaymentCardProps) {
  const [transactionId, setTransactionId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
          userId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to verify transaction')
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Transaction ID submitted successfully! Your payment is being verified.',
        })
        setTransactionId('')
        onSuccess?.()
      } else {
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
    <Card className="w-full max-w-lg mx-auto overflow-hidden shadow-2xl">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Early Access Special</h1>
        <p className="text-sm opacity-95">
          Limited time offer - Get 6 months of full access at our special launch price!
        </p>
      </div>

      {/* Card Body */}
      <div className="p-8">
        {/* Pricing Section */}
        <div className="text-center mb-8 pb-8 border-b-2 border-gray-100">
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
            { icon: '📈', text: '40+ প্রফেশনাল সিমুলেশনে অ্যাক্সেস' },
            { icon: '🛠️', text: 'ERP, CRM, HRMS, অ্যাকাউন্টিং ও আরও টুলস' },
            { icon: '📊', text: 'প্রগ্রেস ট্র্যাকিং ড্যাশবোর্ড' },
            { icon: '👥', text: 'কমিউনিটি ফোরাম অ্যাক্সেস' },
            { icon: '✉️', text: 'প্রায়োরিটি ইমেইল সাপোর্ট' },
            { icon: '💼', text: 'জব প্লেসমেন্ট সহায়তা' },
          ].map((feature, index) => (
            <li key={index} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0">
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-base">{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* Payment Section */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center gap-4 mb-5 flex-wrap justify-center">
            <div className="text-3xl font-bold text-pink-600">bKash</div>
            <div className="text-center flex-1">
              <span className="text-base text-gray-700">
                এই নম্বরে bKash সেন্ড মানি করুন:{' '}
                <span className="font-bold text-pink-600">01306655069</span>
              </span>
            </div>
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
  )
}
