'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Code, Terminal, CheckCircle2, AlertCircle, Play } from 'lucide-react'

interface Problem {
    id: string
    title: string
    description: string
    difficulty: string
    starter_code: { python: string; java: string }
}

export function CodingCompiler() {
    const [problems, setProblems] = useState<Problem[]>([])
    const [activeProblem, setActiveProblem] = useState<Problem | null>(null)
    const [language, setLanguage] = useState<'python' | 'java'>('python')
    const [code, setCode] = useState('')
    const [isTesting, setIsTesting] = useState(false)
    const [testResults, setTestResults] = useState<any[] | null>(null)
    const [error, setError] = useState('')
    const searchParams = useSearchParams()
    const urlQueryTitle = searchParams.get('q')

    const [isFullscreen, setIsFullscreen] = useState(false)
    const [tabSwitches, setTabSwitches] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && activeProblem && isFullscreen && !testResults && !error?.includes('terminated')) {
                setTabSwitches(prev => {
                    const newCount = prev + 1
                    if (newCount >= 3) {
                        setError('Assessment terminated due to repeated tab switching. Supervisor has been notified.')
                        if (document.fullscreenElement) document.exitFullscreen().catch(console.error)
                    } else {
                        alert(`Warning ${newCount}/3: Please do not switch tabs during the assessment!`)
                    }
                    return newCount
                })
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [activeProblem, isFullscreen, testResults, error])

    const requestFullscreen = () => {
        if (containerRef.current) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error("Error attempting to enable fullscreen", err)
            })
        }
    }

    useEffect(() => {
        fetch('http://localhost:8000/api/coding/questions')
            .then(res => res.json())
            .then((data: Problem[]) => {
                setProblems(data)
                if (urlQueryTitle) {
                    const matchedProb = data.find(p => p.title.toLowerCase() === urlQueryTitle.toLowerCase())
                    if (matchedProb) {
                        setActiveProblem(matchedProb)
                        setCode(matchedProb.starter_code['python'])
                    }
                }
            })
            .catch(err => setError('Could not load coding problems. Is backend running?'))
    }, [urlQueryTitle])

    const handleSelectProblem = (prob: Problem) => {
        setActiveProblem(prob)
        setCode(prob.starter_code[language])
        setTestResults(null)
        setError('')
    }

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as 'python' | 'java'
        setLanguage(newLang)
        if (activeProblem) {
            setCode(activeProblem.starter_code[newLang])
        }
    }

    const submitCode = async () => {
        if (!activeProblem) return

        setIsTesting(true)
        setTestResults(null)
        setError('')

        try {
            const res = await fetch('http://localhost:8000/api/coding/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language,
                    code,
                    problem_id: activeProblem.id
                })
            })

            const data = await res.json()
            if (data.error) {
                setError(data.error)
                return
            }

            setTestResults(data.results)

            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            const allPassed = data.results.every((r: any) => r.passed)

            if (user) {
                const { error: dbError } = await supabase
                    .from('coding_submissions')
                    .insert({
                        student_id: user.id,
                        problem_id: activeProblem.id,
                        language: language,
                        code_content: code,
                        status: allPassed ? 'PASSED' : 'FAILED',
                        execution_time_ms: 0, // Mocked for hackathon
                        memory_used_kb: 0     // Mocked for hackathon
                    })

                if (dbError) throw dbError
            } else {
                console.warn("User not logged in, code submission not saved to Supabase")
            }

        } catch (err) {
            setError('Server connection error.')
        } finally {
            setIsTesting(false)
        }
    }

    if (!activeProblem) {
        return (
            <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
                <div>
                    <h2 className="text-2xl font-black italic mb-2">Coding Assessments</h2>
                    <p className="text-gray-500 font-medium text-sm">Master data structures and algorithms with real company problems.</p>
                </div>
                {error && <p className="text-red-500 font-bold">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {problems.map(prob => (
                        <Card key={prob.id} className="p-6 border-gray-100 hover:shadow-lg transition-all rounded-2xl group border">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-black text-gray-900 text-lg group-hover:text-[#5034ff] transition-colors">{prob.title}</h3>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {prob.difficulty}
                                </span>
                            </div>
                            <Button onClick={() => handleSelectProblem(prob)} className="w-full bg-gray-50 hover:bg-[#5034ff] active:scale-95 transition-all text-gray-700 hover:text-white font-bold h-10 shadow-none border-none">
                                Solve Challenge
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="relative w-full h-full bg-white md:bg-transparent rounded-[2.5rem]">
            {!isFullscreen && activeProblem && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center rounded-[2.5rem] m-0">
                    <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
                    <h2 className="text-3xl font-black italic text-gray-900 mb-2">Proctored Assessment</h2>
                    <p className="text-gray-500 font-medium mb-8 max-w-md text-center">To ensure fairness, this coding challenge must be completed in fullscreen mode. Switching tabs will trigger a violation warning.</p>
                    <Button onClick={requestFullscreen} className="bg-gray-900 hover:bg-black text-white px-10 h-14 rounded-2xl font-black text-lg transition-all shadow-xl">
                        Enter Fullscreen to Start
                    </Button>
                    <Button variant="ghost" className="mt-4 text-gray-400 font-bold hover:bg-gray-100 rounded-xl" onClick={() => {
                        setActiveProblem(null)
                        setError('')
                    }}>
                        Cancel & Go Back
                    </Button>
                </div>
            )}

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh] max-w-7xl mx-auto animate-in zoom-in-95 duration-500 ${!isFullscreen && activeProblem ? 'opacity-0 pointer-events-none' : 'bg-white/50 rounded-3xl'}`}>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" className="text-xs font-bold" onClick={() => {
                            setActiveProblem(null)
                            setError('')
                            if (document.fullscreenElement) document.exitFullscreen().catch(console.error)
                        }}>
                            ← Back to Problems
                        </Button>
                    </div>
                    <Card className="p-6 border-gray-100 rounded-3xl shadow-sm flex-1 bg-white overflow-y-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="text-[#5034ff] w-5 h-5" />
                            <h2 className="text-xl font-black italic">{activeProblem.title}</h2>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">{activeProblem.description}</p>

                        <div className="mt-8 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Terminal Output</h3>
                            <Card className="bg-gray-900 border-none p-4 rounded-xl text-xs font-mono min-h-[150px] shadow-inner text-gray-300">
                                {isTesting && <span className="text-indigo-400 animate-pulse">Running test cases against Docker container...</span>}
                                {error && <span className="text-red-400">{error}</span>}

                                {testResults && (
                                    <div className="space-y-3">
                                        {testResults.map((r, i) => (
                                            <div key={i} className={`p-3 rounded-lg border ${r.passed ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-rose-500/20 bg-rose-500/10'}`}>
                                                <div className="font-bold mb-1 flex items-center gap-2">
                                                    {r.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                                                    Test Case {i + 1}: {r.passed ? 'PASSED' : 'FAILED'}
                                                </div>
                                                <div className="opacity-80 mt-2 space-y-1">
                                                    <div>Input: <span className="text-white">{r.input}</span></div>
                                                    <div>Expected: <span className="text-emerald-300">{r.expected}</span></div>
                                                    <div>Actual: <span className={r.passed ? 'text-emerald-300' : 'text-rose-300'}>{r.actual || 'N/A'}</span></div>
                                                    {r.error && <div className="text-rose-400 mt-2 whitespace-pre-wrap">{r.error}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!isTesting && !error && !testResults && <span className="opacity-50">Waiting for code execution...</span>}
                            </Card>
                        </div>
                    </Card>
                </div>

                <Card className="bg-[#0f172a] rounded-[2rem] border-none shadow-2xl overflow-hidden flex flex-col relative">
                    <div className="h-14 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 border-b border-white/10 shrink-0">
                        <div className="flex gap-2 items-center">
                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="ml-4 text-xs font-black tracking-widest text-gray-500 uppercase">Editor</span>
                        </div>
                        <select
                            className="bg-white/10 border-none text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer"
                            value={language}
                            onChange={handleLanguageChange}
                        >
                            <option value="python" className="text-black">Python 3</option>
                            <option value="java" className="text-black">Java</option>
                        </select>
                    </div>

                    <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                        className="flex-1 bg-transparent border-none focus-visible:ring-0 text-gray-300 font-mono text-sm p-6 resize-none mt-2 placeholder:text-gray-700 leading-relaxed shadow-none"
                        placeholder="Write your solution here..."
                    />

                    <div className="p-4 bg-black/20 backdrop-blur-md border-t border-white/10 shrink-0 flex justify-end">
                        <Button
                            onClick={submitCode}
                            disabled={isTesting}
                            className="bg-[#5034ff] hover:bg-[#3d27ca] text-white font-black px-8 rounded-xl h-10 transition-all hover:-translate-y-0.5"
                        >
                            <Play className="w-4 h-4 mr-2" fill="currentColor" /> {isTesting ? 'Evaluating...' : 'Run Test Cases'}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
