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
    // Admin can see all enrollments
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        user:users!enrollments_user_id_fkey(id, email, full_name),
        course:courses!enrollments_course_id_fkey(id, title, price)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ enrollments: data })
  } else {
    // Students can only see their own enrollments
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses!enrollments_course_id_fkey(id, title, description, price)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ enrollments: data })
  }
}

