import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const course_id = searchParams.get('course_id')

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const query = supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', user.id)

  if (course_id) {
    query.eq('course_id', course_id)
  }

  // Admins can query any user's progress (for analytics)
  if (userData?.role === 'admin' && searchParams.get('user_id')) {
    query.eq('user_id', searchParams.get('user_id'))
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ progress: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { lesson_id, course_id, completed } = body

  if (!lesson_id || !course_id || completed === undefined) {
    return NextResponse.json({ error: 'lesson_id, course_id, and completed are required' }, { status: 400 })
  }

  // Verify user is enrolled and paid
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course_id)
    .eq('payment_status', 'paid')
    .single()

  if (!enrollment) {
    return NextResponse.json({ error: 'Access denied. Please enroll and pay for this course.' }, { status: 403 })
  }

  const updateData: any = {
    user_id: user.id,
    lesson_id,
    course_id,
    completed,
  }

  if (completed) {
    updateData.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert(updateData, {
      onConflict: 'user_id,lesson_id',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ progress: data })
}

