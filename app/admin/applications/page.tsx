'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Mail, User, Target, Briefcase, LogOut, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Application {
  id: string
  name: string
  email: string
  goals: string
  experience_level: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  course: {
    id: string
    title: string
    price: number
  }
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch applications')
        setLoading(false)
        return
      }

      setApplications(data.applications || [])
      setLoading(false)
    } catch (err: any) {
      setError('Failed to fetch applications')
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: 'approved' | 'rejected', adminNotes?: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to update application')
        return
      }

      // Refresh applications
      fetchApplications()
    } catch (err: any) {
      alert('Failed to update application')
    }
  }

  const handleSignOut = () => {
    supabase?.auth.signOut().catch(() => {})
    window.location.href = '/admin/login'
  }

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  }

  return (
    <main className="min-h-screen bg-main-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-400">Applications</h1>
          <button
            onClick={handleSignOut}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            Sign Out
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                filter === status
                  ? 'bg-gradient-gold text-black'
                  : 'bg-main-900 border border-gold-400/20 text-type-50 hover:border-gold-400/50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-type-100">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-type-100 text-lg">No applications found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 rounded-2xl border border-gold-400/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-gold-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-type-50 mb-1">{application.name}</h3>
                        <div className="flex items-center gap-2 text-type-100 text-sm mb-2">
                          <Mail className="w-4 h-4" />
                          {application.email}
                        </div>
                        <div className="text-gold-400 font-semibold mb-2">
                          {application.course.title} - £{application.course.price.toFixed(2)}
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          application.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          application.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {application.status === 'pending' && <Clock className="w-4 h-4" />}
                          {application.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                          {application.status === 'rejected' && <XCircle className="w-4 h-4" />}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div>
                        <div className="flex items-center gap-2 text-type-100 text-sm mb-1">
                          <Target className="w-4 h-4" />
                          Goals
                        </div>
                        <p className="text-type-50 text-sm">{application.goals}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-type-100 text-sm mb-1">
                          <Briefcase className="w-4 h-4" />
                          Experience Level
                        </div>
                        <p className="text-type-50 text-sm capitalize">{application.experience_level}</p>
                      </div>
                      <div className="text-type-100 text-xs">
                        Applied: {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {application.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                      <button
                        onClick={() => handleStatusChange(application.id, 'approved')}
                        className="px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl font-semibold hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                        className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
