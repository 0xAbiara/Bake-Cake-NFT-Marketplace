"use client"

import { useAccount } from "wagmi"
import { useState, useEffect } from "react"
import RecentlyListedNFTs from "@/components/RecentlyListed"

function TypewriterText() {
    const [displayText, setDisplayText] = useState("")
    const fullText = "Please connect a wallet..."
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showCursor, setShowCursor] = useState(true)

    useEffect(() => {
        // Typewriter effect
        if (currentIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayText(fullText.slice(0, currentIndex + 1))
                setCurrentIndex(currentIndex + 1)
            }, 100)
            return () => clearTimeout(timeout)
        }
    }, [currentIndex])

    useEffect(() => {
        // Blinking cursor
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev)
        }, 500)
        return () => clearInterval(cursorInterval)
    }, [])

    return (
        <h2 className="text-4xl md:text-6xl font-bold italic text-center mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {displayText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
        </h2>
    )
}

export default function Home() {
    const { isConnected } = useAccount()

    return (
        <main>
            {!isConnected ? (
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 md:p-6 xl:p-8 relative overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Wallet Icon with Pulse */}
                        <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                            <svg 
                                className="w-32 h-32 text-blue-600 relative z-10 animate-bounce" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                                />
                            </svg>
                        </div>

                        {/* Typewriter Text */}
                        <TypewriterText />

                        {/* Subtitle with fade-in */}
                        <p className="text-gray-500 text-center text-lg mb-8 max-w-md animate-fade-in-up">
                            Connect your wallet to explore and trade NFTs on our marketplace
                        </p>

                        {/* Floating Elements */}
                        <div className="flex gap-6 items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>

                    <style jsx>{`
                        @keyframes blob {
                            0%, 100% {
                                transform: translate(0px, 0px) scale(1);
                            }
                            33% {
                                transform: translate(30px, -50px) scale(1.1);
                            }
                            66% {
                                transform: translate(-20px, 20px) scale(0.9);
                            }
                        }

                        @keyframes fade-in-up {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        .animate-blob {
                            animation: blob 7s infinite;
                        }

                        .animation-delay-2000 {
                            animation-delay: 2s;
                        }

                        .animation-delay-4000 {
                            animation-delay: 4s;
                        }

                        .animate-fade-in-up {
                            animation: fade-in-up 1s ease-out 1.5s both;
                        }
                    `}</style>
                </div>
            ) : (
                <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                    <RecentlyListedNFTs />
                </div>
            )}
        </main>
    )
}
