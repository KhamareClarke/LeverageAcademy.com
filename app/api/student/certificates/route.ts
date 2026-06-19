export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId)

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
      return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
    }

    const totalLessons = (lessons || []).length

    const { data: completedLessons, error: completedError } = await supabase
      .from('lesson_progress')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('completed', true)

    if (completedError) {
      console.error('Error fetching completion:', completedError)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    const completedCount = (completedLessons || []).length
    const eligible = totalLessons > 0 && completedCount >= totalLessons

    const { data: latestCompletion } = await supabase
      .from('lesson_progress')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { data: profile } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .maybeSingle()

    const fallbackName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Student'

    return NextResponse.json({
      eligible,
      name: profile?.name || fallbackName,
      course_title: course.title,
      completed_at: latestCompletion?.completed_at || null,
    })
  } catch (error: any) {
    console.error('Error in certificate GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
