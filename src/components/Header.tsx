"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { FaGithub } from "react-icons/fa"

function CustomLogo() {
    return (
        <div className="relative w-12 h-12">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-md opacity-60 animate-pulse"></div>
            
            {/* Main logo */}
            <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12">
                {/* NFT Frame */}
                <div className="absolute inset-2 border-2 border-white/50 rounded-lg"></div>
                
                {/* Diamond/Gem in center */}
                <div className="w-5 h-5 bg-white transform rotate-45 shadow-inner"></div>
                
                {/* Sparkle effects */}
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping"></div>
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
        </div>
    )
}

export default function Header() {
    return (
        <nav
            className="px-8 py-5 border-b-2 border-zinc-200 flex flex-row justify-between items-center xl:min-h-[85px] shadow-sm"
            style={{ backgroundColor: "#f7eed8" }}
        >
            <div className="flex items-center gap-2.5 md:gap-6">
                <a href="/" className="flex items-center gap-3 text-zinc-800 group">
                    <CustomLogo />
                    <h1 className="font-bold text-2xl hidden md:block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                        NFT Marketplace
                    </h1>
                </a>
                
                {/* GitHub Icon - No Box */}
                <a
                    href="https://github.com/0xAbiara/NFT-Marketplace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:block group relative"
                >
                    <div className="absolute inset-0 bg-zinc-900 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <FaGithub className="h-7 w-7 text-zinc-900 relative z-10 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 cursor-pointer" />
                </a>
            </div>
            
            <h3 className="italic text-left hidden text-zinc-500 lg:block animate-fade-in text-base">
                A non-custodial, permissionless NFT Marketplace
            </h3>
            
            {/* Cake NFT Button with Animation */}
            <a 
                href="/cake-nft" 
                className="relative group"
            >
                {/* Animated background gradient */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-gradient-xy"></div>
                
                <div className="relative flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-50 to-yellow-50 text-zinc-800 rounded-lg font-semibold shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-pink-200 group-hover:border-pink-300 transform group-hover:scale-105">
                    <span className="text-xl group-hover:animate-bounce">🍰</span>
                    <span className="group-hover:text-pink-600 transition-colors">Cake NFT</span>
                </div>
            </a>
            
            {/* Connect Wallet Button Container */}
            <div className="relative group">
                {/* Animated glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500 animate-gradient-xy"></div>
                
                <div className="relative transform transition-transform duration-300 group-hover:scale-105">
                    <ConnectButton />
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes gradient-xy {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-in;
                }

                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 3s ease infinite;
                }
            `}</style>
        </nav>
    )
}