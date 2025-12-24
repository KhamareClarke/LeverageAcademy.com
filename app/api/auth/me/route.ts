import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Get current user session info
export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ user: null, authenticated: false })
  }

  // Get user role
  let role = user.user_metadata?.role
  if (!role) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    role = userData?.role || 'student'
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      role,
    },
    authenticated: true,
  })
}

