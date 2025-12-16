'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false)

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
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6"
    >
      <div className={`glass-pill px-10 py-4 rounded-full transition-all duration-500 backdrop-blur-2xl border border-gold-400/10 ${scrolled ? 'shadow-glow-gold border-gold-400/20 bg-main-900/80' : 'bg-main-900/60'}`}>
        <div className="flex items-center gap-16">
          <motion.a 
            href="#" 
            className="text-type-50 font-bold text-lg tracking-tight flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
              <span className="text-black font-black text-sm">L</span>
            </div>
            Leverage Academy
          </motion.a>
          
          <div className="flex items-center gap-10">
            <motion.a 
              href="#curriculum" 
              className="relative text-type-100 hover:text-gold-400 text-sm font-semibold transition-all duration-300 group"
              whileHover={{ y: -2 }}
            >
              Curriculum
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold group-hover:w-full transition-all duration-300" />
            </motion.a>
            <motion.a 
              href="#about" 
              className="relative text-type-100 hover:text-gold-400 text-sm font-semibold transition-all duration-300 group"
              whileHover={{ y: -2 }}
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold group-hover:w-full transition-all duration-300" />
            </motion.a>
            <motion.a 
              href="#faq" 
              className="relative text-type-100 hover:text-gold-400 text-sm font-semibold transition-all duration-300 group"
              whileHover={{ y: -2 }}
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold group-hover:w-full transition-all duration-300" />
            </motion.a>
          </div>

          <motion.button 
            className="relative px-8 py-2.5 bg-gradient-gold text-black text-sm font-bold rounded-full overflow-hidden group shadow-glow-gold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Apply Now</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}
