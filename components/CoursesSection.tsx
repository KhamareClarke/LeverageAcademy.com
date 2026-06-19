'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Brain, Layers, TrendingUp } from 'lucide-react'
import { Container } from '@/components/ui/container'

const thumbnailIcons = [Brain, Layers, TrendingUp]

interface Course {
  id: string
  title: string
  description: string | null
  price: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses')
      const data = await res.json()
      setCourses(data.courses?.slice(0, 6) || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="relative py-32 sm:py-40 px-6 bg-main-900" id="courses">
        <Container size="wide" className="!max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-28">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/[0.03] animate-pulse border border-white/[0.05]" />
            ))}
          </div>
        </Container>
      </section>
    )
  }

  if (courses.length === 0) return null

  return (
    <section className="relative py-32 sm:py-40 px-6 bg-main-900" id="courses">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-[0.04]" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-gradient-gold-radial opacity-[0.03] blur-[140px] -translate-y-1/2" />

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
            Available Courses
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.0] tracking-[-0.02em] mb-6">
            Start building{' '}
            <span className="bg-gradient-gold bg-clip-text text-transparent">today</span>
          </h2>
          <p className="text-type-100 text-base sm:text-lg leading-relaxed font-light max-w-md mx-auto">
            Apply to courses designed to create{' '}
            <span className="text-type-50 font-medium">exponential leverage</span>.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {courses.map((course, index) => {
            const Icon = thumbnailIcons[index % thumbnailIcons.length]
            return (
              <motion.div
                key={course.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-main-800 border border-white/[0.07] hover:border-gold-400/35 rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-28 bg-main-950 border-b border-white/[0.06] overflow-hidden flex-shrink-0">
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(247,207,63,1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-main-950/80 to-transparent" />
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <div className="w-8 h-8 rounded-lg bg-main-800/80 border border-gold-400/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gold-400/60" />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 sm:p-8 flex flex-col flex-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-type-50 mb-3 tracking-[-0.015em] leading-snug">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-type-100 text-sm leading-[1.75] mb-6 line-clamp-3 flex-1">
                      {course.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-5 border-t border-white/[0.06] mt-auto">
                    <span className="font-serif text-2xl font-bold text-type-50 tracking-tight">
                      £{course.price.toFixed(2)}
                    </span>
                    <Link
                      href={`/apply/${course.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-black rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      Apply
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 sm:mt-24 text-center"
        >
          <Link
            href="/student"
            className="group inline-flex items-center gap-2.5 px-10 py-4 sm:py-5 border border-white/10 hover:border-gold-400/35 text-type-50 text-sm font-semibold rounded-xl hover:bg-white/[0.03] transition-all duration-300"
          >
            View All Courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

      </Container>
    </section>
  )
}
