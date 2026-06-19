export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role-client'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role
    let role = user.user_metadata?.role
    if (!role) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      role = userData?.role
    }

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Use service role to access auth.users
    const serviceSupabase = createServiceRoleClient()

    // Try auth admin list first (most reliable for all registered users)
    let authUsers: any[] = []
    try {
      const { data: authData, error: authError } = await serviceSupabase.auth.admin.listUsers()
      if (authError) {
        console.error('Error fetching auth users:', authError)
      } else {
        authUsers = authData?.users || []
      }
    } catch (err) {
      console.error('Error calling auth.admin.listUsers:', err)
    }

    // Fallback to users table if auth list isn't available
    let usersData: any[] = []
    if (authUsers.length === 0) {
      const { data, error: usersError } = await serviceSupabase
        .from('users')
        .select('*')
      if (usersError) {
        console.error('Error fetching users:', usersError)
      } else {
        usersData = data || []
      }
    }

    // Filter out admins and get student users
    const studentUsers = authUsers.length > 0
      ? authUsers.filter((u: any) => u.user_metadata?.role !== 'admin')
      : (usersData || []).filter((u: any) => u.role !== 'admin')

    // Get all enrollments and applications
    const { data: enrollments, error: enrollmentsError } = await serviceSupabase
      .from('enrollments')
      .select('*')

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError)
    }

    const { data: applications, error: applicationsError } = await serviceSupabase
      .from('course_applications')
      .select('*')

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
    }

    const { data: lessons, error: lessonsError } = await serviceSupabase
      .from('lessons')
      .select('id, course_id')

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
    }

    const { data: lessonProgress, error: lessonProgressError } = await serviceSupabase
      .from('lesson_progress')
      .select('user_id, lesson_id, completed, course_id')

    if (lessonProgressError) {
      console.error('Error fetching lesson progress:', lessonProgressError)
    }

    const { data: courses, error: coursesError } = await serviceSupabase
      .from('courses')
      .select('id, title')

    if (coursesError) {
      console.error('Error fetching courses:', coursesError)
    }

    // Combine data
    const students = studentUsers.map((user: any) => {
      const userEnrollments = enrollments?.filter((e: any) => e.user_id === user.id) || []
      const userApplications = applications?.filter((a: any) => a.user_id === user.id || a.email === user.email) || []
      
      const paidEnrollments = userEnrollments.filter((e: any) => e.payment_status === 'paid')
      const hasPayment = paidEnrollments.length > 0

      const courseProgress = (userEnrollments || []).map((enrollment: any) => {
        const courseId = enrollment.course_id
        const course = courses?.find((c: any) => c.id === courseId)
        const courseLessons = lessons?.filter((l: any) => l.course_id === courseId) || []
        const completedLessons = (lessonProgress || []).filter(
          (p: any) => p.user_id === user.id && p.course_id === courseId && p.completed
        )
        const totalLessons = courseLessons.length
        const completedCount = completedLessons.length
        const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

        return {
          course_id: courseId,
          course_title: course?.title || 'Unknown Course',
          total_lessons: totalLessons,
          completed_lessons: completedCount,
          percent,
        }
      })

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.name || (user.email ? user.email.split('@')[0] : 'N/A'),
        created_at: user.created_at,
        email_confirmed: !!user.email_confirmed_at,
        enrollments_count: userEnrollments.length,
        applications_count: userApplications.length,
        has_payment: hasPayment,
        course_progress: courseProgress,
        enrollments: userEnrollments.map((e: any) => ({
          id: e.id,
          course_id: e.course_id,
          payment_status: e.payment_status,
          is_active: e.is_active,
        })),
        applications: userApplications.map((a: any) => ({
          id: a.id,
          course_id: a.course_id,
          status: a.status,
        })),
      }
    })

    return NextResponse.json({ students })
  } catch (error: any) {
    console.error('Error in admin students GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
