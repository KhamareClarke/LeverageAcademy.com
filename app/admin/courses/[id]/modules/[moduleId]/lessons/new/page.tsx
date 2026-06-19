'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewLessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const moduleId = params.moduleId as string

  const [loading, setLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Don't allow submission while uploading
    if (uploading) {
      setError('Please wait for video upload to complete')
      return
    }
    
    setLoading(true)
    setError(null)

    // Validate required fields based on content type
    if (formData.content_type === 'video' && !formData.video_url?.trim()) {
      setError('Video URL is required for video content type. Please upload a video or enter a URL.')
      setLoading(false)
      return
    }

    if (formData.content_type === 'text' && !formData.content?.trim()) {
      setError('Content is required for text content type')
      setLoading(false)
      return
    }

    if (formData.content_type === 'mixed' && !formData.video_url?.trim() && !formData.content?.trim()) {
      setError('Please provide either video URL or content (or both)')
      setLoading(false)
      return
    }

    try {
      console.log('Submitting lesson:', {
        title: formData.title,
        video_url: formData.video_url,
        content_type: formData.content_type,
      })

      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module_id: moduleId,
          course_id: courseId,
          title: formData.title,
          description: formData.description || null,
          content: formData.content || null,
          video_url: formData.video_url || null,
          content_type: formData.content_type,
          order_index: 0,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create lesson')
        setLoading(false)
        return
      }

      // Redirect back to course detail
      router.push(`/admin/courses/${courseId}`)
    } catch (err: any) {
      setError('Failed to create lesson')
      setLoading(false)
    }
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-400">New Lesson</h1>
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
              placeholder="e.g., Introduction to AI Agents"
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
              placeholder="Brief description of the lesson..."
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
                placeholder="Enter lesson content (markdown supported)..."
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

                    // Check file size (max 500MB)
                    const maxSize = 500 * 1024 * 1024
                    if (file.size > maxSize) {
                      setError('File size must be less than 500MB')
                      return
                    }

                    setUploading(true)
                    setUploadProgress(5)
                    setError(null)

                    try {
                      const uploadFormData = new FormData()
                      uploadFormData.append('file', file)

                      // Simulate progress (since we can't track actual upload progress easily)
                      const progressInterval = setInterval(() => {
                        setUploadProgress((prev) => {
                          if (prev >= 90) {
                            clearInterval(progressInterval)
                            return prev
                          }
                          return prev + 5
                        })
                      }, 500)

                      const res = await fetch('/api/admin/upload-video', {
                        method: 'POST',
                        body: uploadFormData,
                      })

                      clearInterval(progressInterval)
                      setUploadProgress(95)

                      const data = await res.json()

                      if (!res.ok) {
                        setError(data.error || 'Failed to upload video')
                        setUploading(false)
                        setUploadProgress(0)
                        return
                      }

                      setUploadProgress(100)
                      setFormData((prev) => ({ ...prev, video_url: data.url }))
                      setError(null)
                      
                      // Wait a moment to show completion, then allow form submission
                      setTimeout(() => {
                        setUploading(false)
                      }, 1000)
                    } catch (err: any) {
                      console.error('Upload error:', err)
                      setError('Failed to upload video: ' + (err.message || 'Unknown error'))
                      setUploading(false)
                      setUploadProgress(0)
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
                    <p className="text-type-100 text-sm mt-1">
                      {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Upload complete!'}
                    </p>
                  </div>
                )}
                {formData.video_url && !uploading && (
                  <div className="mt-2 p-3 rounded-xl bg-green-500/10 border border-green-500/50">
                    <p className="text-green-400 text-sm">✓ Video URL set: {formData.video_url.substring(0, 50)}...</p>
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
                  placeholder="https://youtube.com/watch?v=... or video URL"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading || uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {uploading ? `Uploading... ${uploadProgress}%` : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Lesson
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
