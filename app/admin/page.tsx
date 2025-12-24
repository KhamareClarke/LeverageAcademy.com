'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Users, BookOpen, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: 'Pending Applications', value: 0, icon: FileText, href: '/admin/applications', color: 'text-yellow-400' },
    { label: 'Total Enrollments', value: 0, icon: Users, href: '/admin/enrollments', color: 'text-blue-400' },
    { label: 'Courses', value: 0, icon: BookOpen, href: '/admin/courses', color: 'text-green-400' },
    { label: 'Students', value: 0, icon: TrendingUp, href: '/admin/students', color: 'text-purple-400' },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [applicationsRes, enrollmentsRes, coursesRes, studentsRes] = await Promise.all([
        fetch('/api/applications').then(r => r.json()),
        fetch('/api/enrollments').then(r => r.json()),
        fetch('/api/courses').then(r => r.json()),
        fetch('/api/enrollments').then(r => r.json()),
      ])

      setStats([
        {
          label: 'Pending Applications',
          value: applicationsRes.applications?.filter((a: any) => a.status === 'pending').length || 0,
          icon: FileText,
          href: '/admin/applications',
          color: 'text-yellow-400',
        },
        {
          label: 'Total Enrollments',
          value: enrollmentsRes.enrollments?.length || 0,
          icon: Users,
          href: '/admin/enrollments',
          color: 'text-blue-400',
        },
        {
          label: 'Courses',
          value: coursesRes.courses?.length || 0,
          icon: BookOpen,
          href: '/admin/courses',
          color: 'text-green-400',
        },
        {
          label: 'Students',
          value: new Set(enrollmentsRes.enrollments?.map((e: any) => e.user_id)).size || 0,
          icon: TrendingUp,
          href: '/admin/students',
          color: 'text-purple-400',
        },
      ])
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-type-100">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-5xl font-bold mb-4">
          <span className="bg-gradient-gold bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </h1>
        <p className="text-type-100 text-lg">Manage applications, courses, and student progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-8 rounded-3xl border border-gold-400/10 hover:border-gold-400/40 transition-all duration-500 hover:shadow-glow-gold-lg backdrop-blur-2xl cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold mb-2 text-type-50">{stat.value}</div>
              <div className="text-type-100 text-sm">{stat.label}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link href="/admin/applications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8 }}
            className="glass-card p-8 rounded-3xl border border-gold-400/10 hover:border-gold-400/40 transition-all duration-500 hover:shadow-glow-gold-lg backdrop-blur-2xl cursor-pointer"
          >
            <h2 className="text-2xl font-bold mb-4 text-type-50">Review Applications</h2>
            <p className="text-type-100">Approve or reject student applications for courses</p>
          </motion.div>
        </Link>

        <Link href="/admin/courses">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -8 }}
            className="glass-card p-8 rounded-3xl border border-gold-400/10 hover:border-gold-400/40 transition-all duration-500 hover:shadow-glow-gold-lg backdrop-blur-2xl cursor-pointer"
          >
            <h2 className="text-2xl font-bold mb-4 text-type-50">Manage Courses</h2>
            <p className="text-type-100">Create, edit, and publish courses</p>
          </motion.div>
        </Link>
      </div>
    </div>
  )
}

