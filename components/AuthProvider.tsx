'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  email: string
  role: 'admin' | 'student' | null
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

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // CRITICAL: Do NOT await Supabase calls inside this callback - causes deadlock
      // that makes signInWithPassword hang on next login. Defer with setTimeout.
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setTimeout(() => checkUser(), 0)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        if (pathname?.startsWith('/admin')) {
          router.push('/admin/login')
        } else if (pathname?.startsWith('/student')) {
          router.push('/login')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [pathname, router])

  const checkUser = async () => {
    if (!supabase) { setLoading(false); return }
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError && (authError.message?.includes('fetch failed') || authError.message?.includes('EAI_AGAIN'))) {
        console.warn('Cannot connect to Supabase - network issue.')
        setUser(null)
        setLoading(false)
        return
      }
      
      if (authUser) {
        // Get role from API
        try {
          const res = await fetch('/api/auth/me')
          const data = await res.json()
          
          if (data.authenticated && data.user) {
            setUser(data.user)
          } else {
            setUser(null)
          }
        } catch (apiError: any) {
          // Keep auth user but no role
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            role: authUser.user_metadata?.role || null,
            email_confirmed_at: authUser.email_confirmed_at || null,
          })
        }
      } else {
        setUser(null)
      }
    } catch (error: any) {
      if (error?.cause?.code === 'EAI_AGAIN' || error?.message?.includes('fetch failed')) {
        console.warn('Network error connecting to Supabase.')
      } else {
        console.error('Error checking user:', error)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    if (supabase) await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
