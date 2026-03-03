'use client'

import { useEffect, useMemo, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { getRoadmapByDepartment } from '@/lib/data/roadmaps'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Calendar,
  Building2,
  CheckCircle2,
  Zap,
  GraduationCap,
  Users,
  Loader2,
  BookOpen,
  TrendingUp,
  Award,
  Flame,
  Target,
  Timer,
  ArrowRight,
  Sparkles,
  Trophy,
  Download
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { Progress } from '@/components/ui/progress'

const STUDY_MODULES = [
  { name: 'Quantitative Aptitude', color: 'bg-blue-500', progress: 65 },
  { name: 'Logical Reasoning', color: 'bg-emerald-500', progress: 42 },
  { name: 'Technical DSA', color: 'bg-[#5034ff]', progress: 88 },
  { name: 'Verbal Ability', color: 'bg-amber-500', progress: 30 },
]

const MOTIVATIONAL_QUOTES = [
  "Your future is created by what you do today.",
  "Opportunities don't happen. You create them.",
  "Don't wait for opportunity. Create it.",
  "The best way to predict your future is to create it."
]

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { data: dashboardData, loading } = useDashboardData(user?.id)

  const [isClient, setIsClient] = useState(false)
  const [quote] = useState(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)])

  useEffect(() => {
    setIsClient(true)
    if (!user && !localStorage.getItem('mock_user')) {
      router.push('/login')
    }
  }, [user, router])

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-[#5034ff]" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-700 font-sans py-8 px-6">

      {/* Motivational Banner - Compact & Premium */}
      <div className="bg-[#1e1b4b] p-6 rounded-2xl text-white overflow-hidden relative shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-xl text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md">
              <Sparkles className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ELITE PERFORMANCE
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight italic">
              "{quote}"
            </h1>
            <p className="text-indigo-200 text-[10px] font-bold opacity-80 uppercase tracking-wider">
              Student ID: {user?.email?.split('@')[0] || 'CHAMPION'} • Rank Tracking Active
            </p>
          </div>

          <div className="flex flex-col items-center bg-white/5 p-4 rounded-xl border border-white/10 min-w-[150px]">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400 mb-1" />
            <span className="text-white/40 text-[8px] font-black uppercase tracking-widest">Global Streak</span>
            <div className="text-xl font-black italic">{dashboardData?.weeklyStreak || 7} DAYS</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">

          {/* Stats Grid - High Density */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-white border-gray-100 shadow-sm rounded-xl p-4 group hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 text-[#5034ff] rounded-lg flex items-center justify-center">
                  <Target className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Readiness</p>
                  <h3 className="text-lg font-black text-gray-900 italic">{dashboardData?.readinessScore}%</h3>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm rounded-xl p-4 group hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Rank</p>
                  <h3 className="text-lg font-black text-gray-900 italic">#{dashboardData?.level || 124}</h3>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm rounded-xl p-4 group hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                  <Timer className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Focus</p>
                  <h3 className="text-lg font-black text-gray-900 italic">24.5h</h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Chart Section - Compact */}
          <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-indigo-50 text-[#5034ff] rounded-lg text-[8px] font-black uppercase tracking-widest mb-1.5 border border-indigo-100">
                  Analytics Hub
                </div>
                <h2 className="text-lg font-black tracking-tight text-gray-900 flex items-center gap-2 italic">
                  Skill Trajectory
                  <TrendingUp className="text-emerald-500 w-5 h-5" />
                </h2>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl px-4 border border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5034ff]"></div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Engagement</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full pr-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData?.chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5034ff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#5034ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: '700' }}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    itemStyle={{ fontWeight: '800', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#5034ff"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Sidebar - Compact */}
        <div className="space-y-6">
          <Card className="bg-[#1e1b4b] text-white border-none shadow-lg rounded-2xl p-6 relative overflow-hidden">
            <Trophy className="absolute -top-4 -right-4 w-20 h-20 opacity-10" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-sm font-black italic leading-tight">Next Challenge</h3>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-indigo-400 text-[8px] font-black uppercase tracking-widest mb-1">Weekly #12</p>
                <div className="text-sm font-black italic mb-0.5">Google Mock Round</div>
                <div className="text-[9px] font-medium text-white/50 flex items-center gap-1.5 uppercase tracking-tighter">
                  <Timer className="w-3 h-3" /> Ends in 02:45:12
                </div>
              </div>
              <Button
                onClick={() => router.push('/contests')}
                className="w-full h-10 bg-white text-gray-900 hover:bg-indigo-50 font-black rounded-lg text-xs shadow-md"
              >
                Enter Arena
              </Button>
            </div>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Competency Radar</h3>
            <div className="space-y-4">
              {STUDY_MODULES.map(module => (
                <div key={module.name} className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{module.name}</span>
                    <span className="text-[10px] font-black text-gray-900 italic">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-1.5 rounded-full bg-gray-50">
                    <div className={`h-full rounded-full ${module.color}`} style={{ width: `${module.progress}%` }}></div>
                  </Progress>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-3 shadow-md shadow-emerald-500/10">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-gray-900 italic mb-1">Elite Growth Card</h4>
            <p className="text-gray-500 text-[10px] font-medium mb-4 leading-relaxed">Verified scores and performance benchmarks ready for export.</p>
            <Button
              onClick={() => router.push('/growth-card')}
              className="w-full h-10 rounded-lg font-black text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white transition-all gap-1.5 tracking-tighter"
            >
              <Download className="w-3.5 h-3.5" /> REGENERATE CARD
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}