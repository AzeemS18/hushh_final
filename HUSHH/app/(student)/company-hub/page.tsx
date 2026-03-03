'use client'

import { useState } from 'react'
import {
    Building2,
    TrendingUp,
    DollarSign,
    Lightbulb,
    Mail,
    Search,
    ArrowUpRight,
    ShieldCheck,
    BellRing,
    CheckCircle2,
    ChevronRight,
    Timer
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const COMPANIES = [
    {
        name: "Google",
        slug: "google",
        logo: "G",
        color: "bg-blue-50 text-blue-600",
        avgSalary: "28 - 45 LPA",
        placementRate: "85%",
        difficulty: "Advanced",
        rounds: 5,
        tips: "Focus on Graph algorithms and System Design patterns. Be prepared for unconventional edge cases.",
        link: "https://leetcode.com/company/google/"
    },
    {
        name: "TCS Digital",
        slug: "tcs",
        logo: "T",
        color: "bg-indigo-50 text-indigo-600",
        avgSalary: "7 - 12 LPA",
        placementRate: "92%",
        difficulty: "Moderate",
        rounds: 3,
        tips: "Strong emphasis on Python/Java core concepts and project-based situational questions.",
        link: "https://leetcode.com/company/tcs/"
    },
    {
        name: "Zomato",
        slug: "zomato",
        logo: "Z",
        color: "bg-red-50 text-red-600",
        avgSalary: "18 - 25 LPA",
        placementRate: "78%",
        difficulty: "Competitive",
        rounds: 4,
        tips: "High focus on cultural fit and scalable architecture discussions. Know their product inside out.",
        link: "https://leetcode.com/company/zomato/"
    },
    {
        name: "Amazon",
        slug: "amazon",
        logo: "A",
        color: "bg-orange-50 text-orange-600",
        avgSalary: "32 - 50 LPA",
        placementRate: "72%",
        difficulty: "Expert",
        rounds: 6,
        tips: "Master the 14 Leadership Principles. Data Structures proficiency must be top-tier.",
        link: "https://leetcode.com/company/amazon/"
    },
    {
        name: "AMD",
        slug: "amd",
        logo: "A",
        color: "bg-green-50 text-green-600",
        avgSalary: "18 - 25 LPA",
        placementRate: "70%",
        difficulty: "Advanced",
        rounds: 4,
        tips: "Focus on C++, OS concepts, and Computer Architecture.",
        link: "https://leetcode.com/company/amd/"
    },
    {
        name: "Accenture",
        slug: "accenture",
        logo: "A",
        color: "bg-purple-50 text-purple-600",
        avgSalary: "4.5 - 12 LPA",
        placementRate: "90%",
        difficulty: "Moderate",
        rounds: 3,
        tips: "Standard analytical and verbal rounds. Coding is usually strings and arrays.",
        link: "https://leetcode.com/company/accenture/"
    },
    {
        name: "Accolite",
        slug: "accolite",
        logo: "A",
        color: "bg-yellow-50 text-yellow-600",
        avgSalary: "8 - 14 LPA",
        placementRate: "75%",
        difficulty: "Advanced",
        rounds: 4,
        tips: "Heavy focus on Data Structures and Algorithms.",
        link: "https://leetcode.com/problems/replace-the-substring-for-balanced-string"
    },
    {
        name: "Agoda",
        slug: "agoda",
        logo: "A",
        color: "bg-blue-50 text-blue-600",
        avgSalary: "20 - 35 LPA",
        placementRate: "60%",
        difficulty: "Advanced",
        rounds: 5,
        tips: "Focus on dynamic programming and system design.",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock"
    },
    {
        name: "Airbnb",
        slug: "airbnb",
        logo: "A",
        color: "bg-rose-50 text-rose-600",
        avgSalary: "40 - 60 LPA",
        placementRate: "50%",
        difficulty: "Expert",
        rounds: 5,
        tips: "Focus on complex system design and hard algorithmic problems.",
        link: "https://leetcode.com/problems/design-excel-sum-formula"
    }
]

export default function CompanyHubPage() {
    const [email, setEmail] = useState('')
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubscribed(true)
        setTimeout(() => {
            setShowConfirmation(true)
            setTimeout(() => setShowConfirmation(false), 5000)
        }, 1500)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 py-8 px-6 animate-in fade-in duration-500 font-sans">

            {}
            <div className="bg-[#1e1b4b] p-8 rounded-2xl text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="max-w-xl text-center lg:text-left space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[9px] font-black uppercase tracking-widest mb-2 border border-white/20">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            Verified Placement Data
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tight">Company Insights Hub</h1>
                        <p className="text-indigo-100/80 text-[11px] font-medium leading-relaxed">
                            Real-time statistics on recruitment patterns, compensation tiers, and interview blueprints from top-tier tech firms.
                        </p>
                    </div>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-md p-6 rounded-2xl w-full max-w-sm">
                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BellRing className="w-4 h-4 text-indigo-400" />
                                <span className="text-xs font-black uppercase italic text-white">Alert Subscriptions</span>
                            </div>
                            {!isSubscribed ? (
                                <>
                                    <Input
                                        type="email"
                                        placeholder="Enter registered email..."
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/30 text-xs font-bold h-10 rounded-xl"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Button className="w-full bg-white text-[#1e1b4b] hover:bg-indigo-50 font-black rounded-xl text-[11px] h-10 tracking-widest">
                                        ENABLE NOTIFICATIONS
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-black italic">
                                        <CheckCircle2 className="w-4 h-4" /> SUBMITTED
                                    </div>
                                    <p className="text-[9px] text-white/50 text-center font-bold">A confirmation link has been prioritized for your inbox.</p>
                                </div>
                            )}
                        </form>
                    </Card>
                </div>

                {}
                {showConfirmation && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-emerald-600 animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-center gap-3 text-white">
                            <Mail className="w-5 h-5" />
                            <p className="text-xs font-black italic">ALERT: System has sent a confirmation mail to {email}. Check your inbox now!</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {}
                <div className="lg:col-span-1 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input className="pl-10 h-10 rounded-xl border-gray-100 font-bold text-xs" placeholder="Search companies..." />
                    </div>

                    <Card className="p-4 border-gray-100 rounded-2xl shadow-sm">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Global Statistics</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[11px] font-black mb-1.5 uppercase italic">
                                    <span>Avg. Package</span>
                                    <span className="text-[#5034ff]">15.4 LPA</span>
                                </div>
                                <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#5034ff] w-[65%] rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] font-black mb-1.5 uppercase italic">
                                    <span>Total Hires</span>
                                    <span className="text-emerald-500">2.4k+</span>
                                </div>
                                <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {COMPANIES.map((company) => (
                            <Card key={company.slug} className="group border-gray-100 hover:shadow-xl transition-all rounded-2xl overflow-hidden cursor-pointer">
                                <CardHeader className="p-6 border-b border-gray-50 bg-gray-50/30 group-hover:bg-[#5034ff]/5 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-12 h-12 rounded-xl ${company.color} flex items-center justify-center text-xl font-black italic shadow-sm`}>
                                            {company.logo}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Difficulty</span>
                                            <span className="text-xs font-black italic text-gray-900 uppercase">{company.difficulty}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <CardTitle className="text-lg font-black italic tracking-tight">{company.name}</CardTitle>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase italic">
                                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {company.avgSalary}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase italic">
                                                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> {company.placementRate} Hires
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex gap-3">
                                        <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0" />
                                        <p className="text-[11px] font-medium text-indigo-900 leading-relaxed italic">
                                            "{company.tips}"
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <Timer className="w-3.5 h-3.5 text-gray-300" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase">{company.rounds} Interview Rounds</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 rounded-lg text-indigo-600 font-extrabold text-[10px] uppercase gap-1 hover:bg-indigo-50"
                                            onClick={() => {
                                                if (company.link) window.open(company.link, '_blank');
                                            }}
                                        >
                                            Solve on LeetCode <ArrowUpRight className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
