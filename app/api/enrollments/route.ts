import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendPaymentNotificationEmail } from '@/lib/email'

export async function GET() {
  try {
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

    // Only admins can view all enrollments
    if (role !== 'admin') {
      // Students can only view their own enrollments
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses!enrollments_course_id_fkey(id, title, description, price)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching student enrollments:', error)
        return NextResponse.json({ enrollments: [] })
      }

      // Transform data
      const formattedEnrollments = (enrollments || []).map((enrollment: any) => ({
        ...enrollment,
        course: enrollment.courses || { id: enrollment.course_id, title: 'Unknown Course' },
      }))

      return NextResponse.json({ enrollments: formattedEnrollments })
    }

    // Admin: Get all enrollments
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses!enrollments_course_id_fkey(id, title),
        users!enrollments_user_id_fkey(id, email)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching enrollments:', error)
      return NextResponse.json({ enrollments: [] })
    }

    // Transform data
    const formattedEnrollments = (enrollments || []).map((enrollment: any) => ({
      ...enrollment,
      course: enrollment.courses || { id: enrollment.course_id, title: 'Unknown Course' },
      user: enrollment.users || { id: enrollment.user_id, email: 'Unknown' },
    }))

    return NextResponse.json({ enrollments: formattedEnrollments })
  } catch (error: any) {
    console.error('Error in enrollments GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { course_id, application_id, payment_status } = body

    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Payment is required - only allow 'paid' status
    if (payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment is required to enroll. Please complete payment first.' },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id, payment_status')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .single()

    if (existing) {
      // Update existing enrollment only if payment is confirmed
      const { error: updateError } = await supabase
        .from('enrollments')
        .update({
          payment_status: 'paid',
          is_active: true,
        })
        .eq('id', existing.id)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 })
      }

      // Send payment notification if this is the first time marked paid
      if (existing.payment_status !== 'paid') {
        try {
          const { data: course } = await supabase
            .from('courses')
            .select('title, price')
            .eq('id', course_id)
            .single()
          await sendPaymentNotificationEmail(
            'clarkekhamare@gmail.com',
            user.email || 'Unknown',
            course?.title || 'Unknown Course',
            typeof course?.price === 'number' ? course.price : 0
          )
        } catch (err) {
          console.error('Error sending payment notification:', err)
        }
      }

      return NextResponse.json({ success: true, message: 'Enrollment updated' })
    }

    // Create new enrollment - payment must be 'paid'
    const { data: enrollment, error: insertError } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id,
        payment_status: 'paid',
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating enrollment:', insertError)
      return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 })
    }

    // Update application status if provided
    if (application_id) {
      await supabase
        .from('course_applications')
        .update({ status: 'approved' })
        .eq('id', application_id)
    }

    // Send payment notification email
    try {
      const { data: course } = await supabase
        .from('courses')
        .select('title, price')
        .eq('id', course_id)
        .single()
      await sendPaymentNotificationEmail(
        'clarkekhamare@gmail.com',
        user.email || 'Unknown',
        course?.title || 'Unknown Course',
        typeof course?.price === 'number' ? course.price : 0
      )
    } catch (err) {
      console.error('Error sending payment notification:', err)
    }

    return NextResponse.json({
      success: true,
      enrollment,
      message: 'Enrollment created successfully',
    })
  } catch (error: any) {
    console.error('Error in enrollments POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
