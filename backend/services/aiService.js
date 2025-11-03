import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize AIML API client (compatible with OpenAI SDK)
const aimlClient = process.env.AIML_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.AIML_API_KEY,
      baseURL: process.env.AIML_BASE_URL || 'https://api.aimlapi.com/v1'
    })
  : null;

export async function analyzeWithAI(code, language, contractName) {
  // If no AIML API key, use fallback analysis
  if (!aimlClient) {
    console.log('No AIML API key found, using fallback analysis');
    return fallbackAnalysis(code, language);
  }

  try {
    const prompt = buildAuditPrompt(code, language, contractName);
    
    console.log('Analyzing with AIML API...');
    const completion = await aimlClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert smart contract auditor specializing in DePIN (Decentralized Physical Infrastructure Networks) and NodeOps security. Analyze contracts for vulnerabilities, with special focus on node operator risks, escrow mechanisms, tokenomics, and decentralized infrastructure patterns."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const analysis = completion.choices[0]?.message?.content;
    if (!analysis) {
      console.error('Empty response from AIML API');
      return fallbackAnalysis(code, language);
    }
    
    console.log('AIML API analysis completed');
    return parseAIResponse(analysis);
  } catch (error) {
    console.error('AIML API analysis error:', error.message);
    // Return structured error response instead of fallback
    const fallback = fallbackAnalysis(code, language);
    fallback.error = `AI analysis unavailable: ${error.message}`;
    return fallback;
  }
}

function buildAuditPrompt(code, language, contractName) {
  return `Analyze this ${language} smart contract for security vulnerabilities and code quality issues.
Contract Name: ${contractName || 'Unknown'}

Focus areas:
1. Security vulnerabilities (reentrancy, access control, integer overflow, etc.)
2. DePIN-specific risks (node operator incentives, slashing mechanisms, reward distribution)
3. NodeOps concerns (uptime verification, proof systems, stake management)
4. Gas optimization opportunities
5. Code quality and best practices

Contract Code:
\`\`\`${language}
${code}
\`\`\`

Provide your analysis in the following JSON format:
{
  "vulnerabilities": [
    {
      "title": "Vulnerability title",
      "severity": "critical|high|medium|low|info",
      "category": "security|depin|nodeops|gas|quality",
      "description": "Detailed description",
      "line": line_number_or_null,
      "remediation": "How to fix this issue"
    }
  ]
}

Return ONLY valid JSON, no additional text.`;
}

function parseAIResponse(response) {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const vulnerabilities = Array.isArray(parsed.vulnerabilities) ? parsed.vulnerabilities : [];
      
      // Validate and sanitize each vulnerability
      const sanitized = vulnerabilities.map(v => ({
        title: String(v.title || 'Unknown Vulnerability'),
        severity: validateSeverity(v.severity),
        category: String(v.category || 'security'),
        description: String(v.description || 'No description provided'),
        line: v.line ? Number(v.line) : null,
        remediation: String(v.remediation || 'Review and fix this issue')
      }));
      
      return {
        vulnerabilities: sanitized,
        rawResponse: response
      };
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error);
  }

  // Fallback: parse text response
  return {
    vulnerabilities: extractVulnerabilitiesFromText(response),
    rawResponse: response
  };
}

function validateSeverity(severity) {
  const valid = ['critical', 'high', 'medium', 'low', 'info'];
  const normalized = String(severity || '').toLowerCase();
  return valid.includes(normalized) ? normalized : 'medium';
}

function extractVulnerabilitiesFromText(text) {
  const vulnerabilities = [];
  const lines = text.split('\n');
  
  let currentVuln = null;
  
  for (const line of lines) {
    if (line.match(/critical|high|medium|low/i)) {
      if (currentVuln) {
        vulnerabilities.push(currentVuln);
      }
      currentVuln = {
        title: line.trim(),
        severity: extractSeverity(line),
        category: 'security',
        description: '',
        remediation: ''
      };
    } else if (currentVuln && line.trim()) {
      currentVuln.description += line.trim() + ' ';
    }
  }
  
  if (currentVuln) {
    vulnerabilities.push(currentVuln);
  }
  
  return vulnerabilities;
}

function extractSeverity(text) {
  const lower = text.toLowerCase();
  if (lower.includes('critical')) return 'critical';
  if (lower.includes('high')) return 'high';
  if (lower.includes('medium')) return 'medium';
  if (lower.includes('low')) return 'low';
  return 'info';
}

function fallbackAnalysis(code, language) {
  console.log('Running fallback AI analysis');
  
  const vulnerabilities = [];

  // Basic pattern matching for common vulnerabilities
  if (language === 'solidity') {
    // Check for reentrancy
    if (code.includes('.call{value:') || code.includes('.call.value(')) {
      vulnerabilities.push({
        title: 'Potential Reentrancy Vulnerability',
        severity: 'high',
        category: 'security',
        description: 'Contract uses low-level call with value transfer. This may be vulnerable to reentrancy attacks.',
        remediation: 'Use the Checks-Effects-Interactions pattern or ReentrancyGuard from OpenZeppelin.'
      });
    }

    // Check for tx.origin
    if (code.includes('tx.origin')) {
      vulnerabilities.push({
        title: 'Use of tx.origin for Authorization',
        severity: 'high',
        category: 'security',
        description: 'Using tx.origin for authorization is dangerous and can lead to phishing attacks.',
        remediation: 'Replace tx.origin with msg.sender for authorization checks.'
      });
    }

    // Check for missing access control
    if (!code.includes('onlyOwner') && !code.includes('require(msg.sender')) {
      vulnerabilities.push({
        title: 'Missing Access Control',
        severity: 'medium',
        category: 'security',
        description: 'Contract may lack proper access control mechanisms.',
        remediation: 'Implement role-based access control using OpenZeppelin AccessControl or Ownable.'
      });
    }

    // Check for unchecked external calls
    if (code.match(/\.call\(|\.delegatecall\(/)) {
      vulnerabilities.push({
        title: 'Unchecked External Call',
        severity: 'medium',
        category: 'security',
        description: 'External calls should have their return values checked.',
        remediation: 'Always check the return value of external calls and handle failures appropriately.'
      });
    }
  }

  if (language === 'rust') {
    // Check for unwrap usage
    if (code.includes('.unwrap()')) {
      vulnerabilities.push({
        title: 'Unsafe unwrap() Usage',
        severity: 'medium',
        category: 'quality',
        description: 'Using unwrap() can cause panics. Consider proper error handling.',
        remediation: 'Replace unwrap() with proper error handling using ? operator or match statements.'
      });
    }

    // Check for unsafe blocks
    if (code.includes('unsafe ')) {
      vulnerabilities.push({
        title: 'Unsafe Code Block',
        severity: 'high',
        category: 'security',
        description: 'Unsafe blocks bypass Rust safety guarantees and should be carefully reviewed.',
        remediation: 'Minimize unsafe code and document safety invariants thoroughly.'
      });
    }
  }

  return { vulnerabilities };
}
