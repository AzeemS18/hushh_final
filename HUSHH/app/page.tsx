'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, Target, CheckCircle, GraduationCap, Users } from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user && !localStorage.getItem('mock_user')) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#5034ff]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-50 h-20 flex items-center justify-between px-10">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-[#5034ff]" size={32} />
          <span className="text-xl font-bold tracking-tight text-gray-900">PlacementHub</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-500">
          <a href="#features" className="hover:text-[#5034ff]">Features</a>
          <a href="#about" className="hover:text-[#5034ff]">About</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-[#5034ff] text-white font-bold h-12 px-6 rounded-xl"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                onClick={() => router.push('/login')}
                variant="ghost"
                className="text-gray-600 font-bold"
              >
                Log In
              </Button>
              <Button
                onClick={() => router.push('/signup')}
                className="bg-[#5034ff] text-white font-bold h-12 px-6 rounded-xl"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40">
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Crack Your Career <br />
            <span className="text-[#5034ff]">With PlacementHub</span>
          </h1>

          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Practice mock tests, track your progress, and get a personalized 7-day plan to land your dream job at top companies.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => router.push('/signup')}
              className="bg-[#5034ff] text-white text-lg font-bold h-16 px-10 rounded-2xl shadow-xl shadow-indigo-100"
            >
              Start Preparing Now
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-3 gap-8">
          {[
            { title: 'Practice Tests', icon: Target, desc: 'Multiple test modules covering tech and aptitude.' },
            { title: 'Track Progress', icon: BookOpen, desc: 'Detailed score breakdown and area-wise analysis.' },
            { title: 'Success Path', icon: CheckCircle, desc: 'Simplified 7-day study schedule based on your performance.' }
          ].map((feat, i) => (
            <Card key={i} className="border-gray-100 shadow-sm p-8 rounded-2xl bg-gray-50/50">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm">
                <feat.icon className="text-[#5034ff]" size={24} />
              </div>
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl font-bold">{feat.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-500 text-sm">{feat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Simple CTA */}
        <section className="max-w-4xl mx-auto px-6 pb-40">
          <div className="bg-gray-900 rounded-[2rem] p-16 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Build Your Professional Future</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">Join thousands of students who are preparing for their placements with our structured roadmap.</p>
            <Button
              onClick={() => router.push('/signup')}
              className="bg-[#5034ff] text-white text-lg font-bold h-16 px-12 rounded-2xl"
            >
              Create Your Account
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} />
            <span className="font-bold text-gray-900">PlacementHub</span>
          </div>
          <p>© 2026 PlacementHub. All rights reserved.</p>
          <div className="flex gap-6 font-medium">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
