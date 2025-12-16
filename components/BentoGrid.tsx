'use client'

import { motion } from 'framer-motion'
import { Brain, Workflow, Zap, Target } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Systems Architecture',
    description: 'Design intelligent systems that scale beyond human capacity',
    span: 'col-span-1'
  },
  {
    icon: Workflow,
    title: 'Business Infrastructure',
    description: 'Build operational frameworks that run without constant oversight',
    span: 'col-span-1'
  },
  {
    icon: Zap,
    title: 'Automation & Process Leverage',
    description: 'Replace repetitive effort with systematic execution',
    span: 'col-span-1'
  },
  {
    icon: Target,
    title: 'Venture Design',
    description: 'Architect businesses as products, not projects',
    span: 'col-span-1'
  }
]

export default function BentoGrid() {
  return (
    <section className="relative py-40 px-6" id="curriculum">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-gradient-gold-radial opacity-10 blur-[120px] animate-float" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/20 bg-gold-400/5 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-400 text-xs uppercase tracking-widest font-bold">🎓 Premium Curriculum</span>
          </motion.div>
          <h2 className="font-serif text-5xl md:text-7xl mb-8 font-bold leading-tight">
            A different way to <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">build</span>
          </h2>
          <p className="text-type-100 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Not courses. Not content. <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] font-semibold inline-block">Systems that compound exponentially</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative glass-card p-12 rounded-3xl border border-gold-400/10 hover:border-gold-400/40 transition-all duration-500 hover:shadow-glow-gold-lg backdrop-blur-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-gold-radial opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="relative z-10 flex items-start gap-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-gold/20 group-hover:scale-110 transition-all duration-500 shadow-glow-gold">
                  <feature.icon className="w-10 h-10 text-gold-400" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">
                    <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">{feature.title}</span>
                  </h3>
                  <p className="text-type-100 text-xl leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            className="relative px-12 py-5 bg-gradient-gold text-black text-base font-bold rounded-xl overflow-hidden group shadow-glow-gold-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Explore Full Curriculum
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
