import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role-client'
import { NextResponse } from 'next/server'
import { emitEmpireActivity } from '@/lib/empire-activity'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Check verification code
    const { data: codeData, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('code', code)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (codeError || !codeData) {
      void emitEmpireActivity({
        event_type: 'signin_failed',
        user_email: email,
        message: 'Invalid or expired verification code',
        request,
      })
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 })
    }

    // Try to verify email in Supabase Auth (non-blocking)
    try {
      const normalizedEmail = email.toLowerCase().trim()
      const serviceSupabase = createServiceRoleClient()
      const { data: userRow } = await serviceSupabase
        .from('users')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle()

      if (userRow?.id) {
        await serviceSupabase.auth.admin.updateUserById(userRow.id, {
          email_confirm: true,
        })
      }
    } catch (supabaseError) {
      // Ignore Supabase errors - code verification succeeded
      console.warn('Supabase verification error (ignored):', supabaseError)
    }

    await supabase
      .from('verification_codes')
      .delete()
      .eq('id', codeData.id)

    void emitEmpireActivity({
      event_type: 'verify_email',
      user_email: email,
      request,
    })

    return NextResponse.json({ success: true, message: 'Email verified successfully' })
  } catch (error: any) {
    console.error('Error in verify-code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
