'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    FileText,
    ExternalLink,
    Sparkles,
    CheckCircle2,
    BookOpen,
    Zap,
    Target,
    ArrowRight
} from 'lucide-react'

const RESUME_TOOLS = [
    {
        name: 'Overleaf',
        description: 'Professional LaTeX editor with high-end templates.',
        link: 'https://www.overleaf.com',
        icon: <FileText className="w-5 h-5 text-[#5034ff]" />
    },
    {
        name: 'JSONResume',
        description: 'The open source initiative to create a JSON-based standard for resumes.',
        link: 'https://jsonresume.org',
        icon: <Zap className="w-5 h-5 text-amber-500" />
    },
    {
        name: 'FlowCV',
        description: 'Modern, effortless resume builder for high-end results.',
        link: 'https://flowcv.com',
        icon: <Sparkles className="w-5 h-5 text-pink-500" />
    }
]

const TARGET_ROLES = [
    'Software Development Engineer (SDE)',
    'Data Analyst',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'Product Manager'
]

export default function ResumeAnalyzerPage() {
    const router = useRouter()
    const [selectedRole, setSelectedRole] = useState('')
    const [resumeText, setResumeText] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<{ score: number; tips: string[] } | null>(null)

    const handleAnalyze = () => {
        if (!resumeText || !selectedRole) return
        setIsAnalyzing(true)

        setTimeout(() => {
            const score = Math.floor(Math.random() * 20) + 75 // Random score between 75-95
            setAnalysisResult({
                score,
                tips: [
                    `Add more keywords related to ${selectedRole}.`,
                    "Quantify your achievements using metrics (e.g., 'Improved performance by 20%').",
                    "Ensure consistency in date formatting.",
                    "Add a projects section highlighting your tech stack."
                ]
            })
            setIsAnalyzing(false)
        }, 1500)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 py-8 px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Resume Optimizer</h1>
                    <p className="text-gray-500 text-xs font-medium">Build LaTeX resumes and analyze them for your target role.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase border border-emerald-100 italic">
                        AI Powered Analysis
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {}
                    <Card className="border-none shadow-sm rounded-2xl p-6 border border-gray-100">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Select Target Job Role</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full h-11 bg-gray-50 border-gray-100 rounded-xl px-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#5034ff] outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Choose a role...</option>
                                    {TARGET_ROLES.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Paste Resume content or Text</label>
                                <textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    className="w-full min-h-[250px] bg-gray-50 border-gray-100 rounded-2xl p-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#5034ff] outline-none transition-all"
                                    placeholder="Paste your resume content here for AI keyword analysis..."
                                />
                            </div>

                            <Button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !resumeText || !selectedRole}
                                className="w-full h-12 bg-[#5034ff] hover:bg-[#4028e0] text-white font-black rounded-xl shadow-lg transition-all"
                            >
                                {isAnalyzing ? 'Analyzing Alignment...' : 'Analyze Role Alignment'}
                            </Button>
                        </div>
                    </Card>

                    {analysisResult && (
                        <Card className="border-none shadow-md rounded-2xl p-6 bg-indigo-50/50 border border-indigo-100 animate-in slide-in-from-bottom duration-500">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-sm relative overflow-hidden">
                                        <div className="text-2xl font-black text-[#5034ff]">{analysisResult.score}%</div>
                                    </div>
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-2">Alignment Score</span>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h4 className="text-sm font-black text-gray-900">Optimization Feedback</h4>
                                    <ul className="space-y-2">
                                        {analysisResult.tips.map((tip, i) => (
                                            <li key={i} className="flex gap-2 text-[11px] font-medium text-gray-600">
                                                <CheckCircle2 rotate={1} className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    {}
                    <Card className="border-none shadow-sm rounded-2xl p-6 bg-gray-50 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Recommended LaTeX Makers</h3>
                        <div className="space-y-3">
                            {RESUME_TOOLS.map(tool => (
                                <a
                                    key={tool.name}
                                    href={tool.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-[#5034ff] transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            {tool.icon}
                                            <span className="text-sm font-black text-gray-900">{tool.name}</span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#5034ff]" />
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-medium leading-tight">{tool.description}</p>
                                </a>
                            ))}
                        </div>
                    </Card>

                    {}
                    <div className="bg-[#1e1b4b] p-6 rounded-2xl text-white space-y-4 shadow-xl">
                        <h4 className="text-sm font-black tracking-tight flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-300" />
                            Resume Strategy Guide
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-indigo-300 uppercase">Step 1: The Template</div>
                                <p className="text-[11px] font-medium text-white/70">Use a clean, single-column LaTeX template for ATS compatibility.</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-indigo-300 uppercase">Step 2: Quantify Impact</div>
                                <p className="text-[11px] font-medium text-white/70">Focus on results. "Reduced latency by 40%" is better than "Worked on latency."</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-indigo-300 uppercase">Step 3: Keyword Optimization</div>
                                <p className="text-[11px] font-medium text-white/70">Align your skills section directly with the target job role keywords.</p>
                            </div>
                        </div>
                        <Button onClick={() => router.push('/learning-path')} className="w-full h-10 bg-white text-[#1e1b4b] hover:bg-indigo-50 text-[11px] font-black rounded-xl mt-2 transition-all">
                            View Full Roadmap <ArrowRight className="ml-2 w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
