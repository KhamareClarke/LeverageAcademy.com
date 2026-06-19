'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    status: 'draft' as 'draft' | 'published',
  })

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch course')
        setLoading(false)
        return
      }

      setFormData({
        title: data.course.title,
        description: data.course.description || '',
        price: data.course.price.toString(),
        status: data.course.status,
      })
      setLoading(false)
    } catch (err: any) {
      setError('Failed to fetch course')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
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
        setError(data.error || 'Failed to update course')
        setSaving(false)
        return
      }

      // Redirect back to course detail
      router.push(`/admin/courses/${courseId}`)
    } catch (err: any) {
      setError('Failed to update course')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-main-950 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-type-100">Loading course...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-main-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/admin/courses/${courseId}`}
            className="p-2 rounded-xl bg-main-900 border border-gold-400/20 text-gold-400 hover:border-gold-400/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-400">Edit Course</h1>
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
              disabled={saving}
              className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
            <Link
              href={`/admin/courses/${courseId}`}
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
