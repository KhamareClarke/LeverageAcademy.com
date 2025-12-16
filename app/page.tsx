'use client'

import FloatingNav from '@/components/FloatingNav'
import Hero from '@/components/Hero'
import BentoGrid from '@/components/BentoGrid'
import { motion } from 'framer-motion'
import { Sparkles, Code2, Layers, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-main-950 text-type-50 overflow-hidden">
      <FloatingNav />
      
      <Hero />
      <BentoGrid />
      <ProductDepth />
      <AuthoritySection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}

function ProductDepth() {
  const builds = [
    {
      title: 'AI Agent Workflows',
      what: 'Autonomous systems that execute complex tasks',
      why: 'Time becomes irrelevant to output'
    },
    {
      title: 'Revenue Infrastructure',
      what: 'Monetization systems that operate independently',
      why: 'Income decouples from hours worked'
    },
    {
      title: 'Knowledge Systems',
      what: 'Information architectures that scale expertise',
      why: 'Your knowledge works while you sleep'
    },
    {
      title: 'Distribution Engines',
      what: 'Automated reach and influence mechanisms',
      why: 'Audience growth becomes systematic'
    }
  ]

  return (
    <section className="relative py-40 px-6">
      {/* Hero-style backgrounds */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-pulse-slow" />
      <div className="absolute top-1/4 right-0 w-[1000px] h-[1000px] bg-gradient-gold-radial opacity-20 blur-[140px] animate-float" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-gold-radial opacity-10 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-vignette" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 bg-gold-400/10 mb-8 shadow-glow-gold"
          >
            <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-400 text-xs uppercase tracking-widest font-bold">🏗️ Build Portfolio</span>
          </motion.div>
          <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-tight font-bold">What you <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">build here</span></h2>
          <p className="text-type-100 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-4 font-light">
            Every system is designed to compound. Every framework replaces effort with architecture.
          </p>
          <p className="text-type-100 text-lg max-w-3xl mx-auto leading-relaxed">
            This is not about learning faster. It's about building <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] font-semibold">assets that appreciate exponentially</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {builds.map((build, index) => (
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
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">{build.title}</span>
                </h3>
                <p className="text-type-100 text-lg mb-4 leading-relaxed">{build.what}</p>
                <div className="flex items-center gap-2 text-gold-400 text-base font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <p>{build.why}</p>
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
              Start Building Your Portfolio
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

function AuthoritySection() {
  return (
    <section className="relative py-40 px-6" id="about">
      {/* Hero-style backgrounds */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-pulse-slow" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-gold-radial opacity-20 blur-[140px] animate-float" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-gold-radial opacity-10 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-vignette" />
      
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 bg-gold-400/10 mb-12 shadow-glow-gold"
          >
            <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-400 text-xs uppercase tracking-widest font-bold">🏆 Proven Track Record</span>
          </motion.div>
          
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-8 -left-4 text-gold-400/20 text-8xl font-serif leading-none">"</div>
              <p className="font-serif text-3xl md:text-5xl lg:text-6xl text-type-50 leading-tight mb-12 italic font-medium relative z-10">
                Most people optimize for <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">speed</span>. We optimize for <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">systems</span>. The difference compounds <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">exponentially</span>.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gradient-gold" />
                <p className="text-gold-400 font-bold text-xl">Khamare Clarke</p>
                <div className="h-px w-12 bg-gradient-gold" />
              </div>
              <p className="text-type-100 text-sm mt-2 uppercase tracking-widest">Founder & Chief Architect</p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { value: '500+', label: 'Systems Built', description: 'Operational frameworks deployed' },
            { value: '50+', label: 'Ventures Launched', description: 'Businesses architected & scaled' },
            { value: '8+', label: 'Years Operating', description: 'Building leverage systems' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.05 }}
              className="group relative glass-card p-10 rounded-3xl border border-gold-400/10 hover:border-gold-400/50 transition-all duration-500 hover:shadow-glow-gold-lg backdrop-blur-2xl overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-gradient-gold-radial opacity-0 group-hover:opacity-15 transition-opacity duration-500" />
              <div className="absolute inset-0 border-2 border-gold-400/0 group-hover:border-gold-400/20 rounded-3xl transition-all duration-500" />
              <div className="relative z-10">
                <div className="font-serif text-7xl md:text-8xl bg-gradient-gold bg-clip-text text-transparent mb-4 font-bold animate-shimmer bg-[length:200%_auto]">{stat.value}</div>
                <div className="text-type-50 text-lg font-bold uppercase tracking-wider mb-3">{stat.label}</div>
                <div className="text-type-100 text-sm leading-relaxed">{stat.description}</div>
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
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <motion.button
              className="relative px-12 py-5 bg-gradient-gold text-black text-base font-bold rounded-xl overflow-hidden group shadow-glow-gold-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Apply Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </motion.button>
            <motion.button
              className="px-12 py-5 glass-pill text-type-50 text-base font-semibold rounded-xl hover:bg-white/10 border border-gold-400/30 hover:border-gold-400/50 transition-all duration-300 hover:shadow-glow-gold backdrop-blur-2xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View Case Studies
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    {
      question: 'Who is this for?',
      answer: 'Builders, operators, and founders who want to create systems that compound. Not for people looking for quick wins or passive income shortcuts.'
    },
    {
      question: 'What makes this different?',
      answer: 'No courses. No content dumps. You build real systems with real outcomes. Everything is designed to create leverage, not just knowledge.'
    },
    {
      question: 'How does the application process work?',
      answer: 'Submit an application. We review your background and goals. If accepted, you gain immediate access to the platform and community.'
    },
    {
      question: 'What is the time commitment?',
      answer: 'This is self-paced. Most members spend 5-10 hours per week building. The focus is on output, not hours logged.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes. 30-day full refund if the platform is not what you expected. No questions asked.'
    }
  ]

  return (
    <section className="relative py-40 px-6" id="faq">
      <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/20 bg-gold-400/5 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-400 text-xs uppercase tracking-widest font-bold">❓ Common Questions</span>
          </motion.div>
          <h2 className="font-serif text-5xl md:text-6xl mb-4 font-bold">
            <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group p-8 rounded-2xl glass-card border border-gold-400/10 hover:border-gold-400/30 transition-all duration-300 backdrop-blur-2xl"
            >
              <h3 className="text-2xl font-bold mb-4">
                <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">{faq.question}</span>
              </h3>
              <p className="text-type-100 text-lg leading-relaxed">{faq.answer}</p>
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
              Ready to Apply?
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="relative py-40 px-6">
      <div className="absolute inset-0 bg-gradient-gold-radial opacity-5 blur-[140px] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-mesh opacity-8" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 bg-gold-400/10 mb-10 shadow-glow-gold"
        >
          <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-gold-400 text-xs uppercase tracking-widest font-bold">⚡ Limited Availability</span>
        </motion.div>
        <h2 className="font-serif text-6xl md:text-8xl text-type-50 mb-12 leading-tight font-bold">
          Build leverage<br />
          <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">or stay linear</span>
        </h2>
        <p className="text-type-100 text-2xl md:text-3xl leading-relaxed mb-16 max-w-4xl mx-auto font-light">
          Leverage Academy is not for everyone. It's for elite builders who want <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] font-semibold">systems that work while they sleep</span>.
        </p>
        <motion.button 
          className="relative px-16 py-6 bg-gradient-gold text-black text-lg font-bold rounded-xl overflow-hidden group shadow-glow-gold-lg"
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center gap-3">
            Apply for Leverage Academy
            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </motion.button>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-type-200/20 flex items-center justify-center">
              <span className="text-type-200 font-bold text-sm">L</span>
            </div>
            <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] text-type-50 font-semibold text-sm tracking-tight">Leverage Academy</span>
          </div>
          
          <div className="flex gap-8 text-xs uppercase tracking-widest font-medium">
            <a href="#" className="text-type-100 hover:text-type-50 transition-colors duration-200">Privacy</a>
            <a href="#" className="text-type-100 hover:text-type-50 transition-colors duration-200">Terms</a>
            <a href="#" className="text-type-100 hover:text-type-50 transition-colors duration-200">Contact</a>
          </div>
          
          <div className="text-xs text-type-100">
            © 2024 Leverage Academy
          </div>
        </div>
      </div>
    </footer>
  )
}
