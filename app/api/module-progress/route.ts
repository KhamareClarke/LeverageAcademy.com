import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const { data: progress, error } = await supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error fetching module progress:', error)
      return NextResponse.json({ progress: [] })
    }

    return NextResponse.json({ progress: progress || [] })
  } catch (error: any) {
    console.error('Error in module progress GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { module_id, course_id } = body

    if (!module_id || !course_id) {
      return NextResponse.json({ error: 'Module ID and Course ID are required' }, { status: 400 })
    }

    // Check enrollment status - user must have paid enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id, payment_status, is_active')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .single()

    if (!enrollment || enrollment.payment_status !== 'paid' || !enrollment.is_active) {
      return NextResponse.json(
        { error: 'Payment required to access this course' },
        { status: 403 }
      )
    }

    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('module_id', module_id)

    const lessonIds = (lessons || []).map((l: any) => l.id)
    const totalLessons = lessonIds.length

    const { data: completedLessons } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .in('lesson_id', lessonIds)
      .eq('completed', true)

    const completedCount = (completedLessons || []).length

    if (totalLessons > 0 && completedCount < totalLessons) {
      return NextResponse.json(
        { error: 'Complete all lessons before marking module complete' },
        { status: 400 }
      )
    }

    const { error: upsertError } = await supabase
      .from('module_progress')
      .upsert({
        user_id: user.id,
        module_id,
        course_id,
        lessons_completed: completedCount,
        total_lessons: totalLessons,
        module_completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,module_id' })

    if (upsertError) {
      console.error('Error upserting module progress:', upsertError)
      return NextResponse.json({ error: 'Failed to update module progress' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in module progress POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

