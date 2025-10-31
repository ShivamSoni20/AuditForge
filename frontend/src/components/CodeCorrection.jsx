import { useState } from 'react';
import axios from 'axios';
import { Wand2, Download, Copy, Check, AlertCircle, Code2, FileCode } from 'lucide-react';

function CodeCorrection({ originalCode, language, vulnerabilities, contractName }) {
  const [correcting, setCorrecting] = useState(false);
  const [correction, setCorrection] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  const handleCorrectCode = async () => {
    setCorrecting(true);
    setError(null);
    setCorrection(null);

    try {
      // Only fix critical and high severity issues
      const criticalVulns = vulnerabilities.filter(
        v => v.severity === 'critical' || v.severity === 'high'
      );

      const response = await axios.post('/api/correct-code', {
        code: originalCode,
        language,
        vulnerabilities: criticalVulns
      });

      setCorrection(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate code correction');
    } finally {
      setCorrecting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(correction.correctedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([correction.correctedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName || 'contract'}-corrected.${language === 'solidity' ? 'sol' : 'rs'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'high').length;

  return (
    <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Wand2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Code Correction</h3>
            <p className="text-sm text-gray-400">
              Automatically fix {criticalCount + highCount} critical/high severity issues
            </p>
          </div>
        </div>

        {!correction && (
          <button
            onClick={handleCorrectCode}
            disabled={correcting}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            <Wand2 className={`w-4 h-4 ${correcting ? 'animate-spin' : ''}`} />
            {correcting ? 'Generating Fix...' : 'Fix Code'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {correcting && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">AI is analyzing and fixing your code...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
        </div>
      )}

      {correction && correction.success && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">✓ Code Corrected Successfully</h4>
            <p className="text-gray-300 text-sm">{correction.summary}</p>
          </div>

          {/* Fixes Applied */}
          {correction.fixes && correction.fixes.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Fixes Applied:</h4>
              <ul className="space-y-2">
                {correction.fixes.map((fix, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowDiff(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                !showDiff
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Code2 className="w-4 h-4 inline mr-2" />
              Corrected Code
            </button>
            <button
              onClick={() => setShowDiff(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                showDiff
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FileCode className="w-4 h-4 inline mr-2" />
              View Changes
            </button>
          </div>

          {/* Code Display */}
          {!showDiff ? (
            <div className="relative">
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button
                  onClick={handleCopyCode}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Download code"
                >
                  <Download className="w-4 h-4 text-gray-300" />
                </button>
              </div>
              <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-gray-300">{correction.correctedCode}</code>
              </pre>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <h4 className="text-white font-semibold mb-3">Code Changes:</h4>
              <div className="space-y-1 text-sm font-mono">
                {correction.diff?.modified?.map((change, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start gap-2 text-red-400 bg-red-500/10 px-2 py-1 rounded">
                      <span className="text-gray-500">-</span>
                      <span>{change.original}</span>
                    </div>
                    <div className="flex items-start gap-2 text-green-400 bg-green-500/10 px-2 py-1 rounded">
                      <span className="text-gray-500">+</span>
                      <span>{change.corrected}</span>
                    </div>
                  </div>
                ))}
                {correction.diff?.added?.map((line, index) => (
                  <div key={`add-${index}`} className="flex items-start gap-2 text-green-400 bg-green-500/10 px-2 py-1 rounded">
                    <span className="text-gray-500">+</span>
                    <span>{line.content}</span>
                  </div>
                ))}
                {correction.diff?.removed?.map((line, index) => (
                  <div key={`rem-${index}`} className="flex items-start gap-2 text-red-400 bg-red-500/10 px-2 py-1 rounded">
                    <span className="text-gray-500">-</span>
                    <span>{line.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Download Fixed Code
            </button>
            <button
              onClick={handleCopyCode}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeCorrection;
