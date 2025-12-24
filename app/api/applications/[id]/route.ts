import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    return NextResponse.json({ error: 'Only admins can review applications' }, { status: 403 })
  }

  const body = await request.json()
  const { status } = body

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('applications')
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If approved, create enrollment (payment will be handled separately)
  if (status === 'approved') {
    const { error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id: data.user_id,
        course_id: data.course_id,
        payment_status: 'pending',
      })

    if (enrollmentError && enrollmentError.code !== '23505') { // Ignore duplicate key error
      console.error('Error creating enrollment:', enrollmentError)
    }
  }

  return NextResponse.json({ application: data })
}

