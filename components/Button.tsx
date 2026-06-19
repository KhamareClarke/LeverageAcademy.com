'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  onClick?: () => void
  className?: string
}

export default function Button({ children, variant = 'primary', onClick, className = '' }: ButtonProps) {
  const baseStyles = 'relative px-10 py-4 rounded-lg font-semibold transition-all duration-500 text-sm tracking-wider uppercase overflow-hidden group'
  
  const variants = {
    primary: 'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black shadow-gold-lg hover:shadow-gold-2xl hover:scale-[1.02]',
    ghost: 'glass text-white hover:glass-gold hover:scale-[1.02] shadow-luxury'
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
