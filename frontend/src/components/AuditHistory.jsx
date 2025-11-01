import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, FileText, AlertTriangle, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

function AuditHistory({ onSelectAudit }) {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/audits?limit=20`);
      setAudits(response.data);
    } catch (error) {
      console.error('Failed to fetch audits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-900/30 border-green-500';
    if (score >= 60) return 'bg-yellow-900/30 border-yellow-500';
    return 'bg-red-900/30 border-red-500';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (audits.length === 0) {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Audits Yet</h3>
        <p className="text-gray-400">Run your first audit to see it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Recent Audits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audits.map((audit) => (
          <div
            key={audit.id}
            onClick={() => onSelectAudit(audit)}
            className="card cursor-pointer hover:border-blue-500 transition-colors"
          >
            {/* Score Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-3 ${getScoreBgColor(audit.score)}`}>
              <TrendingUp className="w-4 h-4" />
              <span className={`font-bold ${getScoreColor(audit.score)}`}>
                {audit.score}/100
              </span>
            </div>

            {/* Contract Name */}
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-400" />
              {audit.contractName}
            </h3>

            {/* Language */}
            <div className="inline-block px-2 py-1 bg-gray-700 rounded text-xs font-medium mb-3">
              {audit.language.toUpperCase()}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
              <div className="text-center">
                <div className="font-bold text-red-400">{audit.summary.criticalIssues}</div>
                <div className="text-xs text-gray-400">Critical</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-400">{audit.summary.highIssues}</div>
                <div className="text-xs text-gray-400">High</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-yellow-400">{audit.summary.mediumIssues}</div>
                <div className="text-xs text-gray-400">Medium</div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {new Date(audit.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditHistory;
