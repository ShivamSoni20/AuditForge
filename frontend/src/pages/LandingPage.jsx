import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Network, 
  CheckCircle, 
  Code, 
  FileText, 
  ArrowRight,
  Sparkles,
  Lock,
  TrendingUp,
  Users,
  Cpu,
  Globe,
  Github
} from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(147,51,234,0.4)] pb-1">
                AuditForge
              </span>
            </div>
            <Link 
              to="/app"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/50"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">AI-Powered Smart Contract Security</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-normal pb-2">
            <span className="bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(147,51,234,0.6)]">
              Forge Secure
            </span>
            <br />
            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Smart Contracts</span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            AuditForge is an AI-powered smart contract auditor specifically designed for 
            <span className="text-blue-300 font-semibold"> DePIN</span> and 
            <span className="text-purple-300 font-semibold"> NodeOps</span> ecosystems. 
            Get comprehensive security analysis in under a minute.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/app"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2"
            >
              Start Auditing Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#mvp"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-semibold text-lg"
            >
              View MVP Features
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">{'<60s'}</div>
              <div className="text-sm text-gray-400">Analysis Time</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-sm text-gray-400">Vulnerability Types</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">3</div>
              <div className="text-sm text-gray-400">Languages Supported</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-pink-400 mb-2">100%</div>
              <div className="text-sm text-gray-400">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-800/30">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
            Why Choose AuditForge?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built specifically for DePIN and NodeOps with cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500/50">
            <div className="bg-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Analysis</h3>
            <p className="text-gray-400 leading-relaxed">
              Advanced AI models trained on thousands of smart contracts to detect vulnerabilities, 
              security issues, and optimization opportunities with high accuracy.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50">
            <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Network className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">DePIN Specialized</h3>
            <p className="text-gray-400 leading-relaxed">
              Tailored for Decentralized Physical Infrastructure Networks with specific checks 
              for node operations, staking mechanisms, and infrastructure security.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-2xl p-8 hover:border-green-500/50">
            <div className="bg-green-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Lightning Fast</h3>
            <p className="text-gray-400 leading-relaxed">
              Complete security audits in under 60 seconds. No waiting, no queues. 
              Get instant feedback on your smart contract security posture.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/30 rounded-2xl p-8 hover:border-pink-500/50">
            <div className="bg-pink-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Code className="w-7 h-7 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Auto Code Correction</h3>
            <p className="text-gray-400 leading-relaxed">
              Not just detection - get AI-generated fixes for vulnerabilities with detailed 
              explanations and code diffs to understand every change.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-2xl p-8 hover:border-yellow-500/50">
            <div className="bg-yellow-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-7 h-7 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Professional Reports</h3>
            <p className="text-gray-400 leading-relaxed">
              Generate comprehensive PDF audit reports with severity ratings, vulnerability 
              details, and remediation steps for stakeholders and compliance.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-500/50">
            <div className="bg-cyan-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Multi-Language Support</h3>
            <p className="text-gray-400 leading-relaxed">
              Support for Solidity, Rust, and Move smart contracts. Analyze contracts 
              across different blockchain ecosystems with a single tool.
            </p>
          </div>
        </div>
      </section>

      {/* MVP Section */}
      <section id="mvp" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              MVP Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to secure your smart contracts in our Minimum Viable Product
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Core Features */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-3">
                <Cpu className="w-7 h-7" />
                Core Audit Engine
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Multi-Layer Security Analysis</div>
                    <div className="text-sm text-gray-400">Static analysis, pattern matching, and AI-powered vulnerability detection</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">50+ Vulnerability Checks</div>
                    <div className="text-sm text-gray-400">Reentrancy, overflow, access control, gas optimization, and more</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">DePIN-Specific Checks</div>
                    <div className="text-sm text-gray-400">Node operator security, staking mechanisms, reward distribution</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Real-time Scoring</div>
                    <div className="text-sm text-gray-400">0-100 security score with detailed breakdown by category</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Smart Features */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-3">
                <Sparkles className="w-7 h-7" />
                Smart Features
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">AI Code Correction</div>
                    <div className="text-sm text-gray-400">Automatically generate secure code fixes for detected vulnerabilities</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Code Diff Visualization</div>
                    <div className="text-sm text-gray-400">Side-by-side comparison of original and corrected code</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">PDF Report Generation</div>
                    <div className="text-sm text-gray-400">Professional audit reports for documentation and compliance</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Audit History</div>
                    <div className="text-sm text-gray-400">Track all your audits with searchable history and re-analysis</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* User Experience */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-3">
                <Users className="w-7 h-7" />
                User Experience
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Intuitive Interface</div>
                    <div className="text-sm text-gray-400">Clean, modern UI with syntax highlighting and responsive design</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">File Upload Support</div>
                    <div className="text-sm text-gray-400">Drag-and-drop or paste code directly into the editor</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Multi-Language Support</div>
                    <div className="text-sm text-gray-400">Solidity, Rust, and Move with proper syntax highlighting</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Mobile Responsive</div>
                    <div className="text-sm text-gray-400">Full functionality on desktop, tablet, and mobile devices</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Technical Stack */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-pink-400 flex items-center gap-3">
                <Lock className="w-7 h-7" />
                Technical Stack
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Modern Frontend</div>
                    <div className="text-sm text-gray-400">React 18, Vite, TailwindCSS for blazing-fast performance</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Robust Backend</div>
                    <div className="text-sm text-gray-400">Node.js, Express, with RESTful API architecture</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">AI Integration</div>
                    <div className="text-sm text-gray-400">OpenAI GPT-4 for intelligent vulnerability analysis</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white mb-1">Cloud Deployment</div>
                    <div className="text-sm text-gray-400">Vercel serverless functions for scalability and reliability</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              Who Is This For?
            </h2>
            <p className="text-xl text-gray-400">
              Built for the entire Web3 and DePIN ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-blue-500/50">
              <div className="text-4xl mb-4">👨‍💻</div>
              <h3 className="text-xl font-bold mb-3 text-white">Smart Contract Developers</h3>
              <p className="text-gray-400">
                Catch vulnerabilities early in development. Get instant feedback and AI-powered fixes 
                to ship secure contracts faster.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-3 text-white">Node Operators</h3>
              <p className="text-gray-400">
                Ensure your DePIN infrastructure contracts are secure. Specialized checks for 
                staking, rewards, and node management logic.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-green-500/50">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3 text-white">Security Auditors</h3>
              <p className="text-gray-400">
                Accelerate your audit process with AI assistance. Generate professional reports 
                and catch issues that manual review might miss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Secure Your Smart Contracts?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start auditing for free. No signup required. Get instant security insights.
          </p>
          <Link 
            to="/app"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg shadow-2xl"
          >
            Launch AuditForge Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(147,51,234,0.4)] pb-1">
                  AuditForge
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered smart contract security auditor for DePIN and NodeOps ecosystems. 
                Built with ❤️ for the Web3 community.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/ShivamSoni20/AuditForge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/app" className="hover:text-white">Launch App</Link></li>
                <li><a href="#mvp" className="hover:text-white">MVP Features</a></li>
                <li><a href="https://github.com/ShivamSoni20/AuditForge" target="_blank" rel="noopener noreferrer" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://github.com/ShivamSoni20/AuditForge" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
                <li><a href="https://github.com/ShivamSoni20/AuditForge/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white">Report Issues</a></li>
                <li><a href="https://github.com/ShivamSoni20/AuditForge/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-white">License</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p className="mb-2">Built for DePIN/Web3 Hackers, Node Operators & DevOps Engineers</p>
            <p className="text-sm">© 2024 AuditForge. Open Source • MIT License • Community Driven</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
