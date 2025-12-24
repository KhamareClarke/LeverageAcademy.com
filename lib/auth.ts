import { createClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  return user
}

export async function getUserRole(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data.role
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(requiredRole: 'admin' | 'student') {
  const user = await requireAuth()
  
  // Check metadata first
  let role = user.user_metadata?.role
  
  // If not in metadata, check database
  if (!role) {
    role = await getUserRole(user.id)
  }

  if (role !== requiredRole && role !== 'admin') {
    throw new Error('Forbidden: Insufficient permissions')
  }

  return { user, role }
}

