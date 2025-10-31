import { Shield, Github } from 'lucide-react';

function Header() {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg shadow-lg">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AuditForge
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">Forging Secure Contracts</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2 sm:gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-white transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-800/50"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline text-sm">GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
