'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    status: 'draft' as 'draft' | 'published',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          price: parseFloat(formData.price),
          status: formData.status,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create course')
        setLoading(false)
        return
      }

      // Redirect to course detail page
      router.push(`/admin/courses/${data.course.id}`)
    } catch (err: any) {
      setError('Failed to create course')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-main-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/courses"
            className="p-2 rounded-xl bg-main-900 border border-gold-400/20 text-gold-400 hover:border-gold-400/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-400">New Course</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 sm:p-8 rounded-2xl border border-gold-400/10 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-type-50 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors"
              placeholder="e.g., AI Agent Development"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-type-50 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
              placeholder="Describe what students will learn in this course..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-type-50 mb-2">
                Price (£) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors"
                placeholder="299.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-type-50 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 focus:outline-none focus:border-gold-400/50 transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Course
                </>
              )}
            </button>
            <Link
              href="/admin/courses"
              className="px-6 py-3 bg-main-900 border border-gold-400/20 text-type-50 rounded-xl font-semibold hover:border-gold-400/50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
