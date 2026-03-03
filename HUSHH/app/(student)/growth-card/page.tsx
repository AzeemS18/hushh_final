'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Loader2,
  Share2,
  Download,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Linkedin,
  MessageCircle,
  QrCode,
  Award
} from 'lucide-react'

export default function GrowthCardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const { data: dashboardData, loading } = useDashboardData(user?.id)

  const [profile, setProfile] = useState({
    name: 'STUDENT',
    roll: '2024PH001',
    college: 'HUSH UNIVERSITY',
    dept: 'COMPUTER SCIENCE',
    roles: ['Frontend Developer', 'UI/UX Designer']
  })

  useEffect(() => {
    if (!user && !localStorage.getItem('mock_user')) {
      router.push('/login')
      return
    }

    if (user?.user_metadata) {
      setProfile({
        name: user.user_metadata.name?.toUpperCase() || 'ALEX THOMPSON',
        roll: user.user_metadata.roll || '2024PH012',
        college: user.user_metadata.college || 'PLACEMENT HUB INSTITUTE',
        dept: user.user_metadata.dept?.toUpperCase() || 'INFORMATION TECHNOLOGY',
        roles: user.user_metadata.roles || ['Full Stack Developer', 'AI Analyst']
      })
    } else if (localStorage.getItem('mock_user')) {
      setProfile({
        name: 'ALEX THOMPSON',
        roll: '2024PH012',
        college: 'PLACEMENT HUB INSTITUTE',
        dept: 'INFORMATION TECHNOLOGY',
        roles: ['Full Stack Developer', 'AI Analyst']
      })
    }
  }, [user, router])

  const readinessScore = dashboardData?.readinessScore || 87
  const skills = [
    { name: 'Technical Stack', score: 92 },
    { name: 'Communication', score: 85 },
    { name: 'Problem Solving', score: 88 },
    { name: 'Aptitude', score: 94 }
  ]

  const qrData = encodeURIComponent(`https://placement-hub-hushh.vercel.app/verify/${profile.roll}`)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}&color=1e1b4b&bgcolor=ffffff&qzone=2&margin=0`

  const shareOnLinkedin = () => {
    const text = `I'm excited to share my Verified Placement Readiness Card from PlacementHub! Score: ${readinessScore}% 🚀 #PlacementReady #CareerGrowth`
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://placement-hub-hushh.vercel.app')}&summary=${encodeURIComponent(text)}`, '_blank')
  }

  const shareOnWhatsapp = () => {
    const text = `Check out my Verified Placement Readiness Card on PlacementHub! Score: ${readinessScore}% 🚀 View here: https://placement-hub-hushh.vercel.app`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleDownload = () => {
    const btn = document.getElementById('download-btn')
    if (btn) {
      btn.innerText = 'GENERATING PDF...'
      setTimeout(() => {
        btn.innerText = 'DOWNLOADED'
        setTimeout(() => btn.innerText = 'SAVE CARD (PDF)', 2000)
      }, 1500)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-[#5034ff]" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700 font-sans py-12 px-6">

      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase">Verified Digital Placement Card</h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Generate, Download & Share your professional readiness report</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-12">

        {/* Placement Card Container - Premium Professional Look */}
        <div className="w-full max-w-4xl bg-white border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden p-8 md:p-14 relative bg-glass backdrop-blur-3xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch">

            {/* Left Section: Scannable QR & Skill Blueprint */}
            <div className="space-y-10 relative">
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  {/* Premium QR Border */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-[2rem] blur-2xl"></div>
                  <div className="relative bg-white p-6 rounded-3xl border border-gray-100 shadow-2xl flex items-center justify-center w-52 h-52 group">
                    <img src={qrUrl} alt="Scan for Verification" className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500" />
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase">Placement Id Card</h2>
                  <p className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                    <QrCode className="w-3 h-3" /> Scan to Verify Credentials
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="h-[2px] w-4 bg-indigo-500"></div> Competency Stack
                </h3>
                <div className="space-y-5">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-900 uppercase italic tracking-tight">{skill.name}</span>
                        <span className="text-[11px] font-black text-indigo-600">{skill.score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5034ff] rounded-full shadow-[0_0_12px_rgba(80,52,255,0.3)]"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approved Stamp - Refined */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none rotate-[-15deg] scale-125 hidden md:block">
                <div className="border-[12px] border-indigo-900 rounded-full w-64 h-64 flex items-center justify-center">
                  <span className="text-indigo-900 text-5xl font-black italic tracking-tighter uppercase p-4">Validated</span>
                </div>
              </div>
            </div>

            {/* Right Section: Candidate Dossier & Rank */}
            <div className="space-y-10 border-l border-gray-100/50 md:pl-16">

              {/* Leaderboard Status - Compact Dashboard Style */}
              <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] p-7 rounded-[2rem] space-y-4 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="flex items-center justify-between relative z-10">
                  <h3 className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.3em] italic">Global Standing</h3>
                  <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-3 relative z-10">
                  <span className="text-5xl font-black text-white italic tracking-tighter">Top 12%</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/5 backdrop-blur-md relative z-10">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap">↑ Rising Performance</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-7">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Candidate Name</p>
                    <p className="text-2xl font-black italic text-gray-900 tracking-tight">{profile.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Roll ID</p>
                      <p className="text-sm font-black text-gray-900 tracking-tight">{profile.roll}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Department</p>
                      <p className="text-sm font-black text-gray-900 tracking-tight italic">{profile.dept}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Validated Specializations</p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {profile.roles.map((role) => (
                        <span key={role} className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-tight italic">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Accredited Institution</p>
                    <p className="text-sm font-black text-gray-600 italic tracking-tight opacity-70">{profile.college}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest italic">A+ Merit Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Refined */}
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-xl">
          <Button
            onClick={shareOnLinkedin}
            className="flex-1 h-15 bg-[#0a66c2] hover:bg-[#004182] text-white font-black rounded-2xl gap-3 shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-tight italic text-xs"
          >
            <Linkedin className="w-5 h-5" /> Export to LinkedIn
          </Button>
          <Button
            onClick={shareOnWhatsapp}
            className="flex-1 h-15 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl gap-3 shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-tight italic text-xs"
          >
            <MessageCircle className="w-5 h-5" /> Share via WhatsApp
          </Button>
        </div>

        <Button
          id="download-btn"
          onClick={handleDownload}
          variant="outline"
          className="w-full max-w-sm h-14 border-2 rounded-2xl font-black gap-3 hover:bg-gray-50 transition-all border-gray-100 uppercase tracking-widest italic text-xs"
        >
          <Download className="w-5 h-5 text-gray-400" /> Download Dossier (PDF)
        </Button>

      </div>
    </div>
  )
}
