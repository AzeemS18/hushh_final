'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Users,
    Trophy,
    Settings,
    Plus,
    GraduationCap,
    TrendingUp,
    Target,
    Search,
    BookOpen
} from 'lucide-react'
import { Input } from '@/components/ui/input'

const STUDENT_SCORES = [
    { id: 1, name: 'Rahul S.', email: 'rahul@example.com', score: 92, rank: 1, status: 'Elite' },
    { id: 2, name: 'Priya M.', email: 'priya@example.com', score: 88, rank: 2, status: 'Elite' },
    { id: 3, name: 'Aniket K.', email: 'aniket@example.com', score: 85, rank: 3, status: 'Strong' },
    { id: 4, name: 'Sneha P.', email: 'sneha@example.com', score: 78, rank: 4, status: 'Strong' },
    { id: 5, name: 'Vikram R.', email: 'vikram@example.com', score: 72, rank: 5, status: 'Average' },
]

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 py-8 px-6 animate-in fade-in duration-500 font-sans">

            {/* Admin Header - Compact */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="space-y-1 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/30">
                        Management Console
                    </div>
                    <h1 className="text-2xl font-black tracking-tight italic">Admin Oversight</h1>
                    <p className="text-indigo-200/60 text-[11px] font-medium leading-relaxed">Central command for student performance and contest logic.</p>
                </div>
                <div className="flex gap-3 relative z-10">
                    <Button className="h-10 px-6 bg-white text-gray-900 rounded-xl font-black text-xs hover:bg-indigo-50 transition-all">
                        <Plus className="w-4 h-4 mr-2" /> New Contest
                    </Button>
                    <Button variant="outline" className="h-10 px-4 border-white/20 text-white rounded-xl hover:bg-white/10">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats Blocks */}
                <Card className="bg-white border-none shadow-sm rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Students</p>
                            <h3 className="text-xl font-black text-gray-900">12,540</h3>
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-none shadow-sm rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Contests</p>
                            <h3 className="text-xl font-black text-gray-900">24</h3>
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-none shadow-sm rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Avg Readiness</p>
                            <h3 className="text-xl font-black text-gray-900">76.4%</h3>
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-none shadow-sm rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Growth Rate</p>
                            <h3 className="text-xl font-black text-gray-900">+12%</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student Performance Table */}
                <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl p-6 border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-black text-gray-900 italic flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-[#5034ff]" /> Student Merit List
                        </h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name or email..."
                                className="h-9 pl-10 bg-gray-50 border-gray-100 rounded-xl text-[11px] font-bold"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="text-left py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank</th>
                                    <th className="text-left py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                    <th className="text-left py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Merit</th>
                                    <th className="text-left py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tier</th>
                                    <th className="text-right py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {STUDENT_SCORES.map(student => (
                                    <tr key={student.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4">
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black ${student.rank <= 3 ? 'bg-[#5034ff] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                {student.rank}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900">{student.name}</span>
                                                <span className="text-[10px] font-medium text-gray-400">{student.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${student.score}%` }}></div>
                                                </div>
                                                <span className="text-xs font-black text-gray-900">{student.score}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${student.status === 'Elite' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-indigo-50">
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Admin Tools Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-[#1e1b4b] text-white border-none shadow-xl rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <BookOpen className="w-20 h-20" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-base font-black italic tracking-tight">Active Contest logic</h3>
                            <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-2">
                                <p className="text-indigo-300 text-[9px] font-black uppercase tracking-widest">Weekly Challenge #12</p>
                                <p className="text-sm font-black">Google Mock Sprint</p>
                                <div className="flex items-center justify-between text-[10px] text-white/60 font-medium">
                                    <span>Participants: 1.2k</span>
                                    <span>Avg Score: 68%</span>
                                </div>
                            </div>
                            <Button className="w-full h-11 bg-white text-gray-900 hover:bg-indigo-50 font-black rounded-lg text-xs shadow-lg">
                                Edit Questions
                            </Button>
                        </div>
                    </Card>

                    <Card className="bg-white border-none shadow-sm rounded-2xl p-6 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">System Alerts</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start border-l-2 border-orange-400 pl-3">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-black text-gray-900 leading-tight">Supabase Sync Delay</p>
                                    <p className="text-[10px] font-medium text-gray-500 leading-tight">Merit list updates are lagging by 2 mins.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start border-l-2 border-emerald-400 pl-3">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-black text-gray-900 leading-tight">New Contest Success</p>
                                    <p className="text-[10px] font-medium text-gray-500 leading-tight">1.2k students entered 'Weekly #12'.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
