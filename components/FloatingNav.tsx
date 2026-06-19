'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6"
    >
      <div
        className={`px-5 sm:px-7 lg:px-10 py-3 sm:py-3.5 rounded-full transition-all duration-500 border w-full max-w-4xl ${
          scrolled
            ? 'bg-main-900/90 backdrop-blur-2xl border-gold-400/15 shadow-glow-gold'
            : 'bg-main-900/55 backdrop-blur-xl border-white/[0.07]'
        }`}
      >
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-type-50 font-bold text-base sm:text-lg tracking-tight flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-gold flex items-center justify-center shadow-glow-gold">
              <span className="text-black font-black text-xs sm:text-sm">L</span>
            </div>
            <span className="hidden sm:inline group-hover:text-gold-400 transition-colors duration-200">Leverage Academy</span>
            <span className="sm:hidden group-hover:text-gold-400 transition-colors duration-200">LA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7 lg:gap-10">
            {[
              { href: '#curriculum', label: t.nav.curriculum },
              { href: '/about', label: t.nav.about, isLink: true },
              { href: '#faq', label: t.nav.faq },
            ].map(({ href, label, isLink }) => (
              <motion.div key={href} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                {isLink ? (
                  <Link href={href} className="relative text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors duration-200 group inline-block">
                    {label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-gold group-hover:w-full transition-all duration-300" />
                  </Link>
                ) : (
                  <a href={href} className="relative text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors duration-200 group inline-block">
                    {label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-gold group-hover:w-full transition-all duration-300" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="hidden md:block">
              <Link
                href="/login"
                className="relative px-6 sm:px-8 py-2 sm:py-2.5 bg-gradient-gold text-black text-xs sm:text-sm font-bold rounded-full overflow-hidden group shadow-glow-gold inline-flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">{t.nav.getStarted}</span>
              </Link>
            </motion.div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-type-100 hover:text-gold-400 transition-colors duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden mt-4 pt-5 border-t border-white/[0.07] space-y-1"
          >
            <a href="#curriculum" onClick={() => setIsMobileMenuOpen(false)} className="block text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors duration-200 py-3 cursor-pointer">{t.nav.curriculum}</a>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors duration-200 py-3">{t.nav.about}</Link>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block text-type-100 hover:text-gold-400 text-sm font-semibold transition-colors duration-200 py-3 cursor-pointer">{t.nav.faq}</a>
            <div className="pt-3 pb-1 flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 bg-gradient-gold text-black text-sm font-bold rounded-full text-center">{t.nav.getStarted}</Link>
              <div className="flex justify-center items-center gap-2"><ThemeToggle /><LanguageSwitcher /></div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
