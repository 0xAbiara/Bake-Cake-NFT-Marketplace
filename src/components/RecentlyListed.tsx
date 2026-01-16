import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useChainId } from "wagmi"
import NFTBox from "./NFTBox"
import Link from "next/link"
import { chainsToContracts } from "@/constants"

interface NFTItem {
    rindexerId: number
    seller: string
    nftAddress: string
    tokenId: string
    price: string
    blockNumber: number
    txHash: string
    contractAddress: string
}

interface BoughtCancelledItem {
    nftAddress: string
    tokenId: string
}

interface NFTQueryResponse {
    data: {
        allItemListeds: {
            nodes: NFTItem[]
        }
        allItemBoughts: {
            nodes: BoughtCancelledItem[]
        }
        allItemCanceleds: {
            nodes: BoughtCancelledItem[]
        }
    }
}

const GET_RECENT_NFTS = `
query AllItemListeds($contractAddress: String!) {
  allItemListeds(
    first: 20, 
    orderBy: [BLOCK_NUMBER_DESC, TX_INDEX_DESC],
    filter: { contractAddress: { equalTo: $contractAddress } }
  ) {
    nodes {
      rindexerId
      seller
      nftAddress
      price
      tokenId
      contractAddress
      txHash
      blockNumber
    }
  }

  allItemCanceleds(filter: { contractAddress: { equalTo: $contractAddress } }) {
    nodes {
      nftAddress
      tokenId
    }
  }

  allItemBoughts(filter: { contractAddress: { equalTo: $contractAddress } }) {
    nodes {
      tokenId
      nftAddress
    }
  }
}`

async function fetchNFTs(contractAddress: string): Promise<NFTQueryResponse> {
    const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: GET_RECENT_NFTS,
            variables: {
                contractAddress: contractAddress.toLowerCase(),
            },
        }),
    })

    if (!response.ok) {
        throw new Error("Network response was not ok")
    }

    return response.json()
}

function useRecentlyListedNFTs() {
    const chainId = useChainId()
    const contractAddress = chainsToContracts[chainId]?.nftMarketplace

    const { data, isLoading, error } = useQuery<NFTQueryResponse>({
        queryKey: ["recentNFTs", chainId, contractAddress],
        queryFn: () => fetchNFTs(contractAddress),
        enabled: !!contractAddress,
    })

    const nftDataList = useMemo(() => {
        if (!data) return []

        const boughtNFTs = new Set<string>()
        const canceledNFTs = new Set<string>()

        data.data.allItemBoughts.nodes.forEach(item => {
            if (item.nftAddress && item.tokenId) {
                boughtNFTs.add(`${item.nftAddress}-${item.tokenId}`)
            }
        })

        data.data.allItemCanceleds.nodes.forEach(item => {
            if (item.nftAddress && item.tokenId) {
                canceledNFTs.add(`${item.nftAddress}-${item.tokenId}`)
            }
        })

        const availableNFTs = data.data.allItemListeds.nodes.filter(item => {
            if (!item.nftAddress || !item.tokenId) return false
            const key = `${item.nftAddress}-${item.tokenId}`
            return !boughtNFTs.has(key) && !canceledNFTs.has(key)
        })

        const recentNFTs = availableNFTs.slice(0, 100)

        return recentNFTs.map(nft => ({
            tokenId: nft.tokenId,
            contractAddress: nft.nftAddress,
            price: nft.price,
        }))
    }, [data])

    return { isLoading, error, nftDataList, chainId, contractAddress }
}

export default function RecentlyListedNFTs() {
    const { isLoading, error, nftDataList, chainId, contractAddress } = useRecentlyListedNFTs()
    const [hoveredCard, setHoveredCard] = useState<string | null>(null)

    if (!contractAddress) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-center shadow-xl">
                    <p className="text-white text-xl font-bold">
                        ⚠️ NFT Marketplace not available on this network
                    </p>
                    <p className="text-white/90 mt-2">Please switch to Anvil or Sepolia</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-6 text-xl font-semibold text-gray-700 animate-pulse">
                        Loading amazing NFTs...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center">
                    <p className="text-red-600 text-lg font-semibold">❌ Oops! Something went wrong</p>
                    <p className="text-red-500 mt-2">{error.message}</p>
                </div>
            </div>
        )
    }

    const networkName = chainId === 31337 ? "Anvil" : chainId === 11155111 ? "Sepolia" : `Chain ${chainId}`
    const networkEmoji = chainId === 31337 ? "⚒️" : chainId === 11155111 ? "🧪" : "🔗"

    return (
        <div className="container mx-auto px-4 py-8 relative">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Header Section with Animation */}
            <div className="text-center mb-12 animate-fade-in-down">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    ✨ Recently Listed NFTs
                </h2>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-full shadow-lg border-2 border-blue-200 transform hover:scale-105 transition-transform">
                    <span className="text-2xl">{networkEmoji}</span>
                    <span className="text-lg font-semibold text-gray-700">{networkName}</span>
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                </div>
            </div>

            {/* List Your NFT Button - More Prominent */}
            <div className="text-center mb-12 animate-fade-in-up">
                <Link
                    href="/list-nft"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                >
                    <span className="text-2xl">🎨</span>
                    <span>List Your NFT</span>
                    <svg 
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </Link>
            </div>

            {/* NFT Grid with Staggered Animation */}
            {nftDataList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {nftDataList.map((nft, index) => (
                        <Link
                            key={`${nft.contractAddress}-${nft.tokenId}`}
                            href={`/buy-nft/${nft.contractAddress}/${nft.tokenId}`}
                            className="block"
                            onMouseEnter={() => setHoveredCard(`${nft.contractAddress}-${nft.tokenId}`)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
                            }}
                        >
                            <div className={`transform transition-all duration-300 ${
                                hoveredCard === `${nft.contractAddress}-${nft.tokenId}` 
                                    ? 'scale-110 -translate-y-2 rotate-1 z-10' 
                                    : 'hover:scale-105'
                            }`}>
                                <NFTBox
                                    tokenId={nft.tokenId}
                                    contractAddress={nft.contractAddress}
                                    price={nft.price}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 animate-fade-in">
                    <div className="inline-block p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg">
                        <p className="text-6xl mb-4">🎨</p>
                        <p className="text-2xl font-bold text-gray-700 mb-2">No NFTs Listed Yet</p>
                        <p className="text-gray-500 mb-6">Be the first to list an NFT on {networkName}!</p>
                        <Link
                            href="/list-nft"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg"
                        >
                            <span>🚀</span>
                            <span>List Now</span>
                        </Link>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
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
                    animation: fade-in-down 0.8s ease-out;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out 0.2s both;
                }

                .animate-fade-in {
                    animation: fadeInUp 0.8s ease-out;
                }
            `}</style>
        </div>
    )
}