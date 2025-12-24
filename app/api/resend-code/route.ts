import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { email } = body

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    // Resend verification email with OTP
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify-email?email=${encodeURIComponent(email)}`,
      },
    })

    if (resendError) {
      return NextResponse.json({ 
        error: resendError.message || 'Failed to resend code' 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Verification code has been resent to your email' 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to resend code' 
    }, { status: 500 })
  }
}

