'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Timer, Star, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const CONTESTS = [
    {
        id: 1,
        title: 'Weekly Tech Challenge #12',
        status: 'Active',
        questions: 10,
        time: '45 mins',
        points: 500,
        participants: 1240,
        deadline: 'Closing in 2 days'
    },
    {
        id: 2,
        title: 'Cognitive Ability Sprint',
        status: 'Upcoming',
        questions: 20,
        time: '30 mins',
        points: 300,
        participants: 0,
        deadline: 'Starts in 4 hours'
    },
    {
        id: 3,
        title: 'TCS NQT Mock Contest',
        status: 'Completed',
        questions: 25,
        time: '90 mins',
        points: 1000,
        participants: 8500,
        deadline: 'Ended yesterday'
    }
]

export default function ContestsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("Open Challenges")

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 py-8 px-6 animate-in fade-in duration-500 font-sans">
            {/* Header Section - Compact */}
            <div className="bg-[#1e1b4b] p-8 rounded-2xl text-white relative overflow-hidden shadow-xl">
                <Trophy className="absolute top-4 right-4 w-16 h-16 text-white opacity-5 rotate-12" />

                <div className="relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[9px] font-black uppercase mb-4 backdrop-blur-md border border-white/20 tracking-widest">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        COMPETITIVE PREP
                    </div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight italic">Weekly Contests</h1>
                    <p className="text-indigo-100/80 text-[11px] font-medium leading-relaxed max-w-md">
                        Compete in real-time scenarios. Improve your rank and get noticed by recruiters.
                    </p>

                    <div className="mt-8 flex items-center gap-12 border-t border-white/10 pt-6 w-fit scale-90 origin-left">
                        <div>
                            <p className="text-indigo-400 text-[8px] font-black uppercase tracking-widest mb-0.5">Your Rank</p>
                            <p className="text-2xl font-black italic">#452 <span className="text-[11px] font-bold text-green-400 ml-1">↑ 12</span></p>
                        </div>
                        <div className="border-l border-white/10 pl-12">
                            <p className="text-indigo-400 text-[8px] font-black uppercase tracking-widest mb-0.5">Total Points</p>
                            <p className="text-2xl font-black italic">2,450</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contest List - Compact */}
            <div className="space-y-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 px-2 italic">
                    <Timer className="text-[#5034ff] h-5 w-5" />
                    Open Challenges
                </h2>

                <div className="grid grid-cols-1 gap-3">
                    {CONTESTS.map((contest) => (
                        <Card key={contest.id} className="border border-gray-100 shadow-sm hover:shadow-lg transition-all rounded-xl group overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex items-stretch">
                                    <div className={`w-1.5 ${contest.status === 'Active' ? 'bg-green-500' :
                                        contest.status === 'Upcoming' ? 'bg-[#5034ff]' : 'bg-gray-200'
                                        }`} />

                                    <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${contest.status === 'Active' ? 'bg-green-50 text-green-600' :
                                                    contest.status === 'Upcoming' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'
                                                    }`}>
                                                    {contest.status}
                                                </span>
                                                <span className="text-gray-300 text-[9px] font-bold tracking-tighter">{contest.deadline}</span>
                                            </div>
                                            <h3 className="text-base font-black text-gray-900 group-hover:text-[#5034ff] transition-colors truncate italic">
                                                {contest.title}
                                            </h3>

                                            <div className="flex items-center gap-6 mt-3">
                                                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black">
                                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                    {contest.points} PTS
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black">
                                                    <CheckCircle2 size={14} className="text-[#5034ff]" />
                                                    {contest.questions} Q
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black">
                                                    <Timer size={14} className="text-orange-400" />
                                                    {contest.time}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-2 min-w-[140px]">
                                            <Button
                                                onClick={() => {
                                                    if (contest.status === 'Active') {
                                                        const targetProblem = contest.title.includes('Weekly') ? 'Merge k Sorted Lists' : 'Longest Substring Without Repeating Characters'
                                                        router.push(`/assessment?round=compiler&q=${encodeURIComponent(targetProblem)}`)
                                                    } else if (contest.status === 'Upcoming') {
                                                        alert("Reminder set! We will notify you before the sprint begins.")
                                                    }
                                                }}
                                                disabled={contest.status === 'Completed'}
                                                className={`w-full h-10 rounded-lg text-[10px] font-black shadow-md transition-all active:scale-[0.98] ${contest.status === 'Active' ? 'bg-gray-900 hover:bg-black text-white' :
                                                    contest.status === 'Upcoming' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-gray-50 text-gray-400'
                                                    }`}
                                            >
                                                {contest.status === 'Active' ? 'SOLVE NOW' :
                                                    contest.status === 'Upcoming' ? 'REMIND ME' : 'SUMMARY'}
                                            </Button>
                                            {contest.status === 'Active' && (
                                                <div className="flex items-center gap-1 animate-pulse">
                                                    <div className="w-1 h-1 rounded-full bg-green-500"></div>
                                                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">
                                                        {contest.participants.toLocaleString()} Competing
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
