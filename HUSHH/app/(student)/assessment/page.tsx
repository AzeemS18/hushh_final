'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Rocket, Brain, MessageSquare, Code, Trophy,
  ChevronRight, Sparkles, Timer, Info, ArrowLeft,
  CheckCircle2, Youtube, Search, FileText, Send, Loader2, ListOrdered
} from 'lucide-react'

import { MockTestSimulator } from '@/components/student/mock-test'
import { HRSimulator } from '@/components/student/hr-simulator'
import { CodingCompiler } from '@/components/student/coding-compiler'
import { ATSAnalyzer } from '@/components/student/ats-analyzer'
import { ScorecardHistory } from '@/components/student/scorecard-history'

const INTERVIEW_ROUNDS = [
  {
    id: 'department',
    title: 'Department Mock Test',
    description: '10-question MCQ tests tailored to your engineering stream or target company.',
    icon: <Rocket className="w-5 h-5" />,
    color: 'bg-blue-50 text-blue-600',
    questions: 10,
    duration: '15 mins'
  },
  {
    id: 'compiler',
    title: 'Coding Assessment',
    description: 'Solve real company DSA problems with our live Python/Java compiler.',
    icon: <Code className="w-5 h-5" />,
    color: 'bg-indigo-50 text-indigo-600',
    questions: 1,
    duration: '30 mins'
  },
  {
    id: 'hr',
    title: 'HR Simulator',
    description: 'Practice soft skills with voice-to-text and Local AI feedback.',
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'bg-purple-50 text-purple-600',
    questions: 5,
    duration: '15 mins'
  },
  {
    id: 'ats',
    title: 'ATS Resume Analyzer',
    description: 'Upload your PDF and get instant feedback from Llama 3.2.',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-pink-50 text-pink-600',
    questions: 0,
    duration: 'Instant'
  },
  {
    id: 'scorecards',
    title: 'Scorecard History',
    description: 'View your official PDFs and ML-generated study recommendations.',
    icon: <ListOrdered className="w-5 h-5" />,
    color: 'bg-emerald-50 text-emerald-600',
    questions: 0,
    duration: 'History'
  }
]

const HR_PREP_VIDEOS = [
  { title: "Top 10 HR Interview Questions", url: "https://www.youtube.com/watch?v=KCm6JY_Gz6w", channel: "CareerVidz" },
  { title: "Tell Me About Yourself - 2024", url: "https://www.youtube.com/watch?v=kayOhGRcNt4", channel: "Interviewing.io" },
  { title: "Body Language Tips", url: "https://www.youtube.com/watch?v=PCWVi5pAa30", channel: "Vanessa Van Edwards" }
]

export default function AdvancedInterviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen text-center p-12 text-gray-400">Loading Assessment Environment...</div>}>
      <AdvancedInterviewContent />
    </Suspense>
  )
}

function AdvancedInterviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryProblem = searchParams.get('q')
  const queryRound = searchParams.get('round')

  const [selectedRound, setSelectedRound] = useState<string | null>(queryProblem ? 'compiler' : queryRound || null)

  const [showDoubtAgent, setShowDoubtAgent] = useState(false)
  const [chatParams, setChatParams] = useState({ msg: '', isSending: false })
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', content: string }[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, showDoubtAgent])

  const sendQuery = async () => {
    if (!chatParams.msg.trim() || chatParams.isSending) return

    const newHistory = [...chatHistory, { role: 'user' as const, content: chatParams.msg }]
    setChatHistory(newHistory)
    setChatParams({ msg: '', isSending: true })

    try {
      const res = await fetch('http://localhost:8000/api/chat', { // Assuming same endpoint from vanilla JS
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatParams.msg })
      })
      const data = await res.json()
      setChatHistory([...newHistory, { role: 'bot', content: data.reply || data.response || "I could not process that request." }])
    } catch (e) {
      setChatHistory([...newHistory, { role: 'bot', content: "Error connecting to local Ollama runtime." }])
    } finally {
      setChatParams(prev => ({ ...prev, isSending: false }))
    }
  }

  const renderActiveModule = () => {
    switch (selectedRound) {
      case 'department': return <MockTestSimulator />
      case 'compiler': return <CodingCompiler />
      case 'hr': return <HRSimulator />
      case 'ats': return <ATSAnalyzer />
      case 'scorecards': return <ScorecardHistory />
      default: return null
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 py-8 px-6 animate-in fade-in duration-500 font-sans">
      {!selectedRound ? (
        <>
          <div className="bg-[#1e1b4b] p-8 rounded-2xl text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[9px] font-black uppercase tracking-widest mb-4 border border-white/20 backdrop-blur-md">
                <Sparkles className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                HUSHH AI PLATFORM
              </div>
              <h1 className="text-4xl font-black mb-3 tracking-tight leading-tight italic">Mock Interview Simulator</h1>
              <p className="text-indigo-100/80 text-xs font-medium leading-relaxed max-w-md">
                Master standard and unconventional follow-up questions in high-stakes environments using our offline Local LLM engine.
              </p>

              <div className="mt-8 flex flex-wrap gap-6 items-center bg-white/5 p-4 rounded-xl border border-white/10 w-fit">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-0.5">Success Rate</span>
                  <span className="text-lg font-black tracking-tighter italic">78.2%</span>
                </div>
                <div className="flex flex-col border-l border-white/20 pl-6">
                  <span className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-0.5">Evaluations</span>
                  <span className="text-lg font-black tracking-tighter italic">12.5k+</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 px-2 italic">
              <Trophy className="text-[#5034ff] h-5 w-5" />
              Practice Hub
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {INTERVIEW_ROUNDS.map((round) => (
                <Card
                  key={round.id}
                  onClick={() => setSelectedRound(round.id)}
                  className="group cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all rounded-xl overflow-hidden hover:-translate-y-1 bg-white relative"
                >
                  <div className={`absolute top-0 w-full h-1 ${round.color.split(' ')[0]}`} />
                  <CardContent className="p-5 flex flex-col items-center text-center mt-2">
                    <div className={`w-12 h-12 rounded-xl ${round.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      {round.icon}
                    </div>
                    <CardTitle className="text-xs font-black mb-1.5 uppercase tracking-wide text-gray-900">{round.title}</CardTitle>
                    <CardDescription className="text-[10px] font-medium leading-relaxed mb-4 text-gray-500">
                      {round.description}
                    </CardDescription>

                    <div className="flex items-center justify-center gap-3 text-[9px] font-black text-gray-400 mt-auto uppercase tracking-tighter bg-gray-50 px-3 py-1.5 rounded-md w-full">
                      {round.duration !== 'Instant' && round.duration !== 'History' && <div className="flex items-center gap-1.5"><Timer className="w-3 h-3 text-indigo-400" /> {round.duration}</div>}
                      {round.questions > 0 && <div className="flex items-center gap-1.5"><ListOrdered className="w-3 h-3 text-emerald-400" /> {round.questions} Q</div>}
                      {(round.duration === 'Instant' || round.duration === 'History') && <div className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-amber-500" /> Feature</div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            <Card className="lg:col-span-2 border border-gray-100 p-6 rounded-2xl shadow-sm bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black italic flex items-center gap-2">
                  <Youtube className="text-red-600 w-5 h-5" /> HR Interaction Mastery
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {HR_PREP_VIDEOS.map((video, idx) => (
                  <a key={idx} href={video.url} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="aspect-video bg-gray-100 rounded-xl mb-3 relative overflow-hidden flex items-center justify-center border border-gray-50 group-hover:shadow-md transition-shadow">
                      <img src={`https://img.youtube.com/vi/${video.url.split('v=')[1]}/hqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <Youtube className="w-10 h-10 text-white drop-shadow-lg z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[11px] font-black text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{video.title}</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-1">{video.channel}</p>
                  </a>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="bg-gray-900 border-none p-6 rounded-2xl relative overflow-hidden group shadow-xl">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-black italic uppercase text-white tracking-widest block">Prep GPT Agent</span>
                      <span className="text-[9px] text-indigo-300 font-bold uppercase">Llama 3.2 Offline</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Stuck on a logic problem or need a quick HR tip? Ask our local context-aware agent.
                  </p>
                  <Button
                    onClick={() => setShowDoubtAgent(true)}
                    className="w-full h-10 bg-white text-gray-900 hover:bg-gray-100 font-black rounded-xl text-xs hover:-translate-y-0.5 transition-all mt-4"
                  >
                    Open Assistant Chat
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-500 relative">
          <Button
            variant="ghost"
            onClick={() => setSelectedRound(null)}
            className="self-start rounded-xl font-bold gap-2 text-gray-400 text-xs hover:bg-gray-100 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Button>

          <div className="w-full">
            {renderActiveModule()}
          </div>
        </div>
      )}

      {}
      {showDoubtAgent && (
        <div className="fixed bottom-6 right-6 w-[360px] bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 animate-in slide-in-from-bottom duration-300 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 bg-gray-900 flex items-center justify-between shrink-0 shadow-sm relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center relative">
                <Brain className="w-4 h-4 text-white" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-gray-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white italic tracking-wide">AI Agent</span>
                <span className="text-[9px] text-indigo-300 uppercase tracking-widest font-bold">Online (Local)</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:bg-white/10 hover:text-white h-7 w-7 p-0 rounded-full"
              onClick={() => setShowDoubtAgent(false)}
            >
              ✕
            </Button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 custom-scrollbar">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 text-gray-400 space-y-3 opacity-60">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center"><MessageSquare className="w-6 h-6" /></div>
                <p className="text-xs font-bold leading-relaxed">I have deep context of your mock tests and HR reports. Ask me anything!</p>
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed ${msg.role === 'user'
                    ? 'bg-[#5034ff] text-white rounded-tr-sm shadow-sm'
                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm whitespace-pre-wrap'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {chatParams.isSending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white border border-gray-100 rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#5034ff] animate-spin" />
                  <span className="text-xs font-bold text-gray-400">Agent is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="relative flex items-center">
              <Input
                disabled={chatParams.isSending}
                className="h-12 w-full pr-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-indigo-100 text-xs font-bold shadow-inner"
                placeholder="Message the AI agent..."
                value={chatParams.msg}
                onChange={e => setChatParams(prev => ({ ...prev, msg: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && sendQuery()}
              />
              <Button
                disabled={!chatParams.msg.trim() || chatParams.isSending}
                className="absolute right-1.5 h-9 w-9 p-0 bg-[#5034ff] hover:bg-[#3d1fca] text-white rounded-[10px] transition-all"
                onClick={sendQuery}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

