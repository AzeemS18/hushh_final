'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import {
    LayoutDashboard,
    Trophy,
    Settings,
    GraduationCap,
    LogOut,
    PlusSquare,
    Users
} from 'lucide-react'
import { TopNav } from '@/components/student/top-nav'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const mockRole = localStorage.getItem('user_role')
        if (!loading && (!user || mockRole !== 'admin')) {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Verifying Admin Access...</p>
            </div>
        )
    }

    const navItems = [
        { name: 'Admin Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Contest Editor', href: '/admin/contests', icon: Trophy },
        { name: 'Student Merit', href: '#', icon: Users },
        { name: 'Configuration', href: '#', icon: Settings },
    ]

    const handleLogout = () => {
        localStorage.clear()
        window.location.href = '/login'
    }

    return (
        <div className="flex h-screen bg-white font-sans">
            {}
            <aside className="w-60 bg-gray-900 flex flex-col h-full shrink-0 border-r border-gray-800">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-gray-900" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-white tracking-tight">PlacementHub</span>
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Admin Command</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${isActive
                                    ? 'bg-white text-gray-900 shadow-xl'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={16} className={isActive ? 'text-gray-900' : 'text-gray-500'} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-black text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-wider"
                    >
                        <LogOut size={16} />
                        Term Sesson
                    </button>
                </div>
            </aside>

            {}
            <div className="flex-1 flex flex-col overflow-hidden">
                {}
                <div className="h-14 border-b border-gray-100 flex items-center justify-between px-8 bg-white shrink-0">
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">System Operational</div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Administrator Mode</span>
                        <div className="w-7 h-7 bg-gray-100 rounded-full"></div>
                    </div>
                </div>
                <main className="flex-1 overflow-auto bg-white">
                    {children}
                </main>
            </div>
        </div>
    )
}
