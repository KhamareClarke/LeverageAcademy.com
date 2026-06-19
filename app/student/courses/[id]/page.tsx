'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, BookOpen, Play, CheckCircle, Lock, Circle } from 'lucide-react'
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

interface LessonProgress {
  lesson_id: string
  completed: boolean
}

interface ModuleProgress {
  module_id: string
  module_completed: boolean
  lessons_completed: number
  total_lessons: number
}

export default function StudentCoursePage() {
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({})
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({})
  const [completingLesson, setCompletingLesson] = useState<string | null>(null)
  const [completingModule, setCompletingModule] = useState<string | null>(null)
  const [certificateLoading, setCertificateLoading] = useState(false)

  useEffect(() => {
    fetchCourse()
    fetchProgress()
    fetchModuleProgress()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/student/courses/${courseId}`)
      const data = await res.json()

      if (!res.ok) {
        // If payment required, show specific message
        if (res.status === 403) {
          setError('Payment required to access this course. Please complete your enrollment.')
        } else {
          setError(data.error || 'Failed to fetch course')
        }
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

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/progress?course_id=${courseId}`)
      const data = await res.json()
      const map: Record<string, LessonProgress> = {}
      ;(data.progress || []).forEach((p: LessonProgress) => {
        map[p.lesson_id] = p
      })
      setLessonProgress(map)
    } catch (err) {
      console.error('Failed to fetch lesson progress:', err)
    }
  }

  const fetchModuleProgress = async () => {
    try {
      const res = await fetch(`/api/module-progress?course_id=${courseId}`)
      const data = await res.json()
      const map: Record<string, ModuleProgress> = {}
      ;(data.progress || []).forEach((p: ModuleProgress) => {
        map[p.module_id] = p
      })
      setModuleProgress(map)
    } catch (err) {
      console.error('Failed to fetch module progress:', err)
    }
  }

  const handleCompleteLesson = async (lessonId: string) => {
    if (completingLesson) return
    setCompletingLesson(lessonId)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lessonId, course_id: courseId, completed: true }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to complete lesson')
      }
      await fetchProgress()
      await fetchModuleProgress()
    } catch (err) {
      console.error('Failed to complete lesson:', err)
    } finally {
      setCompletingLesson(null)
    }
  }

  const handleCompleteModule = async (moduleId: string) => {
    if (completingModule) return
    setCompletingModule(moduleId)
    try {
      const res = await fetch('/api/module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_id: moduleId, course_id: courseId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to complete module')
      }
      await fetchModuleProgress()
    } catch (err) {
      console.error('Failed to complete module:', err)
    } finally {
      setCompletingModule(null)
    }
  }

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
  const completedLessons = Object.values(lessonProgress).filter((p) => p.completed).length
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const getModuleStats = (module: Module) => {
    const total = module.lessons?.length || 0
    const completed = module.lessons.filter((lesson) => lessonProgress[lesson.id]?.completed).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    const isCompleted =
      moduleProgress[module.id]?.module_completed || (total > 0 && completed === total)
    return { total, completed, percent, isCompleted }
  }

  const downloadCertificate = async () => {
    if (certificateLoading) return
    setCertificateLoading(true)
    try {
      const res = await fetch(`/api/student/certificates?course_id=${courseId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch certificate')
        return
      }

      if (!data.eligible) {
        setError('Complete all lessons to download your certificate.')
        return
      }

      const name = data.name || 'Student'
      const courseTitle = data.course_title || course?.title || 'Course'
      const completionDate = data.completed_at
        ? new Date(data.completed_at).toLocaleDateString()
        : new Date().toLocaleDateString()

      const canvas = document.createElement('canvas')
      canvas.width = 1600
      canvas.height = 1200
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        setError('Failed to generate certificate.')
        return
      }

      ctx.fillStyle = '#0b0f1c'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = '#f7cf3f'
      ctx.lineWidth = 12
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

      ctx.strokeStyle = 'rgba(247, 207, 63, 0.3)'
      ctx.lineWidth = 4
      ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160)

      ctx.fillStyle = '#f7cf3f'
      ctx.font = 'bold 64px serif'
      ctx.textAlign = 'center'
      ctx.fillText('Certificate of Completion', canvas.width / 2, 240)

      ctx.fillStyle = '#f5f5f5'
      ctx.font = '28px sans-serif'
      ctx.fillText('This certifies that', canvas.width / 2, 340)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 56px serif'
      ctx.fillText(name, canvas.width / 2, 430)

      ctx.fillStyle = '#f5f5f5'
      ctx.font = '28px sans-serif'
      ctx.fillText('has successfully completed', canvas.width / 2, 520)

      ctx.fillStyle = '#f7cf3f'
      ctx.font = 'bold 48px serif'
      ctx.fillText(courseTitle, canvas.width / 2, 610)

      ctx.fillStyle = '#f5f5f5'
      ctx.font = '24px sans-serif'
      ctx.fillText(`Date: ${completionDate}`, canvas.width / 2, 720)
      ctx.fillText('Leverage Academy', canvas.width / 2, 800)

      const dataUrl = canvas.toDataURL('image/png')
      const safeName = String(courseTitle).replace(/[^a-z0-9-_]+/gi, '_')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `certificate_${safeName || 'course'}.png`
      link.click()
    } catch (err) {
      console.error('Certificate download failed:', err)
      setError('Failed to download certificate.')
    } finally {
      setCertificateLoading(false)
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
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/student"
              className="px-6 py-3 bg-main-900 border border-gold-400/20 text-gold-400 rounded-xl font-semibold hover:border-gold-400/50 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            {error?.toLowerCase().includes('payment') && (
              <Link
                href={`/student/payment?course_id=${courseId}`}
                className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Pay to Access
              </Link>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-main-950">
      <div className="flex flex-col lg:flex-row lg:h-screen">
        <div className="w-full lg:w-80 bg-main-900 border-b lg:border-b-0 lg:border-r border-gold-400/10 lg:overflow-y-auto">
          <div className="p-4 sm:p-6 border-b border-gold-400/10">
            <Link
              href="/student"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-4 text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-type-50 mb-2">{course.title}</h1>
            {course.description && (
              <p className="text-type-100 text-sm">{course.description}</p>
            )}
            <div className="mt-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full"
                style={{
                  background: `conic-gradient(#f7cf3f ${progressPercent}%, rgba(247, 207, 63, 0.2) 0)`,
                }}
              />
              <div className="text-xs text-type-100">
                <div className="text-type-50 font-semibold">{progressPercent}% Complete</div>
                <div>{completedLessons}/{totalLessons} lessons</div>
              </div>
            </div>
            {progressPercent >= 100 && (
              <button
                onClick={downloadCertificate}
                className="mt-4 w-full px-4 py-2 bg-gradient-gold text-black rounded-lg font-bold hover:opacity-90 transition-opacity"
                disabled={certificateLoading}
              >
                {certificateLoading ? 'Preparing...' : 'Download Certificate'}
              </button>
            )}
          </div>

          <div className="p-4 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
            {modules.length === 0 ? (
              <p className="text-type-100 text-sm text-center py-8">No modules yet</p>
            ) : (
              <div className="space-y-6">
                {modules.map((module) => {
                  const stats = getModuleStats(module)
                  return (
                  <div key={module.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-gold-400" />
                      <h3 className="font-bold text-type-50">{module.title}</h3>
                    </div>
                    {module.description && (
                      <p className="text-type-100 text-xs mb-3 ml-6">{module.description}</p>
                    )}
                    <div className="ml-6 mb-3">
                      <div className="h-2 bg-main-950 border border-gold-400/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-400"
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                      <div className="text-xs text-type-100 mt-1">
                        {stats.completed}/{stats.total} lessons • {stats.percent}%
                      </div>
                    </div>
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
                            {lessonProgress[lesson.id]?.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-type-100" />
                            )}
                            <span className="text-type-50 text-sm font-medium">{lesson.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    {stats.isCompleted ? (
                      <div className="mt-3 ml-6 text-xs text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Module completed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteModule(module.id)}
                        className="mt-3 ml-6 px-3 py-2 text-xs bg-main-950 border border-gold-400/20 text-type-50 rounded-lg hover:border-gold-400/50 transition-colors"
                        disabled={completingModule === module.id || stats.completed < stats.total}
                      >
                        {stats.completed < stats.total
                          ? 'Complete lessons to unlock'
                          : completingModule === module.id
                          ? 'Completing...'
                          : 'Complete Module'}
                      </button>
                    )}
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          {selectedLesson ? (
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-type-50 mb-4">
                {selectedLesson.title}
              </h2>
              {selectedLesson.description && (
                <p className="text-type-100 mb-6">{selectedLesson.description}</p>
              )}

              {(selectedLesson.content_type === 'video' || selectedLesson.content_type === 'mixed') &&
                selectedLesson.video_url && (
                  <div className="mb-8">
                    <div className="aspect-video bg-main-900 rounded-2xl border border-gold-400/10 overflow-hidden">
                      {selectedLesson.video_url.includes('youtube.com') ||
                      selectedLesson.video_url.includes('youtu.be') ? (
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

              {(selectedLesson.content_type === 'text' || selectedLesson.content_type === 'mixed') &&
                selectedLesson.content && (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-type-100 leading-relaxed">
                      {selectedLesson.content}
                    </div>
                  </div>
                )}

              <div className="mt-8 pt-6 border-t border-gold-400/10 flex items-center justify-between">
                <div className="text-sm text-type-100">
                  {lessonProgress[selectedLesson.id]?.completed ? 'Lesson completed' : 'Mark lesson as complete'}
                </div>
                <button
                  onClick={() => handleCompleteLesson(selectedLesson.id)}
                  disabled={completingLesson === selectedLesson.id || lessonProgress[selectedLesson.id]?.completed}
                  className="px-5 py-2 bg-gradient-gold text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {lessonProgress[selectedLesson.id]?.completed
                    ? 'Completed'
                    : completingLesson === selectedLesson.id
                    ? 'Completing...'
                    : 'Complete Lesson'}
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-6 sm:p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gold-400/10 flex items-center justify-center mx-auto mb-6">
                <Play className="w-10 h-10 text-gold-400" />
              </div>
              <h2 className="text-2xl font-bold text-type-50 mb-2">Select a lesson to begin</h2>
              <p className="text-type-100">Choose a lesson from the left panel to start learning.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
