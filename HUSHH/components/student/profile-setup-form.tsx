'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/auth-context'
import { Loader2, GraduationCap, Building, Zap, Target } from 'lucide-react'

const DOMAINS = [
  'Engineering & Technology',
  'Business & Management',
  'Arts & Humanities',
  'Science & Mathematics',
  'Health & Medicine',
  'Other',
]

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'General',
]

export function ProfileSetupForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    graduationYear: new Date().getFullYear() + 1,
    email: '',
    college: '',
    domain: '',
    department: '',
    classification_level: '' as 'Beginner' | 'Intermediate' | 'Advanced' | '',
  })

  useEffect(() => {
    if (user && !authLoading) {
      setFormData(prev => ({
        ...prev,
        fullName: user.user_metadata?.name || '',
        email: user.email || '',
      }))
    }
  }, [user, authLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user && !localStorage.getItem('mock_user')) return

    if (!formData.fullName || !formData.college || !formData.domain || !formData.department || !formData.classification_level || !formData.rollNumber) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (user && !localStorage.getItem('mock_user')) {
        const { error: dbError } = await supabase
          .from('students')
          .insert({
            user_id: user.id,
            full_name: formData.fullName,
            roll_number: formData.rollNumber,
            email: formData.email,
            academic_year: formData.graduationYear,
            department: formData.department,
            target_role: formData.department,
            preferred_companies: formData.college.split(',').filter(Boolean),
            weekly_availability: 10,
            classification_level: formData.classification_level,
            domain_preference: formData.domain,
            knows_target_domain: true,
          })

        if (dbError) throw dbError

        await supabase.auth.updateUser({
          data: {
            name: formData.fullName,
            roll_number: formData.rollNumber,
            graduation_year: formData.graduationYear
          }
        })
      } else {
        localStorage.setItem('user_name', formData.fullName)
        localStorage.setItem('user_roll', formData.rollNumber)
        localStorage.setItem('user_grad_year', String(formData.graduationYear))
        localStorage.setItem('user_department', formData.department)
        localStorage.setItem('user_level', formData.classification_level)
      }

      router.push('/assessment')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="text-[#5034ff] h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans py-12">
      <Card className="w-full max-w-2xl border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
        {}
        <div className="bg-[#5034ff] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
            <p className="text-[#e2dcff] text-lg font-medium">Let's build your placement profile.</p>
          </div>
        </div>

        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 font-bold">
                {error}
              </div>
            )}

            {}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#5034ff]" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-2xl px-4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Roll Number</label>
                  <Input
                    placeholder="e.g. 21CS001"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-2xl px-4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-2xl px-4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Graduation Year</label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                    className="w-full h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-2xl px-4 bg-white text-gray-900 outline-none border font-medium"
                    required
                  >
                    {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-[#5034ff]" />
                Academic Details
              </h3>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">College / University</label>
                  <Input
                    placeholder="Enter your college name"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-2xl px-4"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Domain</label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-2xl px-4 bg-white text-gray-900 outline-none border font-medium"
                      required
                    >
                      <option value="" disabled>Select Domain</option>
                      {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full h-12 border-gray-200 focus:border-[#5034ff] focus:ring-[#5034ff] rounded-2xl px-4 bg-white text-gray-900 outline-none border font-medium"
                      required
                    >
                      <option value="" disabled>Select Department</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-[#5034ff]" />
                Career Goals
              </h3>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Target Companies</label>
                <div className="flex flex-wrap gap-2">
                  {['TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Microsoft'].map(company => (
                    <button
                      key={company}
                      type="button"
                      onClick={() => {
                        const current = formData.college.split(',').filter(Boolean)
                        const next = current.includes(company)
                          ? current.filter(c => c !== company)
                          : [...current, company]
                        setFormData({ ...formData, college: next.join(',') })
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${formData.college.includes(company)
                        ? 'bg-[#5034ff] text-white border-[#5034ff]'
                        : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200'
                        }`}
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {}
            <div className="space-y-6 pb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#5034ff]" />
                Starting Level
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'Beginner', icon: '🌱', label: 'Beginner' },
                  { id: 'Intermediate', icon: '🚀', label: 'Intermediate' },
                  { id: 'Advanced', icon: '⭐', label: 'Advanced' },
                ].map((level) => (
                  <div
                    key={level.id}
                    onClick={() => setFormData({ ...formData, classification_level: level.id as any })}
                    className={`cursor-pointer rounded-2xl p-4 border-2 text-center transition-all ${formData.classification_level === level.id
                      ? 'border-[#5034ff] bg-[#5034ff]/5 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                  >
                    <div className="text-2xl mb-2">{level.icon}</div>
                    <div className={`font-bold text-sm ${formData.classification_level === level.id ? 'text-[#5034ff]' : 'text-gray-900'}`}>
                      {level.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#5034ff] hover:bg-[#4028e0] text-white rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                'Start My Journey'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
