'use client'

import { useAuth } from '@/lib/auth/auth-context'
import {
    User,
    LogOut,
    ChevronDown,
    Flame
} from 'lucide-react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

import { ThemeToggle } from '@/components/ui/theme-toggle'

export function TopNav() {
    const { user, signOut } = useAuth()
    const { data: dashboardData } = useDashboardData(user?.id)
    const activeStreak = dashboardData?.weeklyStreak || 0

    return (
        <header className="h-16 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-40 px-8 flex items-center justify-end">
            <div className="flex items-center gap-6">
                <ThemeToggle />
                {/* Streak Indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                    <Flame size={18} className="fill-orange-500" />
                    <span className="text-sm font-bold">{activeStreak} Day Streak</span>
                </div>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 rounded-xl hover:bg-gray-50 gap-2 border border-transparent hover:border-gray-100 px-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                <User size={16} />
                            </div>
                            <span className="text-sm font-bold text-gray-900 hidden md:inline-block">
                                {user?.user_metadata?.full_name || 'User'}
                            </span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-gray-100 shadow-xl">
                        <DropdownMenuLabel className="px-4 py-2">
                            <p className="text-xs font-bold text-gray-400 uppercase">My Account</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-50" />
                        <DropdownMenuItem className="rounded-lg px-4 py-2.5 cursor-pointer text-sm font-medium hover:bg-gray-50">
                            <User size={16} className="mr-2" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-50" />
                        <DropdownMenuItem
                            onClick={() => signOut()}
                            className="rounded-lg px-4 py-2.5 cursor-pointer text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50"
                        >
                            <LogOut size={16} className="mr-2" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

