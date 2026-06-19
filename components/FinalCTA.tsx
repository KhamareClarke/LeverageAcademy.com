'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FinalCTA() {
  const { t } = useLanguage()

  return (
    <section className="relative py-24 sm:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-[0.05]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-gradient-gold-radial opacity-[0.03] blur-[200px]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <div className="relative rounded-2xl overflow-hidden bg-main-800 border border-white/[0.08] px-10 sm:px-16 md:px-24 py-20 sm:py-28 text-center">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-mesh opacity-[0.04]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-gold-radial opacity-[0.03] blur-[140px]" />

          <div className="relative z-10">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center justify-center gap-5 mb-14 sm:mb-16"
            >
              <div className="h-px w-14 sm:w-20 bg-gradient-to-r from-transparent to-gold-400/30" />
              <span className="text-gold-400/55 text-[10px] uppercase tracking-[0.35em] font-semibold whitespace-nowrap">
                {t.finalCta.label}
              </span>
              <div className="h-px w-14 sm:w-20 bg-gradient-to-l from-transparent to-gold-400/30" />
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] text-type-50 leading-[0.95] tracking-[-0.03em] font-bold mb-8 sm:mb-10"
            >
              {t.finalCta.heading}<br />
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                {t.finalCta.headingHighlight}
              </span>
            </motion.h2>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-type-100 text-lg sm:text-xl leading-[1.85] mb-12 sm:mb-16 max-w-xl mx-auto font-light"
            >
              {t.finalCta.sub}{' '}
              <span className="text-type-50 font-medium">{t.finalCta.subHighlight}</span>.
            </motion.p>

            {/* CTA */}
            <motion.a
              href="#courses"
              className="group relative inline-flex items-center justify-center px-14 sm:px-16 py-5 sm:py-6 bg-gradient-gold text-black text-base sm:text-lg font-bold rounded-xl overflow-hidden shadow-glow-gold-lg"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                {t.finalCta.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </span>
            </motion.a>

            {/* Note */}

          </div>
        </div>
      </motion.div>
    </section>
  )
}
