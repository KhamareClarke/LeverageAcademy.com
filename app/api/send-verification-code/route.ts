import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store code in database (expires in 10 minutes)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    try {
      const supabase = await createClient()
      const { error: insertError } = await supabase
        .from('verification_codes')
        .insert({
          email: email.toLowerCase().trim(),
          code,
          expires_at: expiresAt.toISOString(),
        })

      if (insertError) {
        // If table doesn't exist, log but continue
        console.warn('Could not store verification code:', insertError)
      }
    } catch (dbError) {
      // If database fails, still try to send email
      console.warn('Database error storing code:', dbError)
    }

    // Send email
    const emailResult = await sendVerificationEmail(email, code)
    
    if (emailResult.success) {
      console.log('✅ Verification email sent to:', email)
      return NextResponse.json({ 
        success: true,
        message: 'Verification code sent to your email'
      })
    } else {
      console.warn('⚠️ Email not sent:', emailResult.error)
      return NextResponse.json({ 
        success: false,
        error: 'Failed to send verification email. Please check your email configuration.',
        message: 'Email service not configured'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in send-verification-code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
