'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Eye } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string | null
  price: number
  status: 'draft' | 'published'
  created_at: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    status: 'draft' as 'draft' | 'published',
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses')
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowForm(false)
        setFormData({ title: '', description: '', price: '', status: 'draft' })
        fetchCourses()
      }
    } catch (error) {
      console.error('Error creating course:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-type-100">Loading courses...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-5xl font-bold">
          <span className="bg-gradient-gold bg-clip-text text-transparent">
            Courses
          </span>
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Course
        </motion.button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-3xl border border-gold-400/10 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-type-50">Create New Course</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-type-100 text-sm font-semibold mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/10 text-type-50 focus:border-gold-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-type-100 text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/10 text-type-50 focus:border-gold-400/50 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-type-100 text-sm font-semibold mb-2">
                  Price (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/10 text-type-50 focus:border-gold-400/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-type-100 text-sm font-semibold mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                  className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/10 text-type-50 focus:border-gold-400/50 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold"
              >
                Create Course
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowForm(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 glass-pill text-type-50 rounded-xl font-semibold"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card p-6 rounded-3xl border border-gold-400/10 hover:border-gold-400/40 transition-all duration-500"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-type-50 flex-1">{course.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  course.status === 'published'
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                }`}
              >
                {course.status}
              </span>
            </div>
            {course.description && (
              <p className="text-type-100 text-sm mb-4 line-clamp-2">{course.description}</p>
            )}
            <div className="text-2xl font-bold mb-4 text-gold-400">£{course.price.toFixed(2)}</div>
            <div className="flex gap-3">
              <Link
                href={`/admin/courses/${course.id}`}
                className="flex-1 px-4 py-2 glass-pill text-type-50 rounded-xl font-semibold text-sm text-center hover:bg-white/10 transition-colors"
              >
                <Edit className="w-4 h-4 inline mr-2" />
                Manage
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20 text-type-100">
          No courses yet. Create your first course!
        </div>
      )}
    </div>
  )
}

