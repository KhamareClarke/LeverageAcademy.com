import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  try {
    if (!supabaseUrl || !supabaseKey) return null
    return createBrowserClient(supabaseUrl, supabaseKey)
  } catch {
    return null
  }
}



