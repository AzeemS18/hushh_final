'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Mic, MicOff, Send, MessageSquare, Briefcase, Play, CheckCircle2 } from 'lucide-react'

interface Question {
    id: string
    topic: string
    difficulty: string
    text: string
    explanation: string
}

export function HRSimulator() {
    const [categories, setCategories] = useState<string[]>([])
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const [answer, setAnswer] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [showFeedback, setShowFeedback] = useState(false)

    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        fetch('http://localhost:8000/api/hr/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err))

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition()
            recognition.lang = 'en-US'
            recognition.interimResults = true
            recognition.continuous = true

            recognition.onresult = (event: any) => {
                let finalTranscript = ''
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript
                    }
                }
                if (finalTranscript) {
                    setAnswer(prev => prev + (prev.endsWith(' ') ? '' : ' ') + finalTranscript)
                }
            }

            recognition.onerror = (event: any) => {
                console.error("Speech error", event.error)
                setIsRecording(false)
            }

            recognition.onend = () => {
                setIsRecording(false)
            }

            recognitionRef.current = recognition
        }
    }, [])

    const startPrep = async (category: string) => {
        setActiveCategory(category)
        const res = await fetch(`http://localhost:8000/api/hr/questions?category=${encodeURIComponent(category)}`)
        const data = await res.json()
        setQuestions(data)
        setCurrentIndex(0)
        resetState()
    }

    const resetState = () => {
        setAnswer('')
        setShowFeedback(false)
        setIsRecording(false)
    }

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.")
            return
        }

        if (isRecording) {
            recognitionRef.current.stop()
        } else {
            recognitionRef.current.start()
            setIsRecording(true)
        }
    }

    const handleSubmit = () => {
        if (!answer.trim()) return
        setShowFeedback(true)
        if (isRecording) {
            recognitionRef.current?.stop()
        }
    }

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            resetState()
        } else {
            setActiveCategory(null) // End session
        }
    }

    if (!activeCategory) {
        return (
            <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
                <div>
                    <h2 className="text-2xl font-black italic mb-2">HR & Behavioral Simulator</h2>
                    <p className="text-gray-500 font-medium text-sm">Select a soft-skill category to practice. Read the question and use your microphone to answer naturally.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {categories.map(cat => (
                        <Card key={cat} onClick={() => startPrep(cat)} className="p-6 border border-gray-100 hover:shadow-lg transition-all rounded-2xl cursor-pointer group text-center hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="font-black text-gray-900 text-sm group-hover:text-purple-600 transition-colors uppercase tracking-widest">{cat}</h3>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    const activeQ = questions[currentIndex]

    if (!activeQ) return null

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
            <Button variant="ghost" className="mb-6 font-bold text-xs" onClick={() => setActiveCategory(null)}>
                ← End Session
            </Button>

            <Card className="p-10 border-gray-100 rounded-[2.5rem] shadow-sm bg-white relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{activeCategory}</span>
                </div>

                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-8">
                    "{activeQ.text}"
                </h2>

                <div className="space-y-4 relative">
                    <Textarea
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        disabled={showFeedback}
                        placeholder={showFeedback ? "" : "Use the microphone or type your response here..."}
                        className="min-h-[160px] p-6 text-gray-700 text-lg leading-relaxed rounded-2xl bg-gray-50 border-gray-100 focus-visible:ring-purple-500 resize-none font-medium"
                    />

                    {!showFeedback && (
                        <div className="flex items-center gap-3 absolute bottom-4 right-4">
                            <Button
                                onClick={toggleRecording}
                                variant={isRecording ? 'destructive' : 'secondary'}
                                className={`rounded-xl shadow-lg h-10 px-4 font-bold transition-all ${isRecording ? 'animate-pulse' : ''}`}
                            >
                                {isRecording ? <><MicOff className="w-4 h-4 mr-2" /> Stop Recording</> : <><Mic className="w-4 h-4 mr-2 text-purple-600" /> Voice Answer</>}
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!answer.trim()}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-10 px-8 rounded-xl shadow-lg shadow-purple-200"
                            >
                                <Send className="w-4 h-4 mr-2" /> Submit
                            </Button>
                        </div>
                    )}
                </div>

                {showFeedback && (
                    <div className="mt-8 animate-in fade-in duration-500">
                        <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
                            <h4 className="font-black text-purple-900 flex items-center gap-2 mb-3 text-sm uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Ideal Answer / Framework
                            </h4>
                            <p className="text-purple-800 font-medium leading-relaxed text-sm">
                                {activeQ.explanation.replace('Ideal Answer:', '')}
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={nextQuestion} className="h-12 px-8 bg-gray-900 text-white rounded-xl font-black text-sm hover:bg-black">
                                {currentIndex < questions.length - 1 ? 'Next Question →' : 'Complete Session'}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
