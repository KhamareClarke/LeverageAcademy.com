'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugUserPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [dbUser, setDbUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUserInfo(user)

    if (user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      setDbUser(data)
    }
  }

  return (
    <div className="min-h-screen bg-main-950 p-8 text-type-50">
      <h1 className="text-2xl font-bold mb-6">User Debug Info</h1>
      
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Auth User</h2>
          <pre className="text-xs overflow-auto bg-main-900 p-4 rounded">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Database User</h2>
          <pre className="text-xs overflow-auto bg-main-900 p-4 rounded">
            {JSON.stringify(dbUser, null, 2)}
          </pre>
        </div>

        <button
          onClick={checkUser}
          className="px-6 py-3 bg-gradient-gold text-black rounded-xl font-bold"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}

