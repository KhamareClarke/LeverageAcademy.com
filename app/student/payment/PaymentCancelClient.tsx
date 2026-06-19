'use client'

import { useSearchParams } from 'next/navigation'
import { XCircle, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

export default function PaymentCancelClient() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('course_id')

  return (
    <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
      <div className="w-full max-w-md text-center">
        <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold-400/10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-type-50 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-type-100 mb-6">
            Your payment was cancelled. No charges were made.
          </p>
          <div className="space-y-4">
            {courseId && (
              <Link
                href={`/apply/${courseId}`}
                className="block px-6 py-3 bg-gradient-gold text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Try Again
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/student"
              className="block px-6 py-3 bg-main-900 border border-gold-400/20 text-type-50 rounded-xl font-semibold hover:border-gold-400/50 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
