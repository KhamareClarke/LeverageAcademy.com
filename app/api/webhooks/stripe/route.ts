import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceRoleClient } from '@/lib/supabase/service-role-client'
import { sendWelcomeEmail } from '@/lib/email'
import { sendGhlSms } from '@/lib/ghl/sms'
import { runWorkflow } from '@/lib/ghl/workflows'
import { syncUserToGhl } from '@/lib/ghl/contact-sync'
import { createNotification } from '@/lib/notifications/service'
import { emitEmpireActivity } from '@/lib/empire-activity'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  })

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id || session.client_reference_id
    const courseId = session.metadata?.course_id

    if (!userId || !courseId) {
      console.error('Missing user_id or course_id in session metadata')
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    try {
      // Check if enrollment already exists
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()

      if (existing) {
        // Update existing enrollment
        await supabase
          .from('enrollments')
          .update({
            payment_status: 'paid',
            payment_id: session.payment_intent as string,
            is_active: true,
          })
          .eq('id', existing.id)
      } else {
        // Create new enrollment
        await supabase
          .from('enrollments')
          .insert({
            user_id: userId,
            course_id: courseId,
            payment_status: 'paid',
            payment_id: session.payment_intent as string,
            is_active: true,
          })
      }

      // Update application status if application_id exists
      const applicationId = session.metadata?.application_id
      if (applicationId) {
        await supabase
          .from('course_applications')
          .update({ status: 'approved' })
          .eq('id', applicationId)
      }

      // Send welcome email to student
      let userRow: { email: string; full_name: string | null; phone_number: string | null } | null = null
      let courseRow: { title: string } | null = null
      try {
        const { data: u } = await supabase
          .from('users')
          .select('email, full_name, phone_number')
          .eq('id', userId)
          .single()
        userRow = u as any
        const { data: c } = await supabase
          .from('courses')
          .select('title')
          .eq('id', courseId)
          .single()
        courseRow = c as any
        if (userRow?.email && courseRow?.title) {
          await sendWelcomeEmail(
            userRow.email,
            userRow.full_name || '',
            courseRow.title
          )
          console.log('✅ Welcome email sent to:', userRow.email)
        }
      } catch (emailErr: any) {
        console.error('Error sending welcome email:', emailErr)
        // Don't fail webhook – enrollment already succeeded
      }

      // Fire GHL hooks (best-effort; never break the webhook)
      try {
        await syncUserToGhl(userId)
      } catch (err: any) {
        console.error('[GHL] syncUserToGhl failed:', err?.message)
      }

      try {
        await runWorkflow({
          workflowKey: 'enrollment',
          studentId: userId,
          variables: {
            student_name: userRow?.full_name || (userRow?.email ? userRow.email.split('@')[0] : 'there'),
            course_title: courseRow?.title || 'your course',
            first_lesson_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/student/courses/${courseId}`,
            dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/student`,
          },
          metadata: { courseId, source: 'stripe_webhook' },
        })
      } catch (err: any) {
        console.error('[GHL] enrollment workflow failed:', err?.message)
      }

      if (userRow?.phone_number) {
        try {
          await sendGhlSms({
            studentId: userId,
            alertType: 'enrollment_confirmation',
            variables: {
              student_name: userRow.full_name || userRow.email.split('@')[0],
              course_title: courseRow?.title || 'your course',
              dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/student`,
            },
            metadata: { courseId, source: 'stripe_webhook' },
          })
        } catch (err: any) {
          console.error('[GHL] enrollment SMS failed:', err?.message)
        }
      }

      try {
        await createNotification({
          studentId: userId,
          type: 'course_update',
          title: `Welcome to ${courseRow?.title ?? 'your course'}`,
          message: 'Your enrollment is confirmed. Jump in and start lesson 1 when you are ready.',
          relatedId: courseId,
          relatedKind: 'course',
          linkUrl: `/student/courses/${courseId}`,
          dedupe: true,
        })
      } catch (err: any) {
        console.error('[notifications] enrollment notification failed:', err?.message)
      }

      void emitEmpireActivity({
        event_type: 'payment_succeeded',
        user_email: userRow?.email || null,
        user_id: userId,
        user_name: userRow?.full_name || null,
        message: `Course enrollment paid: ${courseRow?.title || courseId}`,
        metadata: {
          course_id: courseId,
          course_title: courseRow?.title || null,
          stripe_session_id: session.id,
          payment_intent_id: session.payment_intent,
          amount_total: session.amount_total,
          currency: session.currency,
        },
      })

      console.log('✅ Enrollment created/updated for user:', userId, 'course:', courseId)
    } catch (error: any) {
      console.error('Error processing enrollment:', error)
      return NextResponse.json({ error: 'Failed to process enrollment' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
