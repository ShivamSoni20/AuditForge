export async function runStaticAnalysis(code, language) {
  console.log('Running static analysis...');
  
  const vulnerabilities = [];
  const gasOptimizations = [];
  
  if (language === 'solidity') {
    analyzeSolidity(code, vulnerabilities, gasOptimizations);
  } else if (language === 'rust') {
    analyzeRust(code, vulnerabilities, gasOptimizations);
  }

  const complexity = calculateComplexity(code);
  const documentation = checkDocumentation(code);

  return {
    vulnerabilities,
    gasOptimizations,
    complexity,
    documentation
  };
}

function analyzeSolidity(code, vulnerabilities, gasOptimizations) {
  const lines = code.split('\n');

  // Check for outdated Solidity version
  const pragmaMatch = code.match(/pragma solidity\s+([^;]+);/);
  if (pragmaMatch) {
    const version = pragmaMatch[1];
    if (version.includes('0.4') || version.includes('0.5') || version.includes('0.6')) {
      vulnerabilities.push({
        title: 'Outdated Solidity Version',
        severity: 'medium',
        category: 'quality',
        description: `Contract uses Solidity ${version}. Newer versions include important security fixes and optimizations.`,
        remediation: 'Update to Solidity ^0.8.0 or later for built-in overflow protection and other improvements.'
      });
    }
  }

  // Check for floating pragma
  if (pragmaMatch && pragmaMatch[1].includes('^')) {
    vulnerabilities.push({
      title: 'Floating Pragma',
      severity: 'low',
      category: 'quality',
      description: 'Contract uses a floating pragma which can lead to inconsistent compilation.',
      remediation: 'Lock pragma to a specific version for production contracts.'
    });
  }

  // Check for selfdestruct
  if (code.includes('selfdestruct') || code.includes('suicide')) {
    vulnerabilities.push({
      title: 'Use of selfdestruct',
      severity: 'high',
      category: 'security',
      description: 'selfdestruct can be dangerous and is being deprecated. It can lead to loss of funds.',
      remediation: 'Avoid using selfdestruct. Implement a pause/disable mechanism instead.'
    });
  }

  // Check for delegatecall
  if (code.includes('delegatecall')) {
    vulnerabilities.push({
      title: 'Use of delegatecall',
      severity: 'high',
      category: 'security',
      description: 'delegatecall is powerful but dangerous. It executes code in the context of the calling contract.',
      remediation: 'Ensure delegatecall is only used with trusted contracts and proper access control.'
    });
  }

  // Check for timestamp dependence
  if (code.includes('block.timestamp') || code.includes('now')) {
    vulnerabilities.push({
      title: 'Timestamp Dependence',
      severity: 'low',
      category: 'security',
      description: 'Contract relies on block.timestamp which can be manipulated by miners within limits.',
      remediation: 'Avoid using timestamps for critical logic. Use block numbers if possible.'
    });
  }

  // Gas optimizations
  if (code.includes('string ') && code.includes('memory')) {
    gasOptimizations.push({
      title: 'String Storage Optimization',
      description: 'Consider using bytes32 instead of string for fixed-length strings to save gas.',
      impact: 'Medium'
    });
  }

  if (code.includes('uint256')) {
    const uint8Count = (code.match(/uint8/g) || []).length;
    if (uint8Count > 3) {
      gasOptimizations.push({
        title: 'Pack Small Integers',
        description: 'Multiple uint8/uint16 variables can be packed into a single storage slot.',
        impact: 'High'
      });
    }
  }

  // Check for public array
  if (code.match(/public.*\[\]/)) {
    gasOptimizations.push({
      title: 'Public Array Gas Cost',
      description: 'Public arrays generate expensive getter functions. Consider making them private with custom getters.',
      impact: 'Medium'
    });
  }

  // Check for loops
  const forLoops = (code.match(/for\s*\(/g) || []).length;
  if (forLoops > 0) {
    vulnerabilities.push({
      title: 'Unbounded Loop Risk',
      severity: 'medium',
      category: 'gas',
      description: 'Loops can consume excessive gas or hit block gas limits if arrays grow too large.',
      remediation: 'Implement pagination or limits on array sizes. Avoid loops over unbounded arrays.'
    });
  }
}

function analyzeRust(code, vulnerabilities, gasOptimizations) {
  // Check for panic-inducing operations
  const panicOps = ['.unwrap()', '.expect(', 'panic!(', 'unreachable!'];
  for (const op of panicOps) {
    if (code.includes(op)) {
      vulnerabilities.push({
        title: `Potential Panic: ${op}`,
        severity: 'medium',
        category: 'quality',
        description: `Code contains ${op} which can cause runtime panics in smart contracts.`,
        remediation: 'Use proper error handling with Result types and the ? operator.'
      });
    }
  }

  // Check for overflow operations (pre-Rust 1.60)
  if (code.includes('wrapping_') || code.includes('saturating_')) {
    vulnerabilities.push({
      title: 'Explicit Overflow Handling',
      severity: 'info',
      category: 'quality',
      description: 'Code uses explicit overflow handling methods.',
      remediation: 'Ensure overflow behavior is intentional and documented.'
    });
  }

  // Check for proper error types
  if (!code.includes('Error') && !code.includes('Result')) {
    vulnerabilities.push({
      title: 'Missing Error Handling',
      severity: 'medium',
      category: 'quality',
      description: 'Contract appears to lack proper error type definitions.',
      remediation: 'Define custom error types and use Result for fallible operations.'
    });
  }

  // Check for clone usage
  const cloneCount = (code.match(/\.clone\(\)/g) || []).length;
  if (cloneCount > 5) {
    gasOptimizations.push({
      title: 'Excessive Cloning',
      description: 'Multiple .clone() calls detected. Consider using references or restructuring data flow.',
      impact: 'Medium'
    });
  }
}

function calculateComplexity(code) {
  const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('//')).length;
  const functions = (code.match(/function\s+\w+|fn\s+\w+/g) || []).length;
  const conditions = (code.match(/if\s*\(|match\s+/g) || []).length;
  const loops = (code.match(/for\s*\(|while\s*\(/g) || []).length;

  const complexityScore = conditions + loops * 2 + functions;

  if (complexityScore < 20) return 'Low';
  if (complexityScore < 50) return 'Medium';
  return 'High';
}

function checkDocumentation(code) {
  const commentLines = (code.match(/\/\/|\/\*|\*/g) || []).length;
  const codeLines = code.split('\n').filter(l => l.trim()).length;
  const ratio = commentLines / codeLines;

  if (ratio > 0.2) return 'Good';
  if (ratio > 0.1) return 'Partial';
  return 'Poor';
}
