import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { auditContract } from './services/auditEngine.js';
import { generatePDFReport } from './services/reportGenerator.js';
import { 
  generateCodeCorrection, 
  generateSingleFix,
  generateCodeDiff 
} from './services/codeCorrectionService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

    if (!code || !language || !vulnerabilities) {
      return res.status(400).json({ 
        error: 'Code, language, and vulnerabilities are required' 
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

app.listen(PORT, () => {
  console.log(`🚀 AuditForge API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
