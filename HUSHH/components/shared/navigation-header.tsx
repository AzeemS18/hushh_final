'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NavigationHeader() {
    const router = useRouter()

    return (
        <div className="flex items-center gap-2 mb-6 no-print">
            <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="h-9 w-9 rounded-xl border-gray-200 hover:border-[#5034ff] hover:text-[#5034ff] transition-all"
                title="Go Back"
            >
                <ChevronLeft size={20} />
            </Button>

            <Button
                variant="outline"
                size="icon"
                onClick={() => router.forward()}
                className="h-9 w-9 rounded-xl border-gray-200 hover:border-[#5034ff] hover:text-[#5034ff] transition-all"
                title="Go Forward"
            >
                <ChevronRight size={20} />
            </Button>

            <Button
                variant="outline"
                size="icon"
                onClick={() => router.push('/')}
                className="h-9 w-9 rounded-xl border-gray-200 hover:border-[#5034ff] hover:text-[#5034ff] transition-all ml-2"
                title="Home"
            >
                <Home size={18} />
            </Button>
        </div>
    )
}
