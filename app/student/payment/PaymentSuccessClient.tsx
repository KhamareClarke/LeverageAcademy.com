'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, Home, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const courseId = searchParams.get('course_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId && courseId) {
      // Verify payment and enrollment
      verifyPayment()
    } else {
      setError('Missing payment information')
      setLoading(false)
    }
  }, [sessionId, courseId])

  const verifyPayment = async (retryCount = 0) => {
    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, course_id: courseId }),
      })

      const data = await res.json()

      if (!res.ok) {
        // If enrollment not found, wait a bit for webhook to process and retry (up to 3 times)
        if (res.status === 404 && retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
          return verifyPayment(retryCount + 1)
        }
        setError(data.error || 'Payment verification failed')
        setLoading(false)
        return
      }

      // Payment verified successfully - refresh the page to update enrollment status
      setLoading(false)
      // Small delay to ensure database is updated
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (err: any) {
      // Retry on network errors
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        return verifyPayment(retryCount + 1)
      }
      setError('Failed to verify payment')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-type-100">Verifying payment...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
      <div className="w-full max-w-md text-center">
        <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold-400/10">
          {error ? (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-type-50 mb-4">
                Payment Verification Failed
              </h1>
              <p className="text-type-100 mb-6">{error}</p>
              <Link
                href="/student"
                className="inline-block px-6 py-3 bg-gradient-gold text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-type-50 mb-4">
                Payment Successful!
              </h1>
              <p className="text-type-100 mb-6">
                Your enrollment has been confirmed. You now have access to the course.
              </p>
              <div className="space-y-4">
                <Link
                  href="/student"
                  className="block px-6 py-3 bg-gradient-gold text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Go to My Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="block px-6 py-3 bg-main-900 border border-gold-400/20 text-type-50 rounded-xl font-semibold hover:border-gold-400/50 transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
