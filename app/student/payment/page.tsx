import { Suspense } from 'react'
import PaymentClient from './PaymentClient'

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-type-100">Loading...</p>
          </div>
        </main>
      }
    >
      <PaymentClient />
    </Suspense>
  )
}
