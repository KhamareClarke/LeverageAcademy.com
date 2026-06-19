'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Video, FileText, Save, Eye } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string | null
  price: number
  status: 'draft' | 'published'
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

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' })

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

  const handleSaveModule = async () => {
    try {
      const url = editingModule
        ? `/api/admin/modules/${editingModule.id}`
        : '/api/admin/modules'
      
      const res = await fetch(url, {
        method: editingModule ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          title: moduleForm.title,
          description: moduleForm.description || null,
          order_index: editingModule ? editingModule.order_index : modules.length,
        }),
      })

      if (!res.ok) {
        alert('Failed to save module')
        return
      }

      setShowModuleForm(false)
      setEditingModule(null)
      setModuleForm({ title: '', description: '' })
      fetchCourse()
    } catch (err) {
      alert('Failed to save module')
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure? This will delete all lessons in this module.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        alert('Failed to delete module')
        return
      }

      fetchCourse()
    } catch (err) {
      alert('Failed to delete module')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-main-950 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-type-100">Loading course...</p>
      </div>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-main-950 p-4 sm:p-8">
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
    <main className="min-h-screen bg-main-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
              className="p-2 rounded-xl bg-main-900 border border-gold-400/20 text-gold-400 hover:border-gold-400/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
          <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gold-400">{course.title}</h1>
              <p className="text-type-100 mt-1">£{course.price.toFixed(2)} • {course.status}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link
              href={`/admin/courses/${courseId}/preview`}
              className="px-6 py-3 bg-main-900 border border-gold-400/20 text-gold-400 rounded-xl font-semibold hover:border-gold-400/50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Preview
            </Link>
            <Link
              href={`/admin/courses/${courseId}/edit`}
              className="px-6 py-3 bg-main-900 border border-gold-400/20 text-gold-400 rounded-xl font-semibold hover:border-gold-400/50 transition-colors flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit Course
            </Link>
          </div>
        </div>
        
        {course.description && (
          <div className="glass-card p-6 rounded-2xl border border-gold-400/10 mb-8">
            <p className="text-type-100">{course.description}</p>
          </div>
        )}

        {/* Modules Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-type-50">Modules</h2>
            <button
          onClick={() => {
                setEditingModule(null)
                setModuleForm({ title: '', description: '' })
            setShowModuleForm(true)
          }}
              className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Module
            </button>
      </div>

      {/* Module Form */}
        {showModuleForm && (
            <div className="glass-card p-6 rounded-2xl border border-gold-400/10 mb-6">
              <h3 className="text-lg font-bold text-type-50 mb-4">
              {editingModule ? 'Edit Module' : 'New Module'}
            </h3>
              <div className="space-y-4">
              <div>
                  <label className="block text-sm font-semibold text-type-50 mb-2">Title *</label>
                <input
                  type="text"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 focus:outline-none focus:border-gold-400/50 transition-colors"
                    placeholder="Module title"
                />
              </div>
              <div>
                  <label className="block text-sm font-semibold text-type-50 mb-2">Description</label>
                <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                    placeholder="Module description"
                />
              </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSaveModule}
                    disabled={!moduleForm.title}
                    className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                  <button
                  onClick={() => {
                    setShowModuleForm(false)
                    setEditingModule(null)
                      setModuleForm({ title: '', description: '' })
                    }}
                    className="px-6 py-3 bg-main-900 border border-gold-400/20 text-type-50 rounded-xl font-semibold hover:border-gold-400/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
                            </div>
                          )}

          {/* Modules List */}
          {modules.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl border border-gold-400/10 text-center">
              <BookOpen className="w-16 h-16 text-gold-400/50 mx-auto mb-4" />
              <p className="text-type-100 mb-4">No modules yet</p>
                                      <button
                              onClick={() => {
                  setEditingModule(null)
                  setModuleForm({ title: '', description: '' })
                  setShowModuleForm(true)
                              }}
                className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                            >
                <Plus className="w-5 h-5" />
                Add First Module
              </button>
                          </div>
          ) : (
            <div className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="glass-card p-6 rounded-2xl border border-gold-400/10">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div className="flex-1">
                      <h3 className="text-xl font-bold text-type-50 mb-2">{module.title}</h3>
                      {module.description && (
                        <p className="text-type-100 text-sm mb-2">{module.description}</p>
                      )}
                      <p className="text-type-100 text-xs">
                        {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                      </p>
                                  </div>
                    <div className="flex gap-2">
                      <button
                                onClick={() => {
                          setEditingModule(module)
                          setModuleForm({ title: module.title, description: module.description || '' })
                          setShowModuleForm(true)
                        }}
                        className="p-2 rounded-xl bg-main-900 border border-gold-400/20 text-gold-400 hover:border-gold-400/50 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
              </div>
              
                  {/* Lessons */}
                  <div className="mt-4 space-y-2">
                    {module.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/admin/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`}
                        className="block p-4 rounded-xl bg-main-900 border border-gold-400/10 hover:border-gold-400/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.content_type === 'video' ? (
                            <Video className="w-5 h-5 text-gold-400" />
                          ) : (
                            <FileText className="w-5 h-5 text-gold-400" />
                          )}
                          <span className="text-type-50 font-medium">{lesson.title}</span>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/admin/courses/${courseId}/modules/${module.id}/lessons/new`}
                      className="block p-4 rounded-xl border-2 border-dashed border-gold-400/20 hover:border-gold-400/40 transition-colors text-center text-gold-400 font-semibold"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Add Lesson
                    </Link>
                  </div>
                  </div>
                ))}
              </div>
          )}
              </div>
    </div>
    </main>
  )
}
