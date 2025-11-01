import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import CodeInput from '../components/CodeInput';
import AuditResults from '../components/AuditResults';
import AuditHistory from '../components/AuditHistory';
import { Shield, Zap, Network, ArrowLeft } from 'lucide-react';

function AuditApp() {
  const [currentAudit, setCurrentAudit] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight px-2">
            AuditForge
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 px-4 max-w-3xl mx-auto">
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
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 inline-flex w-full sm:w-auto max-w-md shadow-lg">
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-lg transition-all font-medium text-sm sm:text-base ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              New Audit
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-lg transition-all font-medium text-sm sm:text-base ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Audit History
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'audit' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <div className="w-full">
              <CodeInput 
                onAuditComplete={(audit, context) => {
                  setCurrentAudit(audit);
                  setAuditContext(context);
                }}
                isAuditing={isAuditing}
                setIsAuditing={setIsAuditing}
              />
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
