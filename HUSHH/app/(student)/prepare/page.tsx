'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Bot, ChevronRight, Code, Brain, BookOpen, Loader2, ArrowRight } from 'lucide-react'
import { MockTestSimulator } from '@/components/student/mock-test'

type Phase = 'path-selection' | 'domain-select' | 'domain-description' | 'timeline-select' | 'assessment' | 'dashboard'

const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical']

const DOMAIN_DESCRIPTIONS: Record<string, string> = {
    'Computer Science': 'Focuses on Data Structures, Algorithms, Operating Systems, DBMS, and System Design. Recommended for Software Engineering and Full-Stack roles.',
    'Information Technology': 'Covers Networking, Cloud Computing, Web Technologies, and Database Management. Ideal for DevOps, Cloud, and IT Consultant roles.',
    'Electronics': 'Includes Digital Logic, Microprocessors, Signals & Systems, and VLSI. Best for Embedded Systems and Hardware Engineering roles.',
    'Mechanical': 'Entails Thermodynamics, Fluid Mechanics, Manufacturing, and CAD. Targeted for Core Mechanical, Auto, and HVAC roles.',
    'Civil': 'Focuses on Structural Engineering, Geotech, Construction Management, and Transportation. Geared towards Core Civil Engineering and Infrastructure roles.',
    'Electrical': 'Covers Power Systems, Control Systems, Machines, and Power Electronics. Prime for Core Electrical, Energy, and Power Generation roles.'
}

export default function PreparePage() {
    const router = useRouter()
    const [phase, setPhase] = useState<Phase>('path-selection')
    const [pathType, setPathType] = useState<'level' | 'domain' | null>(null)
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'Aptitude' | 'Coding' | 'Core Subjects' | null>(null)
    const [studyMaterial, setStudyMaterial] = useState<string>('')
    const [isLoadingMaterial, setIsLoadingMaterial] = useState(false)
    const [domainInfo, setDomainInfo] = useState<{ scope: string, salary: string, techStack: string, domains?: string[] } | null>(null)
    const [isFetchingInfo, setIsFetchingInfo] = useState(false)
    const [timeline, setTimeline] = useState<string | null>(null)

    const handlePathSelection = (path: 'level' | 'domain') => {
        setPathType(path)
        setPhase('domain-select')
    }

    const handleDomainSelect = (dept: string) => {
        setSelectedDomain(dept)
        if (pathType === 'level') {
            setPhase('domain-description')
            fetchDomainInfo(dept)
        } else {
            setPhase('timeline-select')
        }
    }

    const fetchDomainInfo = async (dept: string) => {
        setIsFetchingInfo(true)
        setDomainInfo(null)
        try {
            const apiKey = "AIzaSyC9fJtppKvogcON7CsJUJJHKVFnroWOq_I"
            const prompt = `Provide a brief overview for the engineering department: ${dept}. Include standard scope, average starting salary package in Indian Rupees (e.g. ₹8 Lakhs - ₹12 Lakhs or similar context), top tech stack needed, and a list of at least 4 specific career domains or subfields available within this department. Output as JSON with exactly these keys: "scope", "salary", "techStack", "domains" (array of strings).`
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            })
            const data = await res.json()
            const text = data.candidates[0].content.parts[0].text
            setDomainInfo(JSON.parse(text))
        } catch (e) {
            console.warn("Gemini fetch failed. Falling back to Ollama...", e)
            try {
                const prompt = `Provide a brief overview for the engineering department: ${dept}. Include standard scope, average starting salary package in Indian Rupees (e.g. ₹8 Lakhs - ₹12 Lakhs or similar context), top tech stack needed, and a list of at least 4 specific career domains or subfields available within this department. Output as JSON with exactly these keys: "scope", "salary", "techStack", "domains" (array of strings). OUTPUT ONLY VALID JSON. Do not use blockquotes or markdown.`
                const ollamaRes = await fetch('http://localhost:11434/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'llama3.2',
                        prompt: prompt,
                        stream: false,
                        format: 'json'
                    })
                })
                const ollamaData = await ollamaRes.json()
                const raw = ollamaData.response.replace(/```json/g, "").replace(/```/g, "").trim()
                setDomainInfo(JSON.parse(raw))
            } catch (ollamaErr) {
                console.error("Ollama fallback failed", ollamaErr)
                setDomainInfo({
                    scope: DOMAIN_DESCRIPTIONS[dept] || "Overview not available.",
                    salary: "Varies depending on role and location.",
                    techStack: "Standard engineering toolkit.",
                    domains: ["Core Operations", "Research & Development", "Quality Assurance", "Design & Implementation"]
                })
            }
        } finally {
            setIsFetchingInfo(false)
        }
    }

    const handleAssessmentComplete = () => {
        setPhase('dashboard')
    }

    const loadCoreSubjects = async () => {
        setActiveTab('Core Subjects')
        if (studyMaterial) return // already loaded

        setIsLoadingMaterial(true)
        try {
            const res = await fetch(`http://localhost:8000/api/study-material/${encodeURIComponent(selectedDomain || 'General')}?timeline=${encodeURIComponent(timeline || '1 Month')}`)
            const data = await res.json()
            setStudyMaterial(data.material || "Failed to parse material.")
        } catch (e) {
            setStudyMaterial("Sorry, the Offline AI agent could not be reached. Ensure Ollama is running.")
        } finally {
            setIsLoadingMaterial(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#fafafa] p-6 lg:p-12 relative overflow-y-auto">
            {}
            {phase === 'path-selection' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black italic text-gray-900 mb-3">How should we begin?</h2>
                        <p className="text-gray-500 font-medium">Choose your preferred approach to preparation.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card
                            onClick={() => handlePathSelection('level')}
                            className="p-8 rounded-[2rem] border border-gray-100 hover:border-[#5034ff] hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group bg-white"
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Brain className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Know Your Level</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">Take a baseline cognitive and logic assessment to identify your current standing among peers.</p>
                        </Card>

                        <Card
                            onClick={() => handlePathSelection('domain')}
                            className="p-8 rounded-[2rem] border border-gray-100 hover:border-[#5034ff] hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group bg-white"
                        >
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Choose Your Domain</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">Select your specific engineering discipline and get targeted assessments mapping to your syllabus.</p>
                        </Card>
                    </div>
                </div>
            )}

            {}
            {phase === 'domain-select' && (
                <div className="max-w-5xl mx-auto animate-in slide-in-from-right duration-500">
                    <div className="mb-10 flex items-center gap-4">
                        <Button variant="ghost" className="font-bold text-gray-500" onClick={() => setPhase('path-selection')}>← Back</Button>
                        <div>
                            <h2 className="text-3xl font-black italic text-gray-900 mb-2">Select Your Department</h2>
                            <p className="text-gray-500 font-medium">This will calibrate the AI to generate syllabus-accurate Mock Tests.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {DEPARTMENTS.map(dept => (
                            <Card
                                key={dept}
                                onClick={() => handleDomainSelect(dept)}
                                className="p-6 border-gray-100 hover:border-[#5034ff] hover:bg-[#5034ff]/5 hover:shadow-lg transition-all rounded-2xl cursor-pointer group flex items-center justify-center text-center h-32"
                            >
                                <h3 className="font-black text-gray-900 group-hover:text-[#5034ff] transition-colors">{dept}</h3>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {}
            {phase === 'domain-description' && (
                <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500 mt-20 text-center">
                    <div className="w-20 h-20 bg-[#5034ff]/10 text-[#5034ff] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-black italic text-gray-900 mb-6">{selectedDomain} Overview</h2>

                    {isFetchingInfo ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Loader2 className="w-8 h-8 text-[#5034ff] animate-spin mb-4" />
                            <p className="font-bold text-gray-900">Gathering Intelligence...</p>
                            <p className="text-sm text-gray-500">Generating live domain insights...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                                <Card className="p-6 border-indigo-100 bg-indigo-50/30 rounded-3xl shadow-sm">
                                    <h3 className="font-black text-indigo-900 mb-2 uppercase tracking-tight text-sm">Industry Scope</h3>
                                    <p className="text-indigo-700/80 font-medium text-sm leading-relaxed">{domainInfo?.scope}</p>
                                </Card>
                                <Card className="p-6 border-emerald-100 bg-emerald-50/30 rounded-3xl shadow-sm">
                                    <h3 className="font-black text-emerald-900 mb-2 uppercase tracking-tight text-sm">Salary Package</h3>
                                    <p className="text-emerald-700/80 font-medium text-lg italic">{domainInfo?.salary}</p>
                                </Card>
                                <Card className="p-6 border-fuchsia-100 bg-fuchsia-50/30 rounded-3xl shadow-sm">
                                    <h3 className="font-black text-fuchsia-900 mb-2 uppercase tracking-tight text-sm">Tech Stack</h3>
                                    <p className="text-fuchsia-700/80 font-medium text-sm leading-relaxed">{domainInfo?.techStack}</p>
                                </Card>
                            </div>

                            {}
                            {domainInfo?.domains && domainInfo.domains.length > 0 && (
                                <div className="text-left mb-10 w-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5034ff]/5 rounded-full blur-2xl -translate-y-12 translate-x-12"></div>
                                    <h3 className="font-black text-gray-900 mb-4 uppercase tracking-tight text-sm flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-[#5034ff] rounded-full"></div>
                                        Available Career Domains
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5 relative z-10">
                                        {domainInfo.domains.map((d, i) => (
                                            <span key={i} className="px-4 py-2 bg-gray-50 hover:bg-[#5034ff]/5 text-gray-700 font-bold text-xs rounded-xl border border-gray-100 hover:border-[#5034ff]/30 transition-all cursor-default">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <Button
                        disabled={isFetchingInfo}
                        onClick={() => setPhase('timeline-select')}
                        className="bg-[#5034ff] hover:bg-[#3d1fca] text-white px-10 h-14 rounded-2xl font-black text-lg transition-all shadow-xl disabled:opacity-50 mt-4"
                    >
                        Plan Preparation Timeline <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            )}

            {}
            {phase === 'timeline-select' && (
                <div className="max-w-5xl mx-auto animate-in slide-in-from-right duration-500 mt-10">
                    <div className="mb-10 flex items-center gap-4">
                        <Button variant="ghost" className="font-bold text-gray-500" onClick={() => setPhase(pathType === 'level' ? 'domain-description' : 'domain-select')}>← Back</Button>
                        <div>
                            <h2 className="text-3xl font-black italic text-gray-900 mb-2">Select Preparation Timeline</h2>
                            <p className="text-gray-500 font-medium">Choose how much time you have to calibrate the AI study plan.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['7 Days', '1 Month', '3 Months', '6 Months', '1 Year'].map(t => (
                            <Card
                                key={t}
                                onClick={() => {
                                    setTimeline(t)
                                    setPhase('dashboard')
                                }}
                                className="p-6 border-gray-100 hover:border-[#5034ff] hover:bg-[#5034ff]/5 hover:shadow-lg transition-all rounded-2xl cursor-pointer group flex items-center justify-center text-center h-32"
                            >
                                <h3 className="font-black text-gray-900 group-hover:text-[#5034ff] transition-colors">{t}</h3>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {}
            {phase === 'assessment' && (
                <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-black italic text-gray-900 mb-2">Assessment Phase</h2>
                            <p className="text-gray-500 font-medium">Complete a mock test. When finished, you'll unlock your Study Dashboard.</p>
                        </div>
                        <Button
                            onClick={handleAssessmentComplete}
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold px-6 rounded-xl"
                        >
                            Skip Assessment / Go to Dashboard →
                        </Button>
                    </div>

                    {}
                    <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
                        <MockTestSimulator />
                    </div>
                </div>
            )}

            {}
            {phase === 'dashboard' && (
                <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom duration-700">
                    <div className="mb-10 text-center">
                        <h2 className="text-4xl font-black italic text-gray-900 mb-3 tracking-tight">Prepare Phase Dashboard</h2>
                        <p className="text-gray-500 font-medium text-lg">Your personalized placement prep track for <span className="text-[#5034ff] font-bold">{selectedDomain || 'General'}</span>.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <Card
                            onClick={() => setActiveTab('Aptitude')}
                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${activeTab === 'Aptitude' ? 'border-[#5034ff] bg-[#5034ff]/5 shadow-xl scale-105' : 'border-gray-100 hover:border-gray-200 bg-white hover:shadow-md'}`}
                        >
                            <Brain className={`w-10 h-10 mb-4 ${activeTab === 'Aptitude' ? 'text-[#5034ff]' : 'text-gray-400'}`} />
                            <h3 className="text-xl font-black text-gray-900 mb-2">Aptitude</h3>
                            <p className="text-sm font-medium text-gray-500">Quantitative, Logical, and Verbal reasoning basics.</p>
                        </Card>

                        <Card
                            onClick={() => setActiveTab('Coding')}
                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${activeTab === 'Coding' ? 'border-[#5034ff] bg-[#5034ff]/5 shadow-xl scale-105' : 'border-gray-100 hover:border-gray-200 bg-white hover:shadow-md'}`}
                        >
                            <Code className={`w-10 h-10 mb-4 ${activeTab === 'Coding' ? 'text-[#5034ff]' : 'text-gray-400'}`} />
                            <h3 className="text-xl font-black text-gray-900 mb-2">Coding</h3>
                            <p className="text-sm font-medium text-gray-500">DSA problems, algorithms, and technical challenges.</p>
                        </Card>

                        <Card
                            onClick={loadCoreSubjects}
                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${activeTab === 'Core Subjects' ? 'border-[#5034ff] bg-[#5034ff]/5 shadow-xl scale-105' : 'border-gray-100 hover:border-gray-200 bg-white hover:shadow-md'}`}
                        >
                            <BookOpen className={`w-10 h-10 mb-4 ${activeTab === 'Core Subjects' ? 'text-[#5034ff]' : 'text-gray-400'}`} />
                            <h3 className="text-xl font-black text-gray-900 mb-2">Core Subjects</h3>
                            <p className="text-sm font-medium text-gray-500">AI-generated syllabus tailored specifically to your domain.</p>
                        </Card>
                    </div>

                    {}
                    <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 min-h-[400px]">
                        {activeTab === 'Aptitude' && (
                            <div className="animate-in fade-in">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3"><Brain className="text-[#5034ff]" /> Quantitative & Reasoning</h3>
                                <p className="text-gray-600 font-medium mb-8">Focus on Time & Work, Speed & Distance, Blood Relations, and Syllogism to pass the initial screening rounds.</p>
                                <div className="p-8 bg-gray-50 rounded-3xl text-center border border-gray-100 italic text-gray-500 font-medium tracking-wide">
                                    [Interactive Aptitude Modules feature placeholder]
                                </div>
                            </div>
                        )}

                        {activeTab === 'Coding' && (
                            <div className="animate-in fade-in">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3"><Code className="text-[#5034ff]" /> Data Structures & Algorithms</h3>
                                <p className="text-gray-600 font-medium mb-8">Practice frequently asked technical questions focusing on Arrays, Strings, HashMaps, and Dynamic Programming.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { title: "Two Sum", difficulty: "Easy", category: "Array" },
                                        { title: "Reverse Linked List", difficulty: "Easy", category: "Linked List" },
                                        { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "Hash Table" },
                                        { title: "Merge k Sorted Lists", difficulty: "Hard", category: "Linked List" }
                                    ].map(prob => (
                                        <Card key={prob.title} className="p-5 border-gray-100 shadow-sm rounded-2xl group border hover:border-[#5034ff]/30 transition-all flex flex-col justify-between h-full bg-white relative overflow-hidden">
                                            <div className="absolute top-0 w-full h-1 bg-[#5034ff]/10 left-0" />
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-[#5034ff] transition-colors">{prob.title}</h4>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                                                            prob.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                                                        }`}>
                                                        {prob.difficulty}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">{prob.category}</span>
                                            </div>
                                            <Button
                                                onClick={() => router.push(`/assessment?q=${encodeURIComponent(prob.title)}`)}
                                                className="w-full mt-auto bg-gray-50 hover:bg-[#5034ff] text-gray-700 hover:text-white font-black h-10 rounded-xl shadow-none border-none transition-all group-hover:-translate-y-0.5"
                                            >
                                                Solve Challenge <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Core Subjects' && (
                            <div className="animate-in fade-in">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3"><BookOpen className="text-[#5034ff]" /> AI Domain Syllabi: {selectedDomain || 'General'}</h3>

                                {isLoadingMaterial ? (
                                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                                        <Loader2 className="w-10 h-10 text-[#5034ff] animate-spin mb-4" />
                                        <p className="font-bold text-gray-900">Locally structuring study plan...</p>
                                        <p className="text-sm text-gray-500 mt-2">Ollama Llama 3.2 is scanning domain requirements.</p>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-b from-indigo-50/50 to-white rounded-3xl p-8 border border-indigo-100/50">
                                        <div className="prose prose-indigo max-w-none text-gray-700 font-medium leading-loose whitespace-pre-wrap">
                                            {studyMaterial}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {!activeTab && (
                            <div className="flex items-center justify-center h-full text-center py-24 text-gray-400 font-bold italic">
                                Select a track above to view your materials.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
