'use client'

import { motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import Button from './Button'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (latest: number) => {
      setIsScrolled(latest > 50)
    })
  }, [scrollY])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled ? 'glass border-b border-white/10 shadow-luxury' : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-md flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-black font-bold text-lg relative z-10">L</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient">Leverage Academy</span>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#curriculum" className="text-sm font-medium text-white/60 hover:text-white transition-all duration-300 hover:scale-105">Curriculum</a>
          <a href="#about" className="text-sm font-medium text-white/60 hover:text-white transition-all duration-300 hover:scale-105">About</a>
          <a href="#faq" className="text-sm font-medium text-white/60 hover:text-white transition-all duration-300 hover:scale-105">FAQ</a>
        </div>

        <Button variant="primary" className="text-xs">Apply for Access</Button>
      </div>
    </motion.nav>
  )
}
