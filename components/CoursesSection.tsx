'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string | null
  price: number
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
      setCourses(data.courses?.slice(0, 6) || []) // Show first 6 courses
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="relative py-40 px-6">
        <div className="max-w-7xl mx-auto text-center text-type-100">Loading courses...</div>
      </section>
    )
  }

  if (courses.length === 0) {
    return null
  }

  return (
    <section className="relative py-40 px-6" id="courses">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-gradient-gold-radial opacity-10 blur-[120px] animate-float" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            <span className="text-gold-400 text-xs uppercase tracking-widest font-bold">📚 Available Courses</span>
          </motion.div>
          <h2 className="font-serif text-5xl md:text-7xl mb-8 font-bold leading-tight">
            Start building <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] inline-block">today</span>
          </h2>
          <p className="text-type-100 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Apply to courses designed to create <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] font-semibold inline-block">exponential leverage</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative glass-card p-8 rounded-3xl border border-gold-400/10 hover:border-gold-400/40 transition-all duration-500 hover:shadow-glow-gold-lg backdrop-blur-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-gold-radial opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-gold/10 flex items-center justify-center mb-6 group-hover:bg-gradient-gold/20 group-hover:scale-110 transition-all duration-500">
                  <BookOpen className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-type-50">{course.title}</h3>
                {course.description && (
                  <p className="text-type-100 text-sm mb-6 line-clamp-3">{course.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gold-400">£{course.price.toFixed(2)}</div>
                  <Link
                    href={`/apply/${course.id}`}
                    className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    Apply
                    <ArrowRight className="w-4 h-4" />
                  </Link>
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
          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-8 py-4 glass-pill text-type-50 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:shadow-glow-gold backdrop-blur-2xl"
          >
            View All Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

