// components/ListNftForm.tsx
"use client"

import { useState } from "react"
import {
    useAccount,
    useChainId,
    useWriteContract,
    useReadContract,
    useWaitForTransactionReceipt,
} from "wagmi"
import { parseEther } from "viem"
import { chainsToContracts, nftAbi, marketplaceAbi } from "@/constants"
import NFTBox from "@/components/NFTBox"
import { addDecimalsToPrice } from "../utils/formatPrice"

export default function ListNftForm() {
    const { address } = useAccount()
    const chainId = useChainId()
    const marketplaceAddress =
        (chainsToContracts[chainId]?.nftMarketplace as `0x${string}`) || "0x"

    const [nftAddress, setNftAddress] = useState("")
    const [tokenId, setTokenId] = useState("")
    const [price, setPrice] = useState("")
    const [step, setStep] = useState(1) // 1: Form Input, 2: Preview, 3: Approval, 4: Listing

    // For NFT owner verification
    const { data: ownerData } = useReadContract({
        abi: nftAbi,
        address: nftAddress as `0x${string}`,
        functionName: "ownerOf",
        args: tokenId ? [BigInt(tokenId)] : undefined,
    })

    // For NFT approval
    const {
        data: approvalHash,
        isPending: isApprovalPending,
        writeContract: approveNft,
        error: approvalError,
    } = useWriteContract()

    // For listing NFT
    const {
        data: listingHash,
        isPending: isListingPending,
        writeContract: listNft,
        error: listingError,
    } = useWriteContract()

    // Transaction receipts
    const { isSuccess: isApprovalSuccess } = useWaitForTransactionReceipt({
        hash: approvalHash,
    })

    const { isSuccess: isListingSuccess } = useWaitForTransactionReceipt({
        hash: listingHash,
    })

    // Check if user owns the NFT
    const isOwner = ownerData === address

    if (ownerData && price) {
        if (!isOwner) {
            console.log("You are not the owner, the owner is: ", ownerData)
        } else {
            console.log("You are the owner")
        }
    }

    // Handle form submission to proceed to preview
    const handlePreview = (e: React.FormEvent) => {
        e.preventDefault()
        if (nftAddress && tokenId && price) {
            setStep(2)
        }
    }

    // Handle approve NFT for marketplace
    const handleApprove = async () => {
        if (!nftAddress || !tokenId) return

        try {
            await approveNft({
                abi: nftAbi,
                address: nftAddress as `0x${string}`,
                functionName: "approve",
                args: [marketplaceAddress, BigInt(tokenId)],
            })
            setStep(3)
        } catch (error) {
            console.error("Error approving NFT:", error)
        }
    }

    // Handle list NFT
    const handleList = async () => {
        if (!nftAddress || !tokenId || !price) return

        try {
            const formattedPrice = addDecimalsToPrice(price)
            await listNft({
                abi: marketplaceAbi,
                address: marketplaceAddress,
                functionName: "listItem",
                args: [nftAddress as `0x${string}`, BigInt(tokenId), formattedPrice],
            })
            setStep(4)
        } catch (error) {
            console.error("Error listing NFT:", error)
        }
    }

    return (
        <div className="relative">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 -z-10">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8 animate-fade-in-down">
                <div className="flex items-center justify-center gap-4">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-500 ${
                                step >= s 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                                    : 'bg-gray-200 text-gray-500'
                            }`}>
                                {s}
                            </div>
                            {s < 4 && (
                                <div className={`w-16 h-1 mx-2 transition-all duration-500 ${
                                    step > s ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                                }`}></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-16 mt-4 text-sm font-semibold">
                    <span className={step >= 1 ? 'text-blue-600' : 'text-gray-400'}>Details</span>
                    <span className={step >= 2 ? 'text-blue-600' : 'text-gray-400'}>Preview</span>
                    <span className={step >= 3 ? 'text-blue-600' : 'text-gray-400'}>Approve</span>
                    <span className={step >= 4 ? 'text-blue-600' : 'text-gray-400'}>Listed</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-8 relative overflow-hidden animate-fade-in-up">
                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 opacity-10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400 to-yellow-400 opacity-10 rounded-tr-full"></div>

                {step === 1 && (
                    <div className="space-y-6 animate-slide-in">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                🎨 List Your NFT
                            </h2>
                            <p className="text-gray-500">Fill in the details to get started</p>
                        </div>

                        <form onSubmit={handlePreview} className="space-y-6">
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-lg">📜</span>
                                    NFT Contract Address
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-gray-900 transition-all duration-300 group-hover:border-gray-300"
                                    placeholder="0x..."
                                    value={nftAddress}
                                    onChange={e => setNftAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-lg">🔢</span>
                                    Token ID
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-gray-900 transition-all duration-300 group-hover:border-gray-300"
                                    placeholder="1"
                                    value={tokenId}
                                    onChange={e => setTokenId(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-lg">💰</span>
                                    Price (USDC)
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-gray-900 transition-all duration-300 group-hover:border-gray-300"
                                    placeholder="0.1"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Preview Listing
                                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-slide-in">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                👀 Preview Your Listing
                            </h2>
                            <p className="text-gray-500">Make sure everything looks good!</p>
                        </div>

                        {!isOwner ? (
                            <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-2xl border-2 border-red-200 shadow-lg animate-shake">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">⚠️</span>
                                    <div>
                                        <p className="font-bold">Ownership Error</p>
                                        <p className="text-sm">You don&apos;t own this NFT. Please check the contract address and token ID.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
                                        <div className="relative">
                                            <NFTBox
                                                tokenId={tokenId}
                                                contractAddress={nftAddress}
                                                price={addDecimalsToPrice(price)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 px-6 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 hover:scale-105"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="group relative flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg transform hover:scale-105 transition-all duration-300"
                                        disabled={isApprovalPending}
                                    >
                                        {isApprovalPending ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Approving...
                                            </span>
                                        ) : (
                                            "✅ Approve NFT"
                                        )}
                                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                    </button>
                                </div>

                                {approvalError && (
                                    <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl mt-4 animate-shake">
                                        <p className="font-semibold">❌ Error</p>
                                        <p className="text-sm">{approvalError.message}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-slide-in">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                🚀 List Your NFT
                            </h2>
                            <p className="text-gray-500">One more step to go!</p>
                        </div>

                        {isApprovalSuccess ? (
                            <>
                                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-2xl border-2 border-green-200 shadow-lg animate-bounce-once">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">✅</span>
                                        <div>
                                            <p className="font-bold">Approval Successful!</p>
                                            <p className="text-sm">You can now list your NFT on the marketplace.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
                                        <div className="relative">
                                            <NFTBox
                                                tokenId={tokenId}
                                                contractAddress={nftAddress}
                                                price={addDecimalsToPrice(price)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleList}
                                    className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                                    disabled={isListingPending}
                                >
                                    {isListingPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Listing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            🎉 List NFT for Sale
                                        </span>
                                    )}
                                    <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                </button>

                                {listingError && (
                                    <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl mt-4 animate-shake">
                                        <p className="font-semibold">❌ Error</p>
                                        <p className="text-sm">{listingError.message}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-2xl border-2 border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <div>
                                        <p className="font-bold">Processing...</p>
                                        <p className="text-sm">Waiting for approval transaction to be confirmed.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-8 animate-slide-in">
                        <div className="text-center">
                            <div className="inline-block mb-4 animate-bounce">
                                <span className="text-7xl">🎉</span>
                            </div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                                NFT Listed Successfully!
                            </h2>
                            <p className="text-gray-500">Your NFT is now available on the marketplace</p>
                        </div>

                        {isListingSuccess ? (
                            <>
                                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-2xl border-2 border-green-200 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">✨</span>
                                        <div>
                                            <p className="font-bold">Congratulations!</p>
                                            <p className="text-sm">Your NFT is now live and ready for buyers.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-2xl opacity-40 animate-pulse"></div>
                                        <div className="relative">
                                            <NFTBox
                                                tokenId={tokenId}
                                                contractAddress={nftAddress}
                                                price={addDecimalsToPrice(price)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setNftAddress("")
                                        setTokenId("")
                                        setPrice("")
                                        setStep(1)
                                    }}
                                    className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        🎨 List Another NFT
                                    </span>
                                    <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                </button>
                            </>
                        ) : (
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-2xl border-2 border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <div>
                                        <p className="font-bold">Almost there...</p>
                                        <p className="text-sm">Waiting for listing transaction to be confirmed.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
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

                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
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

                .animate-fade-in-down {
                    animation: fade-in-down 0.6s ease-out;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }

                .animate-slide-in {
                    animation: slide-in 0.5s ease-out;
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }

                .animate-bounce-once {
                    animation: bounce-once 0.6s ease-out;
                }
            `}</style>
        </div>
    )
}