'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Clock } from 'lucide-react'

interface Application {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  message: string | null
  created_at: string
  user: {
    id: string
    email: string
    full_name: string | null
  }
  course: {
    id: string
    title: string
    price: number
  }
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error reviewing application:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-type-100">Loading applications...</div>
      </div>
    )
  }

  const pendingApps = applications.filter((app) => app.status === 'pending')
  const reviewedApps = applications.filter((app) => app.status !== 'pending')

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-serif text-5xl font-bold mb-8">
        <span className="bg-gradient-gold bg-clip-text text-transparent">
          Applications
        </span>
      </h1>

      {pendingApps.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-type-50">Pending Review</h2>
          <div className="space-y-4">
            {pendingApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-gold-400/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <div className="font-bold text-type-50">{app.user.full_name || app.user.email}</div>
                        <div className="text-sm text-type-100">{app.user.email}</div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-semibold">Pending</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="font-semibold text-type-50 mb-1">{app.course.title}</div>
                      <div className="text-sm text-type-100">£{app.course.price.toFixed(2)}</div>
                    </div>
                    {app.message && (
                      <div className="text-type-100 text-sm mb-4 p-4 rounded-xl bg-main-900">
                        {app.message}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 ml-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReview(app.id, 'approved')}
                      className="px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl font-semibold hover:bg-green-500/30 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReview(app.id, 'rejected')}
                      className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {reviewedApps.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-type-50">Reviewed</h2>
          <div className="space-y-4">
            {reviewedApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-gold-400/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-type-50 mb-1">{app.user.full_name || app.user.email}</div>
                    <div className="text-sm text-type-100 mb-2">{app.course.title}</div>
                    {app.message && (
                      <div className="text-type-100 text-xs">{app.message}</div>
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-semibold text-sm ${
                      app.status === 'approved'
                        ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                        : 'bg-red-500/20 border border-red-500/50 text-red-400'
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <div className="text-center py-20 text-type-100">
          No applications found
        </div>
      )}
    </div>
  )
}

