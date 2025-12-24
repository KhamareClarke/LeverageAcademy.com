import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StudentNav from '@/components/StudentNav'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // First check user_metadata (faster, no DB query)
  let role = user.user_metadata?.role

  // If not in metadata, check database
  if (!role) {
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user role:', error)
      // If user profile doesn't exist, create it
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          role: 'student',
          full_name: user.user_metadata?.full_name || null,
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('Error creating user profile:', insertError)
      }
      role = 'student' // Default to student
    } else {
      role = userData?.role
    }
  }

  if (role === 'admin') {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-main-950">
      <StudentNav />
      <main className="pt-24">{children}</main>
    </div>
  )
}

