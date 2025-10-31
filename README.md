# 🔨 AuditForge

> **Forging Secure Smart Contracts with AI**

AI-powered smart contract security auditor specialized for **DePIN** and **NodeOps** ecosystems.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

## ✨ Features

- 🤖 **AI-Powered Analysis** - GPT-4o integration for intelligent vulnerability detection
- 🔍 **Multi-Layer Scanning** - AI + Static + DePIN-specific checks
- ⚡ **Fast Results** - Complete audits in under 60 seconds
- 🌐 **DePIN Specialized** - Node operator risks, staking, slashing mechanisms
- 🔨 **Code Correction** - AI-powered automatic vulnerability fixes
- 📊 **PDF Reports** - Professional downloadable audit reports
- 🔧 **Multi-Language** - Solidity and Rust support

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
```

Get API key from [aimlapi.com](https://aimlapi.com/)

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

1. Open http://localhost:3000
2. Paste or upload contract
3. Select language (Solidity/Rust)
4. Click "Run Audit"
5. Review results & download PDF

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

## 📄 License

MIT License

---

**Built for DePIN/Web3 Hackers, Node Operators & DevOps Engineers**
