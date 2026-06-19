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
  const { module_id, course_id, title, description, content, video_url, content_type, order_index } = body

  if (!module_id || !course_id || !title) {
    return NextResponse.json(
      { error: 'Module ID, Course ID, and title are required' },
      { status: 400 }
    )
  }

  // Create lesson
  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert({
      module_id,
      course_id,
      title,
      description: description && description.trim() ? description.trim() : null,
      content: content && content.trim() ? content.trim() : null,
      video_url: video_url && video_url.trim() ? video_url.trim() : null,
      content_type: content_type || 'text',
      order_index: order_index || 0,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ lesson })
}
