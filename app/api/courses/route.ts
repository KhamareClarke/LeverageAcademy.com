import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
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

  // Admins see all courses, others see only published
  const query = supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (userRole !== 'admin') {
    query.eq('status', 'published')
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ courses: data })
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
    return NextResponse.json({ error: 'Only admins can create courses' }, { status: 403 })
  }

  const body = await request.json()
  const { title, description, price, status } = body

  if (!title || price === undefined) {
    return NextResponse.json({ error: 'Title and price are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      description: description || null,
      price: parseFloat(price),
      status: status || 'draft',
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ course: data }, { status: 201 })
}

