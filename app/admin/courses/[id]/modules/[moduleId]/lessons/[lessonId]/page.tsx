'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  description: string | null
  content: string | null
  video_url: string | null
  content_type: 'text' | 'video' | 'mixed'
  order_index: number
}

export default function EditLessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const moduleId = params.moduleId as string
  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    content_type: 'text' as 'text' | 'video' | 'mixed',
  })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch lesson')
        setLoading(false)
        return
      }

      setLesson(data.lesson)
      setFormData({
        title: data.lesson.title,
        description: data.lesson.description || '',
        content: data.lesson.content || '',
        video_url: data.lesson.video_url || '',
        content_type: data.lesson.content_type || 'text',
      })
      setLoading(false)
    } catch (err: any) {
      setError('Failed to fetch lesson')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          content: formData.content || null,
          video_url: formData.video_url || null,
          content_type: formData.content_type,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to update lesson')
        setSaving(false)
        return
      }

      // Redirect back to course detail
      router.push(`/admin/courses/${courseId}`)
    } catch (err: any) {
      setError('Failed to update lesson')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        alert('Failed to delete lesson')
        return
      }

      router.push(`/admin/courses/${courseId}`)
    } catch (err) {
      alert('Failed to delete lesson')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-main-950 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-type-100">Loading lesson...</p>
        </div>
      </main>
    )
  }

  if (error || !lesson) {
    return (
      <main className="min-h-screen bg-main-950 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400">
            {error || 'Lesson not found'}
          </div>
          <Link
            href={`/admin/courses/${courseId}`}
            className="px-6 py-3 bg-main-900 border border-gold-400/20 text-gold-400 rounded-xl font-semibold hover:border-gold-400/50 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Course
          </Link>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-400">Edit Lesson</h1>
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
              Lesson Title *
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
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-type-50 mb-2">
              Content Type
            </label>
            <select
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value as 'text' | 'video' | 'mixed' })}
              className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 focus:outline-none focus:border-gold-400/50 transition-colors"
            >
              <option value="text">Text Content</option>
              <option value="video">Video Content</option>
              <option value="mixed">Mixed (Text + Video)</option>
            </select>
          </div>

          {(formData.content_type === 'text' || formData.content_type === 'mixed') && (
            <div>
              <label className="block text-sm font-semibold text-type-50 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required={formData.content_type === 'text'}
                rows={12}
                className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors resize-none font-mono text-sm"
              />
            </div>
          )}

          {(formData.content_type === 'video' || formData.content_type === 'mixed') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-type-50 mb-2">
                  Upload Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    setUploading(true)
                    setUploadProgress(0)

                    try {
                      const uploadFormData = new FormData()
                      uploadFormData.append('file', file)

                      const res = await fetch('/api/admin/upload-video', {
                        method: 'POST',
                        body: uploadFormData,
                      })

                      const data = await res.json()

                      if (!res.ok) {
                        setError(data.error || 'Failed to upload video')
                        setUploading(false)
                        return
                      }

                      setFormData({ ...formData, video_url: data.url })
                      setUploadProgress(100)
                    } catch (err) {
                      setError('Failed to upload video')
                    } finally {
                      setUploading(false)
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 focus:outline-none focus:border-gold-400/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold-400/20 file:text-gold-400 hover:file:bg-gold-400/30"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-main-900 rounded-full h-2">
                      <div
                        className="bg-gradient-gold h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-type-100 text-sm mt-1">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>
              <div className="text-center text-type-100 text-sm">OR</div>
              <div>
                <label className="block text-sm font-semibold text-type-50 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  required={formData.content_type === 'video' && !uploading}
                  className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
            </div>
          )}

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
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
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
