'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Brain, Building2, Zap, TrendingUp } from 'lucide-react'
import { Container } from '@/components/ui/container'

const features = [
  {
    number: '01',
    Icon: Brain,
    title: 'AI & Machine Learning',
    description: 'Learn to use, build, and integrate AI tools into your business or career. Understand how AI actually works and how to make it work for you.',
  },
  {
    number: '02',
    Icon: Building2,
    title: 'Web Design & Development',
    description: 'Build professional websites and web apps from the ground up. HTML, CSS, JavaScript, React, and the tools used by real development teams.',
  },
  {
    number: '03',
    Icon: Zap,
    title: 'Software & Automation',
    description: 'Write code, automate workflows, and build digital products. Skills that translate directly to freelance work, employment, or launching your own product.',
  },
  {
    number: '04',
    Icon: TrendingUp,
    title: 'Digital Business Skills',
    description: 'Marketing, branding, content, and monetisation. Everything you need to launch and grow a digital career, a side income, or a full business.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function BentoGrid() {
  return (
    <section className="relative py-32 sm:py-40 px-6" id="curriculum">
      <div className="absolute inset-0 bg-gradient-mesh opacity-[0.05]" />
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
            Premium Curriculum
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.0] tracking-[-0.02em] mb-6">
            A different way to{' '}
            <span className="bg-gradient-gold bg-clip-text text-transparent">build</span>
          </h2>
          <p className="text-type-100 text-base sm:text-lg leading-relaxed font-light max-w-md mx-auto">
            Not courses. Not content.{' '}
            <span className="text-type-50 font-medium">Systems that compound exponentially</span>.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.number}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-main-800 border border-white/[0.07] hover:border-gold-400/35 rounded-2xl p-10 sm:p-12 overflow-hidden transition-colors duration-300 cursor-default"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/0 to-transparent group-hover:via-gold-400/30 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-gold-radial opacity-0 group-hover:opacity-[0.025] transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-10">
                  <span className="font-mono text-4xl sm:text-5xl font-bold text-gold-400/50 tracking-[-0.02em] leading-none group-hover:text-gold-400 transition-colors duration-300">
                    {feature.number}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-main-950/70 border border-white/[0.07] flex items-center justify-center group-hover:border-gold-400/20 transition-colors duration-300">
                    <feature.Icon className="w-4 h-4 text-gold-400/50 group-hover:text-gold-400/80 transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl sm:text-[1.65rem] font-bold text-type-50 mb-4 tracking-[-0.02em] leading-[1.15]">
                  {feature.title}
                </h3>
                <p className="text-type-100 text-base leading-[1.8]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 sm:mt-24 text-center"
        >
          <motion.a
            href="#courses"
            className="group inline-flex items-center gap-2.5 px-10 py-4 sm:py-5 border border-white/10 hover:border-gold-400/35 text-type-50 text-sm font-semibold rounded-xl hover:bg-white/[0.03] transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Full Curriculum
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.a>
        </motion.div>

      </Container>
    </section>
  )
}
