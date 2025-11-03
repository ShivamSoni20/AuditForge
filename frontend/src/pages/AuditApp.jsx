import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import CodeInput from '../components/CodeInput';
import EtherscanInput from '../components/EtherscanInput';
import ChatInterface from '../components/ChatInterface';
import AuditResults from '../components/AuditResults';
import AuditHistory from '../components/AuditHistory';
import { Shield, Zap, Network, ArrowLeft, Code, Search, MessageCircle } from 'lucide-react';

function AuditApp() {
  const [currentAudit, setCurrentAudit] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');
  const [inputMode, setInputMode] = useState('code'); // 'code' or 'etherscan'
  const [auditContext, setAuditContext] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      {/* Back to Landing */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-normal px-2 pb-2 drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]">
            AuditForge
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-6 px-4 max-w-3xl mx-auto">
            Forging Secure Smart Contracts with AI
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 px-2">
            <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-blue-500/30 hover:border-blue-500/50 transition-all">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium">Security First</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-all">
              <Network className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-xs sm:text-sm font-medium">DePIN Optimized</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-green-500/30 hover:border-green-500/50 transition-all">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xs sm:text-sm font-medium">Sub-Minute Analysis</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8 px-2">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 inline-flex w-full sm:w-auto max-w-2xl shadow-lg">
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-3 rounded-md sm:rounded-lg transition-all font-medium text-sm sm:text-base ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              New Audit
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-3 rounded-md sm:rounded-lg transition-all font-medium text-sm sm:text-base flex items-center justify-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>AI Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-3 rounded-md sm:rounded-lg transition-all font-medium text-sm sm:text-base ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'audit' ? (
          <>
            {/* Input Mode Toggle */}
            <div className="flex justify-center mb-6 px-2">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 inline-flex w-full sm:w-auto max-w-md shadow-lg">
                <button
                  onClick={() => setInputMode('code')}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-md transition-all font-medium text-sm sm:text-base flex items-center justify-center gap-2 ${
                    inputMode === 'code'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>Paste Code</span>
                </button>
                <button
                  onClick={() => setInputMode('etherscan')}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-md transition-all font-medium text-sm sm:text-base flex items-center justify-center gap-2 ${
                    inputMode === 'etherscan'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Etherscan</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              <div className="w-full">
                {inputMode === 'code' ? (
                  <CodeInput 
                    onAuditComplete={(audit, context) => {
                      setCurrentAudit(audit);
                      setAuditContext(context);
                    }}
                    isAuditing={isAuditing}
                    setIsAuditing={setIsAuditing}
                  />
                ) : (
                  <EtherscanInput 
                    onAuditComplete={(audit, context) => {
                      setCurrentAudit(audit);
                      setAuditContext(context);
                    }}
                    isAuditing={isAuditing}
                    setIsAuditing={setIsAuditing}
                  />
                )}
              </div>
              {currentAudit && (
                <div className="w-full">
                  <AuditResults 
                    audit={currentAudit}
                    isAuditing={isAuditing}
                    originalCode={auditContext?.code}
                    language={auditContext?.language}
                    contractName={auditContext?.contractName}
                  />
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'chat' ? (
          <div className="max-w-5xl mx-auto">
            <ChatInterface />
          </div>
        ) : (
          <AuditHistory onSelectAudit={setCurrentAudit} />
        )}

        {/* Info Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="card hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-blue-400 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <span>Comprehensive Analysis</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Multi-layer security scanning combining AI, static analysis, and DePIN-specific checks
            </p>
          </div>
          <div className="card hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-purple-400 flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <span>NodeOps Ready</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Specialized insights for node operators, staking mechanisms, and decentralized infrastructure
            </p>
          </div>
          <div className="card hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-green-400 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Actionable Reports</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Clear vulnerability descriptions with specific remediation steps and downloadable PDF reports
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 lg:mt-20 py-6 sm:py-8 border-t border-gray-800 text-center text-gray-500 px-4">
        <p className="text-sm sm:text-base mb-2">Built for DePIN/Web3 Hackers, Node Operators & DevOps Engineers</p>
        <p className="text-xs sm:text-sm">Powered by AI • Open Source • Community Driven</p>
      </footer>
    </div>
  );
}

export default AuditApp;
