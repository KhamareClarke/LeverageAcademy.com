'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowRight, Home, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!supabase) {
      setError('Authentication service unavailable.')
      setLoading(false)
      return
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        setError(signInError.message || 'Invalid email or password')
        setLoading(false)
        return
      }

      if (data?.user) {
        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Get role from database (more reliable than metadata)
        try {
          const { data: userData, error: dbError } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.user.id)
              .single()
            
          const role = userData?.role || data.user.user_metadata?.role || 'student'
          
          // Only allow admin users
          if (role !== 'admin') {
            setError('Access denied. Admin credentials required.')
            setLoading(false)
            // Sign out non-admin users
            await supabase.auth.signOut()
            return
          }
          
          // Redirect to admin dashboard
          router.push('/admin')
          router.refresh()
        } catch (dbError) {
          // If DB check fails, use metadata
          const role = data.user.user_metadata?.role || 'student'
          if (role !== 'admin') {
            setError('Access denied. Admin credentials required.')
            setLoading(false)
            await supabase.auth.signOut()
            return
          }
          router.push('/admin')
          router.refresh()
        }
      } else {
        setError('Login failed')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
      <div className="w-full max-w-md">
        <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold-400/10">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-gold/20 flex items-center justify-center">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center text-type-50 mb-2">
            Admin Sign In
          </h1>
          <p className="text-center text-type-100 mb-6 sm:mb-8 text-xs sm:text-sm">
            Sign in to access the admin dashboard
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
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
                placeholder="admin@example.com"
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gold-400/10 text-center space-y-2">
            <p className="text-xs sm:text-sm text-type-100">
              Student?{' '}
              <Link href="/login" className="text-gold-400 hover:text-gold-300 font-semibold">
                Sign in here
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
      </div>
    </main>
  )
}
