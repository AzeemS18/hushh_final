'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { NavigationHeader } from '@/components/shared/navigation-header'

export default function LoginPage() {
  const [role, setRole] = useState<'student' | 'admin'>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    localStorage.setItem('mock_user', 'true')
    localStorage.setItem('user_role', role)
    localStorage.setItem('user_email', email)
    localStorage.setItem('user_name', email.split('@')[0])

    if (role === 'admin') {
      window.location.href = '/admin/dashboard'
    } else {
      window.location.href = '/dashboard'
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 relative">
        <div className="max-w-md w-full mx-auto">
          <NavigationHeader />
          {}
          <div className="mb-8 flex items-center gap-2">
            <GraduationCap className="text-[#5034ff]" size={32} />
            <span className="text-xl font-bold tracking-tight text-gray-900">PlacementHub</span>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Welcome back</h1>
          <p className="text-gray-500 text-xs mb-6 font-medium">Continue your high-performance placement journey.</p>

          <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 p-1 rounded-2xl border border-gray-100">
            <button
              onClick={() => setRole('student')}
              type="button"
              className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'student' ? 'bg-white text-[#5034ff] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('admin')}
              type="button"
              className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-white text-[#5034ff] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Email
              </label>
              <Input
                type="text"
                placeholder="Enter your mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-gray-100 bg-gray-50 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-xl px-4 text-sm font-bold"
              />
            </div>

            <div className="relative">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-gray-100 bg-gray-50 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-xl px-4 pr-12 text-sm font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="border-gray-300 data-[state=checked]:bg-[#5034ff] data-[state=checked]:border-[#5034ff]" />
                <label htmlFor="remember" className="text-xs font-bold text-gray-600 cursor-pointer">
                  Keep me logged in
                </label>
              </div>
              <a href="#" className="text-xs font-black text-[#5034ff] hover:underline">
                Forgot ?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gray-900 border-none hover:bg-black text-white rounded-xl font-black text-sm mt-4 shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </Button>

            <div className="relative py-3 flex items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink-0 mx-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                Quick Access
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full h-11 border-gray-100 hover:bg-gray-50 rounded-xl font-bold text-gray-600 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>
          </form>

          <p className="text-center text-[11px] font-bold text-gray-500 mt-6">
            New here?{' '}
            <a href="/signup" className="text-[#5034ff] hover:underline underline-offset-4">
              Create an account
            </a>
          </p>
        </div>
      </div>

      {}
      <div className="hidden lg:block w-1/2 bg-[#2a1780] relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          viewBox="0 0 800 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M 0 0 L 400 0 L 400 250 C 400 250 200 350 0 250 Z" fill="#8c52ff" />
          <circle cx="900" cy="400" r="300" stroke="#5034ff" strokeWidth="60" fill="none" />
          <rect x="650" y="700" width="150" height="300" fill="#00d4ff" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center p-20 text-white">
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-black italic tracking-tighter">"The best way to predict your future is to create it."</h2>
            <p className="text-indigo-200 text-sm font-bold opacity-80">Join 12,000+ students mastering their career path with AI-driven placement insights.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
