'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    // Get email from URL params or session
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else {
      // Try to get from session
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setEmail(user.email)
        }
      })
    }
  }, [])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit
    
    const newCode = [...code]
    newCode[index] = value.replace(/\D/g, '') // Only numbers
    setCode(newCode)
    setError(null)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newCode[i] = char
    })
    setCode(newCode)
    
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5)
    const lastInput = document.getElementById(`code-${lastIndex}`)
    lastInput?.focus()
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      setLoading(false)
      return
    }

    try {
      // Verify the code using API route (which uses Supabase OTP)
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Invalid verification code. Please check your email and try again.')
      }

      if (result.success) {
        setSuccess(true)
        
        // Refresh auth session after verification
        await supabase.auth.refreshSession()
        
        // After verification, redirect to login
        // User needs to sign in to complete the process
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(email)}&verified=true`)
          router.refresh()
        }, 1500)
      } else {
        throw new Error('Verification failed. Please try again.')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResending(true)
    setError(null)
    
    try {
      // Get user ID if available
      const { data: { user } } = await supabase.auth.getUser()
      
      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          userId: user?.id || null,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to resend code. Please try again.')
      }

      alert('Verification code has been resent to your email!')
      
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-main-950 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-4 text-type-50">
            Email Verified!
          </h1>
          <p className="text-type-100">Redirecting to your dashboard...</p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-main-950 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-gold-radial opacity-10 blur-[140px] animate-float" />
      
      {/* Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20"
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-pill border border-gold-400/20 hover:border-gold-400/50 text-type-100 hover:text-gold-400 text-sm font-semibold transition-all duration-300 backdrop-blur-2xl"
        >
          <Home className="w-4 h-4" />
          Home
        </motion.button>
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-12 rounded-3xl border border-gold-400/10 backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-gold/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="font-serif text-4xl font-bold mb-2">
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Verify Your Email
              </span>
            </h1>
            <p className="text-type-100 text-sm mb-2">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-gold-400 font-semibold">{email || 'your email'}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-type-100 text-sm font-semibold mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold rounded-xl bg-main-900 border border-gold-400/20 text-type-50 focus:border-gold-400/50 focus:outline-none focus:ring-2 focus:ring-gold-400/30 transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className="w-full relative px-6 py-4 bg-gradient-gold text-black text-base font-bold rounded-xl overflow-hidden group shadow-glow-gold-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Verifying...' : 'Verify Email'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </span>
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="text-type-100 hover:text-gold-400 text-sm transition-colors disabled:opacity-50"
            >
              {resending ? 'Sending...' : "Didn't receive the code? Resend"}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

