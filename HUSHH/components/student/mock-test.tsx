'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Rocket, Building2, CheckCircle2, AlertCircle, TrendingUp, Download, ArrowLeft } from 'lucide-react'

interface Question {
    id: string
    text: string
    options: string[]
    answer: string
    explanation: string
    topic: string
    difficulty: string
    link?: string
}

interface UserAnswer {
    questionId: string
    selected: string
    correct: boolean
    topic: string
    difficulty: string
    questionText: string
    explanation: string
    correctAnswer: string
}

interface Recommendation {
    topic: string
    reason: string
    priority: string
}

export function MockTestSimulator() {
    const [departments, setDepartments] = useState<string[]>([])
    const [companies, setCompanies] = useState<string[]>([])

    const [phase, setPhase] = useState<'select' | 'quiz' | 'results'>('select')
    const [activeTarget, setActiveTarget] = useState<{ id: string, type: 'dept' | 'company' } | null>(null)

    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])

    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetch('http://localhost:8000/api/departments').then(res => res.json()).then(setDepartments).catch(console.error)
        fetch('http://localhost:8000/api/companies').then(res => res.json()).then(setCompanies).catch(console.error)
    }, [])

    const startQuiz = async (id: string, type: 'dept' | 'company') => {
        setActiveTarget({ id, type })
        setPhase('quiz')

        const url = type === 'dept'
            ? `http://localhost:8000/api/questions/${encodeURIComponent(id)}`
            : `http://localhost:8000/api/questions/company/${encodeURIComponent(id)}`

        try {
            const res = await fetch(url)
            const data = await res.json()
            setQuestions(data)
            setCurrentIndex(0)
            setUserAnswers([])
        } catch (e) {
            console.error(e)
            setPhase('select')
        }
    }

    const handleNext = () => {
        if (!selectedOption) return

        const q = questions[currentIndex]
        const isCorrect = selectedOption === q.answer

        const newAnswer: UserAnswer = {
            questionId: q.id || currentIndex.toString(),
            selected: selectedOption,
            correct: isCorrect,
            topic: q.topic,
            difficulty: q.difficulty,
            questionText: q.text,
            explanation: q.explanation,
            correctAnswer: q.answer
        }

        const newAnswers = [...userAnswers, newAnswer]
        setUserAnswers(newAnswers)
        setSelectedOption(null)

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            finishQuiz(newAnswers)
        }
    }

    const finishQuiz = async (finalAnswers: UserAnswer[]) => {
        setPhase('results')
        setIsSaving(true)

        const score = finalAnswers.filter(a => a.correct).length

        try {
            const reqData = finalAnswers.map(a => ({ topic: a.topic, correct: a.correct, difficulty: a.difficulty }))
            let recs = []
            try {
                const recRes = await fetch('http://localhost:8000/api/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ results: reqData })
                })
                recs = await recRes.json()
                setRecommendations(recs)
            } catch (err) {
                console.error("FastAPI ML Request Failed:", err)
            }

            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data, error } = await supabase
                    .from('assessments')
                    .insert({
                        student_id: user.id,
                        category: activeTarget?.id || 'Assessment',
                        score: score,
                        total_questions: finalAnswers.length,
                        recommendations: recs
                    })
                    .select('id')
                    .single()

                if (error) throw error;
                setSessionId(data.id)
            } else {
                console.error("User not logged in, score not saved to Supabase")
            }
        } catch (e) {
            console.error("Failed to save scorecard to Supabase:", e)
        } finally {
            setIsSaving(false)
        }
    }

    if (phase === 'select') {
        return (
            <div className="space-y-10 animate-in fade-in max-w-6xl mx-auto pb-12">
                <div>
                    <h2 className="text-2xl font-black italic mb-2 flex items-center gap-2"><Rocket className="text-blue-500" /> By Department</h2>
                    <p className="text-gray-500 font-medium text-sm">Adaptive tests matching academic curriculum.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {departments.map(dept => (
                            <Card key={dept} onClick={() => startQuiz(dept, 'dept')} className="p-5 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-lg transition-all rounded-2xl cursor-pointer group hover:-translate-y-1">
                                <h3 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors text-sm">{dept}</h3>
                            </Card>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-black italic mb-2 flex items-center gap-2"><Building2 className="text-indigo-500" /> By Company</h2>
                    <p className="text-gray-500 font-medium text-sm">Targeted questions specifically requested by top-tier recruiters.</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        {companies.map(comp => (
                            <Card key={comp} onClick={() => startQuiz(comp, 'company')} className="p-4 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-lg transition-all rounded-2xl cursor-pointer group text-center hover:-translate-y-1">
                                <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors text-sm uppercase tracking-widest">{comp}</h3>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (phase === 'quiz' && questions.length > 0) {
        const q = questions[currentIndex]
        return (
            <div className="max-w-3xl mx-auto animate-in zoom-in-95 duration-500 relative">
                <Button variant="ghost" className="mb-6 font-bold text-xs absolute -top-12 -left-4" onClick={() => setPhase('select')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Abort
                </Button>

                <Card className="p-8 border-gray-100 rounded-[2.5rem] shadow-sm bg-white">
                    <div className="flex justify-between items-center mb-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                        <div className="w-32">
                            <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2 bg-gray-100" />
                        </div>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-8">
                        {q.text}
                    </h2>

                    <div className="space-y-3 mb-8">
                        {q.options.map((opt, i) => {
                            if (opt === 'N/A') return null
                            const isSelected = selectedOption === opt
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedOption(opt)}
                                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 font-medium transition-all ${isSelected
                                        ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md ring-2 ring-blue-500/20'
                                        : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    {opt}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-50 pt-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{q.topic} • {q.difficulty}</span>
                            {q.link && q.link !== '#' && (
                                <a href={q.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1">
                                    View on LeetCode
                                </a>
                            )}
                        </div>
                        <Button
                            onClick={handleNext}
                            disabled={!selectedOption}
                            className="bg-gray-900 hover:bg-black text-white font-black px-8 h-12 rounded-xl transition-all"
                        >
                            {currentIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    if (phase === 'results') {
        const score = userAnswers.filter(a => a.correct).length
        const maxScore = userAnswers.length
        const percentage = Math.round((score / maxScore) * 100)

        return (
            <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom duration-700 space-y-8 pb-12">
                <Card className="p-10 border-none bg-[#1e1b4b] text-white rounded-[2.5rem] relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="w-40 h-40 rounded-full bg-white/10 border-8 border-white/5 flex items-center justify-center relative z-10 shrink-0 backdrop-blur-md">
                        <span className="text-5xl font-black italic tracking-tighter">{percentage}%</span>
                    </div>
                    <div className="relative z-10 text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-black italic">Assessment Complete</h2>
                        <p className="text-indigo-200 font-medium">You scored {score} out of {maxScore} in {activeTarget?.id}.</p>

                        <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                            {sessionId && (
                                <a href={`http://localhost:8000/api/report/${sessionId}`} target="_blank" className="inline-flex items-center gap-2 h-10 px-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs rounded-xl transition-colors">
                                    <Download className="w-4 h-4" /> Official Report PDF
                                </a>
                            )}
                            <Button onClick={() => setPhase('select')} variant="outline" className="h-10 px-5 text-gray-900 font-black text-xs rounded-xl">
                                Try Another
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-black italic text-gray-900 flex items-center gap-2 text-xl px-2">
                            <AlertCircle className="text-rose-500 w-5 h-5" /> Knowledge Gaps
                        </h3>
                        {userAnswers.filter(a => !a.correct).map((ans, i) => (
                            <Card key={i} className="p-6 border-rose-100 bg-rose-50/30 rounded-2xl shadow-sm">
                                <p className="font-bold text-gray-900 leading-snug mb-4">{ans.questionText}</p>
                                <div className="space-y-2 text-sm font-medium">
                                    <div className="flex gap-2 items-start"><span className="text-rose-500 font-bold shrink-0">Your Answer:</span> <span className="text-gray-700">{ans.selected}</span></div>
                                    <div className="flex gap-2 items-start"><span className="text-emerald-600 font-bold shrink-0">Correct Answer:</span> <span className="text-gray-900">{ans.correctAnswer}</span></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-rose-100 text-sm text-gray-600 leading-relaxed italic">
                                    {ans.explanation}
                                </div>
                            </Card>
                        ))}
                        {userAnswers.filter(a => !a.correct).length === 0 && (
                            <div className="p-6 bg-emerald-50 text-emerald-600 font-bold rounded-2xl">Perfect score! No wrong answers.</div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-black italic text-gray-900 flex items-center gap-2 text-xl px-2">
                            <TrendingUp className="text-blue-500 w-5 h-5" /> ML Study Plan
                        </h3>
                        {recommendations.length > 0 ? recommendations.map((rec, i) => (
                            <Card key={i} className="p-5 border-gray-100 rounded-2xl shadow-sm space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-black text-indigo-900 text-sm leading-tight">{rec.topic}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${rec.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {rec.priority}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{rec.reason}</p>
                            </Card>
                        )) : (
                            <div className="p-5 text-sm text-gray-500 font-medium">No strict recommendations. You're doing great!</div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
    )
}
