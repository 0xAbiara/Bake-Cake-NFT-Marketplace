// app/buy-nft/[contractAddress]/[tokenId]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    useAccount,
    useChainId,
    useWriteContract,
    useReadContract,
    useWaitForTransactionReceipt,
} from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { chainsToContracts, erc20Abi, marketplaceAbi } from "@/constants"
import NFTBox from "@/components/NFTBox"

export default function BuyNftPage() {
    const router = useRouter()
    const { contractAddress, tokenId } = useParams() as {
        contractAddress: string
        tokenId: string
    }
    const { address } = useAccount()
    const chainId = useChainId()

    const marketplaceAddress =
        (chainsToContracts[chainId]?.nftMarketplace as `0x${string}`) || "0x"
    const usdcAddress = (chainsToContracts[chainId]?.usdc as `0x${string}`) || "0x"

    const [step, setStep] = useState(1) // 1: Preview, 2: Approval, 3: Purchase

    interface Listing {
        price: bigint
        seller: string
    }

    // Get the listing details
    const { data: listingData, isLoading: isListingLoading } = useReadContract({
        abi: marketplaceAbi,
        address: marketplaceAddress,
        functionName: "getListing",
        args: [contractAddress as `0x${string}`, BigInt(tokenId)],
    })

    // Destructure listing data if available
    const listing = listingData as Listing | undefined
    const price = listing ? listing.price.toString() : "0"
    const seller = listing ? listing.seller : undefined

    // For token approval
    const {
        data: approvalHash,
        isPending: isApprovalPending,
        writeContract: approveToken,
        error: approvalError,
    } = useWriteContract()

    // For buying NFT
    const {
        data: purchaseHash,
        isPending: isPurchasePending,
        writeContract: buyNft,
        error: purchaseError,
    } = useWriteContract()

    // Transaction receipts
    const { isSuccess: isApprovalSuccess } = useWaitForTransactionReceipt({
        hash: approvalHash,
    })

    const { isSuccess: isPurchaseSuccess } = useWaitForTransactionReceipt({
        hash: purchaseHash,
    })

    // Check if NFT is actually listed (price > 0)
    const isListed = price && BigInt(price) > BigInt(0)

    // Handle approve token
    const handleApprove = async () => {
        if (!price) return

        try {
            await approveToken({
                abi: erc20Abi,
                address: usdcAddress,
                functionName: "approve",
                args: [marketplaceAddress, BigInt(price)],
            })
            setStep(2)
        } catch (error) {
            console.error("Error approving token:", error)
        }
    }

    // Handle buy NFT
    const handleBuy = async () => {
        try {
            await buyNft({
                abi: marketplaceAbi,
                address: marketplaceAddress,
                functionName: "buyItem",
                args: [contractAddress as `0x${string}`, BigInt(tokenId)],
            })
            setStep(3)
        } catch (error) {
            console.error("Error buying NFT:", error)
        }
    }

    // Redirect to home if purchase is successful
    useEffect(() => {
        if (step === 3 && isPurchaseSuccess) {
            const timer = setTimeout(() => {
                router.push("/")
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [step, isPurchaseSuccess, router])

    // Check if the current user is the seller
    const isSeller = seller === address

    const chainSupported =
        chainId in chainsToContracts && chainsToContracts[chainId]?.nftMarketplace !== undefined

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-blue-50 to-purple-50 flex flex-col relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Animated Title */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
                            Buy NFT
                        </h1>
                        <div className="flex justify-center gap-2 mt-4">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>

                    {!address ? (
                        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-white text-center transform hover:scale-105 transition-all duration-300">
                            <div className="mb-4 text-6xl animate-bounce">🔐</div>
                            <p className="text-lg text-zinc-600 mb-6 font-medium">
                                Connect your wallet to purchase this NFT
                            </p>
                            <div className="flex justify-center">
                                <ConnectButton />
                            </div>
                        </div>
                    ) : !chainSupported ? (
                        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-red-200 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="mb-4 text-6xl animate-pulse">⚠️</div>
                            <p className="text-lg text-red-600 mb-6 font-medium">
                                The current network is not supported. Please switch to a supported network.
                            </p>
                            <div className="flex justify-center">
                                <ConnectButton />
                            </div>
                        </div>
                    ) : isListingLoading ? (
                        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-white text-center">
                            <div className="mb-4 text-6xl animate-spin">⏳</div>
                            <p className="text-lg text-zinc-600 font-medium">Loading NFT details...</p>
                        </div>
                    ) : !isListed ? (
                        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-orange-200 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="mb-4 text-6xl">😢</div>
                            <p className="text-lg text-red-600 mb-6 font-medium">
                                This NFT is not currently listed for sale.
                            </p>
                            <button
                                onClick={() => router.push("/")}
                                className="relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                                <div className="relative py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transform group-hover:scale-105 transition-all duration-300">
                                    Back to Home
                                </div>
                            </button>
                        </div>
                    ) : isSeller ? (
                        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-yellow-200 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="mb-4 text-6xl">🎨</div>
                            <p className="text-lg text-orange-600 mb-6 font-medium">
                                You are the seller of this NFT.
                            </p>
                            <button
                                onClick={() => router.push("/")}
                                className="relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                                <div className="relative py-3 px-6 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg font-semibold transform group-hover:scale-105 transition-all duration-300">
                                    Back to Home
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white p-8 transform hover:shadow-3xl transition-all duration-300">
                            {step === 1 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        🎯 NFT Details
                                    </h2>

                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3 transform hover:scale-105 transition-transform duration-300">
                                            <NFTBox
                                                tokenId={tokenId}
                                                contractAddress={contractAddress}
                                                price={price}
                                            />
                                        </div>

                                        <div className="md:w-2/3 space-y-6">
                                            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                                                <h3 className="text-sm font-bold text-blue-600 mb-2">
                                                    📝 Contract Address
                                                </h3>
                                                <p className="text-sm text-gray-900 break-all font-mono">
                                                    {contractAddress}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                                <h3 className="text-sm font-bold text-purple-600 mb-2">
                                                    🎫 Token ID
                                                </h3>
                                                <p className="text-sm text-gray-900 font-mono">
                                                    {tokenId}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl">
                                                <h3 className="text-sm font-bold text-pink-600 mb-2">
                                                    👤 Seller
                                                </h3>
                                                <p className="text-sm text-gray-900 break-all font-mono">
                                                    {seller}
                                                </p>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handleApprove}
                                                    disabled={isApprovalPending}
                                                    className="relative w-full group"
                                                >
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500 animate-gradient-xy"></div>
                                                    <div className="relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                                        {isApprovalPending ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <span className="animate-spin">⏳</span>
                                                                Approving...
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <span>✅</span>
                                                                Approve Payment Token
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>

                                                {approvalError && (
                                                    <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl mt-4 animate-shake">
                                                        <span className="font-bold">❌ Error:</span> {approvalError.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                        🎉 Complete Purchase
                                    </h2>

                                    {isApprovalSuccess ? (
                                        <>
                                            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 text-green-700 rounded-xl animate-bounce-once">
                                                <span className="text-2xl mr-2">✅</span>
                                                <span className="font-bold">Payment token approved!</span> You can now complete the purchase.
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-8">
                                                <div className="md:w-1/3 transform hover:scale-105 transition-transform duration-300">
                                                    <NFTBox
                                                        tokenId={tokenId}
                                                        contractAddress={contractAddress}
                                                        price={price}
                                                    />
                                                </div>

                                                <div className="md:w-2/3 space-y-4">
                                                    <button
                                                        onClick={handleBuy}
                                                        disabled={isPurchasePending}
                                                        className="relative w-full group"
                                                    >
                                                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500 animate-gradient-xy"></div>
                                                        <div className="relative w-full py-4 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                                            {isPurchasePending ? (
                                                                <span className="flex items-center justify-center gap-2">
                                                                    <span className="animate-spin">⏳</span>
                                                                    Processing...
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center justify-center gap-2">
                                                                    <span className="text-2xl">🛒</span>
                                                                    Buy Now
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>

                                                    {purchaseError && (
                                                        <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl animate-shake">
                                                            <span className="font-bold">❌ Error:</span> {purchaseError.message}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-6 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-xl flex items-center gap-4">
                                            <span className="text-3xl animate-spin">⏳</span>
                                            <span>Waiting for approval transaction to be confirmed...</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-fade-in-up text-center">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        🎊 Purchase Complete!
                                    </h2>

                                    {isPurchaseSuccess ? (
                                        <>
                                            <div className="p-6 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 text-green-700 rounded-xl">
                                                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                                                <p className="font-bold text-lg">
                                                    Congratulations! You have successfully purchased this NFT.
                                                </p>
                                                <p className="text-sm mt-2">
                                                    You will be redirected to the homepage in a few seconds.
                                                </p>
                                            </div>

                                            <div className="mx-auto w-64 transform hover:scale-110 transition-transform duration-300">
                                                <NFTBox
                                                    tokenId={tokenId}
                                                    contractAddress={contractAddress}
                                                    price={price}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-6 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-xl flex flex-col items-center gap-4">
                                            <span className="text-6xl animate-spin">⏳</span>
                                            <span className="font-medium">Waiting for purchase transaction to be confirmed...</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-white/80 backdrop-blur-sm border-t-2 border-zinc-200 py-6 relative z-10">
                <div className="container mx-auto px-4">
                    <p className="text-center text-zinc-600 text-sm font-medium">
                        NFT Marketplace • Built with 💙 Next.js, Wagmi, and Rainbow Kit
                    </p>
                </div>
            </footer>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes gradient-xy {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }

                @keyframes bounce-once {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
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

                .animate-fade-in {
                    animation: fade-in 0.8s ease-in;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }

                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 3s ease infinite;
                }

                .animate-shake {
                    animation: shake 0.5s ease;
                }

                .animate-bounce-once {
                    animation: bounce-once 0.6s ease;
                }
            `}</style>
        </div>
    )
}
