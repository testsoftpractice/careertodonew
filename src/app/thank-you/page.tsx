'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Sparkles, Gift, ShieldCheck, Users } from 'lucide-react'
import { useEffect } from 'react'
import { trackViewContent } from '@/lib/analytics/facebook-pixel-events'

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0)

    // Track Facebook Pixel ViewContent event
    trackViewContent({
      content_name: 'Payment Success Page',
      content_category: 'Conversion',
      value: 2999,
      currency: 'BDT',
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-green-950/20 dark:to-teal-950/20 p-4">
      <div className="max-w-4xl mx-auto py-12">
        {/* Main Card */}
        <Card className="border-2 border-green-200 dark:border-green-800 overflow-hidden shadow-2xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 opacity-20">
              <Sparkles className="h-12 w-12" />
            </div>
            <div className="absolute top-8 right-8 opacity-20">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="absolute bottom-4 left-1/4 opacity-20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute bottom-6 right-1/3 opacity-20">
              <Sparkles className="h-10 w-10" />
            </div>

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <CheckCircle2 className="h-20 w-20 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ধন্যবাদ! স্বাগতম!
              </h1>
              <p className="text-xl md:text-2xl opacity-95">
                আপনার পেমেন্ট সফলভাবে যাচাই হয়েছে
              </p>
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="p-8 md:p-12 space-y-8">
            {/* Success Message */}
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                আপনার পেমেন্ট যাচাই সম্পন্ন হয়েছে। আপনি এখন CareerTodo-এর সমস্ত প্রিমিয়াম ফিচার এবং টুল অ্যাক্সেস করতে পারবেন।
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                আপনার অ্যাকাউন্ট এখন সম্পূর্ণভাবে সক্রিয় এবং আপনি শুরু করতে প্রস্তুত!
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">
                  40+ সিমুলেশন
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  প্রফেশনাল সিমুলেশন টুলের পূর্ণ অ্যাক্সেস
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                  প্রায়োরিটি সাপোর্ট
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  দ্রুত সহায়তা এবং গাইডেন্স
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">
                  কমিউনিটি
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  এক্সক্লুসিভ কমিউনিটি ফোরাম
                </p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                আপনার সাবস্ক্রিপশনে যা যা আছে:
              </h3>
              <ul className="space-y-3">
                {[
                  '40+ প্রফেশনাল সিমুলেশনে অ্যাক্সেস',
                  'ERP, CRM, HRMS, অ্যাকাউন্টিং ও আরও টুলস',
                  'কমিউনিটি ফোরামে অ্যাক্সেস',
                  'প্রায়োরিটি সাপোর্ট',
                  'সিভি তৈরিতে সহায়তা',
                  'জব প্লেসমেন্ট সহায়তা',
                  '6 মাসের পূর্ণ অ্যাক্সেস',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    সাহায্যের প্রয়োজন?
                  </p>
                  <a
                    href="tel:01306655069"
                    className="text-lg font-bold text-blue-900 dark:text-blue-100 hover:underline"
                  >
                    01306655069
                  </a>
                </div>
                <div className="hidden md:block w-px h-12 bg-blue-300 dark:bg-blue-700"></div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    ইমেইল
                  </p>
                  <a
                    href="mailto:support@careertodo.com"
                    className="text-lg font-bold text-blue-900 dark:text-blue-100 hover:underline"
                  >
                    support@careertodo.com
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                onClick={() => router.push('/dashboard/student')}
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg px-8 py-6 h-auto"
              >
                ড্যাশবোর্ডে যান
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            আপনার সাফল্যের যাত্রা শুরু হোক! 🚀
          </p>
          <p className="text-xs mt-2">
            CareerTodo - আপনার ক্যারিয়ার গড়ার সহযোগী
          </p>
        </div>
      </div>
    </div>
  )
}
