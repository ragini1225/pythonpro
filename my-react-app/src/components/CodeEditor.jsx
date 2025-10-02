import React, { useState, useEffect } from 'react';
import { Play, Copy, Download, FileText } from 'lucide-react';

const CodeEditor = ({ initialCode, onExecute, isExecuting }) => {
  const [code, setCode] = useState(initialCode);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  const handleExecute = () => {
    if (!isExecuting) {
      onExecute(code);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <FileText className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300 font-medium">script.py</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200 hover:scale-105"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={downloadCode}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200 hover:scale-105"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isExecuting
                ? 'bg-emerald-600/50 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105'
            } text-white shadow-lg`}
          >
            <Play className={`w-4 h-4 ${isExecuting ? 'animate-pulse' : ''}`} />
            <span>{isExecuting ? 'Running...' : 'Execute'}</span>
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col items-center py-4 px-3 bg-slate-800/30 border-r border-slate-700/50 text-slate-500 text-sm font-mono">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="h-6 flex items-center">
              {i + 1}
            </div>
          ))}
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 p-4 bg-transparent text-slate-100 font-mono text-sm resize-none outline-none min-h-[400px] leading-6"
          spellCheck={false}
          style={{
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;