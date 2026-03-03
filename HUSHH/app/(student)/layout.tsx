'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, FileText, BookOpen, GraduationCap, MessageCircleQuestion, X, Loader2, Users, Building2 } from 'lucide-react'
import { useState } from 'react'
import { TopNav } from '@/components/student/top-nav'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const [isAgentOpen, setIsAgentOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your localized AI Placement Assistant. What doubts do you have about your technical rounds?" }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMsg = inputMessage
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInputMessage("")
    setIsChatLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "No response generated." }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Failed to connect to the local Ollama backend." }])
    } finally {
      setIsChatLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 font-medium">Loading...</p>
      </div>
    )
  }

  if (!user) return null


  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Prepare Wizard', href: '/prepare', icon: BookOpen },
    { name: 'Resume Optimizer', href: '/resume-analyzer', icon: FileText },
    { name: 'Mock Interview', href: '/assessment', icon: FileText },
    { name: 'Practice', href: '/learning-path', icon: BookOpen },
    { name: 'Company Hub', href: '/company-hub', icon: Building2 },
    { name: 'Contests', href: '/contests', icon: GraduationCap },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Growth Card', href: '/growth-card', icon: FileText },
  ]

  return (
    <div className="flex h-screen bg-white font-sans">
      {}
      <aside className="w-64 bg-[#2a1780] flex flex-col h-full shrink-0">
        <div className="p-8 flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-lg">
            <GraduationCap className="h-6 w-6 text-[#5034ff]" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">PlacementHub</h1>
        </div>

        <nav className="px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                  ? 'bg-white text-[#5034ff] shadow-lg'
                  : 'text-indigo-100/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <item.icon size={18} className={isActive ? 'text-[#5034ff]' : 'text-indigo-200'} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto bg-white">
          {children}
        </main>
      </div>

      {}
      <button
        onClick={() => setIsAgentOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#5034ff] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <MessageCircleQuestion className="h-8 w-8" />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask Doubt Agent
        </span>
      </button>

      {}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col ${isAgentOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageCircleQuestion className="h-5 w-5 text-[#5034ff]" />
            Doubt Agent
          </h3>
          <button onClick={() => setIsAgentOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#5034ff] text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex items-start">
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-sm">
                <Loader2 className="h-5 w-5 text-[#5034ff] animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 shrink-0 bg-white">
          <div className="flex gap-2">
            <Input
              placeholder="Type your doubt..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="rounded-xl flex-1 focus-visible:ring-[#5034ff]"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isChatLoading || !inputMessage.trim()}
              className="bg-[#5034ff] hover:bg-[#3d1fca] rounded-xl font-bold px-6"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
