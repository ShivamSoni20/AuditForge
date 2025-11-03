import dotenv from 'dotenv';

dotenv.config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const ETHERSCAN_BASE_URL = process.env.ETHERSCAN_BASE_URL || 'https://api.etherscan.io/api';

// Supported EVM chains configuration
const CHAIN_CONFIGS = {
  ethereum: {
    name: 'Ethereum Mainnet',
    baseUrl: 'https://api.etherscan.io/api',
    explorer: 'https://etherscan.io'
  },
  goerli: {
    name: 'Goerli Testnet',
    baseUrl: 'https://api-goerli.etherscan.io/api',
    explorer: 'https://goerli.etherscan.io'
  },
  sepolia: {
    name: 'Sepolia Testnet',
    baseUrl: 'https://api-sepolia.etherscan.io/api',
    explorer: 'https://sepolia.etherscan.io'
  },
  bsc: {
    name: 'BSC Mainnet',
    baseUrl: 'https://api.bscscan.com/api',
    explorer: 'https://bscscan.com'
  },
  polygon: {
    name: 'Polygon Mainnet',
    baseUrl: 'https://api.polygonscan.com/api',
    explorer: 'https://polygonscan.com'
  },
  arbitrum: {
    name: 'Arbitrum One',
    baseUrl: 'https://api.arbiscan.io/api',
    explorer: 'https://arbiscan.io'
  },
  optimism: {
    name: 'Optimism',
    baseUrl: 'https://api-optimistic.etherscan.io/api',
    explorer: 'https://optimistic.etherscan.io'
  },
  base: {
    name: 'Base',
    baseUrl: 'https://api.basescan.org/api',
    explorer: 'https://basescan.org'
  }
};

/**
 * Get base URL for a specific chain
 */
function getChainBaseUrl(chain = 'ethereum') {
  return CHAIN_CONFIGS[chain]?.baseUrl || ETHERSCAN_BASE_URL;
}

/**
 * Fetch contract ABI from Etherscan
 * @param {string} address - Contract address
 * @param {string} chain - Blockchain network (ethereum, bsc, polygon, etc.)
 * @returns {Promise<Object>} ABI data
 */
export async function fetchContractABI(address, chain = 'ethereum') {
  try {
    const baseUrl = getChainBaseUrl(chain);
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getabi',
      address,
      apikey: ETHERSCAN_API_KEY
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    if (data.status === '0') {
      throw new Error(data.result || 'Failed to fetch ABI');
    }

    return {
      success: true,
      abi: JSON.parse(data.result),
      address,
      chain
    };
  } catch (error) {
    console.error('Error fetching ABI:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fetch contract source code from Etherscan
 * @param {string} address - Contract address
 * @param {string} chain - Blockchain network
 * @returns {Promise<Object>} Source code data
 */
export async function fetchContractSourceCode(address, chain = 'ethereum') {
  try {
    const baseUrl = getChainBaseUrl(chain);
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getsourcecode',
      address,
      apikey: ETHERSCAN_API_KEY
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    if (data.status === '0') {
      throw new Error(data.result || 'Failed to fetch source code');
    }

    const result = data.result[0];
    
    return {
      success: true,
      sourceCode: result.SourceCode,
      contractName: result.ContractName,
      compilerVersion: result.CompilerVersion,
      optimizationUsed: result.OptimizationUsed,
      runs: result.Runs,
      constructorArguments: result.ConstructorArguments,
      evmVersion: result.EVMVersion,
      library: result.Library,
      licenseType: result.LicenseType,
      proxy: result.Proxy,
      implementation: result.Implementation,
      swarmSource: result.SwarmSource,
      address,
      chain
    };
  } catch (error) {
    console.error('Error fetching source code:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fetch contract creator and creation transaction
 * @param {string} address - Contract address
 * @param {string} chain - Blockchain network
 * @returns {Promise<Object>} Creator data
 */
export async function fetchContractCreator(address, chain = 'ethereum') {
  try {
    const baseUrl = getChainBaseUrl(chain);
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getcontractcreation',
      contractaddresses: address,
      apikey: ETHERSCAN_API_KEY
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    if (data.status === '0') {
      throw new Error(data.result || 'Failed to fetch creator info');
    }

    const result = data.result[0];
    
    return {
      success: true,
      contractAddress: result.contractAddress,
      contractCreator: result.contractCreator,
      txHash: result.txHash,
      chain
    };
  } catch (error) {
    console.error('Error fetching creator:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check source code verification status
 * @param {string} guid - Verification GUID
 * @param {string} chain - Blockchain network
 * @returns {Promise<Object>} Verification status
 */
export async function checkVerificationStatus(guid, chain = 'ethereum') {
  try {
    const baseUrl = getChainBaseUrl(chain);
    const params = new URLSearchParams({
      module: 'contract',
      action: 'checkverifystatus',
      guid,
      apikey: ETHERSCAN_API_KEY
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    return {
      success: true,
      status: data.status,
      result: data.result,
      chain
    };
  } catch (error) {
    console.error('Error checking verification status:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check proxy contract verification status
 * @param {string} guid - Proxy verification GUID
 * @param {string} chain - Blockchain network
 * @returns {Promise<Object>} Proxy verification status
 */
export async function checkProxyVerification(guid, chain = 'ethereum') {
  try {
    const baseUrl = getChainBaseUrl(chain);
    const params = new URLSearchParams({
      module: 'contract',
      action: 'checkproxyverification',
      guid,
      apikey: ETHERSCAN_API_KEY
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    return {
      success: true,
      status: data.status,
      result: data.result,
      chain
    };
  } catch (error) {
    console.error('Error checking proxy verification:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fetch complete contract details (ABI + Source + Creator)
 * @param {string} address - Contract address
 * @param {string} chain - Blockchain network
 * @returns {Promise<Object>} Complete contract data
 */
export async function fetchCompleteContractDetails(address, chain = 'ethereum') {
  try {
    // Fetch all data in parallel
    const [abiData, sourceData, creatorData] = await Promise.all([
      fetchContractABI(address, chain),
      fetchContractSourceCode(address, chain),
      fetchContractCreator(address, chain)
    ]);

    // Check if contract is verified
    const isVerified = sourceData.success && sourceData.sourceCode && sourceData.sourceCode !== '';

    return {
      success: true,
      address,
      chain,
      chainName: CHAIN_CONFIGS[chain]?.name || 'Unknown',
      explorerUrl: `${CHAIN_CONFIGS[chain]?.explorer}/address/${address}`,
      isVerified,
      abi: abiData.success ? abiData.abi : null,
      sourceCode: sourceData.success ? sourceData.sourceCode : null,
      contractName: sourceData.success ? sourceData.contractName : null,
      compilerVersion: sourceData.success ? sourceData.compilerVersion : null,
      optimizationUsed: sourceData.success ? sourceData.optimizationUsed : null,
      licenseType: sourceData.success ? sourceData.licenseType : null,
      isProxy: sourceData.success ? sourceData.proxy === '1' : false,
      implementation: sourceData.success ? sourceData.implementation : null,
      creator: creatorData.success ? creatorData.contractCreator : null,
      creationTxHash: creatorData.success ? creatorData.txHash : null,
      errors: {
        abi: abiData.success ? null : abiData.error,
        source: sourceData.success ? null : sourceData.error,
        creator: creatorData.success ? null : creatorData.error
      }
    };
  } catch (error) {
    console.error('Error fetching complete contract details:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get list of supported chains
 * @returns {Array} List of supported chains
 */
export function getSupportedChains() {
  return Object.keys(CHAIN_CONFIGS).map(key => ({
    id: key,
    name: CHAIN_CONFIGS[key].name,
    explorer: CHAIN_CONFIGS[key].explorer
  }));
}

/**
 * Validate Ethereum address format
 * @param {string} address - Address to validate
 * @returns {boolean} Is valid address
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
