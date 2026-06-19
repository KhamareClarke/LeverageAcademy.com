'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailClient() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const codeString = code.join('')
    if (codeString.length !== 6) {
      setError('Please enter the complete 6-digit code')
      setLoading(false)
      return
    }

    try {
      // Use our custom verification API
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeString }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid verification code')
        setLoading(false)
        return
      }

      // Fire-and-forget OTP verification (custom code already validated)
      supabase?.auth
        .verifyOtp({
          email,
          token: codeString,
          type: 'email',
        })
        .catch(() => {
          // Ignore Supabase errors - code was already verified
        })

      setMessage('Email verified! Redirecting...')
      router.push('/login')
    } catch (err: any) {
      setError('Verification failed. Please try again.')
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setMessage(null)
    setLoading(true)
    
    try {
      const res = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to resend code')
        setLoading(false)
        return
      }

      setMessage('Verification code sent! Check your email.')
      setLoading(false)
    } catch (err: any) {
      setError('Failed to resend code. Please try again.')
      setLoading(false)
    }
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
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center text-type-50 mb-2">
            Verify Email
          </h1>
          <p className="text-center text-type-100 mb-6 sm:mb-8 text-xs sm:text-sm">
            Enter the 6-digit code sent to {email || 'your email'}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/50 text-green-400 text-sm"
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl bg-main-900 border border-gold-400/20 text-type-50 focus:outline-none focus:border-gold-400/50 transition-colors"
                  required
                  disabled={loading}
                />
              ))}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-gold text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-gold-400/10 text-center">
            <button
              onClick={handleResend}
              className="text-sm text-gold-400 hover:text-gold-300 font-semibold"
            >
              Resend code
            </button>
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
