'use client'

import { useState } from 'react'
import {
    Users,
    MessageSquare,
    ThumbsUp,
    Share2,
    MoreHorizontal,
    Sparkles,
    Hash,
    Plus,
    Filter,
    ArrowUpRight,
    TrendingDown,
    TrendingUp,
    Brain
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const DISCUSSIONS = [
    {
        id: 1,
        author: "Arjun K.",
        role: "Admin (Moderator)",
        avatar: "A",
        tag: "Technical",
        title: "Google Interview Experience: L4 Level Rounds",
        content: "Just finished the round. Focus heavily on dynamic programming and graph traversals. The interviewer was very picky about time complexity optimization.",
        timestamp: "2h ago",
        likes: 45,
        comments: 12
    },
    {
        id: 2,
        author: "Sneha Reddy",
        role: "Student",
        avatar: "S",
        tag: "HR Round",
        title: "How to handle 'Tell me about a time you failed'?",
        content: "I'm preparing for Amazon HR and I'm stuck on this. Any tips from someone who cracked the Amazon SDE interview?",
        timestamp: "5h ago",
        likes: 82,
        comments: 34
    },
    {
        id: 3,
        author: "Rahul V.",
        role: "Student",
        avatar: "R",
        tag: "Aptitude",
        title: "Is TCS NQT harder this year?",
        content: "The quantitative section felt significantly more algebraic than last time. Need suggestions for practice material.",
        timestamp: "1d ago",
        likes: 21,
        comments: 8
    }
]

export default function CommunityPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 py-8 px-6 animate-in fade-in duration-500 font-sans">

            {/* Header section - Compact & Dark */}
            <div className="bg-[#1e1b4b] p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <Users className="absolute top-0 right-0 w-32 h-32 opacity-5 translate-x-8 -translate-y-8" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                            Student Community Forum
                            <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        </h1>
                        <p className="text-indigo-200/80 text-[10px] font-bold uppercase tracking-widest">Connect • Discuss • Conquer</p>
                    </div>
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 font-black rounded-xl h-10 px-6 text-xs uppercase tracking-tight shadow-lg">
                        <Plus className="w-4 h-4 mr-2" /> Start Discussion
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Filters & Trends */}
                <div className="space-y-6">
                    <Card className="border-gray-100 shadow-sm rounded-2xl p-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5" /> Topics & Rounds
                        </h3>
                        <div className="space-y-1">
                            {["General", "Technical", "HR Round", "Aptitude", "Case Study"].map((tag) => (
                                <button key={tag} className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-black text-gray-500 hover:bg-gray-50 hover:text-[#5034ff] transition-all flex items-center justify-between italic uppercase tracking-tighter">
                                    {tag}
                                    <Hash className="w-3 h-3 text-gray-300" />
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-indigo-50 border-none rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-900 italic uppercase">Trending Now</span>
                        </div>
                        <div className="space-y-3">
                            <div className="group cursor-pointer">
                                <p className="text-[10px] font-black text-indigo-900 italic leading-tight group-hover:underline">#AmazonLeadershipPrinciples</p>
                                <p className="text-[9px] font-bold text-indigo-400 uppercase">234 Conversations</p>
                            </div>
                            <div className="group cursor-pointer">
                                <p className="text-[10px] font-black text-indigo-900 italic leading-tight group-hover:underline">#TCSDigitalExperience</p>
                                <p className="text-[9px] font-bold text-indigo-400 uppercase">1.2k Conversations</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Discussion Feed */}
                <div className="lg:col-span-3 space-y-4">
                    {DISCUSSIONS.map((post) => (
                        <Card key={post.id} className="border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-all group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9 border-2 border-white shadow-sm">
                                            <AvatarFallback className="bg-orange-50 text-orange-600 font-black text-xs">{post.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="text-xs font-black text-gray-900 italic">{post.author}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter">{post.role}</span>
                                                <span className="text-gray-300 text-[9px]">•</span>
                                                <span className="text-gray-400 text-[9px] font-bold">{post.timestamp}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100 italic">
                                        #{post.tag}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <h3 className="text-base font-black text-gray-900 italic leading-tight group-hover:text-[#5034ff] transition-colors">{post.title}</h3>
                                    <p className="text-[11px] font-medium text-gray-500 leading-relaxed line-clamp-2">
                                        {post.content}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#5034ff] transition-colors text-[10px] font-black italic">
                                            <ThumbsUp className="w-4 h-4" /> {post.likes}
                                        </button>
                                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors text-[10px] font-black italic">
                                            <MessageSquare className="w-4 h-4" /> {post.comments}
                                        </button>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-900 group/btn font-black text-[10px] uppercase">
                                        Open Thread <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Button className="w-full h-12 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 font-black italic rounded-xl border border-dashed border-gray-200 text-xs">
                        Load older conversations...
                    </Button>
                </div>
            </div>
        </div>
    )
}
