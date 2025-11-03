import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { auditContract } from './services/auditEngine.js';
import { generatePDFReport } from './services/reportGenerator.js';
import { 
  generateCodeCorrection, 
  generateSingleFix,
  generateCodeDiff 
} from './services/codeCorrectionService.js';
import {
  fetchContractABI,
  fetchContractSourceCode,
  fetchContractCreator,
  fetchCompleteContractDetails,
  checkVerificationStatus,
  checkProxyVerification,
  getSupportedChains,
  isValidAddress
} from './services/etherscanService.js';
import { 
  processChatMessage, 
  generateFixFromChat 
} from './services/chatService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
}

// In-memory storage for audits (use database in production)
const auditHistory = [];

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Audit endpoint
app.post('/api/audit', async (req, res) => {
  try {
    const { code, language, contractName } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    console.log(`Starting audit for ${language} contract: ${contractName || 'Unnamed'}`);
    
    const auditId = uuidv4();
    const startTime = Date.now();

    // Run the audit
    const auditResult = await auditContract(code, language, contractName);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const auditRecord = {
      id: auditId,
      contractName: contractName || 'Unnamed Contract',
      language,
      timestamp: new Date().toISOString(),
      duration,
      ...auditResult
    };

    // Store in history (limit to last 50)
    auditHistory.unshift(auditRecord);
    if (auditHistory.length > 50) {
      auditHistory.pop();
    }

    console.log(`Audit completed in ${duration}s - Score: ${auditResult.score}/100`);
    
    res.json(auditRecord);
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ 
      error: 'Audit failed', 
      message: error.message 
    });
  }
});

// File upload endpoint
app.post('/api/audit/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const code = req.file.buffer.toString('utf-8');
    const language = req.body.language || 'solidity';
    const contractName = req.file.originalname;

    const auditId = uuidv4();
    const startTime = Date.now();

    const auditResult = await auditContract(code, language, contractName);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const auditRecord = {
      id: auditId,
      contractName,
      language,
      timestamp: new Date().toISOString(),
      duration,
      ...auditResult
    };

    auditHistory.unshift(auditRecord);
    if (auditHistory.length > 50) {
      auditHistory.pop();
    }

    res.json(auditRecord);
  } catch (error) {
    console.error('Upload audit error:', error);
    res.status(500).json({ 
      error: 'Audit failed', 
      message: error.message 
    });
  }
});

// Get audit history
app.get('/api/audits', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  res.json(auditHistory.slice(0, limit));
});

// Get specific audit
app.get('/api/audits/:id', (req, res) => {
  const audit = auditHistory.find(a => a.id === req.params.id);
  if (!audit) {
    return res.status(404).json({ error: 'Audit not found' });
  }
  res.json(audit);
});

// Generate PDF report
app.post('/api/report/:id', async (req, res) => {
  try {
    const audit = auditHistory.find(a => a.id === req.params.id);
    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    const pdfBuffer = await generatePDFReport(audit);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="audit-report-${audit.id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      error: 'Report generation failed', 
      message: error.message 
    });
  }
});

// Code correction endpoints
app.post('/api/correct-code', async (req, res) => {
  try {
    const { code, language, vulnerabilities } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        error: 'Code and language are required' 
      });
    }

    if (!vulnerabilities || vulnerabilities.length === 0) {
      return res.status(400).json({ 
        error: 'No vulnerabilities to fix',
        message: 'Please provide at least one vulnerability to correct'
      });
    }

    console.log(`Generating code correction for ${language} contract`);
    
    const correction = await generateCodeCorrection(code, language, vulnerabilities);
    
    if (!correction.success) {
      return res.status(400).json(correction);
    }

    // Generate diff
    const diff = generateCodeDiff(code, correction.correctedCode);
    
    res.json({
      ...correction,
      diff,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Code correction error:', error);
    res.status(500).json({ 
      error: 'Code correction failed', 
      message: error.message 
    });
  }
});

app.post('/api/fix-vulnerability', async (req, res) => {
  try {
    const { code, language, vulnerability } = req.body;

    if (!code || !language || !vulnerability) {
      return res.status(400).json({ 
        error: 'Code, language, and vulnerability are required' 
      });
    }

    console.log(`Generating fix for: ${vulnerability.title}`);
    
    const fix = await generateSingleFix(code, language, vulnerability);
    
    res.json({
      ...fix,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Fix generation error:', error);
    res.status(500).json({ 
      error: 'Fix generation failed', 
      message: error.message 
    });
  }
});

// Etherscan API endpoints
app.get('/api/etherscan/chains', (req, res) => {
  try {
    const chains = getSupportedChains();
    res.json({ success: true, chains });
  } catch (error) {
    console.error('Error fetching chains:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch supported chains' 
    });
  }
});

app.get('/api/etherscan/contract/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'ethereum' } = req.query;

    if (!isValidAddress(address)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid contract address format' 
      });
    }

    console.log(`Fetching contract details for ${address} on ${chain}`);
    
    const contractDetails = await fetchCompleteContractDetails(address, chain);
    
    res.json(contractDetails);
  } catch (error) {
    console.error('Error fetching contract details:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch contract details',
      message: error.message 
    });
  }
});

app.get('/api/etherscan/abi/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'ethereum' } = req.query;

    if (!isValidAddress(address)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid contract address format' 
      });
    }

    const abiData = await fetchContractABI(address, chain);
    res.json(abiData);
  } catch (error) {
    console.error('Error fetching ABI:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch ABI',
      message: error.message 
    });
  }
});

app.get('/api/etherscan/source/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'ethereum' } = req.query;

    if (!isValidAddress(address)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid contract address format' 
      });
    }

    const sourceData = await fetchContractSourceCode(address, chain);
    res.json(sourceData);
  } catch (error) {
    console.error('Error fetching source code:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch source code',
      message: error.message 
    });
  }
});

app.get('/api/etherscan/creator/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'ethereum' } = req.query;

    if (!isValidAddress(address)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid contract address format' 
      });
    }

    const creatorData = await fetchContractCreator(address, chain);
    res.json(creatorData);
  } catch (error) {
    console.error('Error fetching creator:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch creator info',
      message: error.message 
    });
  }
});

app.get('/api/etherscan/verify-status/:guid', async (req, res) => {
  try {
    const { guid } = req.params;
    const { chain = 'ethereum' } = req.query;

    const status = await checkVerificationStatus(guid, chain);
    res.json(status);
  } catch (error) {
    console.error('Error checking verification status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check verification status',
      message: error.message 
    });
  }
});

app.get('/api/etherscan/proxy-verify/:guid', async (req, res) => {
  try {
    const { guid } = req.params;
    const { chain = 'ethereum' } = req.query;

    const status = await checkProxyVerification(guid, chain);
    res.json(status);
  } catch (error) {
    console.error('Error checking proxy verification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check proxy verification',
      message: error.message 
    });
  }
});

// Audit contract from Etherscan address
app.post('/api/audit/etherscan', async (req, res) => {
  try {
    const { address, chain = 'ethereum' } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Contract address is required' });
    }

    if (!isValidAddress(address)) {
      return res.status(400).json({ error: 'Invalid contract address format' });
    }

    console.log(`Fetching and auditing contract ${address} from ${chain}`);

    // Fetch contract details from Etherscan
    const contractDetails = await fetchCompleteContractDetails(address, chain);

    if (!contractDetails.success) {
      return res.status(400).json({ 
        error: 'Failed to fetch contract from Etherscan',
        details: contractDetails.error 
      });
    }

    if (!contractDetails.isVerified) {
      return res.status(400).json({ 
        error: 'Contract is not verified on Etherscan',
        message: 'Only verified contracts can be audited via address'
      });
    }

    // Audit the contract
    const auditId = uuidv4();
    const startTime = Date.now();

    const auditResult = await auditContract(
      contractDetails.sourceCode, 
      'solidity', 
      contractDetails.contractName
    );
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const auditRecord = {
      id: auditId,
      contractName: contractDetails.contractName,
      contractAddress: address,
      chain,
      chainName: contractDetails.chainName,
      language: 'solidity',
      timestamp: new Date().toISOString(),
      duration,
      explorerUrl: contractDetails.explorerUrl,
      creator: contractDetails.creator,
      compilerVersion: contractDetails.compilerVersion,
      isProxy: contractDetails.isProxy,
      implementation: contractDetails.implementation,
      ...auditResult
    };

    // Store in history
    auditHistory.unshift(auditRecord);
    if (auditHistory.length > 50) {
      auditHistory.pop();
    }

    console.log(`Etherscan audit completed in ${duration}s - Score: ${auditResult.score}/100`);
    
    res.json(auditRecord);
  } catch (error) {
    console.error('Etherscan audit error:', error);
    res.status(500).json({ 
      error: 'Audit failed', 
      message: error.message 
    });
  }
});

// Chat API endpoints
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, chain = 'ethereum' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Processing chat message: ${message.substring(0, 50)}...`);

    const response = await processChatMessage(message, null, chain);
    
    res.json({
      success: true,
      ...response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process message', 
      message: error.message 
    });
  }
});

app.post('/api/chat/message-with-file', upload.single('file'), async (req, res) => {
  try {
    const { message, chain = 'ethereum' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let attachedFile = null;
    if (req.file) {
      const code = req.file.buffer.toString('utf-8');
      const filename = req.file.originalname;
      const language = filename.endsWith('.rs') ? 'rust' : 'solidity';
      
      attachedFile = {
        code,
        filename,
        language
      };
    }

    console.log(`Processing chat message with file: ${message.substring(0, 50)}...`);

    const response = await processChatMessage(message, attachedFile, chain);
    
    res.json({
      success: true,
      ...response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat message with file error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process message', 
      message: error.message 
    });
  }
});

app.post('/api/chat/generate-fix', async (req, res) => {
  try {
    const { code, language, vulnerabilities } = req.body;

    if (!code || !language || !vulnerabilities) {
      return res.status(400).json({ 
        error: 'Code, language, and vulnerabilities are required' 
      });
    }

    console.log(`Generating fix for contract via chat`);

    const fix = await generateFixFromChat(code, language, vulnerabilities);
    
    res.json({
      success: fix.success,
      ...fix,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat generate fix error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate fix', 
      message: error.message 
    });
  }
});

// Serve frontend for all non-API routes (must be last)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AuditForge running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Frontend & API served on port ${PORT}`);
  }
});

// Export for Vercel serverless
export default app;
