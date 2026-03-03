import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=auth_error', request.url))
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      const { data: profile } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile) {
        return NextResponse.redirect(new URL('/profile-setup', request.url))
      }

      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.redirect(new URL('/auth/login', request.url))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=callback_error', request.url))
  }
}
