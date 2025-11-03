import { API_URL } from '../config';

/**
 * Fetch contract ABI from Etherscan via backend
 * @param {string} address - Contract address
 * @param {string} chain - Blockchain network (ethereum, bsc, polygon, etc.)
 * @returns {Promise<Object>} ABI data
 */
export async function fetchContractABI(address, chain = 'ethereum') {
  try {
    const response = await fetch(
      `${API_URL}/api/etherscan/abi/${address}?chain=${chain}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ABI:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fetch contract source code from Etherscan via backend
 * @param {string} address - Contract address
 * @param {string} chain - Blockchain network
 * @returns {Promise<Object>} Source code data
 */
export async function fetchContractSourceCode(address, chain = 'ethereum') {
  try {
    const response = await fetch(
      `${API_URL}/api/etherscan/source/${address}?chain=${chain}`
    );
    const data = await response.json();
    return data;
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
    const response = await fetch(
      `${API_URL}/api/etherscan/creator/${address}?chain=${chain}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching creator:', error);
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
    const response = await fetch(
      `${API_URL}/api/etherscan/contract/${address}?chain=${chain}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching contract details:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Audit a contract directly from Etherscan address
 * @param {string} address - Contract address
 * @param {string} chain - Blockchain network
 * @returns {Promise<Object>} Audit results
 */
export async function auditContractFromEtherscan(address, chain = 'ethereum') {
  try {
    const response = await fetch(`${API_URL}/api/audit/etherscan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address, chain })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to audit contract');
    }

    return data;
  } catch (error) {
    console.error('Error auditing contract from Etherscan:', error);
    throw error;
  }
}

/**
 * Get list of supported chains
 * @returns {Promise<Array>} List of supported chains
 */
export async function getSupportedChains() {
  try {
    const response = await fetch(`${API_URL}/api/etherscan/chains`);
    const data = await response.json();
    return data.chains || [];
  } catch (error) {
    console.error('Error fetching chains:', error);
    return [];
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
    const response = await fetch(
      `${API_URL}/api/etherscan/verify-status/${guid}?chain=${chain}`
    );
    const data = await response.json();
    return data;
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
    const response = await fetch(
      `${API_URL}/api/etherscan/proxy-verify/${guid}?chain=${chain}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking proxy verification:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Validate Ethereum address format
 * @param {string} address - Address to validate
 * @returns {boolean} Is valid address
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format address for display (0x1234...5678)
 * @param {string} address - Full address
 * @param {number} startChars - Number of chars to show at start
 * @param {number} endChars - Number of chars to show at end
 * @returns {string} Formatted address
 */
export function formatAddress(address, startChars = 6, endChars = 4) {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Get Etherscan URL for address
 * @param {string} address - Contract address
 * @param {string} chain - Blockchain network
 * @returns {string} Etherscan URL
 */
export function getEtherscanUrl(address, chain = 'ethereum') {
  const explorers = {
    ethereum: 'https://etherscan.io',
    goerli: 'https://goerli.etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    bsc: 'https://bscscan.com',
    polygon: 'https://polygonscan.com',
    arbitrum: 'https://arbiscan.io',
    optimism: 'https://optimistic.etherscan.io',
    base: 'https://basescan.org'
  };

  const baseUrl = explorers[chain] || explorers.ethereum;
  return `${baseUrl}/address/${address}`;
}
