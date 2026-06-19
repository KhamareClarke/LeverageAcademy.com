'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Home, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!supabase) {
      setError('Authentication service unavailable.')
      setLoading(false)
      return
    }

    // Start signup - fire and forget, redirect immediately
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'student',
        },
      },
    })
      .then(({ data, error: signUpError }) => {
        if (signUpError) {
          // Only show error if it's a real error (not just slow response)
          if (!signUpError.message.includes('timeout') && !signUpError.message.includes('network')) {
            setError(signUpError.message)
            setLoading(false)
            return
          }
        }

        // Send verification code via email (background)
        fetch('/api/send-verification-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }).catch(() => {})
      })
      .catch(() => {
        // Ignore errors - user might be created anyway
      })

    // Redirect immediately - don't wait
    setTimeout(() => {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold-400/10">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-gold/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center text-type-50 mb-2">
            Create Account
          </h1>
          <p className="text-center text-type-100 mb-6 sm:mb-8 text-xs sm:text-sm">
            Sign up to access courses
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-type-50 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-type-50 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-type-50 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-gold text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gold-400/10 text-center">
            <p className="text-xs sm:text-sm text-type-100">
              Already have an account?{' '}
              <Link href="/login" className="text-gold-400 hover:text-gold-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <Link
              href="/"
              className="text-sm text-type-100 hover:text-gold-400 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
