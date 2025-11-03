import dotenv from 'dotenv';
import { analyzeWithAI } from './aiService.js';
import { auditContract } from './auditEngine.js';
import { generateCodeCorrection } from './codeCorrectionService.js';
import { 
  fetchCompleteContractDetails, 
  isValidAddress 
} from './etherscanService.js';

dotenv.config();

/**
 * Process user message and determine intent
 */
function parseUserIntent(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for contract address
  const addressMatch = message.match(/0x[a-fA-F0-9]{40}/);
  
  // Check for file attachment mention
  const hasFileAttachment = lowerMessage.includes('file') || 
                           lowerMessage.includes('upload') || 
                           lowerMessage.includes('attach');
  
  // Check for audit request
  const wantsAudit = lowerMessage.includes('audit') || 
                     lowerMessage.includes('analyze') || 
                     lowerMessage.includes('check') ||
                     lowerMessage.includes('vulnerabilit') ||
                     lowerMessage.includes('security');
  
  // Check for fix/rewrite request
  const wantsFix = lowerMessage.includes('fix') || 
                   lowerMessage.includes('correct') || 
                   lowerMessage.includes('rewrite') ||
                   lowerMessage.includes('improve');
  
  // Check for explanation request
  const wantsExplanation = lowerMessage.includes('explain') || 
                          lowerMessage.includes('what is') || 
                          lowerMessage.includes('tell me about') ||
                          lowerMessage.includes('describe');
  
  return {
    address: addressMatch ? addressMatch[0] : null,
    hasFileAttachment,
    wantsAudit,
    wantsFix,
    wantsExplanation,
    originalMessage: message
  };
}

/**
 * Fetch basic contract info from Etherscan website
 */
async function fetchContractInfoFromWeb(address, chain = 'ethereum') {
  try {
    const explorerUrls = {
      ethereum: 'https://etherscan.io',
      bsc: 'https://bscscan.com',
      polygon: 'https://polygonscan.com',
      arbitrum: 'https://arbiscan.io',
      optimism: 'https://optimistic.etherscan.io',
      base: 'https://basescan.org'
    };
    
    const baseUrl = explorerUrls[chain] || explorerUrls.ethereum;
    const url = `${baseUrl}/address/${address}`;
    
    // Return basic info that we can provide
    return {
      success: true,
      address,
      chain,
      explorerUrl: url,
      message: `Contract found on ${chain} blockchain`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Analyze contract from Etherscan address
 */
async function analyzeContractFromAddress(address, chain = 'ethereum') {
  try {
    // Validate address
    if (!isValidAddress(address)) {
      return {
        success: false,
        error: 'Invalid Ethereum address format'
      };
    }

    // Get basic contract info
    const contractInfo = await fetchContractInfoFromWeb(address, chain);
    
    if (!contractInfo.success) {
      return {
        success: false,
        error: 'Failed to fetch contract information'
      };
    }

    // Try to fetch details from Etherscan API (may fail due to V1 deprecation)
    const contractDetails = await fetchCompleteContractDetails(address, chain);
    
    // If we have source code, run audit
    if (contractDetails.success && contractDetails.sourceCode) {
      const auditResult = await auditContract(
        contractDetails.sourceCode,
        'solidity',
        contractDetails.contractName
      );

      return {
        success: true,
        contractDetails,
        auditResult,
        address,
        chain
      };
    }

    // Return basic info without audit
    return {
      success: true,
      address,
      chain,
      explorerUrl: contractInfo.explorerUrl,
      basicInfo: true,
      message: 'Contract information retrieved. Source code not available via API.'
    };
  } catch (error) {
    console.error('Error analyzing contract from address:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Analyze contract from source code
 */
async function analyzeContractFromCode(code, language = 'solidity', contractName = 'Contract') {
  try {
    const auditResult = await auditContract(code, language, contractName);
    
    return {
      success: true,
      auditResult,
      code,
      language,
      contractName
    };
  } catch (error) {
    console.error('Error analyzing contract from code:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate fixed version of contract
 */
async function generateFixedContract(code, language, vulnerabilities) {
  try {
    const correction = await generateCodeCorrection(code, language, vulnerabilities);
    
    return {
      success: correction.success,
      correctedCode: correction.correctedCode,
      explanation: correction.explanation,
      changes: correction.changes
    };
  } catch (error) {
    console.error('Error generating fixed contract:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate AI response for chat
 */
async function generateChatResponse(userMessage, context = {}) {
  const { address, code, auditResult, contractDetails } = context;
  
  let prompt = `You are a smart contract security expert assistant. The user asked: "${userMessage}"\n\n`;
  
  if (contractDetails) {
    prompt += `Contract Details:\n`;
    prompt += `- Name: ${contractDetails.contractName}\n`;
    prompt += `- Address: ${address}\n`;
    prompt += `- Chain: ${contractDetails.chainName}\n`;
    prompt += `- Verified: ${contractDetails.isVerified ? 'Yes' : 'No'}\n`;
    prompt += `- Compiler: ${contractDetails.compilerVersion}\n`;
    if (contractDetails.isProxy) {
      prompt += `- Type: Proxy Contract\n`;
    }
    prompt += `\n`;
  }
  
  if (auditResult) {
    prompt += `Audit Results:\n`;
    prompt += `- Security Score: ${auditResult.score}/100\n`;
    prompt += `- Risk Level: ${auditResult.riskLevel}\n`;
    prompt += `- Total Issues: ${auditResult.vulnerabilities?.length || 0}\n`;
    
    if (auditResult.vulnerabilities && auditResult.vulnerabilities.length > 0) {
      prompt += `\nVulnerabilities Found:\n`;
      auditResult.vulnerabilities.forEach((vuln, idx) => {
        prompt += `${idx + 1}. ${vuln.title} (${vuln.severity})\n`;
        prompt += `   - ${vuln.description}\n`;
      });
    }
    prompt += `\n`;
  }
  
  prompt += `Please provide a helpful, concise response focusing on security aspects and actionable recommendations. If there are vulnerabilities, explain them clearly and suggest fixes.`;
  
  try {
    const aiResponse = await analyzeWithAI(prompt, 'solidity');
    return {
      success: true,
      response: aiResponse
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      success: false,
      error: 'Failed to generate AI response'
    };
  }
}

/**
 * Main chat handler - processes user message and returns appropriate response
 */
export async function processChatMessage(message, attachedFile = null, chain = 'ethereum') {
  try {
    const intent = parseUserIntent(message);
    let response = {
      message: '',
      data: null,
      suggestions: []
    };

    // Handle contract address
    if (intent.address) {
      const analysis = await analyzeContractFromAddress(intent.address, chain);
      
      if (!analysis.success) {
        response.message = `❌ ${analysis.error}`;
        return response;
      }

      // Check if we have basic info only (no source code)
      if (analysis.basicInfo) {
        const chainNames = {
          ethereum: 'Ethereum Mainnet',
          bsc: 'BSC',
          polygon: 'Polygon',
          arbitrum: 'Arbitrum',
          optimism: 'Optimism',
          base: 'Base'
        };
        
        let summary = `📍 **Contract Address Found**\n\n`;
        summary += `**Address:** \`${analysis.address}\`\n`;
        summary += `**Network:** ${chainNames[analysis.chain] || analysis.chain}\n`;
        summary += `**Explorer:** [View on Etherscan](${analysis.explorerUrl})\n\n`;
        summary += `ℹ️ This contract address exists on the ${chainNames[analysis.chain] || analysis.chain} blockchain.\n\n`;
        summary += `**What you can do:**\n`;
        summary += `• View transaction history on Etherscan\n`;
        summary += `• Check token balances and transfers\n`;
        summary += `• See contract interactions\n`;
        summary += `• Upload the source code for security analysis\n`;
        
        response.message = summary;
        response.data = {
          type: 'basic_info',
          address: analysis.address,
          chain: analysis.chain,
          explorerUrl: analysis.explorerUrl
        };
        
        response.suggestions = [
          'View on Etherscan',
          'Upload contract source code for audit',
          'Ask about common vulnerabilities'
        ];
        
        return response;
      }

      // Full analysis with source code
      const { contractDetails, auditResult } = analysis;
      
      // Generate summary
      let summary = `✅ **${contractDetails.contractName}** analyzed successfully!\n\n`;
      summary += `📊 **Security Score:** ${auditResult.score}/100 (${auditResult.riskLevel})\n`;
      summary += `🔍 **Issues Found:** ${auditResult.vulnerabilities?.length || 0}\n\n`;
      
      if (auditResult.vulnerabilities && auditResult.vulnerabilities.length > 0) {
        summary += `**Critical Vulnerabilities:**\n`;
        auditResult.vulnerabilities
          .filter(v => v.severity === 'critical' || v.severity === 'high')
          .slice(0, 3)
          .forEach((vuln, idx) => {
            summary += `${idx + 1}. ${vuln.title}\n`;
          });
        summary += `\n`;
      }
      
      // Generate AI insights
      const aiInsights = await generateChatResponse(message, {
        address: intent.address,
        contractDetails,
        auditResult
      });
      
      if (aiInsights.success && aiInsights.response) {
        // Properly serialize AI response
        const aiText = typeof aiInsights.response === 'string' 
          ? aiInsights.response 
          : JSON.stringify(aiInsights.response, null, 2);
        summary += `\n💡 **AI Analysis:**\n${aiText}\n`;
      }
      
      response.message = summary;
      response.data = {
        type: 'audit',
        contractDetails,
        auditResult,
        address: intent.address,
        chain
      };
      
      if (intent.wantsFix && auditResult.vulnerabilities?.length > 0) {
        response.suggestions = [
          'Generate fixed version of the contract',
          'Download detailed PDF report',
          'View specific vulnerability details'
        ];
      }
      
      return response;
    }

    // Handle file attachment
    if (attachedFile) {
      const { code, language, filename } = attachedFile;
      const analysis = await analyzeContractFromCode(code, language, filename);
      
      if (!analysis.success) {
        response.message = `❌ Failed to analyze contract: ${analysis.error}`;
        return response;
      }

      const { auditResult } = analysis;
      
      let summary = `✅ **${filename}** analyzed successfully!\n\n`;
      summary += `📊 **Security Score:** ${auditResult.score}/100 (${auditResult.riskLevel})\n`;
      summary += `🔍 **Issues Found:** ${auditResult.vulnerabilities?.length || 0}\n\n`;
      
      if (auditResult.vulnerabilities && auditResult.vulnerabilities.length > 0) {
        summary += `**Vulnerabilities:**\n`;
        auditResult.vulnerabilities.slice(0, 5).forEach((vuln, idx) => {
          summary += `${idx + 1}. **${vuln.title}** (${vuln.severity})\n`;
          summary += `   ${vuln.description}\n\n`;
        });
      }
      
      // Generate AI insights
      const aiInsights = await generateChatResponse(message, {
        code,
        auditResult
      });
      
      if (aiInsights.success && aiInsights.response) {
        // Properly serialize AI response
        const aiText = typeof aiInsights.response === 'string' 
          ? aiInsights.response 
          : JSON.stringify(aiInsights.response, null, 2);
        summary += `\n💡 **AI Recommendations:**\n${aiText}\n`;
      }
      
      response.message = summary;
      response.data = {
        type: 'audit',
        auditResult,
        code,
        language,
        filename
      };
      
      if (intent.wantsFix && auditResult.vulnerabilities?.length > 0) {
        response.suggestions = [
          'Generate corrected contract code',
          'Explain specific vulnerabilities',
          'Download PDF report'
        ];
      }
      
      return response;
    }

    // Handle general questions
    response.message = `I can help you analyze smart contracts! Here's what I can do:\n\n`;
    response.message += `🔍 **Analyze Contracts:**\n`;
    response.message += `- Paste a contract address (e.g., 0x...)\n`;
    response.message += `- Upload a contract file (.sol, .rs)\n`;
    response.message += `- I'll check for vulnerabilities and security issues\n\n`;
    response.message += `🔨 **Fix Vulnerabilities:**\n`;
    response.message += `- I can rewrite contracts to fix security issues\n`;
    response.message += `- Get AI-powered code corrections\n\n`;
    response.message += `💬 **Ask Questions:**\n`;
    response.message += `- "What vulnerabilities does this contract have?"\n`;
    response.message += `- "Can you fix this contract?"\n`;
    response.message += `- "Explain the security issues"\n\n`;
    response.message += `Try pasting a contract address or uploading a file to get started!`;
    
    response.suggestions = [
      'Analyze contract: 0xdAC17F958D2ee523a2206206994597C13D831ec7',
      'Upload a contract file',
      'Explain common vulnerabilities'
    ];

    return response;
  } catch (error) {
    console.error('Error processing chat message:', error);
    return {
      message: `❌ An error occurred: ${error.message}`,
      data: null,
      suggestions: ['Try again', 'Contact support']
    };
  }
}

/**
 * Generate fixed contract from chat context
 */
export async function generateFixFromChat(code, language, vulnerabilities) {
  return await generateFixedContract(code, language, vulnerabilities);
}
