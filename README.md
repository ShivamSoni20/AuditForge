# 🔨 AuditForge

> **Forging Secure Smart Contracts with AI**

AI-powered smart contract security auditor specialized for **DePIN** and **NodeOps** ecosystems.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

## ✨ Features

- 🤖 **AI-Powered Analysis** - GPT-4o integration for intelligent vulnerability detection
- 💬 **AI Chat Interface** - Conversational contract analysis with natural language
- 🔍 **Multi-Layer Scanning** - AI + Static + DePIN-specific checks
- ⚡ **Fast Results** - Complete audits in under 60 seconds
- 🌐 **DePIN Specialized** - Node operator risks, staking, slashing mechanisms
- 🔨 **Code Correction** - AI-powered automatic vulnerability fixes
- 📊 **PDF Reports** - Professional downloadable audit reports
- 🔧 **Multi-Language** - Solidity and Rust support
- 🔗 **Etherscan Integration** - Fetch and audit verified contracts from 8+ EVM chains

## 🚀 Quick Start

```bash
# Install dependencies
npm run install-all

# Configure (optional)
cd backend
cp .env.example .env
# Add AIML_API_KEY to .env

# Start application
npm run dev
```

Open http://localhost:3000

## 🔧 Configuration

Add to `backend/.env`:

```env
AIML_API_KEY=your_aiml_api_key_here
AIML_BASE_URL=https://api.aimlapi.com/v1

# Etherscan API (for contract fetching)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
ETHERSCAN_BASE_URL=https://api.etherscan.io/api
```

Get API keys from:
- [aimlapi.com](https://aimlapi.com/) - For AI analysis
- [etherscan.io/apis](https://etherscan.io/apis) - For contract fetching (optional)

## 📁 Structure

```
├── backend/          # Node.js API
│   ├── services/     # Audit engine, AI, analyzers
│   └── server.js
├── frontend/         # React UI
│   └── src/
└── package.json
```

## 🎯 Usage

### Landing Page
1. Open http://localhost:3000 to view the landing page
2. Explore MVP features and documentation
3. Click "Launch App" to start auditing

### Audit Interface
1. Navigate to http://localhost:3000/app
2. Choose your preferred method:

   **🔨 Traditional Audit:**
   - **Option A - Manual Input:** Paste or upload contract code
   - **Option B - Etherscan Fetch:** Enter verified contract address
   - Click "Run Audit" and review results
   
   **💬 AI Chat Assistant:**
   - Click "AI Chat" tab
   - Paste contract address or upload file
   - Chat naturally: "Analyze this contract" or "Fix vulnerabilities"
   - Get instant analysis, explanations, and corrected code

3. Download PDF reports or fixed contracts
4. View audit history

## 🔐 Security Checks

- Reentrancy vulnerabilities
- Access control issues
- Integer overflow/underflow
- Unchecked external calls
- DePIN-specific risks
- Node operator security
- Staking/slashing mechanisms

## 📊 Tech Stack

**Frontend:** React, Vite, TailwindCSS  
**Backend:** Node.js, Express, AIML API, PDFKit

## 🚀 Deployment

### Option 1: Railway (Recommended)

**Easiest full-stack deployment**:
1. Go to https://railway.app
2. Connect your GitHub repo
3. Railway auto-deploys both frontend & backend
4. Add `AIML_API_KEY` in environment variables

### Option 2: Docker / NodeOps

**Deploy with Docker**:
```bash
docker run -d \
  --name auditforge \
  -p 3000:3000 \
  -p 3001:3001 \
  -e AIML_API_KEY=your_key \
  shivamsoni20/auditforge:latest
```

**NodeOps Template**: Available on NodeOps Marketplace  
**Docker Hub**: https://hub.docker.com/r/shivamsoni20/auditforge  
**Config**: See `nodeops-config.yaml` for NodeOps deployment

### Option 3: Vercel (Frontend Only)

If deploying to Vercel:
1. Deploy backend separately (Railway/Render)
2. Set `VITE_API_URL` in Vercel environment variables
3. Point to your backend URL

## 📄 License

MIT License

---

**Built for DePIN/Web3 Hackers, Node Operators & DevOps Engineers**
