'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Clock, CheckCircle } from 'lucide-react'

interface Enrollment {
  id: string
  payment_status: 'pending' | 'paid' | 'failed'
  enrolled_at: string
  course: {
    id: string
    title: string
    description: string | null
    price: number
  }
}

interface Application {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  course: {
    id: string
    title: string
    price: number
  }
}

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [enrollmentsRes, applicationsRes] = await Promise.all([
        fetch('/api/enrollments'),
        fetch('/api/applications'),
      ])

      const enrollmentsData = await enrollmentsRes.json()
      const applicationsData = await applicationsRes.json()

      setEnrollments(enrollmentsData.enrollments || [])
      setApplications(applicationsData.applications || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-type-100">Loading...</div>
      </div>
    )
  }

  const paidEnrollments = enrollments.filter((e) => e.payment_status === 'paid')
  const pendingApplications = applications.filter((a) => a.status === 'pending')
  const approvedApplications = applications.filter((a) => a.status === 'approved')

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-5xl font-bold mb-4">
          <span className="bg-gradient-gold bg-clip-text text-transparent">
            My Dashboard
          </span>
        </h1>
        <p className="text-type-100 text-lg">Track your courses and applications</p>
      </div>

      {paidEnrollments.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-type-50">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paidEnrollments.map((enrollment, index) => (
              <Link key={enrollment.id} href={`/student/courses/${enrollment.course.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-card p-6 rounded-3xl border border-gold-400/10 hover:border-gold-400/40 transition-all duration-500 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-gold/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gold-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-type-50">{enrollment.course.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400 font-semibold">Enrolled</span>
                      </div>
                    </div>
                  </div>
                  {enrollment.course.description && (
                    <p className="text-type-100 text-sm line-clamp-2">{enrollment.course.description}</p>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {approvedApplications.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-type-50">Approved - Payment Required</h2>
          <div className="space-y-4">
            {approvedApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-gold-400/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-type-50 mb-1">{app.course.title}</div>
                    <div className="text-gold-400 font-semibold">£{app.course.price.toFixed(2)}</div>
                  </div>
                  <Link
                    href={`/student/payment/${app.id}`}
                    className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    Pay Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {pendingApplications.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-type-50">Pending Applications</h2>
          <div className="space-y-4">
            {pendingApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-gold-400/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-type-50 mb-1">{app.course.title}</div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-semibold">Awaiting Review</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {paidEnrollments.length === 0 && approvedApplications.length === 0 && pendingApplications.length === 0 && (
        <div className="text-center py-20">
          <p className="text-type-100 mb-6">You haven't enrolled in any courses yet.</p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  )
}

