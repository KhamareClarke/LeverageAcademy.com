import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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

  const body = await request.json()
  const { course_id, title, description, order_index } = body

  if (!course_id || !title) {
    return NextResponse.json(
      { error: 'Course ID and title are required' },
      { status: 400 }
    )
  }

  // Create module
  const { data: module, error } = await supabase
    .from('modules')
    .insert({
      course_id,
      title,
      description: description || null,
      order_index: order_index || 0,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating module:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ module })
}
