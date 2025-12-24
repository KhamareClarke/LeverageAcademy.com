'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string | null
  price: number
}

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
    fetchCourse()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?redirect=/apply/' + courseId)
      return
    }
    setUser(user)
  }

  const fetchCourse = async () => {
    try {
      const res = await fetch('/api/courses')
      const data = await res.json()
      const foundCourse = data.courses?.find((c: Course) => c.id === courseId)
      setCourse(foundCourse || null)
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          message: message || null,
        }),
      })

      if (res.ok) {
        router.push('/student')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-main-950 flex items-center justify-center">
        <div className="text-type-100">Loading...</div>
      </main>
    )
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-main-950 flex items-center justify-center">
        <div className="text-type-100">Course not found</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-main-950 px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 rounded-3xl border border-gold-400/10"
        >
          <h1 className="font-serif text-4xl font-bold mb-4 text-type-50">
            Apply for <span className="bg-gradient-gold bg-clip-text text-transparent">{course.title}</span>
          </h1>
          <p className="text-type-100 mb-8">{course.description || 'Submit your application to enroll in this course.'}</p>

          <div className="mb-8 p-6 rounded-2xl bg-main-900 border border-gold-400/10">
            <div className="flex items-center justify-between">
              <span className="text-type-100">Course Price</span>
              <span className="text-2xl font-bold text-gold-400">£{course.price.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-type-100 text-sm font-semibold mb-2">
                Why do you want to enroll? (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/10 text-type-50 focus:border-gold-400/50 focus:outline-none"
                placeholder="Tell us about your goals and what you hope to achieve..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="w-full relative px-6 py-4 bg-gradient-gold text-black text-base font-bold rounded-xl overflow-hidden group shadow-glow-gold-lg disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? 'Submitting...' : 'Submit Application'}
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </span>
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-type-100 text-center">
            Your application will be reviewed by an admin. You'll be notified once a decision is made.
          </p>
        </motion.div>
      </div>
    </main>
  )
}

