'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'

const builds = [
  {
    number: '01',
    title: 'AI Integration for Business',
    what: 'Identify, implement, and manage AI tools that reduce costs and increase output, without needing a tech team',
    why: 'Your business runs smarter',
  },
  {
    number: '02',
    title: 'Professional Web Projects',
    what: 'Build real websites and apps you can add to your portfolio, charge clients for, or use to launch your own product',
    why: 'Portfolio-ready in weeks',
  },
  {
    number: '03',
    title: 'Automation & Productivity',
    what: 'Eliminate repetitive manual tasks using tools and code that work around the clock, freeing you to focus on what matters',
    why: 'More output, less effort',
  },
  {
    number: '04',
    title: 'Career & Freelance Launchpad',
    what: 'Position yourself as a digital professional with in-demand skills, a strong portfolio, and a clear path to earning',
    why: 'Ready to earn from day one',
  },
]

export default function ProductDepth() {
  return (
    <section className="relative py-32 sm:py-40 px-6">
      <div className="absolute inset-0 bg-gradient-mesh opacity-[0.04]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <Container size="wide" className="relative z-10 !max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 sm:mb-28"
        >
          <p className="text-type-100/45 text-[10px] uppercase tracking-[0.28em] font-semibold mb-10 sm:mb-12">
            What You Will Achieve
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.0] tracking-[-0.02em] mb-6">
            Real skills.{' '}
            <span className="bg-gradient-gold bg-clip-text text-transparent">Real outcomes.</span>
          </h2>
          <p className="text-type-100 text-base sm:text-lg leading-relaxed font-light max-w-md mx-auto">
            Every course ends with something tangible: a project, a portfolio piece, or a skill you can{' '}
            <span className="text-type-50 font-medium">use immediately</span>.
          </p>
        </motion.div>

        {/* List */}
        <div className="divide-y divide-white/[0.07]">
          {builds.map((build, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-[48px_1fr] md:grid-cols-[64px_1fr_auto] gap-x-8 lg:gap-x-14 gap-y-3 py-10 sm:py-12 hover:bg-white/[0.015] -mx-5 px-5 rounded-2xl transition-colors duration-300 cursor-default"
            >
              {/* Number */}
              <div className="font-mono text-[10px] text-gold-400/35 tracking-[0.3em] uppercase pt-1.5 group-hover:text-gold-400/65 transition-colors duration-300">
                {build.number}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-type-50 mb-2 tracking-[-0.015em] leading-snug">
                  {build.title}
                </h3>
                <p className="text-type-100 text-base sm:text-lg leading-relaxed">
                  {build.what}
                </p>
              </div>

              {/* Outcome */}
              <div className="col-start-2 md:col-start-auto flex items-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-main-800 border border-gold-400/15 text-gold-400/80 text-sm font-medium group-hover:border-gold-400/30 transition-colors duration-300">
                  {build.why}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </Container>
    </section>
  )
}
