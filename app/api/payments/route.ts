import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { enrollment_id, payment_id } = body

  if (!enrollment_id || !payment_id) {
    return NextResponse.json({ error: 'enrollment_id and payment_id are required' }, { status: 400 })
  }

  // Verify enrollment belongs to user
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('id', enrollment_id)
    .eq('user_id', user.id)
    .single()

  if (!enrollment) {
    return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
  }

  // Update payment status
  const { data, error } = await supabase
    .from('enrollments')
    .update({
      payment_status: 'paid',
      payment_id,
    })
    .eq('id', enrollment_id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ enrollment: data })
}

