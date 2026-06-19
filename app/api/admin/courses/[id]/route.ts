import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  const { id } = params

  // Get course with modules and lessons
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
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  const { id } = params
  const body = await request.json()
  const { title, description, price, status } = body

  const updateData: any = {}
  if (title !== undefined) updateData.title = title
  if (description !== undefined) updateData.description = description
  if (price !== undefined) updateData.price = parseFloat(price)
  if (status !== undefined) updateData.status = status

  const { data: course, error } = await supabase
    .from('courses')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ course })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  const { id } = params

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
