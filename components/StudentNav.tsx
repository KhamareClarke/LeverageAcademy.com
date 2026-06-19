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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-pill border-b border-gold-400/10 backdrop-blur-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/student" className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
            <span className="text-black font-black text-xs sm:text-sm">L</span>
          </div>
          <span className="bg-gradient-gold bg-clip-text text-transparent font-bold text-base sm:text-lg">
            Leverage Academy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/student"
            className="flex items-center gap-2 text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/student/courses"
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-type-100 hover:text-gold-400 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-gold-400/10 bg-main-900/95 backdrop-blur-2xl"
        >
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/student"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors py-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/student/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors py-2"
            >
              <BookOpen className="w-4 h-4" />
              Browse Courses
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                handleSignOut()
              }}
              disabled={isSigningOut}
              className="flex items-center gap-2 text-type-100 hover:text-red-400 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-2 w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

