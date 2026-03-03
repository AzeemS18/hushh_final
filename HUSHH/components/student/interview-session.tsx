'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
    Mic,
    Video,
    VideoOff,
    MicOff,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Timer,
    ChevronRight,
    Sparkles,
    Award,
    BarChart3
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Question {
    id: string
    text: string
    category: string
    modelAnswer: string
}

const ADVANCED_QUESTIONS: Record<string, Question[]> = {
    technical: [
        {
            id: 't1',
            text: "Imagine you're leading a team and a critical production server goes down due to a memory leak in a new feature. How do you handle the immediate crisis and the post-mortem?",
            category: 'System Design / Leadership',
            modelAnswer: 'A strong answer covers: 1. Immediate rollback/isolation. 2. Communication with stakeholders. 3. Root cause analysis using profiling tools. 4. Implementing automated regression tests.'
        },
        {
            id: 't2',
            text: "Walk me through how you would optimize a web application that is experiencing slow load times only for users in a specific geographic region.",
            category: 'Performance',
            modelAnswer: 'Consider: CDN integration, region-specific DB replicas, edge computing (workers), and analyzing network latency/TTFB.'
        }
    ],
    hr: [
        {
            id: 'h1',
            text: "Tell me about a time you disagreed with a direct supervisor's decision. How did you approach the situation and what was the outcome?",
            category: 'Conflict Resolution',
            modelAnswer: 'Focus on professional communication, data-driven arguments, and commitment to the final team decision even if different from your own.'
        }
    ],
    aptitude: [
        {
            id: 'a1',
            text: "A project has a 30% chance of failing in the first month. If it survives, it has a 10% chance of failing in the second month. What is the total probability of success after two months?",
            category: 'Probability',
            modelAnswer: 'Success = 0.7 (month 1) * 0.9 (month 2) = 0.63 or 63%.'
        }
    ]
}

export function InterviewSession({ round, onComplete }: { round: string, onComplete: (score: number) => void }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [currentAnswer, setCurrentAnswer] = useState('')
    const [isCameraOn, setIsCameraOn] = useState(true)
    const [isMicOn, setIsMicOn] = useState(true)
    const [timeLeft, setTimeLeft] = useState(600) // 10 mins
    const [isFinishing, setIsFinishing] = useState(false)

    const questions = ADVANCED_QUESTIONS[round] || ADVANCED_QUESTIONS.technical

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleNext = () => {
        const newAnswers = [...answers, currentAnswer]
        setAnswers(newAnswers)
        setCurrentAnswer('')

        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            finishInterview()
        }
    }

    const finishInterview = () => {
        setIsFinishing(true)
        setTimeout(() => {
            onComplete(85) // Mock score
        }, 2000)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (isFinishing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center animate-in fade-in duration-1000">
                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-[#5034ff] animate-spin" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Analyzing Performance</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Our AI is evaluating your responses, tone, and technical depth...</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Interviewer View (Left) */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gray-900 dark:bg-black border-none rounded-[2.5rem] overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center">
                    {/* Placeholder for Video Feed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

                    <div className="text-center space-y-4 relative z-20 px-10">
                        <div className="w-20 h-20 bg-white/10 rounded-full mx-auto flex items-center justify-center border border-white/20 backdrop-blur-md">
                            <Video className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">AI Interviewer Live</h3>
                        <p className="text-gray-400 text-sm font-medium">Monitoring facial expressions and engagement...</p>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-center">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsCameraOn(!isCameraOn)}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all ${isCameraOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white'}`}
                            >
                                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setIsMicOn(!isMicOn)}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all ${isMicOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white'}`}
                            >
                                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="px-5 py-2.5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white font-black text-sm flex items-center gap-2">
                            <Timer className="w-4 h-4 text-indigo-400" /> {formatTime(timeLeft)}
                        </div>
                    </div>
                </Card>

                {/* Current Question */}
                <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#5034ff]/10 text-[#5034ff] rounded-full text-[10px] font-black uppercase tracking-widest">
                            Question {currentStep + 1} of {questions.length}
                        </span>
                        <span className="text-gray-300 dark:text-gray-700">|</span>
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">{questions[currentStep].category}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight underline decoration-[#5034ff]/30 underline-offset-8 decoration-4">
                        "{questions[currentStep].text}"
                    </h2>

                    <div className="pt-4">
                        <Textarea
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            placeholder="Type your response here... (AI will analyze word choice and logic)"
                            className="min-h-[200px] rounded-3xl border-2 border-gray-100 dark:border-gray-800 focus:border-[#5034ff] bg-gray-50/50 dark:bg-black/20 p-8 text-xl font-medium leading-relaxed resize-none shadow-inner"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleNext}
                            disabled={!currentAnswer.trim()}
                            className="h-14 px-10 bg-[#5034ff] text-white font-black rounded-2xl text-lg shadow-xl shadow-[#5034ff]/20 hover:-translate-y-1 transition-all"
                        >
                            {currentStep === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Real-time Insights (Right) */}
            <div className="space-y-6">
                <Card className="bg-white dark:bg-gray-900 border-none rounded-[2rem] p-8 space-y-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="text-[#5034ff] w-5 h-5" />
                        Live Transcription
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-black/40 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-500 italic">
                            "Listening for key technical terms like 'Post-mortem', 'Profiling', 'Latency'..."
                        </div>
                        <div className="flex items-center gap-3 px-2">
                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 animate-pulse w-1/3"></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase">Fluency</span>
                        </div>
                    </div>
                </Card>

                <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-none rounded-[2rem] p-8 space-y-6">
                    <h3 className="font-black text-indigo-900 dark:text-indigo-400 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Round Tips
                    </h3>
                    <ul className="space-y-4">
                        {[
                            "Explain your 'Why' before your 'How'.",
                            "Be structured. Use bullet points in your mind.",
                            "Maintain eye contact with the AI eye."
                        ].map((tip, i) => (
                            <li key={i} className="flex gap-3 text-sm font-bold text-indigo-800 dark:text-indigo-300">
                                <span className="w-5 h-5 rounded-full bg-white dark:bg-indigo-900 flex items-center justify-center shrink-0 border border-indigo-200 text-[10px]">{i + 1}</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card className="bg-white dark:bg-gray-900 border-none rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Readiness Sync</h3>
                        <BarChart3 className="w-4 h-4 text-[#5034ff]" />
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                            <span>Progress</span>
                            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                        </div>
                        <Progress value={((currentStep + 1) / questions.length) * 100} className="h-2.5 bg-gray-100 dark:bg-gray-800" />
                    </div>
                </Card>
            </div>
        </div>
    )
}
