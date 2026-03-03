'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { NavigationHeader } from '@/components/shared/navigation-header'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    localStorage.setItem('mock_user', 'true')
    localStorage.setItem('user_email', email)
    localStorage.setItem('user_name', name)
    window.location.href = '/profile-setup'
    return

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: name,
            role: 'student',
          },
        },
      })

      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="mx-auto w-12 h-12 bg-[#5034ff]/10 rounded-full flex items-center justify-center mb-6 text-[#5034ff]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-500 mb-6">
            A confirmation link has been sent to <strong>{email}</strong>. Click it to confirm your email and activate your account.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="w-full h-12 bg-[#5034ff] hover:bg-[#4028e0] text-white rounded-xl font-semibold text-base transition-all"
          >
            Back to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 relative py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto">
          <NavigationHeader />
          {}
          <div className="mb-10 flex items-center gap-2">
            <GraduationCap className="text-[#5034ff]" size={36} />
            <span className="text-xl font-bold tracking-tight text-gray-900">PlacementHub</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Create an account</h1>
          <p className="text-gray-500 text-sm mb-8">Join thousands of students and start your preparation today.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-xl px-4"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="Enter your mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-xl px-4"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-xl px-4 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Match password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-xl px-4"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#5034ff] hover:bg-[#4028e0] text-white rounded-xl font-semibold text-base mt-2 shadow-md transition-all active:scale-[0.98]"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Or, Sign up with
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              variant="outline"
              className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-xl font-semibold text-gray-700 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with google
            </Button>
          </form>

          <p className="text-center text-sm font-semibold text-gray-900 mt-6">
            Already have an account ?{' '}
            <a href="/login" className="text-[#5034ff] hover:underline underline-offset-4">
              Log in here
            </a>
          </p>
        </div>
      </div>

      {}
      <div className="hidden lg:block w-1/2 bg-[#2a1780] relative overflow-hidden">
        {}
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          viewBox="0 0 800 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {}
          <path d="M 0 0 L 400 0 L 400 250 C 400 250 200 350 0 250 Z" fill="#8c52ff" />
          <path d="M 0 0 L 200 0 C 200 150 100 250 0 250 Z" fill="#aa75ff" opacity="0.8" />

          {}
          <rect x="400" y="0" width="200" height="250" fill="#130e46" />
          <rect x="450" y="50" width="30" height="30" transform="rotate(45 465 65)" fill="#ffb400" />
          <rect x="500" y="50" width="30" height="30" transform="rotate(45 515 65)" fill="#ff5e5e" />
          <path d="M 420 150 L 580 150 M 420 160 L 580 160 M 420 170 L 580 170" stroke="#00f0ff" strokeWidth="4" strokeDasharray="8 4" />

          {}
          <rect x="600" y="0" width="200" height="250" fill="#3a25a2" />
          <path d="M 600 0 L 800 200 M 600 20 L 800 220 M 600 40 L 800 240 M 600 60 L 800 260 M 600 80 L 800 280 M 600 100 L 800 300 M 600 120 L 800 320 M 600 140 L 800 340 M 600 160 L 800 360 M 600 180 L 800 380 M 600 200 L 800 400" stroke="#1c1157" strokeWidth="2" opacity="0.3" />

          {}
          <path d="M 120 300 L 160 350 L 80 350 Z" fill="#4d8ef7" />
          <path d="M 60 370 L 100 420 L 20 420 Z" fill="#4d8ef7" />

          {}
          <path d="M 300 280 C 330 280 340 250 340 250 C 340 280 370 290 370 290 C 340 300 330 330 330 330 C 320 300 290 290 300 280 Z" fill="#d8edff" opacity="0.5" />
          <path d="M 330 330 L 350 380 L 310 380 Z" fill="#ffffff" />

          {}
          <circle cx="900" cy="400" r="300" stroke="#5034ff" strokeWidth="60" fill="none" opacity="0.8" />
          <circle cx="900" cy="400" r="220" stroke="#130e46" strokeWidth="40" fill="none" />

          {}
          <path d="M 280 480 L 290 510 L 320 515 L 295 530 L 305 560 L 280 545 L 255 560 L 265 530 L 240 515 L 270 510 Z" fill="#ffb400" />

          {}
          <rect x="80" y="520" width="120" height="150" fill="#00d4ff" />
          <path d="M 80 520 L 200 670 L 80 670 Z" fill="#00a3cc" />

          {}
          <path d="M 400 490 A 5 5 0 1 1 400 491" stroke="#4d8ef7" strokeWidth="10" strokeLinecap="round" strokeDasharray="0 25" />
          <path d="M 440 490 A 5 5 0 1 1 440 491" stroke="#4d8ef7" strokeWidth="10" strokeLinecap="round" strokeDasharray="0 25" />
          <path d="M 480 490 A 5 5 0 1 1 480 491" stroke="#4d8ef7" strokeWidth="10" strokeLinecap="round" strokeDasharray="0 25" />
          <path d="M 520 490 A 5 5 0 1 1 520 491" stroke="#4d8ef7" strokeWidth="10" strokeLinecap="round" strokeDasharray="0 25" />

          {}
          <path d="M 0 600 L 500 600" stroke="#5034ff" strokeWidth="40" fill="none" />
          <path d="M 0 660 L 500 660" stroke="#4d8ef7" strokeWidth="30" fill="none" opacity="0.5" />

          {}
          <path d="M 450 630 A 250 250 0 0 1 950 630 L 950 1000 L 450 1000 Z" fill="#130e46" />
          <circle cx="650" cy="800" r="150" fill="#5034ff" />
          <circle cx="580" cy="800" r="150" fill="#4d8ef7" opacity="0.3" clipPath="url(#circle-clip)" />

          <clipPath id="circle-clip">
            <circle cx="650" cy="800" r="150" />
          </clipPath>

          <circle cx="650" cy="800" r="8" fill="#ffffff" />

          {}
          <path d="M 0 850 C 150 850 250 950 250 1000 L 0 1000 Z" fill="#aa75ff" />
          <circle cx="0" cy="1000" r="150" stroke="#5034ff" strokeWidth="20" fill="none" />

          {}
          <rect x="650" y="700" width="150" height="300" fill="#00d4ff" />
          <path d="M 670 720 L 780 720 M 670 740 L 780 740 M 670 760 L 780 760" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />

          {}
          <path d="M 640 550 L 580 500 M 640 550 L 540 540 M 640 550 L 600 600 M 640 550 L 680 490 M 640 550 L 720 520" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <circle cx="640" cy="550" r="6" fill="#ffffff" />
          <circle cx="580" cy="500" r="4" fill="#ffffff" opacity="0.8" />
          <circle cx="540" cy="540" r="4" fill="#ffffff" opacity="0.8" />
          <circle cx="600" cy="600" r="4" fill="#ffffff" opacity="0.8" />
          <circle cx="680" cy="490" r="4" fill="#ffffff" opacity="0.8" />
          <circle cx="720" cy="520" r="4" fill="#ffffff" opacity="0.8" />

          {}
          <path d="M 300 950 Q 320 930 340 950 T 380 950 T 420 950 T 460 950 T 500 950" stroke="#4d8ef7" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 300 970 Q 320 950 340 970 T 380 970 T 420 970 T 460 970 T 500 970" stroke="#4d8ef7" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
