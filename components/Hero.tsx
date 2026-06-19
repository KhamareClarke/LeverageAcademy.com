'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-24 sm:pt-28">

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(242,242,240,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(242,242,240,0.025) 1px,transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />
      {/* Gold center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-gold-radial opacity-[0.04] blur-[200px]" />
      <div className="absolute inset-0 bg-vignette" />
      {/* Top edge line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
      {/* Bottom edge line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto w-full">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-gold-400/20 bg-gold-400/[0.04] mb-10 sm:mb-12"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-40" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
          </span>
          <span className="text-gold-400/75 text-[10px] uppercase tracking-[0.25em] font-semibold">{t.hero.badge}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold tracking-[-0.03em] leading-[0.92] mb-8 sm:mb-10"
        >
          <span className="block text-type-50 text-6xl sm:text-7xl md:text-8xl xl:text-[7rem]">{t.hero.line1}</span>
          <span className="block text-type-50 text-6xl sm:text-7xl md:text-8xl xl:text-[7rem]">{t.hero.line2}</span>
          <span className="block bg-gradient-gold bg-clip-text text-transparent text-6xl sm:text-7xl md:text-8xl xl:text-[7rem]">{t.hero.line3}</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent mb-8 sm:mb-10"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-type-100 text-lg sm:text-xl leading-[1.8] max-w-xl font-light mb-10 sm:mb-12"
        >
          {t.hero.sub}{' '}
          <span className="text-type-50 font-medium">{t.hero.subHighlight}</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center gap-8 sm:gap-28 mb-8"
        >
          <motion.a
            href="#courses"
            className="group relative w-52 py-4 sm:py-5 bg-gradient-gold text-black text-sm font-bold rounded-xl overflow-hidden shadow-glow-gold inline-flex items-center justify-center gap-2.5"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2.5">
              {t.hero.browseCourses}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </motion.a>

          {!loading && (user ? (
            <Link href="/student">
              <motion.div
                className="w-52 py-4 sm:py-5 border border-white/10 hover:border-gold-400/35 text-type-50 text-sm font-semibold rounded-xl hover:bg-white/[0.03] transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.nav.dashboard}
              </motion.div>
            </Link>
          ) : (
            <motion.a
              href="/login"
              className="w-52 py-4 sm:py-5 border border-white/10 hover:border-gold-400/35 text-type-50 text-sm font-semibold rounded-xl hover:bg-white/[0.03] transition-all duration-300 inline-flex items-center justify-center"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.nav.signIn}
            </motion.a>
          ))}
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="text-type-100/25 text-[10px] uppercase tracking-[0.22em]"
        >
          {t.hero.applicationNote}
        </motion.p>

      </div>
    </section>
  )
}
