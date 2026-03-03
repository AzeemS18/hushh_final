'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Trophy,
    Plus,
    Trash2,
    Save,
    ArrowLeft,
    Layout,
    Brain,
    Timer
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function AdminContestsPage() {
    const [questions, setQuestions] = useState([
        { id: 1, text: 'Reverse a Linked List in O(n) time.', difficulty: 'Medium', points: 50 },
        { id: 2, text: 'Find the maximum sum subarray (Kadane’s Algorithm).', difficulty: 'Easy', points: 30 }
    ])

    const addQuestion = () => {
        setQuestions([...questions, { id: Date.now(), text: '', difficulty: 'Easy', points: 10 }])
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 py-8 px-6 animate-in fade-in duration-500 font-sans">

            {/* Header - Compact */}
            <div className="flex items-center justify-between bg-[#1e1b4b] p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-xl" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-black italic tracking-tight">Weekly Challenge Management</h1>
                        <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Contest ID: W#12 • Active</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-xs shadow-md">
                        <Save className="w-4 h-4 mr-2" /> Push to Production
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-sm font-black text-gray-900 px-2 italic uppercase tracking-widest flex items-center gap-2">
                        <Layout className="w-4 h-4 text-[#5034ff]" /> Questions (10 Required)
                    </h2>

                    {questions.map((q, idx) => (
                        <Card key={q.id} className="border border-gray-100 shadow-sm rounded-xl overflow-hidden group">
                            <CardContent className="p-4 flex gap-4 items-start">
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[11px] font-black text-gray-400">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <Textarea
                                        placeholder="Enter question description or technical problem..."
                                        className="min-h-[80px] bg-gray-50 border-gray-100 rounded-xl text-xs font-bold p-3"
                                        defaultValue={q.text}
                                    />
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-[8px] font-black uppercase text-gray-400 ml-1">Difficulty</label>
                                            <Input defaultValue={q.difficulty} className="h-8 bg-gray-50 border-gray-100 rounded-lg text-[10px] font-black" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[8px] font-black uppercase text-gray-400 ml-1">Points</label>
                                            <Input defaultValue={q.points} className="h-8 bg-gray-50 border-gray-100 rounded-lg text-[10px] font-black" />
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-gray-300 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    <Button
                        onClick={addQuestion}
                        variant="outline"
                        className="w-full h-12 border-dashed border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-400 hover:text-[#5034ff] rounded-2xl font-black text-xs transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" /> ADD CHALLENGE QUESTION
                    </Button>
                </div>

                <div className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic">Contest Settings</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Launch Time</label>
                                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                    <Timer className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-[11px] font-black text-gray-900">Today, 18:00 IST</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Duration</label>
                                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                    <Timer className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-[11px] font-black text-gray-900">45 Minutes</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-indigo-50 border-none p-6 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">AI Audit</span>
                        </div>
                        <p className="text-[11px] font-medium text-indigo-700 leading-tight">
                            AI analysis suggests these questions are balanced for 'Medium' difficulty students.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}
