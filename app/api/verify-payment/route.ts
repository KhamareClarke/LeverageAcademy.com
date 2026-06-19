import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { session_id, course_id } = body

    if (!session_id || !course_id) {
      return NextResponse.json(
        { error: 'Session ID and Course ID are required' },
        { status: 400 }
      )
    }

    // Check if enrollment exists and is paid
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .eq('payment_status', 'paid')
      .single()

    if (enrollmentError || !enrollment) {
      // If enrollment doesn't exist, check if webhook might still be processing
      // Return 404 so client can retry
      return NextResponse.json(
        { error: 'Enrollment not found. Payment may still be processing. Please wait a moment and refresh.' },
        { status: 404 }
      )
    }

    // Ensure is_active is set
    if (!enrollment.is_active) {
      await supabase
        .from('enrollments')
        .update({ is_active: true })
        .eq('id', enrollment.id)
    }

    return NextResponse.json({
      success: true,
      enrollment,
      message: 'Payment verified successfully',
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
