'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Download, Award, Clock } from 'lucide-react'

interface Scorecard {
    id: string
    category: string
    score: number
    total_questions: number
    percentage: number
    created_at: string
    recommendations?: string
}

export function ScorecardHistory() {
    const [scorecards, setScorecards] = useState<Scorecard[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [downloadingId, setDownloadingId] = useState<string | null>(null)

    const handleDownload = async (sc: Scorecard) => {
        setDownloadingId(sc.id)
        try {
            const res = await fetch("http://localhost:8000/api/report/generate", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: sc.id,
                    name: "Student",
                    category: sc.category,
                    created_at: sc.created_at,
                    score: sc.score,
                    total: sc.total_questions,
                    percentage: sc.percentage,
                    recommendations: sc.recommendations || ""
                })
            })
            if (!res.ok) throw new Error("Failed to generate PDF")
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `report_${sc.id.slice(0, 8)}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            a.remove()
        } catch (e) {
            console.error("Download error:", e)
            alert("Failed to download PDF.")
        } finally {
            setDownloadingId(null)
        }
    }

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { createClient } = await import('@/lib/supabase/client')
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    setLoading(false)
                    return
                }

                const { data, error } = await supabase
                    .from('assessments')
                    .select('*')
                    .eq('student_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error

                setScorecards(data || [])
            } catch (err) {
                console.error("Error fetching scorecards:", err)
                setError('Could not load history from Supabase.')
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [])

    if (loading) {
        return <div className="p-12 text-center text-gray-500 font-bold animate-pulse">Loading Official Scorecards...</div>
    }

    if (error) {
        return <div className="p-12 text-center text-rose-500 font-bold">{error}</div>
    }

    if (scorecards.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20 animate-in fade-in">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-black italic text-gray-900 mb-2">No History Found</h2>
                <p className="text-gray-500 font-medium">Complete a Mock Test or ATS Analysis to generate your first official scorecard.</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div>
                <h2 className="text-2xl font-black italic mb-2">Official Scorecards</h2>
                <p className="text-gray-500 font-medium text-sm">Download your securely generated PDF reports detailing performance and ML recommendations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {scorecards.map(sc => (
                    <Card key={sc.id} className="p-6 border-gray-100 rounded-[2rem] hover:shadow-lg hover:-translate-y-1 transition-all bg-white relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10 transition-transform group-hover:scale-150 ${sc.percentage >= 70 ? 'bg-emerald-500' : sc.percentage >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h3 className="font-black text-gray-900 text-lg mb-1">{sc.category}</h3>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <Clock className="w-3 h-3" /> {new Date(sc.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className={`text-3xl font-black tracking-tighter italic ${sc.percentage >= 70 ? 'text-emerald-500' : sc.percentage >= 40 ? 'text-amber-500' : 'text-rose-500'
                                }`}>
                                {sc.percentage}%
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-6 relative z-10">
                            <span className="text-sm font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                {sc.score} / {sc.total_questions} Questions
                            </span>

                            <button
                                onClick={() => handleDownload(sc)}
                                disabled={downloadingId === sc.id}
                                className="inline-flex items-center gap-2 text-xs font-black text-[#5034ff] hover:text-[#3d1fca] transition-colors disabled:opacity-50"
                            >
                                {downloadingId === sc.id ? (
                                    <Clock className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {downloadingId === sc.id ? 'Generating...' : 'Get PDF'}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
