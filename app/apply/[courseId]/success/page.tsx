'use client'

import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

export default function ApplicationSuccessPage() {
  return (
    <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold-400/10">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-type-50 mb-4">
            Application Submitted!
          </h1>
          <p className="text-type-100 mb-6 sm:mb-8 text-sm sm:text-base">
            Thank you for your application. We'll review it and get back to you soon via email.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="block px-6 py-3 rounded-xl bg-gradient-gold text-black font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              href="/login"
              className="block px-6 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 font-semibold hover:border-gold-400/50 transition-colors flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
