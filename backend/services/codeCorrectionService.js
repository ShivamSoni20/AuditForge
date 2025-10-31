import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize AIML API client
const aimlClient = process.env.AIML_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.AIML_API_KEY,
      baseURL: process.env.AIML_BASE_URL || 'https://api.aimlapi.com/v1'
    })
  : null;

/**
 * Generate corrected code for vulnerabilities
 */
export async function generateCodeCorrection(code, language, vulnerabilities) {
  if (!aimlClient) {
    console.log('No AIML API key found, code correction unavailable');
    return {
      success: false,
      message: 'AI API key required for code correction feature',
      correctedCode: null
    };
  }

  try {
    const prompt = buildCorrectionPrompt(code, language, vulnerabilities);
    
    console.log('Generating code corrections with AIML API...');
    const completion = await aimlClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert smart contract developer specializing in security fixes. Generate corrected code that fixes all identified vulnerabilities while maintaining the original functionality. Provide clear explanations for each fix."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 3000
    });

    const response = completion.choices[0].message.content;
    console.log('Code correction generated successfully');
    
    return parseCorrectionResponse(response, code);
  } catch (error) {
    console.error('Code correction error:', error.message);
    return {
      success: false,
      message: 'Failed to generate code correction',
      error: error.message,
      correctedCode: null
    };
  }
}

/**
 * Generate fix for a specific vulnerability
 */
export async function generateSingleFix(code, language, vulnerability) {
  if (!aimlClient) {
    return {
      success: false,
      message: 'AI API key required for code correction',
      fixedCode: null
    };
  }

  try {
    const prompt = `Fix this specific vulnerability in the ${language} code:

Vulnerability: ${vulnerability.title}
Severity: ${vulnerability.severity}
Description: ${vulnerability.description}
${vulnerability.line ? `Line: ${vulnerability.line}` : ''}

Original Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. The corrected code
2. Explanation of the fix
3. Why this fix resolves the vulnerability

Format your response as:
CORRECTED_CODE:
\`\`\`${language}
[corrected code here]
\`\`\`

EXPLANATION:
[explanation here]`;

    const completion = await aimlClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert smart contract security engineer. Provide precise, secure fixes for vulnerabilities."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    return parseSingleFixResponse(response);
  } catch (error) {
    console.error('Single fix error:', error.message);
    return {
      success: false,
      message: 'Failed to generate fix',
      error: error.message
    };
  }
}

function buildCorrectionPrompt(code, language, vulnerabilities) {
  const vulnList = vulnerabilities
    .filter(v => v.severity === 'critical' || v.severity === 'high')
    .map((v, i) => `${i + 1}. ${v.title} (${v.severity})${v.line ? ` - Line ${v.line}` : ''}
   ${v.description}`)
    .join('\n');

  return `Fix all critical and high severity vulnerabilities in this ${language} smart contract.

Original Code:
\`\`\`${language}
${code}
\`\`\`

Vulnerabilities to Fix:
${vulnList}

Provide:
1. Complete corrected code with all vulnerabilities fixed
2. Summary of changes made
3. List of fixes applied

Format your response as:
CORRECTED_CODE:
\`\`\`${language}
[complete corrected code here]
\`\`\`

CHANGES_SUMMARY:
[summary of changes]

FIXES_APPLIED:
- [fix 1]
- [fix 2]
...`;
}

function parseCorrectionResponse(response, originalCode) {
  try {
    // Extract corrected code
    const codeMatch = response.match(/CORRECTED_CODE:\s*```[\w]*\n([\s\S]*?)```/);
    const correctedCode = codeMatch ? codeMatch[1].trim() : null;

    // Extract summary
    const summaryMatch = response.match(/CHANGES_SUMMARY:\s*([\s\S]*?)(?=FIXES_APPLIED:|$)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    // Extract fixes
    const fixesMatch = response.match(/FIXES_APPLIED:\s*([\s\S]*?)$/);
    const fixesText = fixesMatch ? fixesMatch[1].trim() : '';
    const fixes = fixesText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());

    if (!correctedCode) {
      return {
        success: false,
        message: 'Could not extract corrected code from response',
        correctedCode: null
      };
    }

    return {
      success: true,
      correctedCode,
      originalCode,
      summary,
      fixes,
      message: 'Code correction generated successfully'
    };
  } catch (error) {
    console.error('Error parsing correction response:', error);
    return {
      success: false,
      message: 'Failed to parse correction response',
      correctedCode: null
    };
  }
}

function parseSingleFixResponse(response) {
  try {
    const codeMatch = response.match(/CORRECTED_CODE:\s*```[\w]*\n([\s\S]*?)```/);
    const fixedCode = codeMatch ? codeMatch[1].trim() : null;

    const explanationMatch = response.match(/EXPLANATION:\s*([\s\S]*?)$/);
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    return {
      success: !!fixedCode,
      fixedCode,
      explanation,
      message: fixedCode ? 'Fix generated successfully' : 'Could not generate fix'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to parse fix response'
    };
  }
}

/**
 * Compare original and corrected code
 */
export function generateCodeDiff(originalCode, correctedCode) {
  const originalLines = originalCode.split('\n');
  const correctedLines = correctedCode.split('\n');
  
  const diff = {
    added: [],
    removed: [],
    modified: [],
    unchanged: []
  };

  const maxLength = Math.max(originalLines.length, correctedLines.length);
  
  for (let i = 0; i < maxLength; i++) {
    const original = originalLines[i] || '';
    const corrected = correctedLines[i] || '';
    
    if (original === corrected) {
      diff.unchanged.push({ line: i + 1, content: original });
    } else if (!original && corrected) {
      diff.added.push({ line: i + 1, content: corrected });
    } else if (original && !corrected) {
      diff.removed.push({ line: i + 1, content: original });
    } else {
      diff.modified.push({ 
        line: i + 1, 
        original, 
        corrected 
      });
    }
  }

  return diff;
}
