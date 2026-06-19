import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  : null

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe secret key is missing. Check STRIPE_SECRET_KEY in env.' },
        { status: 500 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { course_id, application_id } = body

    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price, status')
      .eq('id', course_id)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (typeof course.price !== 'number' || Number.isNaN(course.price)) {
      return NextResponse.json({ error: 'Invalid course price' }, { status: 400 })
    }

    if (course.status !== 'published') {
      return NextResponse.json({ error: 'Course is not available' }, { status: 400 })
    }

    // Check if already enrolled / payment status
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id, payment_status, is_active')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .single()

    if (existingEnrollment?.payment_status === 'paid' && existingEnrollment.is_active) {
      return NextResponse.json(
        { error: 'Payment already completed for this course' },
        { status: 400 }
      )
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: course.title,
              description: `Enrollment for ${course.title}`,
            },
            unit_amount: Math.round(course.price * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/student/payment/success?session_id={CHECKOUT_SESSION_ID}&course_id=${course_id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/student/payment/cancel?course_id=${course_id}`,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        course_id: course_id,
        application_id: application_id || '',
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
