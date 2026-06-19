'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'

const STATS = [
  { value: '2,000+', label: 'Students Enrolled', description: 'Across all skill levels and backgrounds' },
  { value: '15+', label: 'Courses Available', description: 'AI, web, software, and digital business' },
  { value: 'Beginner–Pro', label: 'Skill Levels Covered', description: 'From first lesson to industry level' },
]

export default function AuthoritySection() {
  return (
    <section className="relative py-32 sm:py-40 px-6 bg-main-900" id="about">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-[0.04]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-gold-radial opacity-[0.03] blur-[160px]" />
      <div className="absolute inset-0 bg-vignette" />

      <Container size="wide" className="relative z-10 !max-w-7xl">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 sm:mb-28"
        >
          <p className="text-type-100/45 text-[10px] uppercase tracking-[0.28em] font-semibold">
            Proven Track Record
          </p>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto mb-16 sm:mb-20"
        >
          <div className="font-serif text-7xl sm:text-8xl text-gold-400/10 leading-none select-none mb-4">"</div>
          <p className="font-serif text-2xl sm:text-4xl md:text-5xl text-type-50 leading-[1.2] italic font-medium">
            Most education teaches you what to think.{' '}
            We teach you what to{' '}
            <span className="bg-gradient-gold bg-clip-text text-transparent">build</span>
            {' '}and how to get{' '}
            <span className="bg-gradient-gold bg-clip-text text-transparent">paid</span>{' '}
            for it.
          </p>
        </motion.div>

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-6 mb-20 sm:mb-28"
        >
          <div className="w-10 h-px bg-gold-400/30" />
          <div className="text-center">
            <p className="text-type-50 font-bold text-sm tracking-wide mb-1">Khamare Clarke</p>
            <p className="text-type-100/40 text-xs uppercase tracking-[0.22em]">Founder & Chief Architect</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <a
              href="#courses"
              className="inline-flex items-center gap-2 text-type-100 text-sm font-semibold hover:text-gold-400 transition-colors duration-200 group"
            >
              Browse Courses
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <span className="hidden sm:block w-px h-4 bg-white/10" />
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-type-100/50 text-sm hover:text-type-100 transition-colors duration-200 group"
            >
              About the Founder
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-main-800"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-3">
            {STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 + index * 0.1 }}
                className={`text-center px-10 sm:px-12 py-14 sm:py-16 ${
                  index < STATS.length - 1
                    ? 'border-b sm:border-b-0 sm:border-r border-white/[0.06]'
                    : ''
                }`}
              >
                <div className="font-serif text-5xl sm:text-6xl md:text-7xl bg-gradient-gold bg-clip-text text-transparent font-bold leading-none mb-4">
                  {stat.value}
                </div>
                <div className="text-type-50 text-xs font-bold uppercase tracking-[0.18em] mb-2">
                  {stat.label}
                </div>
                <div className="text-type-100/40 text-sm">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </Container>
    </section>
  )
}
