import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, RotateCcw, Download, Share2, Settings, Maximize2, Minimize2, Bot, Send, Copy, Trash2, Save, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Editor } from '@monaco-editor/react';

const CodeExecutor = () => {
  const [code, setCode] = useState(`# Welcome to Python Playground!
# Try running some code below:

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Calculate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")

print("\\nHello, Python World! 🐍")`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('vs-dark');
  
  // AI Chatbot state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your Python coding assistant. I can help you with:\n\n• Writing and debugging code\n• Explaining Python concepts\n• Optimizing your algorithms\n• Suggesting improvements\n\nWhat would you like to work on?",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const editorRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const executeCode = async () => {
    setIsRunning(true);
    const startTime = Date.now();
    
    try {
      // Simulate code execution (replace with actual Python execution)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const executionTime = Date.now() - startTime;
      const mockOutput = `Executing Python code...\n\nF(0) = 0\nF(1) = 1\nF(2) = 1\nF(3) = 2\nF(4) = 3\nF(5) = 5\nF(6) = 8\nF(7) = 13\nF(8) = 21\nF(9) = 34\n\nHello, Python World! 🐍\n\nExecution completed successfully in ${executionTime}ms`;
      
      setOutput(mockOutput);
      
      const result = {
        output: mockOutput,
        executionTime,
        timestamp: new Date()
      };
      
      setExecutionHistory(prev => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setOutput(errorMessage);

      // Log the error to use the variable and avoid unused error
      console.error('Code execution error:', error);

      const result = {
        output: '',
        error: errorMessage,
        executionTime,
        timestamp: new Date()
      };

      setExecutionHistory(prev => [result, ...prev.slice(0, 9)]);
    } finally {
      setIsRunning(false);
    }
  };

  const stopExecution = () => {
    setIsRunning(false);
    setOutput(prev => prev + '\n\n[Execution stopped by user]');
  };

  const clearOutput = () => {
    setOutput('');
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python_code.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareCode = async () => {
    try {
      await navigator.share({
        title: 'Python Code',
        text: code,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    }
  };

  const insertCodeFromChat = (codeSnippet) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = selection || {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1
      };
      
      editor.executeEdits('ai-insert', [{
        range,
        text: codeSnippet
      }]);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "Here's a more efficient version of your Fibonacci function using memoization:",
          codeSnippet: `def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]

# Much faster for large numbers!
print([fibonacci_memo(i) for i in range(20)])`
        },
        {
          content: "I can help you optimize this code! Here's a list comprehension approach:",
          codeSnippet: `# More Pythonic way to generate Fibonacci sequence
def fib_sequence(n):
    a, b = 0, 1
    return [a := a + b for _ in range(n)]

print(fib_sequence(10))`
        },
        {
          content: "Great question! Here's how you can add error handling to your code:",
          codeSnippet: `def safe_fibonacci(n):
    try:
        if not isinstance(n, int):
            raise TypeError("Input must be an integer")
        if n < 0:
            raise ValueError("Input must be non-negative")
        
        if n <= 1:
            return n
        return safe_fibonacci(n-1) + safe_fibonacci(n-2)
    except (TypeError, ValueError) as e:
        print(f"Error: {e}")
        return None

# Test with different inputs
print(safe_fibonacci(10))
print(safe_fibonacci(-5))
print(safe_fibonacci("hello"))`
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: randomResponse.content,
        timestamp: new Date(),
        codeSnippet: randomResponse.codeSnippet
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className={`h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <h1 className="text-xl font-bold text-white">Python Playground</h1>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Ready</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={executeCode}
              disabled={isRunning}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:scale-100"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
            
            {isRunning && (
              <button
                onClick={stopExecution}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </button>
            )}
            
            <button
              onClick={clearOutput}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadCode}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={shareCode}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 p-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-slate-300">Font Size:</label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-slate-400">{fontSize}px</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-slate-300">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-slate-700 text-white rounded px-2 py-1 text-sm"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className={`${showChat ? 'w-2/3' : 'w-full'} flex flex-col transition-all duration-300`}>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              theme={theme}
              options={{
                fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                glyphMargin: true,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'all',
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
              }}
              className="border-r border-slate-700/50"
            />
            
            {/* Execution Status Overlay */}
            {isRunning && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-white">
                    <p className="font-semibold">Executing Python Code...</p>
                    <p className="text-sm text-slate-300">Please wait while your code runs</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Output Panel */}
          <div className="h-64 bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-slate-300">Output</span>
                {executionHistory.length > 0 && (
                  <span className="text-xs text-slate-500">
                    Last run: {formatTime(executionHistory[0].executionTime)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copy output"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={clearOutput}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Clear output"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap">
                {output || 'No output yet. Run your code to see results here.'}
              </pre>
            </div>
          </div>
        </div>

        {/* AI Chatbot Panel */}
        {showChat && (
          <div className="w-1/3 bg-slate-800/50 backdrop-blur-sm border-l border-slate-700/50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Assistant</h3>
                    <p className="text-xs text-slate-400">Python coding helper</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.codeSnippet && (
                      <div className="mt-3 bg-slate-900 rounded p-3 border border-slate-600">
                        <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                          {message.codeSnippet}
                        </pre>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(message.codeSnippet)}
                            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                          <button
                            onClick={() => insertCodeFromChat(message.codeSnippet)}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Insert</span>
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-slate-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-slate-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask about Python, request code examples..."
                  className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isAiTyping}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:scale-100"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  'Explain this code',
                  'Optimize performance',
                  'Add error handling',
                  'Write tests'
                ].map((action) => (
                  <button
                    key={action}
                    onClick={() => setChatInput(action)}
                    className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Execution History Sidebar */}
      {executionHistory.length > 0 && !showChat && (
        <div className="absolute right-4 top-24 w-80 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Execution History</span>
          </h3>
          <div className="space-y-2">
            {executionHistory.map((result, index) => (
              <div
                key={index}
                className="bg-slate-700/50 rounded p-3 border border-slate-600/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {result.error ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    <span className="text-xs text-slate-300">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatTime(result.executionTime)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {result.error || result.output.split('\n')[0] || 'No output'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default CodeExecutor;