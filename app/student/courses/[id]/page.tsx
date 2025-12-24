'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, BookOpen } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string | null
  content: string | null
  lesson_order: number
}

interface Progress {
  lesson_id: string
  completed: boolean
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id as string
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Record<string, Progress>>({})
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    try {
      const [lessonsRes, progressRes] = await Promise.all([
        fetch(`/api/lessons?course_id=${courseId}`),
        fetch(`/api/progress?course_id=${courseId}`),
      ])

      const lessonsData = await lessonsRes.json()
      const progressData = await progressRes.json()

      setLessons(lessonsData.lessons || [])
      
      const progressMap: Record<string, Progress> = {}
      ;(progressData.progress || []).forEach((p: any) => {
        progressMap[p.lesson_id] = p
      })
      setProgress(progressMap)

      if (lessonsData.lessons && lessonsData.lessons.length > 0) {
        setSelectedLesson(lessonsData.lessons[0])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (lessonId: string) => {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          course_id: courseId,
          completed: true,
        }),
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-type-100">Loading...</div>
      </div>
    )
  }

  const completedCount = Object.values(progress).filter((p) => p.completed).length
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-serif text-4xl font-bold text-type-50">Course Lessons</h1>
          <div className="text-right">
            <div className="text-2xl font-bold text-gold-400">{completedCount}/{lessons.length}</div>
            <div className="text-sm text-type-100">Lessons Completed</div>
          </div>
        </div>
        <div className="w-full h-2 bg-main-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className="h-full bg-gradient-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-gold-400/10">
            <h2 className="font-bold text-type-50 mb-4">Lessons</h2>
            <div className="space-y-2">
              {lessons.map((lesson, index) => {
                const isCompleted = progress[lesson.id]?.completed
                const isSelected = selectedLesson?.id === lesson.id

                return (
                  <motion.button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    whileHover={{ x: 4 }}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-gold-400/20 border border-gold-400/50'
                        : 'bg-main-900 border border-gold-400/10 hover:border-gold-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-type-100 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-type-50 text-sm">
                          Lesson {index + 1}: {lesson.title}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedLesson ? (
            <motion.div
              key={selectedLesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-2xl border border-gold-400/10"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-type-50 mb-2">{selectedLesson.title}</h2>
                  {selectedLesson.description && (
                    <p className="text-type-100">{selectedLesson.description}</p>
                  )}
                </div>
                {progress[selectedLesson.id]?.completed ? (
                  <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 text-sm font-semibold">
                    Completed
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleComplete(selectedLesson.id)}
                    className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold"
                  >
                    Mark Complete
                  </motion.button>
                )}
              </div>

              {selectedLesson.content && (
                <div className="prose prose-invert max-w-none">
                  <div
                    className="text-type-100 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                  />
                </div>
              )}

              {!selectedLesson.content && (
                <div className="text-center py-12 text-type-100">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-type-100 opacity-50" />
                  <p>Content coming soon...</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-card p-12 rounded-2xl border border-gold-400/10 text-center text-type-100">
              Select a lesson to begin
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

