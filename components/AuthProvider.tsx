'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  email: string | undefined
  role: string | null
  email_confirmed_at: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        await checkUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        if (pathname?.startsWith('/admin') || pathname?.startsWith('/student')) {
          router.push('/login')
        }
      }
    })

    // Periodically refresh session to keep it alive (every 30 minutes)
    const refreshInterval = setInterval(async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession) {
        // Refresh if session exists
        await supabase.auth.refreshSession()
      }
    }, 30 * 60 * 1000)

    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [pathname, router])

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Get role from API
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        
        if (data.authenticated && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      // Sign out from client
      const { error: clientError } = await supabase.auth.signOut()
      
      // Also call API route to clear server-side cookies
      try {
        await fetch('/api/auth/signout', { method: 'POST' })
      } catch (apiError) {
        console.error('Error calling signout API:', apiError)
      }
      
      if (clientError) {
        console.error('Error signing out:', clientError)
      }
      
      setUser(null)
      
      // Force navigation to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Error during sign out:', error)
      // Even if there's an error, clear user state and redirect
      setUser(null)
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

