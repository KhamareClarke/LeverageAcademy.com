import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { emitEmpireActivity } from '@/lib/empire-activity'
import { emitFleetIngest } from '@/lib/fleet-ingest'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { course_id, name, email, goals, experience_level } = body

    if (!course_id || !name || !email || !goals || !experience_level) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser()
    const user_id = user?.id || null

    // Check if course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', course_id)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Prevent duplicate applications for same course
    const emailNormalized = email.toLowerCase().trim()
    const duplicateQuery = supabase
      .from('course_applications')
      .select('id, status')
      .eq('course_id', course_id)

    if (user_id) {
      duplicateQuery.eq('user_id', user_id)
    } else {
      duplicateQuery.eq('email', emailNormalized)
    }

    const { data: existingApplication } = await duplicateQuery.maybeSingle()

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already applied for this course.' },
        { status: 400 }
      )
    }

    // Create application
    const { data: application, error: insertError } = await supabase
      .from('course_applications')
      .insert({
        course_id,
        user_id,
        name,
        email: emailNormalized,
        goals,
        experience_level,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating application:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    await emitEmpireActivity({
      event_type: 'lead_created',
      user_email: emailNormalized,
      user_id: user_id,
      user_name: name,
      message: `Course application: ${course.title}`,
      metadata: {
        application_id: application?.id,
        course_id,
        course_title: course.title,
        experience_level,
      },
      request,
    })

    await emitFleetIngest({
      event_type: 'lead',
      summary: `Course application: ${name} (${emailNormalized}) — ${course.title}`,
      payload: {
        application_id: application?.id,
        course_id,
        course_title: course.title,
        experience_level,
      },
    })

    return NextResponse.json({
      success: true,
      application,
      message: 'Application submitted successfully',
    })
  } catch (error: any) {
    console.error('Error in applications POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
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

  // Only admins can view all applications
  if (role !== 'admin') {
    // Students can only view their own applications
    const { data: applications, error } = await supabase
      .from('course_applications')
      .select(`
        *,
        courses!course_applications_course_id_fkey(id, title, price)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching student applications:', error)
      return NextResponse.json({ applications: [] })
    }

    // Transform data to ensure course is always an object
    const formattedApplications = (applications || []).map((app: any) => ({
      ...app,
      course: app.courses || { id: app.course_id, title: 'Unknown Course', price: 0 },
    }))

    return NextResponse.json({ applications: formattedApplications })
  }

  // Admin: Get all applications
  const { data: applications, error } = await supabase
    .from('course_applications')
    .select(`
      *,
      courses!course_applications_course_id_fkey(id, title, price)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ applications: [] })
  }

  // Transform data to match expected format
  const formattedApplications = (applications || []).map((app: any) => ({
    ...app,
    course: app.courses || { id: app.course_id, title: 'Unknown Course', price: 0 },
  }))

  return NextResponse.json({ applications: formattedApplications })
}
