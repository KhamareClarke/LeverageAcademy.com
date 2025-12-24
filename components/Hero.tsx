'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from './AuthProvider'
import Link from 'next/link'

export default function Hero() {
  const { user, loading } = useAuth()
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-pulse-slow" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-gold-radial opacity-20 blur-[140px] animate-float" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-gold-radial opacity-10 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-vignette" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-pill border border-gold-400/30 backdrop-blur-2xl shadow-glow-gold"
          >
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-gold-400 text-xs uppercase tracking-widest font-bold">
              ✨ Elite Application Process
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-type-50 leading-[1.05] tracking-tight font-bold"
          >
            Build systems.<br />
            Create leverage.<br />
            <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">Own the outcome.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-type-100 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light"
          >
            An exclusive education platform for elite builders designing AI systems, 
            business infrastructure, and digital assets that <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] font-semibold inline-block">compound exponentially</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-5 justify-center pt-2"
          >
            <motion.a
              href="#courses"
              className="group relative px-12 py-5 bg-gradient-gold text-black text-base font-bold rounded-xl overflow-hidden shadow-glow-gold-lg inline-flex items-center justify-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Browse Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>
            {!loading && (
              user ? (
                <Link href={user.role === 'admin' ? '/admin' : '/student'}>
                  <motion.div
                    className="px-12 py-5 glass-pill text-type-50 text-base font-semibold rounded-xl hover:bg-white/10 border border-gold-400/30 hover:border-gold-400/50 transition-all duration-300 hover:shadow-glow-gold backdrop-blur-2xl inline-flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Dashboard
                  </motion.div>
                </Link>
              ) : (
                <motion.a
                  href="/login"
                  className="px-12 py-5 glass-pill text-type-50 text-base font-semibold rounded-xl hover:bg-white/10 border border-gold-400/30 hover:border-gold-400/50 transition-all duration-300 hover:shadow-glow-gold backdrop-blur-2xl inline-flex items-center justify-center"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.a>
              )
            )}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center justify-center gap-8 pt-12 text-type-100 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold-400" />
              <span>500+ Systems Built</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold-400" />
              <span>£10M+ Revenue Generated</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold-400" />
              <span>Elite Community</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
