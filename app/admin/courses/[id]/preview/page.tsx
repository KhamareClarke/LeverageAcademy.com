'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, BookOpen, Play, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string | null
  price: number
  status: string
}

interface Module {
  id: string
  title: string
  description: string | null
  order_index: number
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  description: string | null
  content: string | null
  video_url: string | null
  content_type: 'text' | 'video' | 'mixed'
  order_index: number
}

export default function CoursePreviewPage() {
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      setCourse(data.course)
      setModules(data.modules || [])
      setLoading(false)
    } catch (err: any) {
      setError('Failed to fetch course')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-main-950 p-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-type-100">Loading course...</p>
        </div>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-main-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400">
            {error || 'Course not found'}
          </div>
          <Link
            href="/admin/courses"
            className="px-6 py-3 bg-main-900 border border-gold-400/20 text-gold-400 rounded-xl font-semibold hover:border-gold-400/50 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-main-950">
      <div className="flex h-screen">
        {/* Sidebar - Course Content */}
        <div className="w-80 bg-main-900 border-r border-gold-400/10 overflow-y-auto">
          <div className="p-6 border-b border-gold-400/10">
            <Link
              href={`/admin/courses/${courseId}`}
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-4 text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </Link>
            <h1 className="text-xl font-bold text-type-50 mb-2">{course.title}</h1>
            {course.description && (
              <p className="text-type-100 text-sm">{course.description}</p>
            )}
          </div>

          <div className="p-4">
            {modules.length === 0 ? (
              <p className="text-type-100 text-sm text-center py-8">No modules yet</p>
            ) : (
              <div className="space-y-6">
                {modules.map((module) => (
                  <div key={module.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-gold-400" />
                      <h3 className="font-bold text-type-50">{module.title}</h3>
                    </div>
                    {module.description && (
                      <p className="text-type-100 text-xs mb-3 ml-6">{module.description}</p>
                    )}
                    <div className="space-y-1 ml-6">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`w-full text-left p-3 rounded-xl transition-colors ${
                            selectedLesson?.id === lesson.id
                              ? 'bg-gradient-gold/20 border border-gold-400/50'
                              : 'bg-main-950 border border-gold-400/10 hover:border-gold-400/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {lesson.content_type === 'video' ? (
                              <Play className="w-4 h-4 text-gold-400" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-gold-400" />
                            )}
                            <span className="text-type-50 text-sm font-medium">{lesson.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedLesson ? (
            <div className="max-w-4xl mx-auto p-8">
              <h2 className="text-3xl font-bold text-type-50 mb-4">{selectedLesson.title}</h2>
              {selectedLesson.description && (
                <p className="text-type-100 mb-6">{selectedLesson.description}</p>
              )}

              {/* Video Content */}
              {(selectedLesson.content_type === 'video' || selectedLesson.content_type === 'mixed') && selectedLesson.video_url && (
                <div className="mb-8">
                  <div className="aspect-video bg-main-900 rounded-2xl border border-gold-400/10 overflow-hidden">
                    {selectedLesson.video_url.includes('youtube.com') || selectedLesson.video_url.includes('youtu.be') ? (
                      <iframe
                        src={
                          selectedLesson.video_url.includes('youtu.be/')
                            ? `https://www.youtube.com/embed/${selectedLesson.video_url.split('youtu.be/')[1].split('?')[0]}`
                            : selectedLesson.video_url.includes('watch?v=')
                            ? `https://www.youtube.com/embed/${selectedLesson.video_url.split('watch?v=')[1].split('&')[0]}`
                            : selectedLesson.video_url
                        }
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={selectedLesson.video_url}
                        controls
                        className="w-full h-full"
                        style={{ objectFit: 'contain' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </div>
              )}

              {/* Text Content */}
              {(selectedLesson.content_type === 'text' || selectedLesson.content_type === 'mixed') && selectedLesson.content && (
                <div className="glass-card p-6 rounded-2xl border border-gold-400/10">
                  <div
                    className="prose prose-invert max-w-none text-type-50"
                    dangerouslySetInnerHTML={{ __html: selectedLesson.content.replace(/\n/g, '<br />') }}
                  />
                </div>
              )}

              {!selectedLesson.content && !selectedLesson.video_url && (
                <div className="glass-card p-12 rounded-2xl border border-gold-400/10 text-center">
                  <p className="text-type-100">No content added to this lesson yet</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gold-400/50 mx-auto mb-4" />
                <p className="text-type-100 text-lg">Select a lesson to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
