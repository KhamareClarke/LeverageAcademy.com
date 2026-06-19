import { createServerClient } from '@supabase/ssr'
import { NextResponse, NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-url', request.nextUrl.pathname)
  
  const modifiedRequest = new NextRequest(request, {
    headers: requestHeaders,
  })
  
  let supabaseResponse = NextResponse.next({
    request: modifiedRequest,
  })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return modifiedRequest.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => modifiedRequest.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: modifiedRequest,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()
    user = authUser
    if (authError && authError.message?.includes('fetch failed')) {
      console.warn('Network error connecting to Supabase:', authError.message)
    }
  } catch (error: any) {
    if (error?.cause?.code === 'EAI_AGAIN' || error?.message?.includes('fetch failed')) {
      console.warn('Cannot connect to Supabase - network issue. Continuing without auth check.')
    } else {
      console.error('Auth error:', error)
    }
  }

  // Refresh session to keep it alive
  if (user) {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError && !sessionError.message?.includes('fetch failed')) {
        console.warn('Session check error:', sessionError.message)
      }
      if (session && session.expires_at) {
        const expiresAt = session.expires_at * 1000
        const now = Date.now()
        const timeUntilExpiry = expiresAt - now
        if (timeUntilExpiry < 5 * 60 * 1000) {
          const { error: refreshError } = await supabase.auth.refreshSession()
          if (refreshError && !refreshError.message?.includes('fetch failed')) {
            console.warn('Session refresh error:', refreshError.message)
          }
        }
      }
    } catch (error: any) {
      if (!error?.message?.includes('fetch failed')) {
        console.warn('Session refresh error:', error)
      }
    }
  }

  // Public routes
  const publicRoutes = ['/login', '/admin/login', '/signup', '/verify-email', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isPublicRoute || !user) {
    // If trying to access protected route without auth, redirect to appropriate login
    if (!user && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/student'))) {
      const pathname = request.nextUrl.pathname
      // Don't redirect if already on login page
      if (pathname === '/admin/login' || pathname === '/login' || pathname.startsWith('/admin/login') || pathname.startsWith('/login/')) {
        return supabaseResponse
      }
      const url = request.nextUrl.clone()
      // Redirect admin routes to admin login, student routes to student login
      if (pathname.startsWith('/admin')) {
        url.pathname = '/admin/login'
      } else {
        url.pathname = '/login'
      }
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    // Allow public routes and unauthenticated users
    return supabaseResponse
  }

  // Get user role from database (more reliable)
  let userRole = user.user_metadata?.role
  
  // Try to get role from database if not in metadata
  if (!userRole) {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      userRole = userData?.role
    } catch (dbError) {
      // If DB check fails, use metadata or default to student
      userRole = user.user_metadata?.role || 'student'
    }
  }

  // Admin routes - only admins can access
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname.startsWith('/admin/login')) {
      // If admin is already logged in and tries to access login, redirect to dashboard
      if (userRole === 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }
    
    // Allow if role is admin, or if role is undefined (be lenient)
    if (userRole && userRole !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Student routes - allow students and undefined roles
  if (request.nextUrl.pathname.startsWith('/student')) {
    // Only block if explicitly admin trying to access student route
    if (userRole === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    // Allow students and undefined roles
  }

  supabaseResponse.headers.set('x-url', request.nextUrl.pathname)
  
  return supabaseResponse
}
