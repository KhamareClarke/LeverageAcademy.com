'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogOut, LayoutDashboard, BookOpen } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState } from 'react'

export default function StudentNav() {
  const router = useRouter()
  const { signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return // Prevent double-clicks
    
    setIsSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-pill border-b border-gold-400/10 backdrop-blur-2xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/student" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
            <span className="text-black font-black text-sm">L</span>
          </div>
          <span className="bg-gradient-gold bg-clip-text text-transparent font-bold text-lg">
            Leverage Academy
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/student"
            className="flex items-center gap-2 text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Browse Courses
          </Link>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-2 text-type-100 hover:text-red-400 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

