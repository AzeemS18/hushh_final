'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react'

export function ATSAnalyzer() {
    const [file, setFile] = useState<File | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
            setError('')
        }
    }

    const analyzeResume = async () => {
        if (!file) {
            setError('Please upload a resume PDF first.')
            return
        }

        setIsAnalyzing(true)
        setError('')

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('http://localhost:8000/api/resume/analyze', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)

            setResult(data)

            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { error: dbError } = await supabase
                    .from('resume_analysis')
                    .insert({
                        student_id: user.id,
                        resume_url: 'uploaded_locally.pdf', // Mock URL since no storage setup yet
                        ats_score: data.ats_score,
                        missing_keywords: data.improvements || [],
                        formatting_feedback: data.feedback,
                        impact_feedback: Array.isArray(data.strengths) ? data.strengths.join('\n') : data.strengths
                    })

                if (dbError) throw dbError
            } else {
                console.warn("User not logged in, ATS score not saved to Supabase")
            }

        } catch (err: any) {
            setError(err.message || 'Failed to connect to Local AI. Make sure main.py and Ollama are running.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 w-full animate-in fade-in duration-500">
            <h2 className="text-3xl font-black italic">ATS Resume Analyzer</h2>
            <p className="text-gray-500">Powered by Local Llama 3.2. Get instant feedback on your resume's compatibility.</p>

            <Card className="p-10 border-dashed border-2 bg-gray-50/50 flex flex-col items-center justify-center text-center">
                <input
                    type="file"
                    id="resume"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <label htmlFor="resume" className="cursor-pointer flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-indigo-500">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div>
                        <span className="text-base font-black text-gray-900 leading-tight block">
                            {file ? file.name : "Click to upload PDF"}
                        </span>
                        <span className="text-xs text-gray-400">Strictly private. Analyzed 100% locally.</span>
                    </div>
                </label>

                {file && (
                    <Button
                        onClick={analyzeResume}
                        disabled={isAnalyzing}
                        className="mt-8 bg-[#5034ff] text-white hover:bg-[#3d1fca] rounded-xl font-bold h-12 px-8"
                    >
                        {isAnalyzing ? 'Analyzing with Local AI...' : 'Analyze Resume'}
                    </Button>
                )}

                {error && <p className="mt-4 text-red-500 text-sm font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}
            </Card>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-in slide-in-from-bottom-4">
                    <Card className="p-8 border-none shadow-xl bg-gray-900 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">ATS Score</span>
                        <div className={`text-6xl font-black italic tracking-tighter ${result.ats_score >= 75 ? 'text-emerald-400' : result.ats_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {result.ats_score}%
                        </div>
                        <p className="mt-4 text-sm font-medium text-gray-300 px-4">{result.feedback}</p>
                        {result.session_id && (
                            <a
                                href={`http://localhost:8000/api/ats-report/${result.session_id}`}
                                target="_blank"
                                className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                            >
                                <FileText className="w-4 h-4" /> Download PDF Report
                            </a>
                        )}
                    </Card>

                    <div className="space-y-4">
                        <Card className="p-6 border-gray-100 shadow-sm">
                            <h4 className="font-black text-emerald-600 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" /> Strengths
                            </h4>
                            <ul className="space-y-2">
                                {(Array.isArray(result.strengths) ? result.strengths : typeof result.strengths === 'string' ? result.strengths.split('\n') : []).map((s: string, i: number) => (
                                    s.trim() ? <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" /> {s.replace(/^- /, '')}</li> : null
                                ))}
                            </ul>
                        </Card>

                        <Card className="p-6 border-gray-100 shadow-sm">
                            <h4 className="font-black text-rose-500 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <AlertCircle className="w-4 h-4" /> Areas for Improvement
                            </h4>
                            <ul className="space-y-2">
                                {(Array.isArray(result.improvements) ? result.improvements : typeof result.improvements === 'string' ? result.improvements.split('\n') : []).map((s: string, i: number) => (
                                    s.trim() ? <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" /> {s.replace(/^- /, '')}</li> : null
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
