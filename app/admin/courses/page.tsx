'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, BookOpen, Edit, Trash2, Eye, EyeOff, LogOut, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string | null
  price: number
  status: 'draft' | 'published'
  created_at: string
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch courses')
        setLoading(false)
        return
      }

      setCourses(data.courses || [])
      setLoading(false)
    } catch (err: any) {
      setError('Failed to fetch courses')
      setLoading(false)
    }
  }

  const handleToggleStatus = async (courseId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        alert('Failed to update course status')
        return
      }

      fetchCourses()
    } catch (err) {
      alert('Failed to update course status')
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        alert('Failed to delete course')
        return
      }

      fetchCourses()
    } catch (err) {
      alert('Failed to delete course')
    }
  }

  const handleSignOut = () => {
    supabase?.auth.signOut().catch(() => {})
    window.location.href = '/admin/login'
  }

  return (
    <main className="min-h-screen bg-main-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-main-900 border border-gold-400/20 text-gold-400 hover:border-gold-400/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold-400">Courses</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/courses/new"
              className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Course
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
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
            <p className="text-type-100">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gold-400/50 mx-auto mb-4" />
            <p className="text-type-100 text-lg mb-4">No courses yet</p>
            <Link
              href="/admin/courses/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 rounded-2xl border border-gold-400/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-gold-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-type-50">{course.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {course.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        {course.description && (
                          <p className="text-type-100 text-sm mb-2 line-clamp-2">{course.description}</p>
                        )}
                        <div className="text-gold-400 font-semibold">£{course.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="px-4 py-2 bg-main-900 border border-gold-400/20 text-gold-400 rounded-xl font-semibold hover:border-gold-400/50 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(course.id, course.status)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                        course.status === 'published'
                          ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30'
                          : 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {course.status === 'published' ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Publish
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
