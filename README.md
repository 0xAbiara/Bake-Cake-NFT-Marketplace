# NFT Marketplace - Full Stack Web3 Application

A production-ready, full-stack NFT marketplace deployed on Sepolia testnet. Built with Next.js, TypeScript, Solidity, and deployed on Render. This marketplace enables users to list, buy, and trade NFTs with real-time blockchain indexing.

## 🌟 Live Demo

- **Frontend**: https://bake-cake-nftmarketplace.netlify.app/
- **Indexer API**: https://nft-marketplace-indexer.onrender.com
- **Blockchain Network**: Sepolia Testnet
- **Smart Contract**: `0x79adCA9feB6bB753d7928731aba8529beCd3ED94`

## 🚀 Features

- **NFT Minting**: Create and mint new NFTs directly from the interface
- **NFT Listing**: List your NFTs for sale with custom pricing
- **NFT Trading**: Buy and sell NFTs seamlessly on the marketplace
- **Real-time Indexing**: Blockchain events indexed using rindexer for instant updates
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets via WalletConnect
- **Responsive Design**: Mobile-friendly interface built with modern UI components
- **Production Deployment**: Fully deployed backend indexer on Render with PostgreSQL

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework for production
- **TypeScript** - Type-safe development
- **Wagmi** - React hooks for Ethereum
- **TailwindCSS** - Utility-first CSS framework
- **WalletConnect** - Multi-wallet support

### Backend
- **Solidity** - Smart contract development
- **Hardhat/Foundry** - Smart contract deployment
- **rindexer** - Blockchain event indexing
- **PostgreSQL** - Database for indexed data
- **GraphQL** - API for querying indexed events

### Deployment
- **Render** - Backend indexer hosting
- **Vercel/Render** - Frontend hosting
- **Sepolia** - Ethereum testnet

## 📋 Prerequisites

Before running this project, ensure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) browser extension
- Sepolia testnet ETH ([faucet](https://sepoliafaucet.com/))

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# GraphQL API URL (your deployed Render indexer URL)
GRAPHQL_API_URL=https://your-indexer-url.onrender.com/graphql

# Sepolia RPC URL (get from https://www.alchemy.com/)
NEXT_PUBLIC_SEPOLIA_RPC_URL=your_alchemy_sepolia_rpc_url

# Smart Contract Address
NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=0x79adCA9feB6bB753d7928731aba8529beCd3ED94

# Optional: Compliance features
ENABLE_COMPLIANCE_CHECK=false
CIRCLE_API_KEY=your_circle_api_key
```

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/0xAbiara/NFT-Marketplace.git
cd NFT-Marketplace
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. **Run the development server**
```bash
pnpm dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🌐 Deployment

### Backend Indexer (Render)

The blockchain indexer is deployed on Render and continuously syncs events from the Sepolia blockchain.

**Environment Variables on Render:**
- `DATABASE_URL` - PostgreSQL connection string
- `SEPOLIA_RPC_URL` - Alchemy/Infura Sepolia RPC endpoint
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` - Database credentials

**Docker Command:**
```bash
rindexer start all
```

### Frontend Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xAbiara/NFT-Marketplace)

Or deploy manually:
```bash
pnpm build
pnpm start
```

## 🎯 How to Use

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the navigation
   - Select MetaMask or your preferred wallet
   - Switch to Sepolia testnet

2. **Get Test ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Request test ETH for transactions

3. **Mint an NFT** (if available)
   - Navigate to the Mint page
   - Upload your image and metadata
   - Pay gas fees to mint

4. **List Your NFT**
   - Go to "My NFTs"
   - Click "List for Sale"
   - Set your price and confirm

5. **Buy NFTs**
   - Browse the marketplace
   - Click on any listed NFT
   - Click "Buy" and confirm the transaction

## 📊 Project Structure

```
NFT-Marketplace/
├── marketplaceIndexer/      # Blockchain indexer
│   ├── rindexer.yaml       # Indexer configuration
│   ├── abis/               # Contract ABIs
│   └── Dockerfile          # Docker config for Render
├── src/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── constants.ts        # Contract addresses & configs
├── public/                 # Static assets
└── package.json
```

## 🔐 Smart Contracts

**Network**: Sepolia Testnet  
**Contract Address**: `0x79adCA9feB6bB753d7928731aba8529beCd3ED94`  
**Start Block**: `9711451`

**Events Indexed:**
- `ItemListed` - When an NFT is listed for sale
- `ItemBought` - When an NFT is purchased
- `ItemCanceled` - When a listing is canceled

## 🐛 Troubleshooting

**Issue**: Transactions failing
- **Solution**: Ensure you have enough Sepolia ETH for gas fees

**Issue**: NFTs not showing up
- **Solution**: Wait for the indexer to sync (check Render logs)

**Issue**: Wallet not connecting
- **Solution**: Make sure you're on Sepolia testnet in MetaMask

**Issue**: GraphQL errors
- **Solution
