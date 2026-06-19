'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogOut, Mail, User, CreditCard, BookOpen, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Student {
  id: string
  email: string
  name: string
  created_at: string
  email_confirmed: boolean
  enrollments_count: number
  applications_count: number
  has_payment: boolean
  course_progress: Array<{
    course_id: string
    course_title: string
    total_lessons: number
    completed_lessons: number
    percent: number
  }>
  enrollments: Array<{
    id: string
    course_id: string
    payment_status: string
    is_active: boolean
  }>
  applications: Array<{
    id: string
  course_id: string
    status: string
  }>
}

export default function AdminStudentsPage() {
  const supabase = createClient()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasPaidEnrollment = (student: Student) =>
    student.enrollments?.some((e) => e.payment_status === 'paid')
  const allProgress = students.flatMap((student) => student.course_progress || [])
  const averageProgress = allProgress.length
    ? Math.round(allProgress.reduce((sum, p) => sum + p.percent, 0) / allProgress.length)
    : 0
  const completedCourses = allProgress.filter(
    (p) => p.total_lessons > 0 && p.completed_lessons >= p.total_lessons
  ).length

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students')
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch students')
        setLoading(false)
        return
      }

      setStudents(data.students || [])
      setLoading(false)
    } catch (err: any) {
      setError('Failed to fetch students')
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    supabase?.auth.signOut().catch(() => {})
    window.location.href = '/admin/login'
  }

  const getStatusBadge = (student: Student) => {
    if (hasPaidEnrollment(student)) {
      return (
        <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm font-semibold flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          Paid
        </span>
      )
    }
    if (student.applications_count > 0) {
      return (
        <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-lg text-sm font-semibold flex items-center gap-1">
          <FileText className="w-3 h-3" />
          Applied
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded-lg text-sm font-semibold">
        Registered Only
      </span>
    )
  }

  return (
    <main className="min-h-screen bg-main-950 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-2">Students</h1>
            <p className="text-type-100">Manage all registered students</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/admin"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-main-900 border border-gold-400/20 text-gold-400 rounded-xl font-semibold hover:border-gold-400/50 transition-colors flex items-center gap-2"
            >
              Back to Dashboard
            </Link>
          <button
            onClick={handleSignOut}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            Sign Out
          </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="glass-card p-4 sm:p-6 rounded-2xl border border-gold-400/10">
            <div className="text-2xl sm:text-3xl font-bold text-gold-400 mb-1">{students.length}</div>
            <div className="text-type-100 text-sm">Total Students</div>
          </div>
          <div className="glass-card p-4 sm:p-6 rounded-2xl border border-gold-400/10">
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
              {students.filter((s) => hasPaidEnrollment(s)).length}
            </div>
            <div className="text-type-100 text-sm">With Payment</div>
          </div>
          <div className="glass-card p-4 sm:p-6 rounded-2xl border border-gold-400/10">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1">
              {students.filter(s => s.applications_count > 0 && !s.has_payment).length}
            </div>
            <div className="text-type-100 text-sm">Applied Only</div>
          </div>
          <div className="glass-card p-4 sm:p-6 rounded-2xl border border-gold-400/10">
            <div className="text-2xl sm:text-3xl font-bold text-gold-400 mb-1">
              {averageProgress}%
            </div>
            <div className="text-type-100 text-sm">Avg Course Progress</div>
          </div>
          <div className="glass-card p-4 sm:p-6 rounded-2xl border border-gold-400/10">
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
              {completedCourses}
            </div>
            <div className="text-type-100 text-sm">Completed Courses</div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-type-100">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-type-100 text-lg">No students found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4 sm:p-6 rounded-2xl border border-gold-400/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gold-400" />
                        <h3 className="text-lg sm:text-xl font-bold text-type-50">{student.name}</h3>
                      </div>
                      {getStatusBadge(student)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-type-100">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{student.email}</span>
                        {student.email_confirmed ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{student.enrollments_count} Enrollments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{student.applications_count} Applications</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollments */}
                {student.enrollments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gold-400/10">
                    <h4 className="text-sm font-semibold text-type-50 mb-2">Enrollments:</h4>
                    <div className="flex flex-wrap gap-2">
                      {student.enrollments.map((enrollment) => (
                        <span
                          key={enrollment.id}
                          className={`px-2 py-1 rounded-lg text-xs ${
                            enrollment.payment_status === 'paid'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                          }`}
                        >
                          {enrollment.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                  </span>
                      ))}
                                </div>
                                  </div>
                                )}

                {/* Applications */}
                {student.applications.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gold-400/10">
                    <h4 className="text-sm font-semibold text-type-50 mb-2">Applications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {student.applications.map((application) => (
                                  <span
                          key={application.id}
                          className={`px-2 py-1 rounded-lg text-xs ${
                            application.status === 'approved'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                              : application.status === 'rejected'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                          }`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                  </span>
                      ))}
                  </div>
                  </div>
                )}

                {/* Progress */}
                {student.course_progress.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gold-400/10">
                    <h4 className="text-sm font-semibold text-type-50 mb-2">Progress:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {student.course_progress.map((progress) => (
                        <div
                          key={progress.course_id}
                          className="p-3 rounded-xl bg-main-900 border border-gold-400/10"
                        >
                          <div className="text-sm font-semibold text-type-50 mb-1">
                            {progress.course_title}
                          </div>
                          <div className="flex items-center justify-between text-xs text-type-100 mb-2">
                            <span>
                              {progress.completed_lessons}/{progress.total_lessons} lessons
                            </span>
                            <span>{progress.percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-main-950 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-gold"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
    </div>
    </main>
  )
}
