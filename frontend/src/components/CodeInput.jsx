import { useState } from 'react';
import axios from 'axios';
import { Upload, Code, Loader2, Play } from 'lucide-react';

const EXAMPLE_CONTRACTS = {
  solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NodeOperatorStaking {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    
    function stake() public payable {
        stakes[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) public {
        require(stakes[msg.sender] >= amount, "Insufficient stake");
        stakes[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
    
    function distributeRewards() public {
        // Distribute rewards to stakers
        rewards[msg.sender] += 100;
    }
}`,
  rust: `use anchor_lang::prelude::*;

#[program]
pub mod node_staking {
    use super::*;
    
    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let stake_account = &mut ctx.accounts.stake_account;
        stake_account.amount += amount;
        Ok(())
    }
    
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let stake_account = &mut ctx.accounts.stake_account;
        stake_account.amount -= amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub stake_account: Account<'info, StakeAccount>,
}

#[account]
pub struct StakeAccount {
    pub amount: u64,
}`
};

function CodeInput({ onAuditComplete, isAuditing, setIsAuditing }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('solidity');
  const [contractName, setContractName] = useState('');
  const [error, setError] = useState('');

  const handleAudit = async () => {
    if (!code.trim()) {
      setError('Please enter contract code');
      return;
    }

    setError('');
    setIsAuditing(true);

    try {
      const response = await axios.post('/api/audit', {
        code,
        language,
        contractName: contractName || 'Unnamed Contract'
      });

      // Pass both audit result and context for code correction
      onAuditComplete(response.data, {
        code,
        language,
        contractName: contractName || 'Unnamed Contract'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Audit failed. Please try again.');
      console.error('Audit error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
      setContractName(file.name);
    };
    reader.readAsText(file);
  };

  const loadExample = () => {
    setCode(EXAMPLE_CONTRACTS[language]);
    setContractName(`Example ${language === 'solidity' ? 'Solidity' : 'Rust'} Contract`);
  };

  return (
    <div className="card">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
        <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
        Smart Contract Input
      </h2>

      {/* Language Selection */}
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium mb-2">Language</label>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setLanguage('solidity')}
            className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
              language === 'solidity'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Solidity
          </button>
          <button
            onClick={() => setLanguage('rust')}
            className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
              language === 'rust'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Rust
          </button>
        </div>
      </div>

      {/* Contract Name */}
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium mb-2">Contract Name (Optional)</label>
        <input
          type="text"
          value={contractName}
          onChange={(e) => setContractName(e.target.value)}
          placeholder="MyContract.sol"
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all"
        />
      </div>

      {/* Code Editor */}
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium mb-2">Contract Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`Paste your ${language} contract code here...`}
          className="w-full h-48 sm:h-64 lg:h-80 px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={handleAudit}
          disabled={isAuditing}
          className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 sm:py-2.5 text-sm sm:text-base font-semibold"
        >
          {isAuditing ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Run Audit
            </>
          )}
        </button>

        <div className="flex gap-2 sm:gap-3">
          <label className="flex-1 sm:flex-none btn-secondary flex items-center justify-center gap-2 cursor-pointer py-3 sm:py-2.5 text-sm sm:text-base">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Upload File</span>
            <span className="sm:hidden">Upload</span>
            <input
              type="file"
              accept=".sol,.rs"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={loadExample}
            className="flex-1 sm:flex-none btn-secondary py-3 sm:py-2.5 text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Load Example</span>
            <span className="sm:hidden">Example</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-300 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs sm:text-sm text-blue-300">
        💡 <span className="hidden sm:inline">Tip: Upload your contract or paste code above. The audit typically completes in under 60 seconds.</span>
        <span className="sm:hidden">Upload or paste code. Audit takes ~60s.</span>
      </div>
    </div>
  );
}

export default CodeInput;
