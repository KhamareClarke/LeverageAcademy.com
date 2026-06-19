import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Ensure student is enrolled and has paid
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id, payment_status, is_active')
      .eq('user_id', user.id)
      .eq('course_id', id)
      .single()

    if (!enrollment || enrollment.payment_status !== 'paid' || !enrollment.is_active) {
      return NextResponse.json(
        { error: 'Payment required to access this course' },
        { status: 403 }
      )
    }

    // Get course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Get modules
    const { data: modules } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', id)
      .order('order_index', { ascending: true })

    // Get lessons for each module
    const modulesWithLessons = await Promise.all(
      (modules || []).map(async (module) => {
        const { data: lessons } = await supabase
          .from('lessons')
          .select('*')
          .eq('module_id', module.id)
          .order('order_index', { ascending: true })

        return {
          ...module,
          lessons: lessons || [],
        }
      })
    )

    return NextResponse.json({
      course,
      modules: modulesWithLessons,
    })
  } catch (error: any) {
    console.error('Error fetching student course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
