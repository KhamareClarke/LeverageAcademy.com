import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
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

  if (userData?.role === 'admin') {
    // Admin can see all applications
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        user:users!applications_user_id_fkey(id, email, full_name),
        course:courses!applications_course_id_fkey(id, title, price)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ applications: data })
  } else {
    // Students can only see their own applications
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        course:courses!applications_course_id_fkey(id, title, price, description)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ applications: data })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user is a student
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'student') {
    return NextResponse.json({ error: 'Only students can apply' }, { status: 403 })
  }

  const body = await request.json()
  const { course_id, message } = body

  if (!course_id) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
  }

  // Check if application already exists
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course_id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Application already exists' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      course_id,
      message: message || null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ application: data }, { status: 201 })
}

