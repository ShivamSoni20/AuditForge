import { useState, useEffect } from 'react';
import { Search, Loader2, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { 
  auditContractFromEtherscan, 
  getSupportedChains, 
  isValidAddress,
  formatAddress,
  getEtherscanUrl,
  fetchCompleteContractDetails
} from '../utils/etherscan';

function EtherscanInput({ onAuditComplete, isAuditing, setIsAuditing }) {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [chains, setChains] = useState([]);
  const [error, setError] = useState('');
  const [contractInfo, setContractInfo] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Load supported chains
    getSupportedChains().then(setChains);
  }, []);

  const handleFetchContract = async () => {
    if (!address.trim()) {
      setError('Please enter a contract address');
      return;
    }

    if (!isValidAddress(address)) {
      setError('Invalid Ethereum address format');
      return;
    }

    setError('');
    setIsFetching(true);
    setContractInfo(null);

    try {
      const details = await fetchCompleteContractDetails(address, chain);
      
      if (!details.success) {
        setError(details.error || 'Failed to fetch contract details');
        return;
      }

      if (!details.isVerified) {
        setError('Contract is not verified on Etherscan. Only verified contracts can be audited.');
        return;
      }

      setContractInfo(details);
    } catch (err) {
      setError(err.message || 'Failed to fetch contract details');
      console.error('Fetch error:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAudit = async () => {
    if (!contractInfo) {
      setError('Please fetch contract details first');
      return;
    }

    setError('');
    setIsAuditing(true);

    try {
      const auditResult = await auditContractFromEtherscan(address, chain);
      
      // Pass audit result with contract context
      onAuditComplete(auditResult, {
        code: contractInfo.sourceCode,
        language: 'solidity',
        contractName: contractInfo.contractName,
        fromEtherscan: true,
        address,
        chain
      });
    } catch (err) {
      setError(err.message || 'Audit failed. Please try again.');
      console.error('Audit error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setContractInfo(null);
    setError('');
  };

  return (
    <div className="card">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
        <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
        Fetch from Etherscan
      </h2>

      {/* Chain Selection */}
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium mb-2">Blockchain Network</label>
        <select
          value={chain}
          onChange={(e) => {
            setChain(e.target.value);
            setContractInfo(null);
          }}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all"
        >
          {chains.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Contract Address Input */}
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium mb-2">Contract Address</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="0x..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-mono transition-all"
          />
          <button
            onClick={handleFetchContract}
            disabled={isFetching || isAuditing}
            className="btn-secondary px-4 sm:px-6 py-2 sm:py-2.5 flex items-center gap-2"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Fetching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Fetch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contract Info Display */}
      {contractInfo && (
        <div className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {contractInfo.contractName}
                {contractInfo.isVerified && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </h3>
              <p className="text-sm text-gray-400 font-mono mt-1">
                {formatAddress(address)}
              </p>
            </div>
            <a
              href={contractInfo.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Network:</span>
              <span className="ml-2 font-medium">{contractInfo.chainName}</span>
            </div>
            <div>
              <span className="text-gray-400">Compiler:</span>
              <span className="ml-2 font-mono text-xs">{contractInfo.compilerVersion}</span>
            </div>
            {contractInfo.creator && (
              <div className="sm:col-span-2">
                <span className="text-gray-400">Creator:</span>
                <span className="ml-2 font-mono text-xs">{formatAddress(contractInfo.creator)}</span>
              </div>
            )}
            {contractInfo.licenseType && (
              <div>
                <span className="text-gray-400">License:</span>
                <span className="ml-2">{contractInfo.licenseType}</span>
              </div>
            )}
            {contractInfo.isProxy && (
              <div className="sm:col-span-2 flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">This is a proxy contract</span>
              </div>
            )}
          </div>

          {/* Verification Status */}
          <div className="pt-3 border-t border-gray-700">
            <div className="flex items-center gap-2">
              {contractInfo.isVerified ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Verified Contract</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">Not Verified</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-300 text-xs sm:text-sm flex items-start gap-2">
          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Audit Button */}
      {contractInfo && contractInfo.isVerified && (
        <button
          onClick={handleAudit}
          disabled={isAuditing}
          className="w-full btn-primary flex items-center justify-center gap-2 py-3 sm:py-2.5 text-sm sm:text-base font-semibold"
        >
          {isAuditing ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              Analyzing Contract...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              Run Security Audit
            </>
          )}
        </button>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs sm:text-sm text-blue-300">
        💡 <span className="hidden sm:inline">Enter a verified contract address to fetch and audit it directly from Etherscan.</span>
        <span className="sm:hidden">Fetch verified contracts from Etherscan.</span>
      </div>

      {/* Example Addresses */}
      <div className="mt-3 text-xs text-gray-400">
        <p className="mb-1">Try these verified contracts:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7')}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-mono transition-colors"
          >
            USDT
          </button>
          <button
            onClick={() => setAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-mono transition-colors"
          >
            USDC
          </button>
          <button
            onClick={() => setAddress('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-mono transition-colors"
          >
            UNI
          </button>
        </div>
      </div>
    </div>
  );
}

export default EtherscanInput;
