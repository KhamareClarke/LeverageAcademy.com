import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { email, userId } = body

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    // Generate verification code using database function
    const { data: codeData, error: codeError } = await supabase.rpc('generate_verification_code', {
      p_email: email,
      p_user_id: userId || null,
    })

    if (codeError) {
      console.error('Error generating code:', codeError)
      return NextResponse.json({ 
        error: 'Failed to generate verification code' 
      }, { status: 500 })
    }

    const code = codeData

    // Send email with verification code
    try {
      // Use custom email route (Gmail SMTP) to send verification code
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const emailResult = await emailResponse.json()
      
      if (!emailResponse.ok) {
        console.error('Gmail email failed:', emailResult.error)
        // Log the error but don't fail - code is still generated
      } else {
        console.log('✅ Email sent via Gmail successfully:', emailResult.messageId)
      }
    } catch (emailErr) {
      console.error('Error sending email:', emailErr)
      // Don't fail the request if email fails - code is still generated
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Verification code sent to your email' 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to send verification code' 
    }, { status: 500 })
  }
}

