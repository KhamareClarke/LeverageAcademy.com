'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Container } from '@/components/ui/container'

const faqs = [
  {
    question: 'Who is this for?',
    answer: 'Anyone who wants to build a future in technology: whether you\'re a business owner adopting AI, a student exploring career options, or a professional upskilling into digital. No prior experience is required.',
  },
  {
    question: 'Do I need a technical background?',
    answer: 'Not at all. Every course is designed to start from the basics and build to professional level. You\'ll know exactly where to begin, and the structure guides you step by step.',
  },
  {
    question: 'What subjects do you cover?',
    answer: 'AI and machine learning, web design and development, software and automation, and digital business skills. New courses are added regularly to stay current with the industry.',
  },
  {
    question: 'How does the platform work?',
    answer: 'Enrol in a course, work through structured lessons at your own pace, complete real projects, and apply your skills immediately. You keep lifetime access to everything you purchase.',
  },
  {
    question: 'Is there a refund policy?',
    answer: 'Yes. Full refund within 30 days of purchase if the course is not right for you. No questions asked.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative py-32 sm:py-40 px-6" id="faq">
      <div className="absolute inset-0 bg-gradient-mesh opacity-[0.03]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <Container size="wide" className="relative z-10 !max-w-3xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 sm:mb-28"
        >
          <p className="text-type-100/45 text-[10px] uppercase tracking-[0.28em] font-semibold mb-10 sm:mb-12">
            Common Questions
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.0] tracking-[-0.02em]">
            Questions
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="divide-y divide-white/[0.08]">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-8 py-8 text-left group cursor-pointer"
              >
                <h3 className={`text-base sm:text-lg font-semibold tracking-[-0.01em] transition-colors duration-200 ${
                  openIndex === index ? 'text-type-50' : 'text-type-100 group-hover:text-type-50'
                }`}>
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                    openIndex === index
                      ? 'border-gold-400/40 bg-gold-400/[0.08]'
                      : 'border-white/10 group-hover:border-gold-400/25'
                  }`}
                >
                  <Plus className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    openIndex === index ? 'text-gold-400' : 'text-type-100 group-hover:text-gold-400'
                  }`} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-type-100 text-base sm:text-lg leading-[1.85] pb-8 pr-12">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />
    </section>
  )
}
