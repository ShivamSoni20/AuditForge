import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Paperclip, Loader2, Bot, User, Download, Code, AlertCircle, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';
import ReactMarkdown from 'react-markdown';

function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `👋 Hi! I'm your smart contract security assistant. I can help you:\n\n🔍 **Analyze contracts** - Paste an address or upload a file\n🔨 **Fix vulnerabilities** - Get corrected contract code\n💬 **Answer questions** - Ask me anything about contract security\n\nTry pasting a contract address like: \`0xdAC17F958D2ee523a2206206994597C13D831ec7\``,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [chain, setChain] = useState('ethereum');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachedFile) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      file: attachedFile ? attachedFile.name : null,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;

      if (attachedFile) {
        const formData = new FormData();
        formData.append('message', inputMessage || 'Analyze this contract');
        formData.append('file', attachedFile);
        formData.append('chain', chain);

        const res = await fetch(`${API_URL}/api/chat/message-with-file`, {
          method: 'POST',
          body: formData
        });
        response = await res.json();
        setAttachedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const res = await fetch(`${API_URL}/api/chat/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: inputMessage,
            chain
          })
        });
        response = await res.json();
      }

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.message,
          data: response.data,
          suggestions: response.suggestions,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.error || 'Failed to process message');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `❌ Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleGenerateFix = async (data) => {
    if (!data || !data.auditResult) return;

    setIsLoading(true);
    const loadingMessage = {
      id: Date.now(),
      type: 'bot',
      content: '🔨 Generating corrected contract code...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await fetch(`${API_URL}/api/chat/generate-fix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: data.code || data.contractDetails?.sourceCode,
          language: data.language || 'solidity',
          vulnerabilities: data.auditResult.vulnerabilities
        })
      });

      const result = await response.json();

      if (result.success) {
        const fixMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: `✅ **Contract Fixed!**\n\n${result.explanation}\n\n**Changes Made:**\n${result.changes?.map((c, i) => `${i + 1}. ${c}`).join('\n') || 'Multiple security improvements applied'}`,
          data: {
            type: 'fix',
            correctedCode: result.correctedCode
          },
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fixMessage]);
      } else {
        throw new Error(result.error || 'Failed to generate fix');
      }
    } catch (error) {
      console.error('Fix generation error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `❌ Failed to generate fix: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCode = (code, filename = 'fixed_contract.sol') => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold">AI Security Assistant</h2>
        </div>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ethereum">Ethereum</option>
          <option value="bsc">BSC</option>
          <option value="polygon">Polygon</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="optimism">Optimism</option>
          <option value="base">Base</option>
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.type === 'bot' ? 'bg-blue-600' : 'bg-gray-700'
            }`}>
              {msg.type === 'bot' ? (
                <Bot className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            
            <div className={`flex-1 ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
              <div className={`inline-block max-w-[85%] p-3 rounded-lg ${
                msg.type === 'bot' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-blue-600'
              }`}>
                {msg.file && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                    <Paperclip className="w-4 h-4" />
                    <span>{msg.file}</span>
                  </div>
                )}
                
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Audit Results Card */}
                {msg.data && msg.data.type === 'audit' && (
                  <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Security Score</span>
                      <span className={`text-lg font-bold ${
                        msg.data.auditResult.score >= 80 ? 'text-green-400' :
                        msg.data.auditResult.score >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {msg.data.auditResult.score}/100
                      </span>
                    </div>
                    
                    {msg.data.auditResult.vulnerabilities?.length > 0 && (
                      <button
                        onClick={() => handleGenerateFix(msg.data)}
                        className="w-full mt-2 btn-primary py-2 text-sm flex items-center justify-center gap-2"
                      >
                        <Code className="w-4 h-4" />
                        Generate Fixed Contract
                      </button>
                    )}
                  </div>
                )}

                {/* Fixed Code Card */}
                {msg.data && msg.data.type === 'fix' && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleDownloadCode(msg.data.correctedCode)}
                      className="w-full btn-secondary py-2 text-sm flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Fixed Contract
                    </button>
                  </div>
                )}

                {/* Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-400">Suggestions:</p>
                    {msg.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="inline-block bg-gray-800 border border-gray-700 p-3 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 pt-4">
        {attachedFile && (
          <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
            <Paperclip className="w-4 h-4 text-blue-400" />
            <span className="text-sm flex-1">{attachedFile.name}</span>
            <button
              onClick={() => {
                setAttachedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".sol,.rs"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary px-3 py-2"
            disabled={isLoading}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Ask about a contract or paste an address..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputMessage.trim() && !attachedFile)}
            className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          💡 Tip: Paste a contract address, upload a .sol/.rs file, or ask questions about smart contract security
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
