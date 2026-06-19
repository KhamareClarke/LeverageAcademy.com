import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendApplicationApprovalEmail } from '@/lib/email'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, admin_notes } = body

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Check if user is admin
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

    // Update application
    const updateData: any = {
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    }

    if (admin_notes) {
      updateData.admin_notes = admin_notes
    }

    const { data: application, error: updateError } = await supabase
      .from('course_applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating application:', updateError)
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      )
    }

    // If approved, create enrollment and send email
    if (status === 'approved') {
      // Create enrollment if user_id exists
      if (application.user_id) {
        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .insert({
            user_id: application.user_id,
            course_id: application.course_id,
            payment_status: 'pending',
          })
          .select()
          .single()

        if (enrollmentError && !enrollmentError.message.includes('duplicate')) {
          console.error('Error creating enrollment:', enrollmentError)
          // Don't fail the request if enrollment creation fails
        }
      }

      // Get course title for email
      const { data: course } = await supabase
        .from('courses')
        .select('title')
        .eq('id', application.course_id)
        .single()

      // Send approval email
      if (application.email && application.name) {
        sendApplicationApprovalEmail(
          application.email,
          application.name,
          course?.title || 'Course'
        ).catch((err) => {
          console.error('Error sending approval email:', err)
          // Don't fail the request if email fails
        })
      }
    }

    return NextResponse.json({
      success: true,
      application,
      message: 'Application updated successfully',
    })
  } catch (error: any) {
    console.error('Error in applications PATCH:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
