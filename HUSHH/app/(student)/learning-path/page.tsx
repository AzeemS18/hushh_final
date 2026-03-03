'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getRoadmapByDepartment, RoadmapDay } from '@/lib/data/roadmaps'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Calendar,
  Zap,
  GraduationCap,
  Code,
  Video,
  MessagesSquare,
  Play,
  Lock,
  Terminal,
  Sparkles,
  Search,
  BookOpen,
  ChevronRight,
  Flame
} from 'lucide-react'

interface Student {
  classification_level: string
  domain_preference: string | null
  department: string | null
}

const TECHNICAL_PROBLEMS = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Array', solved: true, acceptance: '49.8%' },
  { id: 2, title: 'Reverse Linked List', difficulty: 'Easy', category: 'Linked List', solved: true, acceptance: '72.1%' },
  { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'Hash Table', solved: false, acceptance: '33.8%' },
  { id: 4, title: 'Merge k Sorted Lists', difficulty: 'Hard', category: 'Linked List', solved: false, acceptance: '48.9%' },
  { id: 5, title: 'House Robber', difficulty: 'Medium', category: 'Dynamic Programming', solved: false, acceptance: '49.2%' },
]

const HR_VIDEOS = [
  { id: '1', title: 'Top 10 HR Interview Questions and Answers', youtubeId: 'X_76-it7v78', duration: '15:20', channel: 'Career Coach' },
  { id: '2', title: 'How to Introduce Yourself in English', youtubeId: 'kayOhGRcu8o', duration: '08:45', channel: 'Skillup' },
  { id: '3', title: 'Body Language Tips for Interviews', youtubeId: 'PCWVi5pAa30', duration: '10:12', channel: 'Interview Prep' },
]

const ROUND_SPECIFIC_CONTENT = {
  aptitude: {
    title: 'Aptitude Mastery',
    description: 'Solve quants and logic puzzles from top recruiters.',
    quote: "Aptitude is the entry gate to your dream career. Master it with precision.",
    topics: ['Number Systems', 'Probability', 'Logical Deduction', 'Data Sufficiency']
  },
  technical: {
    title: 'Code Proficiency',
    description: 'Solve top-tier technical problems curated for industry placements.',
    quote: "Talk is cheap. Show me the code. - Linus Torvalds",
    topics: ['Arrays', 'Strings', 'Dynamic Programming', 'System Design']
  },
  hr: {
    title: 'Interaction Round',
    description: 'Master the art of conversation and behavioral interaction.',
    quote: "People will forget what you said, but they will never forget how you made them feel.",
    topics: ['Introduction', 'Weakness/Strength', 'Conflict Resolution']
  }
}

export default function PracticeHubPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [roadmap, setRoadmap] = useState<RoadmapDay[]>([])
  const [selectedRound, setSelectedRound] = useState<'aptitude' | 'technical' | 'hr'>('technical')

  useEffect(() => {
    if (!user && !localStorage.getItem('mock_user')) {
      router.push('/login')
      return
    }
    loadStudent()
  }, [user, router])

  useEffect(() => {
    if (student?.department) {
      setRoadmap(getRoadmapByDepartment(student.department))
    } else {
      setRoadmap(getRoadmapByDepartment('General'))
    }
  }, [student])

  const loadStudent = async () => {
    try {
      if (localStorage.getItem('mock_user') && !user) {
        setStudent({
          classification_level: 'Intermediate',
          domain_preference: 'Engineering & Technology',
          department: localStorage.getItem('user_department') || 'Computer Science',
        })
        setLoading(false)
        return
      }

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('students')
        .select('classification_level, domain_preference, department')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.warn('Supabase error fetching student:', error)
      }

      if (data) {
        setStudent(data)
      } else {
        setStudent({
          classification_level: 'Beginner',
          domain_preference: null,
          department: 'General'
        })
      }
    } catch (error) {
      console.error('Failed to load student:', error)
      setStudent({
        classification_level: 'Beginner',
        domain_preference: null,
        department: 'General'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#5034ff]" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500 py-8 px-6">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Practice Hub</h1>
          <div className="mt-2 flex items-center gap-2 overflow-hidden">
            <div className="flex items-center gap-2 animate-marquee whitespace-nowrap">
              <Sparkles className="w-4 h-4 text-[#5034ff] shrink-0" />
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm italic">
                "{ROUND_SPECIFIC_CONTENT[selectedRound].quote}"
              </p>
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-wrap gap-2">
          {Object.keys(ROUND_SPECIFIC_CONTENT).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRound(r as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${selectedRound === r
                ? 'bg-[#5034ff] text-white border-[#5034ff] shadow-lg shadow-[#5034ff]/30'
                : 'bg-white dark:bg-gray-900 text-gray-400 border-gray-100 dark:border-gray-800 hover:border-[#5034ff]'
                }`}
            >
              {r} PREP
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-gray-100/50 dark:bg-gray-900 p-1.5 rounded-2xl w-full sm:w-auto h-auto grid grid-cols-2 sm:flex gap-1 mb-8">
          <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[#5034ff] data-[state=active]:text-white transition-all shadow-sm">
            Activities
          </TabsTrigger>
          <TabsTrigger value="resources" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[#5034ff] data-[state=active]:text-white transition-all shadow-sm">
            Roadmap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="relative overflow-hidden bg-gray-900 p-10 rounded-[2.5rem] text-white mb-8 border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5034ff] opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-[10px] font-black uppercase mb-6 border border-white/20">
                Active Round: {selectedRound.toUpperCase()}
              </div>
              <h2 className="text-3xl font-black mb-2">{ROUND_SPECIFIC_CONTENT[selectedRound].title}</h2>
              <p className="text-gray-400 font-medium mb-8 max-w-lg">{ROUND_SPECIFIC_CONTENT[selectedRound].description}</p>

              <div className="flex flex-wrap gap-3">
                {ROUND_SPECIFIC_CONTENT[selectedRound].topics.map(topic => (
                  <div key={topic} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-white/80 uppercase tracking-tighter">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedRound === 'technical' ? (
              TECHNICAL_PROBLEMS.map(prob => (
                <Card key={prob.id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all dark:bg-gray-900 border border-transparent hover:border-[#5034ff]/20 group">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 shadow-sm shadow-emerald-100/50' :
                        prob.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 shadow-sm shadow-orange-100/50' :
                          'bg-red-50 text-red-600 dark:bg-red-900/20 shadow-sm shadow-red-100/50'
                        }`}>
                        {prob.difficulty}
                      </div>
                      {prob.solved && <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />}
                    </div>
                    <h4 className="font-extrabold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-[#5034ff] transition-colors">{prob.title}</h4>
                    <div className="flex items-center gap-2 mb-8">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{prob.category}</span>
                      <span className="text-gray-200">|</span>
                      <span className="text-[10px] font-black text-[#5034ff] uppercase tracking-widest">{prob.acceptance} ACC.</span>
                    </div>
                    <Button onClick={() => router.push(`/assessment?q=${encodeURIComponent(prob.title)}`)} className="w-full h-12 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl group hover:bg-[#5034ff] hover:text-white transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#5034ff]">
                      Solve Challenge <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              HR_VIDEOS.map(video => (
                <Card key={video.id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl transition-all dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <div className="aspect-video relative bg-black/10 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                      alt={video.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-2xl">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-black">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-[10px] font-black text-[#5034ff] uppercase tracking-widest mb-2">{video.channel}</div>
                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-relaxed">{video.title}</h4>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {roadmap.map((dayPlan) => (
              <Card key={dayPlan.day} className="border-none shadow-sm rounded-3xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
                <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-8 justify-between">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#5034ff] to-[#7c3aed] rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-[#5034ff]/20">
                      D{dayPlan.day}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#5034ff] uppercase tracking-widest bg-[#5034ff]/10 px-2 py-0.5 rounded-lg">Milestone</span>
                      </div>
                      <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{dayPlan.topic}</h4>
                      <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 leading-relaxed max-w-lg">{dayPlan.activity}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full sm:w-auto">
                    <Button onClick={() => router.push('/prepare')} className="h-14 px-10 bg-[#5034ff] hover:bg-[#4028e0] text-white font-black rounded-2xl transition-all shadow-xl shadow-[#5034ff]/20">
                      Start Preparation <ChevronRight size={20} className="ml-2" />
                    </Button>
                    <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#5034ff] transition-colors">Mark as complete</button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
