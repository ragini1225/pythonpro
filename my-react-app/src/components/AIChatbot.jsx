import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Code,
  Lightbulb,
  Zap,
  MessageCircle,
  RefreshCw,
  Download,
  Share2,
  Target,
  BookOpen,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

const AIChatbot = ({ onInsertCode, isMinimized, onToggleMinimize }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: "👋 Hi! I'm your Python coding assistant. I can help you with:\n\n• 🐍 Writing and debugging Python code\n• 📚 Explaining programming concepts\n• ⚡ Optimizing your algorithms\n• 🔧 Suggesting improvements\n• 🎯 Solving coding challenges\n\nWhat would you like to work on today?",
      timestamp: new Date(),
      suggestions: [
        "Explain Python basics",
        "Help with loops",
        "Debug my code",
        "Optimize performance"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickActions = [
    { text: "Explain this code", icon: <Lightbulb className="w-4 h-4" />, category: "help" },
    { text: "Find bugs", icon: <Code className="w-4 h-4" />, category: "debug" },
    { text: "Optimize performance", icon: <Zap className="w-4 h-4" />, category: "optimize" },
    { text: "Add comments", icon: <MessageCircle className="w-4 h-4" />, category: "improve" },
    { text: "Write tests", icon: <Target className="w-4 h-4" />, category: "test" },
    { text: "Refactor code", icon: <RefreshCw className="w-4 h-4" />, category: "refactor" },
    { text: "Learn Python basics", icon: <BookOpen className="w-4 h-4" />, category: "learn" },
    { text: "Algorithm help", icon: <Brain className="w-4 h-4" />, category: "algorithm" }
  ];

  const aiResponses = [
    {
      content: "Here's an optimized version of your code using list comprehension:",
      codeSnippet: `# More efficient approach
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Instead of using a loop:
# squares = []
# for num in numbers:
#     squares.append(num ** 2)

# Use list comprehension:
squares = [num ** 2 for num in numbers]
print("Squares:", squares)

# Even more advanced - filter and transform:
even_squares = [num ** 2 for num in numbers if num % 2 == 0]
print("Even squares:", even_squares)`
    },
    {
      content: "I can help you add error handling to make your code more robust:",
      codeSnippet: `# Robust error handling example
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None
    except TypeError:
        print("Error: Please provide numbers only!")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

# Test the function
print(safe_divide(10, 2))    # Works fine
print(safe_divide(10, 0))    # Handles division by zero
print(safe_divide(10, "a"))  # Handles type error`
    },
    {
      content: "Here's a clean way to work with files and handle exceptions:",
      codeSnippet: `# File handling with proper error management
def read_file_safely(filename):
    try:
        with open(filename, 'r') as file:
            content = file.read()
            return content
    except FileNotFoundError:
        print(f"File '{filename}' not found!")
        return None
    except PermissionError:
        print(f"Permission denied to read '{filename}'!")
        return None
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

def write_file_safely(filename, content):
    try:
        with open(filename, 'w') as file:
            file.write(content)
            print(f"Successfully wrote to '{filename}'")
            return True
    except Exception as e:
        print(f"Error writing file: {e}")
        return False

# Example usage
content = "Hello, Python!"
write_file_safely("example.txt", content)
read_content = read_file_safely("example.txt")`
    },
    {
      content: "Let me show you some Python best practices and clean code techniques:",
      codeSnippet: `# Python best practices example
from typing import List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    """A class demonstrating Python best practices"""
    
    def __init__(self, data: List[int]):
        self.data = data
        self._processed_data: Optional[List[int]] = None
    
    def process_data(self) -> List[int]:
        """Process the data with validation and logging"""
        if not self.data:
            logger.warning("No data to process")
            return []
        
        logger.info(f"Processing {len(self.data)} items")
        
        # Use list comprehension for efficiency
        self._processed_data = [
            self._transform_item(item) 
            for item in self.data 
            if self._is_valid_item(item)
        ]
        
        logger.info(f"Processed {len(self._processed_data)} valid items")
        return self._processed_data
    
    def _is_valid_item(self, item: int) -> bool:
        """Check if item is valid (private method)"""
        return isinstance(item, int) and item > 0
    
    def _transform_item(self, item: int) -> int:
        """Transform individual item (private method)"""
        return item * 2 + 1

# Example usage
processor = DataProcessor([1, 2, 3, 4, 5, -1, 0])
result = processor.process_data()
print(f"Result: {result}")

# Key practices demonstrated:
# ✅ Type hints for better code documentation
# ✅ Docstrings for all functions and classes
# ✅ Logging instead of print for debugging
# ✅ Private methods with underscore prefix
# ✅ List comprehensions for efficiency
# ✅ Input validation and error handling`
    },
    {
      content: "Here's how to create a simple but powerful data analysis script:",
      codeSnippet: `# Data analysis with Python built-ins
import statistics
import random
from collections import Counter

def analyze_dataset(data):
    """Comprehensive data analysis function"""
    if not data:
        return "No data provided"
    
    # Basic statistics
    analysis = {
        'count': len(data),
        'sum': sum(data),
        'mean': statistics.mean(data),
        'median': statistics.median(data),
        'std_dev': statistics.stdev(data) if len(data) > 1 else 0,
        'min': min(data),
        'max': max(data),
        'range': max(data) - min(data)
    }
    
    # Frequency analysis
    counter = Counter(data)
    analysis['most_common'] = counter.most_common(3)
    
    return analysis

# Generate sample data
sample_data = [random.randint(1, 100) for _ in range(50)]

print("📊 Data Analysis Report")
print("=" * 30)
print(f"Dataset: {sample_data[:10]}... (showing first 10)")

results = analyze_dataset(sample_data)
print(f"\\n📈 Statistics:")
print(f"Count: {results['count']}")
print(f"Mean: {results['mean']:.2f}")
print(f"Median: {results['median']}")
print(f"Std Dev: {results['std_dev']:.2f}")
print(f"Range: {results['min']} - {results['max']}")

print(f"\\n🔥 Most Common Values:")
for value, count in results['most_common']:
    print(f"  {value}: appears {count} times")

# Data visualization with ASCII
def create_histogram(data, bins=10):
    """Create a simple ASCII histogram"""
    min_val, max_val = min(data), max(data)
    bin_width = (max_val - min_val) / bins
    
    histogram = [0] * bins
    for value in data:
        bin_index = min(int((value - min_val) / bin_width), bins - 1)
        histogram[bin_index] += 1
    
    print("\\n📊 Data Distribution:")
    max_count = max(histogram)
    for i, count in enumerate(histogram):
        bar_length = int((count / max_count) * 20) if max_count > 0 else 0
        bar = "█" * bar_length
        range_start = min_val + i * bin_width
        range_end = min_val + (i + 1) * bin_width
        print(f"{range_start:5.1f}-{range_end:5.1f} |{bar:<20} {count}")

create_histogram(sample_data)
print("\\n💡 This analysis helps you understand your data patterns!")`
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: randomResponse.content,
        timestamp: new Date(),
        codeSnippet: randomResponse.codeSnippet,
        suggestions: [
          "Explain this code",
          "Show more examples",
          "Add error handling",
          "Optimize further"
        ]
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickAction = (action) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!', { icon: '📋' });
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleInsertCode = (code) => {
    if (onInsertCode) {
      onInsertCode(code);
      toast.success('Code inserted into editor!', { icon: '✨' });
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep welcome message
    toast.success('Chat cleared!');
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleMinimize}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/25 transition-all duration-300"
        >
          <Bot className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`fixed ${isExpanded ? 'inset-4' : 'bottom-6 right-6 w-96 h-[600px]'} bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-500`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white">AI Python Assistant</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100">Online & Ready</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleMinimize}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/30">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                    : 'bg-slate-700/80 text-slate-100 border border-slate-600/50'
                }`}
              >
                <div className="flex items-start space-x-2 mb-2">
                  {message.type === 'ai' && (
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    
                    {message.codeSnippet && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 bg-slate-900/80 rounded-xl border border-slate-600/50 overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 border-b border-slate-600/50">
                          <span className="text-xs text-slate-400 font-medium">Python Code</span>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCopyCode(message.codeSnippet)}
                              className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                              title="Copy code"
                            >
                              <Copy className="w-3 h-3" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleInsertCode(message.codeSnippet)}
                              className="p-1 rounded text-slate-400 hover:text-blue-400 transition-colors"
                              title="Insert into editor"
                            >
                              <Code className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>
                        <pre className="text-xs text-emerald-300 font-mono p-4 overflow-x-auto leading-relaxed">
                          {message.codeSnippet}
                        </pre>
                      </motion.div>
                    )}

                    {message.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickAction(suggestion)}
                            className="text-xs px-3 py-1 bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 rounded-full transition-colors border border-slate-500/30"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.type === 'ai' && (
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        className="p-1 rounded text-slate-400 hover:text-green-400 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-slate-700/80 text-slate-200 rounded-2xl p-4 border border-slate-600/50">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-slate-300">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-slate-700/50 bg-slate-800/50">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.slice(0, isExpanded ? 6 : 4).map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction(action.text)}
              className="flex items-center space-x-1 text-xs px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors border border-slate-600/30"
            >
              {action.icon}
              <span>{action.text}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about Python..."
              className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-600/50 transition-all duration-200"
            />
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              whileHover={{ scale: 1.1 }}
            >
              <Sparkles className="w-4 h-4 text-slate-400" />
            </motion.div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Sparkles className="w-3 h-3" />
            <span>Powered by AI • Always learning</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            Clear chat
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatbot;