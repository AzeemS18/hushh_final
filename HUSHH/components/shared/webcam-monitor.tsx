'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, AlertCircle } from 'lucide-react'

export function WebcamMonitor() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isActive, setIsActive] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let stream: MediaStream | null = null

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    setIsActive(true)
                }
            } catch (err) {
                console.error('Error accessing webcam:', err)
                setError('Webcam Access Required')
            }
        }

        startCamera()

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    return (
        <div className="fixed bottom-24 right-6 w-48 h-36 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-40 group">
            {!isActive && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="animate-pulse text-indigo-400">
                        <Camera className="w-8 h-8" />
                    </div>
                </div>
            )}

            {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/10 backdrop-blur-sm p-4 text-center">
                    <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter leading-tight">{error}</span>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover grayscale brightness-110"
                />
            )}

            <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 rounded text-[8px] font-black text-white uppercase tracking-widest animate-pulse">
                Live Proctoring
            </div>

            <div className="absolute inset-0 border-2 border-white/10 pointer-events-none rounded-2xl"></div>
        </div>
    )
}
