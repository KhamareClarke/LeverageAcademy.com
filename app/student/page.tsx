'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, CreditCard, CheckCircle, Clock, XCircle, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Application {
  id: string
  course: {
    id: string
    title: string
    price: number
  }
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

interface Enrollment {
  id: string
  course: {
    id: string
    title: string
  }
  payment_status: string
  is_active: boolean
}

interface CourseProgressSummary {
  course_id: string
  course_title: string
  total_lessons: number
  completed_lessons: number
  percent: number
}

export default function StudentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [applications, setApplications] = useState<Application[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [progressSummary, setProgressSummary] = useState<CourseProgressSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch applications
      const appRes = await fetch('/api/applications')
      const appData = await appRes.json()
      setApplications(appData.applications || [])

      // Fetch enrollments
      const enrollRes = await fetch('/api/enrollments')
      const enrollData = await enrollRes.json()
      setEnrollments(enrollData.enrollments || [])

      // Fetch progress summary
      const progressRes = await fetch('/api/student/progress-summary')
      const progressData = await progressRes.json()
      setProgressSummary(progressData.progress || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    supabase?.auth.signOut().catch(() => {})
    window.location.href = '/login'
  }

  const handlePayment = async (courseId: string, applicationId?: string) => {
    try {
      // Redirect to payment page
      const params = new URLSearchParams({
        course_id: courseId,
      })
      if (applicationId) {
        params.append('application_id', applicationId)
      }
      window.location.href = `/student/payment?${params.toString()}`
    } catch (err: any) {
      alert('Failed to initiate payment')
    }
  }

  const approvedApplications = applications.filter(app => app.status === 'approved')
  const pendingApplications = applications.filter(app => app.status === 'pending')
  const rejectedApplications = applications.filter(app => app.status === 'rejected')
  const paidEnrollments = enrollments.filter(e => e.payment_status === 'paid' && e.is_active)
  const progressMap = new Map(progressSummary.map((p) => [p.course_id, p]))
  
  // Check if student has paid enrollment for a course
  const hasPaidEnrollment = (courseId: string) => {
    return paidEnrollments.some(e => e.course?.id === courseId)
  }

  return (
    <main className="min-h-screen bg-main-950 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-2">Student Dashboard</h1>
            <p className="text-type-100">Manage your applications and courses</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            Sign Out
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-type-100">Loading...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {progressSummary.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-type-50 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-gold-400" />
                  Progress Overview
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {progressSummary.map((progress, index) => (
                    <motion.div
                      key={progress.course_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-6 rounded-2xl border border-gold-400/10"
                    >
                      <h3 className="text-lg font-bold text-type-50 mb-3">{progress.course_title}</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full"
                          style={{
                            background: `conic-gradient(#f7cf3f ${progress.percent}%, rgba(247, 207, 63, 0.2) 0)`,
                          }}
                        />
                        <div className="text-sm text-type-100">
                          <div className="text-type-50 font-semibold">{progress.percent}% Complete</div>
                          <div>
                            {progress.completed_lessons}/{progress.total_lessons} lessons
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-main-950 border border-gold-400/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-400"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            {/* My Courses (Paid Enrollments) */}
            {paidEnrollments.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-type-50 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-gold-400" />
                  My Courses
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paidEnrollments.map((enrollment, index) => {
                    const progress = progressMap.get(enrollment.course?.id || '')
                    return (
                    <motion.div
                      key={enrollment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-6 rounded-2xl border border-gold-400/10"
                    >
                      <h3 className="text-xl font-bold text-type-50 mb-2">{enrollment.course.title}</h3>
                      <div className="flex items-center gap-2 text-green-400 mb-4">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Enrolled</span>
                      </div>
                      {progress && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-type-100 mb-2">
                            <span>
                              {progress.completed_lessons}/{progress.total_lessons} lessons
                            </span>
                            <span>{progress.percent}%</span>
                          </div>
                          <div className="h-2 bg-main-950 border border-gold-400/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold-400"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <Link
                        href={`/student/courses/${enrollment.course?.id || ''}`}
                        className="block w-full px-4 py-2 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2"
                      >
                        View Course
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Approved Applications (Need Payment) */}
            {approvedApplications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-type-50 mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-gold-400" />
                  Complete Enrollment
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {approvedApplications.map((application, index) => {
                    const courseId = application.course?.id
                    const isPaidEnrolled = hasPaidEnrollment(courseId || '')
                    
                    return (
                      <motion.div
                        key={application.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card p-6 rounded-2xl border border-gold-400/10"
                      >
                        <h3 className="text-xl font-bold text-type-50 mb-2">{application.course?.title || 'Unknown Course'}</h3>
                        <div className="flex items-center gap-2 text-green-400 mb-4">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Application Approved</span>
                        </div>
                        {isPaidEnrolled ? (
                          <div className="text-type-100 text-sm mb-4">Payment completed - You have access</div>
                        ) : (
                          <>
                            <div className="text-2xl font-bold text-gold-400 mb-4">£{application.course?.price?.toFixed(2) || '0.00'}</div>
                            <button
                              onClick={() => handlePayment(courseId || '', application.id)}
                              className="w-full px-4 py-2 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                              <CreditCard className="w-4 h-4" />
                              Proceed to Payment
                            </button>
                          </>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Pending Applications */}
            {pendingApplications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-type-50 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  Pending Applications
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingApplications.map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-6 rounded-2xl border border-gold-400/10"
                    >
                      <h3 className="text-xl font-bold text-type-50 mb-2">{application.course.title}</h3>
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Awaiting Review</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Rejected Applications */}
            {rejectedApplications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-type-50 mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-400" />
                  Rejected Applications
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rejectedApplications.map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-6 rounded-2xl border border-red-400/20"
                    >
                      <h3 className="text-xl font-bold text-type-50 mb-2">{application.course?.title || 'Unknown Course'}</h3>
                      <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">Application Rejected</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {applications.length === 0 && enrollments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-type-100 text-lg mb-4">No applications or enrollments yet</p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
