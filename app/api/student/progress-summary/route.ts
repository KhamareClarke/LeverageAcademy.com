export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('course_id, payment_status, is_active, courses(id, title)')
      .eq('user_id', user.id)
      .eq('payment_status', 'paid')
      .eq('is_active', true)

    if (enrollmentError) {
      console.error('Error fetching enrollments:', enrollmentError)
      return NextResponse.json({ progress: [] })
    }

    const courseRows = enrollments || []
    const courseIds = courseRows.map((row: any) => row.course_id).filter(Boolean)

    if (courseIds.length === 0) {
      return NextResponse.json({ progress: [] })
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, course_id')
      .in('course_id', courseIds)

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
      return NextResponse.json({ progress: [] })
    }

    const { data: completedRows, error: progressError } = await supabase
      .from('lesson_progress')
      .select('lesson_id, course_id, completed')
      .eq('user_id', user.id)
      .in('course_id', courseIds)
      .eq('completed', true)

    if (progressError) {
      console.error('Error fetching lesson progress:', progressError)
      return NextResponse.json({ progress: [] })
    }

    const totals: Record<string, number> = {}
    const completed: Record<string, number> = {}

    ;(lessons || []).forEach((lesson: any) => {
      const courseId = lesson.course_id
      totals[courseId] = (totals[courseId] || 0) + 1
    })

    ;(completedRows || []).forEach((row: any) => {
      const courseId = row.course_id
      completed[courseId] = (completed[courseId] || 0) + 1
    })

    const progress = courseRows.map((row: any) => {
      const totalLessons = totals[row.course_id] || 0
      const completedLessons = completed[row.course_id] || 0
      const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      return {
        course_id: row.course_id,
        course_title: row.courses?.title || 'Unknown Course',
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        percent,
      }
    })

    return NextResponse.json({ progress })
  } catch (error: any) {
    console.error('Error in progress summary GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
