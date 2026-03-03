'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Mic, PlaySquare, CheckCircle2, History, Video, Presentation } from 'lucide-react'

const MOCK_QUESTIONS: Record<string, string[]> = {
  'Software Engineer': [
    'Tell me about your most recent project and your role in it.',
    'How would you design a URL shortening service?',
    'Explain the difference between monolithic and microservices architecture.',
    'What is your approach to handling API rate limiting?',
    'Describe a time when you had to optimize a slow database query.',
  ],
  'Data Analyst': [
    'How would you handle missing values in a dataset?',
    'Explain the difference between WHERE and HAVING in SQL.',
    'Walk me through a time you found an unexpected insight in data.',
  ],
  'Product Manager': [
    'How would you measure the success of a new feature?',
    'How do you prioritize features in a roadmap?',
    'Tell me about a product you love and how you would improve it.',
  ],
  'Marketing': [
    'How would you launch a new product to college students?',
    'What metrics do you track for a social media campaign?',
    'Describe a successful campaign you ran.',
  ],
}

const ROLES = Object.keys(MOCK_QUESTIONS)

interface InterviewSession {
  currentQuestion: string
  role: string
  answer: string
  showModelAnswer: boolean
  modelAnswer: string
  selfRating: number
  submitted: boolean
}

const MODEL_ANSWERS: Record<string, Record<string, string>> = {
  'Software Engineer': {
    'Tell me about your most recent project and your role in it.':
      'A strong answer uses the STAR method (Situation, Task, Action, Result). Focus on your specific technical contributions, challenges overcome, and the measurable impact of the project.',
    'How would you design a URL shortening service?':
      'Discuss hashing algorithms (Base62), database schema (NoSQL vs SQL), handling collisions, caching strategies (Redis), and horizontal scaling. Consider read/write ratios.',
  },
  'Data Analyst': {
    'Explain the difference between WHERE and HAVING in SQL.':
      'WHERE filters rows before aggregation occurs, while HAVING filters the result set after aggregation (e.g., after a GROUP BY clause).',
  },
}

export default function MockInterviewPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<'practice' | 'history'>('practice')
  const [session, setSession] = useState<InterviewSession>({
    currentQuestion: '',
    role: '',
    answer: '',
    showModelAnswer: false,
    modelAnswer: '',
    selfRating: 0,
    submitted: false,
  })

  const [loading, setLoading] = useState(false)
  const [pastInterviews, setPastInterviews] = useState<any[]>([])
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    if (!user && !localStorage.getItem('mock_user')) {
      router.push('/login')
    }
    loadPastInterviews()
  }, [user, router])

  const loadPastInterviews = async () => {
    if (localStorage.getItem('mock_user') && !user) {
      setPastInterviews([{
        role: 'Software Engineer',
        created_at: new Date().toISOString(),
        self_rating: 4,
        answer_text: 'I built a URL shortener using Node.js and Redis for caching...',
      }])
      return
    }

    try {
      const { data, error } = await supabase
        .from('mock_interviews')
        .select('*')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setPastInterviews(data || [])
    } catch (error) {
      console.error('Failed to load interviews:', error)
    }
  }

  const startInterview = (role: string) => {
    const questions = MOCK_QUESTIONS[role]
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]

    setSession({
      currentQuestion: randomQuestion,
      role,
      answer: '',
      showModelAnswer: false,
      modelAnswer: MODEL_ANSWERS[role]?.[randomQuestion] || 'Ensure you highlight specific examples, explain your reasoning clearly, and structure your answer logically.',
      selfRating: 0,
      submitted: false,
    })
  }

  const submitAnswer = async () => {
    if (!session.answer.trim()) return

    setLoading(true)

    if (localStorage.getItem('mock_user') && !user) {
      setTimeout(() => {
        setSession({ ...session, submitted: true, showModelAnswer: true })
        setLoading(false)
      }, 1000)
      return
    }

    try {
      const { error } = await supabase
        .from('mock_interviews')
        .insert({
          student_id: user?.id,
          role: session.role,
          question_id: 'mock-' + Date.now(),
          answer_text: session.answer,
          model_answer: session.modelAnswer,
          self_rating: session.selfRating,
          time_taken_seconds: 60,
          system_evaluation: { clarity: 'good', completeness: 'good' },
        })

      if (error) throw error

      setSession({ ...session, submitted: true, showModelAnswer: true })
      await loadPastInterviews()
    } catch (error) {
      console.error('Failed to save interview:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording && session.answer === '') {
      setTimeout(() => setSession(s => ({ ...s, answer: 'I would approach this by first clarifying the requirements...' })), 1000)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500 font-sans">

      {}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5034ff] opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
            <Presentation className="w-4 h-4" /> AI Interviewer
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Mock Interview Questions</h1>
          <p className="text-gray-500 text-lg">
            Role-based question sets you can practice instantly. Build confidence with real-time feedback.
          </p>
        </div>

        {}
        <div className="flex bg-gray-100 p-1 rounded-xl relative z-10 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 md:w-32 py-2 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'practice' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <PlaySquare className="w-4 h-4" /> Practice
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:w-32 py-2 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <History className="w-4 h-4" /> History
          </button>
        </div>
      </div>

      {activeTab === 'practice' ? (
        <div className="space-y-6">
          {!session.role ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLES.map(role => (
                <div
                  key={role}
                  onClick={() => startInterview(role)}
                  className="bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:border-[#5034ff] hover:shadow-md group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/4 group-hover:bg-[#5034ff]/5 transition-colors"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">{role}</h3>
                  <p className="text-sm text-gray-500 relative z-10">Practice {MOCK_QUESTIONS[role].length}+ common questions</p>
                  <div className="mt-4 flex items-center text-[#5034ff] font-semibold text-sm relative z-10">
                    Start Session <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <div className="bg-[#5034ff] p-6 text-white">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {session.role} Interview
                      </span>
                      {isRecording && (
                        <span className="flex items-center gap-2 text-red-300 text-sm font-bold animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div> Recording
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold leading-relaxed">{session.currentQuestion}</h2>
                  </div>

                  <CardContent className="p-6">
                    {!session.submitted ? (
                      <div className="space-y-6">
                        <div className="relative">
                          <Textarea
                            placeholder="Type your answer or use the microphone to dictate..."
                            value={session.answer}
                            onChange={e => setSession({ ...session, answer: e.target.value })}
                            className="min-h-[250px] text-lg p-6 rounded-xl border-2 border-gray-100 focus-visible:ring-0 focus-visible:border-[#5034ff] resize-none"
                          />
                          <button
                            onClick={toggleRecording}
                            className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${isRecording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            <Mic className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                            <Video className="w-4 h-4" /> Optional: Record audio for fluency analysis
                          </p>
                          <Button
                            onClick={submitAnswer}
                            disabled={!session.answer.trim() || loading}
                            className="h-12 px-8 bg-[#5034ff] hover:bg-[#4028e0] text-white rounded-xl font-bold"
                          >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Answer'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in fade-in">
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Your Answer</h4>
                          <p className="text-gray-900 text-lg leading-relaxed">{session.answer}</p>
                        </div>

                        <div className="p-6 bg-green-50 border-2 border-green-100 rounded-xl">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <h4 className="font-bold text-green-900">AI Feedback & Model Answer</h4>
                          </div>
                          <p className="text-green-800 leading-relaxed">{session.modelAnswer}</p>
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900 mb-3">Rate your confidence on this question:</p>
                          <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <button
                                key={rating}
                                onClick={() => setSession({ ...session, selfRating: rating })}
                                className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${session.selfRating === rating ? 'bg-[#5034ff] text-white shadow-md scale-110' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {}
              <div className="space-y-4">
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-gray-900">Session Actions</h3>
                    <Button
                      onClick={() => startInterview(session.role)}
                      variant="outline"
                      className="w-full justify-start h-12 rounded-xl font-semibold border-gray-200"
                    >
                      Skip to Next Question
                    </Button>
                    <Button
                      onClick={() => setSession({ ...session, role: '' })}
                      variant="ghost"
                      className="w-full justify-start h-12 rounded-xl font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    >
                      Change Interview Role
                    </Button>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-900">
                  <h4 className="font-bold mb-2 flex items-center gap-2">💡 Pro Tip</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Always try to structure your answers using the STAR method. Think out loud before diving into technical specifics.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      ) : (
        
        <div className="space-y-4">
          {pastInterviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No History Yet</h3>
              <p className="text-gray-500 mb-6">Take your first practice interview to see it here.</p>
              <Button onClick={() => setActiveTab('practice')} className="bg-[#5034ff] hover:bg-[#4028e0] rounded-xl font-semibold px-8 h-12">
                Start Practice Options
              </Button>
            </div>
          ) : (
            pastInterviews.map((interview, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-gray-200 transition-colors">
                <div className="flex-1">
                  <div className="flex gap-3 items-center mb-2">
                    <span className="font-bold text-gray-900 text-lg">{interview.role}</span>
                    <span className="text-xs font-semibold text-gray-400">{new Date(interview.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-500 line-clamp-2">{interview.answer_text}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-400 mb-1">Confidence</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <div key={star} className={`w-3 h-3 rounded-full ${star <= (interview.self_rating || 0) ? 'bg-[#5034ff]' : 'bg-gray-100'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
