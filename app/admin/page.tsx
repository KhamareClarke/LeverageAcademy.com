'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, FileText, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = () => {
    // Sign out in background, redirect immediately
    supabase?.auth.signOut().catch(() => {})
    window.location.href = '/admin/login'
  }

  return (
    <main className="min-h-screen bg-main-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-400">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            Sign Out
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/applications"
            className="glass-card p-6 rounded-2xl border border-gold-400/10 hover:border-gold-400/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center mb-4 group-hover:bg-gradient-gold/30 transition-colors">
              <FileText className="w-6 h-6 text-gold-400" />
            </div>
            <h2 className="text-xl font-bold text-type-50 mb-2">Applications</h2>
            <p className="text-type-100 text-sm">Review and manage course applications</p>
          </Link>

          <Link
            href="/admin/courses"
            className="glass-card p-6 rounded-2xl border border-gold-400/10 hover:border-gold-400/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center mb-4 group-hover:bg-gradient-gold/30 transition-colors">
              <BookOpen className="w-6 h-6 text-gold-400" />
            </div>
            <h2 className="text-xl font-bold text-type-50 mb-2">Courses</h2>
            <p className="text-type-100 text-sm">Manage courses and content</p>
          </Link>

          <Link
            href="/admin/students"
            className="glass-card p-6 rounded-2xl border border-gold-400/10 hover:border-gold-400/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center mb-4 group-hover:bg-gradient-gold/30 transition-colors">
              <Users className="w-6 h-6 text-gold-400" />
            </div>
            <h2 className="text-xl font-bold text-type-50 mb-2">Students</h2>
            <p className="text-type-100 text-sm">View and manage students</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
