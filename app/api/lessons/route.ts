import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const course_id = searchParams.get('course_id')

  if (!course_id) {
    return NextResponse.json({ error: 'course_id is required' }, { status: 400 })
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Get user role if logged in
  let userRole = null
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = userData?.role
  }

  // Check if user has access (admin or enrolled student)
  if (userRole !== 'admin') {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if student is enrolled and paid
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
  }

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course_id)
    .order('lesson_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ lessons: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can create lessons' }, { status: 403 })
  }

  const body = await request.json()
  const { course_id, title, description, content, order } = body

  if (!course_id || !title) {
    return NextResponse.json({ error: 'course_id and title are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      course_id,
      title,
      description: description || null,
      content: content || null,
      lesson_order: order || 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ lesson: data }, { status: 201 })
}

