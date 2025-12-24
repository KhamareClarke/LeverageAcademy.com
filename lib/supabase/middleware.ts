import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Get user and refresh session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // Refresh session to keep it alive
  if (user) {
    const { data: { session } } = await supabase.auth.getSession()
    // If session is about to expire, refresh it
    if (session && session.expires_at) {
      const expiresAt = session.expires_at * 1000 // Convert to milliseconds
      const now = Date.now()
      const timeUntilExpiry = expiresAt - now
      // Refresh if less than 5 minutes remaining
      if (timeUntilExpiry < 5 * 60 * 1000) {
        await supabase.auth.refreshSession()
      }
    }
  }

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/verify-email', '/api/test-email', '/api/send-email', '/api/send-verification-code', '/api/verify-code', '/api/resend-code']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Allow public routes and static files
  if (isPublicRoute || !user) {
    // If trying to access protected route without auth, redirect to login
    if (!user && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/student') || request.nextUrl.pathname.startsWith('/apply'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Get user role from metadata (database check happens in layouts)
  const userRole = user.user_metadata?.role

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/student'
      return NextResponse.redirect(url)
    }
  }

  // Protect student routes (allow both student and admin)
  if (request.nextUrl.pathname.startsWith('/student')) {
    if (!userRole || (userRole !== 'student' && userRole !== 'admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Protect application routes (require authentication)
  if (request.nextUrl.pathname.startsWith('/apply')) {
    if (!userRole) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse
}

