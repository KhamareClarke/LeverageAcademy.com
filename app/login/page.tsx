'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Check for verified email or redirect in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const verified = params.get('verified')
    const emailParam = params.get('email')
    const redirect = params.get('redirect')
    
    if (verified === 'true' && emailParam) {
      setEmail(emailParam)
      setError('Email verified! Please sign in with your password.')
    }
    
    // Store redirect URL for after login
    if (redirect) {
      sessionStorage.setItem('redirectAfterLogin', redirect)
    }
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'student', // Default role is student
            },
            emailRedirectTo: typeof window !== 'undefined' 
              ? `${window.location.origin}/verify-email?email=${encodeURIComponent(email)}` 
              : undefined,
          },
        })

        if (signUpError) {
          throw signUpError
        }

        if (data.user) {
          // Send verification code
          try {
            const codeResponse = await fetch('/api/send-verification-code', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email, 
                userId: data.user.id 
              }),
            })
            
            const codeData = await codeResponse.json()
            
            // Code is sent via email, no need to show in alert
          } catch (err) {
            console.error('Error sending code:', err)
          }
          
          // Always redirect to verification page for email verification
          router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          console.error('Sign in error:', signInError)
          throw signInError
        }

        if (data.user) {
          // Check if email is verified
          if (!data.user.email_confirmed_at) {
            // Email not verified, redirect to verification page
            router.push(`/verify-email?email=${encodeURIComponent(email)}`)
            return
          }

          // Get user role from metadata or from database
          let role = data.user.user_metadata?.role
          
          // If role not in metadata, check database
          if (!role) {
            const { data: userData, error: dbError } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.user.id)
              .single()

            if (dbError) {
              console.error('Error fetching user role:', dbError)
              role = 'student'
            } else {
              role = userData?.role || 'student'
            }
          }
          
          // Check for redirect URL
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin')
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin')
            router.push(redirectUrl)
          } else {
            router.push(role === 'admin' ? '/admin' : '/student')
          }
          router.refresh()
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || err.error_description || 'An error occurred')
    } finally {
      setLoading(false)
    }
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-6">
              <span className="text-black font-black text-2xl">L</span>
            </div>
            <h1 className="font-serif text-4xl font-bold mb-2">
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Leverage Academy
              </span>
            </h1>
            <p className="text-type-100 text-sm">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-type-100 text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isSignUp}
                  className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/10 text-type-50 focus:border-gold-400/50 focus:outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-type-100 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/10 text-type-50 focus:border-gold-400/50 focus:outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-type-100 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/10 text-type-50 focus:border-gold-400/50 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full relative px-6 py-4 bg-gradient-gold text-black text-base font-bold rounded-xl overflow-hidden group shadow-glow-gold-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </span>
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-type-100 hover:text-gold-400 text-sm transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

