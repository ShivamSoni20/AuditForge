import { useState } from 'react';
import axios from 'axios';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Download, 
  Clock,
  TrendingUp,
  Network,
  Zap
} from 'lucide-react';
import CodeCorrection from './CodeCorrection';
import { API_URL } from '../config';

function AuditResults({ audit, isAuditing, originalCode, language, contractName }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const response = await axios.post(`${API_URL}/api/report/${audit.id}`, {}, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-report-${audit.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (isAuditing) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Analyzing Contract...</h3>
          <p className="text-gray-400 text-center">
            Running multi-layer security analysis<br />
            This usually takes 30-60 seconds
          </p>
        </div>
      </div>
    );
  }

  if (!audit) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-900/30 border-red-500 text-red-300',
      high: 'bg-orange-900/30 border-orange-500 text-orange-300',
      medium: 'bg-yellow-900/30 border-yellow-500 text-yellow-300',
      low: 'bg-blue-900/30 border-blue-500 text-blue-300',
      info: 'bg-gray-700 border-gray-500 text-gray-300'
    };
    return colors[severity] || colors.info;
  };

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Audit Results</h2>
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {/* Score Display */}
        <div className="text-center mb-6 p-6 bg-gray-900 rounded-lg">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(audit.score)}`}>
            {audit.score}/100
          </div>
          <p className="text-gray-400">{audit.summary.recommendation}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{audit.summary.criticalIssues}</div>
            <div className="text-sm text-gray-400">Critical</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-400">{audit.summary.highIssues}</div>
            <div className="text-sm text-gray-400">High</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-400">{audit.summary.mediumIssues}</div>
            <div className="text-sm text-gray-400">Medium</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{audit.summary.totalIssues}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {audit.duration.toFixed(2)}s
          </div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            {audit.summary.depinReady ? 'DePIN Ready' : 'DePIN Issues Found'}
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {audit.summary.nodeOpsCompatible ? 'NodeOps Compatible' : 'NodeOps Review Needed'}
          </div>
        </div>
      </div>

      {/* Vulnerabilities */}
      {audit.vulnerabilities && audit.vulnerabilities.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Vulnerabilities Found
          </h3>
          <div className="space-y-4">
            {audit.vulnerabilities.slice(0, 10).map((vuln, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityColor(vuln.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{vuln.title}</h4>
                  <span className="text-xs uppercase font-bold px-2 py-1 rounded">
                    {vuln.severity}
                  </span>
                </div>
                <p className="text-sm mb-2 opacity-90">{vuln.description}</p>
                <div className="text-sm">
                  <strong>Fix:</strong> {vuln.remediation}
                </div>
                {vuln.line && (
                  <div className="text-xs mt-2 opacity-75">Line: {vuln.line}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DePIN Insights */}
      {audit.depinInsights && audit.depinInsights.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" />
            DePIN Insights
          </h3>
          <div className="space-y-3">
            {audit.depinInsights.map((insight, index) => (
              <div key={index} className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <div className="font-semibold text-purple-300">{insight.category}</div>
                <div className="text-sm text-gray-300">{insight.finding}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NodeOps Recommendations */}
      {audit.nodeOpsRecommendations && audit.nodeOpsRecommendations.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            NodeOps Recommendations
          </h3>
          <div className="space-y-3">
            {audit.nodeOpsRecommendations.map((rec, index) => (
              <div key={index} className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="font-semibold text-green-300">{rec.title}</div>
                <div className="text-sm text-gray-300">{rec.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gas Optimizations */}
      {audit.gasOptimizations && audit.gasOptimizations.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Gas Optimizations
          </h3>
          <div className="space-y-3">
            {audit.gasOptimizations.map((opt, index) => (
              <div key={index} className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <div className="font-semibold text-yellow-300">{opt.title}</div>
                <div className="text-sm text-gray-300">{opt.description}</div>
                <div className="text-xs text-yellow-400 mt-1">Impact: {opt.impact}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Correction */}
      {audit.vulnerabilities && audit.vulnerabilities.length > 0 && originalCode && (
        <CodeCorrection
          originalCode={originalCode}
          language={language}
          vulnerabilities={audit.vulnerabilities}
          contractName={contractName}
        />
      )}
    </div>
  );
}

export default AuditResults;
