'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function Card({ children, className = '', delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`
        relative p-10 rounded-2xl
        glass spotlight
        shadow-luxury
        transition-all duration-500
        hover:shadow-gold-lg
        group
        overflow-hidden
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
