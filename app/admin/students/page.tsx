'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, CheckCircle } from 'lucide-react'

interface Student {
  id: string
  email: string
  full_name: string | null
  enrollments: {
    course: {
      title: string
    }
    payment_status: string
  }[]
  progress: {
    completed: number
    total: number
  }
}

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      // Fetch enrollments to get student data
      const enrollmentsRes = await fetch('/api/enrollments')
      const enrollmentsData = await enrollmentsRes.json()

      // Group by user
      const studentMap: Record<string, any> = {}
      
      ;(enrollmentsData.enrollments || []).forEach((enrollment: any) => {
        if (!studentMap[enrollment.user.id]) {
          studentMap[enrollment.user.id] = {
            ...enrollment.user,
            enrollments: [],
            progress: { completed: 0, total: 0 },
          }
        }
        studentMap[enrollment.user.id].enrollments.push(enrollment)
      })

      setStudents(Object.values(studentMap))
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-type-100">Loading students...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-serif text-5xl font-bold mb-8">
        <span className="bg-gradient-gold bg-clip-text text-transparent">
          Students
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card p-6 rounded-3xl border border-gold-400/10 hover:border-gold-400/40 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-gold-400" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-type-50">{student.full_name || 'No name'}</div>
                <div className="text-sm text-type-100">{student.email}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-type-100">Enrollments</span>
                <span className="text-type-50 font-semibold">{student.enrollments.length}</span>
              </div>
              {student.enrollments.map((enrollment: any) => (
                <div key={enrollment.id} className="p-3 rounded-xl bg-main-900 border border-gold-400/10">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-gold-400" />
                    <span className="text-sm font-semibold text-type-50">{enrollment.course.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        enrollment.payment_status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {enrollment.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-20 text-type-100">
          No students enrolled yet
        </div>
      )}
    </div>
  )
}

