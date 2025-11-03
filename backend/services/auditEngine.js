import { analyzeWithAI } from './aiService.js';
import { runStaticAnalysis } from './staticAnalyzer.js';
import { checkDepinVulnerabilities } from './depinAnalyzer.js';

export async function auditContract(code, language, contractName) {
  console.log(`Auditing ${language} contract...`);
  
  try {
    // Run multiple analysis passes in parallel with error handling
    const [staticResults, aiResults, depinResults] = await Promise.allSettled([
      runStaticAnalysis(code, language),
      analyzeWithAI(code, language, contractName),
      checkDepinVulnerabilities(code, language)
    ]);

    // Extract results with fallbacks
    const static_data = staticResults.status === 'fulfilled' ? staticResults.value : { vulnerabilities: [], gasOptimizations: [] };
    const ai_data = aiResults.status === 'fulfilled' ? aiResults.value : { vulnerabilities: [] };
    const depin_data = depinResults.status === 'fulfilled' ? depinResults.value : { vulnerabilities: [], insights: [], nodeOpsRecommendations: [] };

    // Combine all vulnerabilities with validation
    const allVulnerabilities = [
      ...(Array.isArray(static_data.vulnerabilities) ? static_data.vulnerabilities : []),
      ...(Array.isArray(ai_data.vulnerabilities) ? ai_data.vulnerabilities : []),
      ...(Array.isArray(depin_data.vulnerabilities) ? depin_data.vulnerabilities : [])
    ].filter(v => v && typeof v === 'object');

    // Deduplicate and sort by severity
    const uniqueVulnerabilities = deduplicateVulnerabilities(allVulnerabilities);
    const sortedVulnerabilities = sortBySeverity(uniqueVulnerabilities);

    // Calculate overall score (guaranteed to be a number)
    const score = calculateScore(sortedVulnerabilities);

    // Categorize vulnerabilities
    const categories = categorizeVulnerabilities(sortedVulnerabilities);

    // Generate summary
    const summary = generateSummary(sortedVulnerabilities, depin_data, score);

    return {
      score,
      riskLevel: summary.riskLevel,
      summary,
      vulnerabilities: sortedVulnerabilities,
      categories,
      depinInsights: Array.isArray(depin_data.insights) ? depin_data.insights : [],
      nodeOpsRecommendations: Array.isArray(depin_data.nodeOpsRecommendations) ? depin_data.nodeOpsRecommendations : [],
      gasOptimizations: Array.isArray(static_data.gasOptimizations) ? static_data.gasOptimizations : [],
      codeQuality: {
        complexity: static_data.complexity || 'Medium',
        testCoverage: 'N/A',
        documentation: static_data.documentation || 'Partial'
      },
      analysisErrors: [
        staticResults.status === 'rejected' ? `Static analysis: ${staticResults.reason}` : null,
        aiResults.status === 'rejected' ? `AI analysis: ${aiResults.reason}` : null,
        depinResults.status === 'rejected' ? `DePIN analysis: ${depinResults.reason}` : null
      ].filter(Boolean)
    };
  } catch (error) {
    console.error('Critical error in audit engine:', error);
    // Return minimal valid response
    return {
      score: 0,
      riskLevel: 'Critical',
      summary: {
        riskLevel: 'Critical',
        score: 0,
        totalIssues: 0,
        criticalIssues: 0,
        highIssues: 0,
        mediumIssues: 0,
        recommendation: 'Audit failed due to system error. Please try again.',
        depinReady: false,
        nodeOpsCompatible: false
      },
      vulnerabilities: [],
      categories: { security: [], depin: [], nodeops: [], gas: [], quality: [] },
      depinInsights: [],
      nodeOpsRecommendations: [],
      gasOptimizations: [],
      codeQuality: { complexity: 'Unknown', testCoverage: 'N/A', documentation: 'Unknown' },
      analysisErrors: [error.message]
    };
  }
}

function deduplicateVulnerabilities(vulnerabilities) {
  const seen = new Map();
  
  for (const vuln of vulnerabilities) {
    const key = `${vuln.title}-${vuln.line || 0}`;
    if (!seen.has(key) || seen.get(key).severity < vuln.severity) {
      seen.set(key, vuln);
    }
  }
  
  return Array.from(seen.values());
}

function sortBySeverity(vulnerabilities) {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  return vulnerabilities.sort((a, b) => 
    severityOrder[a.severity] - severityOrder[b.severity]
  );
}

function calculateScore(vulnerabilities) {
  let score = 100;
  
  for (const vuln of vulnerabilities) {
    switch (vuln.severity) {
      case 'critical':
        score -= 20;
        break;
      case 'high':
        score -= 10;
        break;
      case 'medium':
        score -= 5;
        break;
      case 'low':
        score -= 2;
        break;
      case 'info':
        score -= 0.5;
        break;
    }
  }
  
  return Math.max(0, Math.round(score));
}

function categorizeVulnerabilities(vulnerabilities) {
  const categories = {
    security: [],
    depin: [],
    nodeops: [],
    gas: [],
    quality: []
  };

  for (const vuln of vulnerabilities) {
    if (vuln.category) {
      if (categories[vuln.category]) {
        categories[vuln.category].push(vuln);
      }
    }
  }

  return categories;
}

function generateSummary(vulnerabilities, depinResults, score) {
  const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
  const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;

  let riskLevel = 'Low';
  if (criticalCount > 0) riskLevel = 'Critical';
  else if (highCount > 0) riskLevel = 'High';
  else if (mediumCount > 2) riskLevel = 'Medium';

  let recommendation = '';
  if (score >= 80) {
    recommendation = 'Contract shows good security practices. Address remaining issues before deployment.';
  } else if (score >= 60) {
    recommendation = 'Contract has moderate security concerns. Review and fix identified vulnerabilities.';
  } else {
    recommendation = 'Contract has significant security issues. Major refactoring recommended before deployment.';
  }

  return {
    riskLevel,
    score,
    totalIssues: vulnerabilities.length,
    criticalIssues: criticalCount,
    highIssues: highCount,
    mediumIssues: mediumCount,
    recommendation,
    depinReady: depinResults.depinReady,
    nodeOpsCompatible: depinResults.nodeOpsCompatible
  };
}
