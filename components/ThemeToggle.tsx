'use client'

import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-xl border border-white/[0.08] hover:border-gold-400/25 bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark'
        ? <Sun className="w-4 h-4 text-type-100 hover:text-gold-400 transition-colors duration-200" />
        : <Moon className="w-4 h-4 text-type-100 hover:text-gold-400 transition-colors duration-200" />
      }
    </motion.button>
  )
}
