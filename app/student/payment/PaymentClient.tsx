'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CreditCard, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  price: number
  description: string | null
}

export default function PaymentClient() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('course_id')
  const applicationId = searchParams.get('application_id')

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    } else {
      setError('Course ID is required')
      setLoading(false)
    }
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch course')
        setLoading(false)
        return
      }

      setCourse(data.course)
      setLoading(false)
    } catch (err: any) {
      setError('Failed to fetch course')
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!courseId) return

    setProcessing(true)
    setError(null)

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          application_id: applicationId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create payment session')
        setProcessing(false)
        return
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Payment session created but no URL returned')
        setProcessing(false)
      }
    } catch (err: any) {
      setError('Failed to initiate payment')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-type-100">Loading...</p>
        </div>
      </main>
    )
  }

  if (error && !course) {
    return (
      <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
        <div className="text-center">
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400">
            {error}
          </div>
          <Link
            href="/student"
            className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
      <div className="w-full max-w-2xl">
        <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold-400/10">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-gold/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center text-type-50 mb-2">
            Complete Your Enrollment
          </h1>
          <p className="text-center text-type-100 mb-6 sm:mb-8 text-xs sm:text-sm">
            Secure payment powered by Stripe
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {course && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-main-900 border border-gold-400/20">
                <h2 className="text-xl font-bold text-type-50 mb-2">{course.title}</h2>
                {course.description && (
                  <p className="text-type-100 text-sm mb-4">{course.description}</p>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gold-400/10">
                  <span className="text-type-100 font-semibold">Total Amount</span>
                  <span className="text-3xl font-bold text-gold-400">£{course.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-type-100 text-sm">
                <Lock className="w-4 h-4 text-gold-400" />
                <span>Your payment is secure and encrypted</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-4 rounded-xl bg-gradient-gold text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <Link
                href="/student"
                className="block text-center text-sm text-type-100 hover:text-gold-400 transition-colors"
              >
                Cancel and return to dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
