import { analyzeWithAI } from './aiService.js';
import { runStaticAnalysis } from './staticAnalyzer.js';
import { checkDepinVulnerabilities } from './depinAnalyzer.js';

export async function auditContract(code, language, contractName) {
  console.log(`Auditing ${language} contract...`);
  
  // Run multiple analysis passes in parallel
  const [staticResults, aiResults, depinResults] = await Promise.all([
    runStaticAnalysis(code, language),
    analyzeWithAI(code, language, contractName),
    checkDepinVulnerabilities(code, language)
  ]);

  // Combine all vulnerabilities
  const allVulnerabilities = [
    ...staticResults.vulnerabilities,
    ...aiResults.vulnerabilities,
    ...depinResults.vulnerabilities
  ];

  // Deduplicate and sort by severity
  const uniqueVulnerabilities = deduplicateVulnerabilities(allVulnerabilities);
  const sortedVulnerabilities = sortBySeverity(uniqueVulnerabilities);

  // Calculate overall score
  const score = calculateScore(sortedVulnerabilities);

  // Categorize vulnerabilities
  const categories = categorizeVulnerabilities(sortedVulnerabilities);

  // Generate summary
  const summary = generateSummary(sortedVulnerabilities, depinResults, score);

  return {
    score,
    summary,
    vulnerabilities: sortedVulnerabilities,
    categories,
    depinInsights: depinResults.insights,
    nodeOpsRecommendations: depinResults.nodeOpsRecommendations,
    gasOptimizations: staticResults.gasOptimizations || [],
    codeQuality: {
      complexity: staticResults.complexity || 'Medium',
      testCoverage: 'N/A',
      documentation: staticResults.documentation || 'Partial'
    }
  };
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
