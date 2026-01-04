import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Save,
  Share2,
  Download,
  Zap,
  Clock,
  CheckCircle,
  Settings,
  Maximize2,
  Minimize2,
  RotateCcw,
  Copy,
  FileText,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Brain,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Bot
} from 'lucide-react';
import toast from 'react-hot-toast';
import MonacoEditor from '../components/MonacoEditor.jsx';
import OutputTerminal from '../components/OutputTerminal.jsx';
import ExampleSelector from '../components/ExampleSelector.jsx';
import { executePythonCode } from '../utils/pythonExecutor';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/database';
import AIChatbot from '../components/AIChatbot.jsx';

const initialCode = `# Welcome to PyCode Pro! 🐍
# Your journey into Python programming starts here!

print("🎉 Welcome to Python Programming!")
print("Let's start with something simple...")

# Variables - storing information
name = "Future Python Developer"
age = 25
favorite_language = "Python"

print(f"Hello, {name}!")
print(f"You are {age} years old")
print(f"Your favorite language is {favorite_language}")

# Simple math
print("\\n🧮 Let's do some math:")
x = 10
y = 5
print(f"{x} + {y} = {x + y}")
print(f"{x} - {y} = {x - y}")
print(f"{x} * {y} = {x * y}")
print(f"{x} / {y} = {x / y}")

# Fun with lists
print("\\n📝 Working with lists:")
fruits = ["apple", "banana", "orange", "grape"]
print("My favorite fruits:")
for i, fruit in enumerate(fruits, 1):
    print(f"{i}. {fruit}")

print("\\n✨ Try changing the code above and click 'Execute Code'!")
print("💡 Check out the examples below for more ideas!")
`;

const welcomeCode = `# 🎯 Quick Start Guide - Try These Examples!

# 1. Basic Print Statements
print("Hello, World!")
print("Python is awesome! 🐍")

# 2. Variables and Data Types
name = "Alice"           # String (text)
age = 25                # Integer (whole number)
height = 5.6            # Float (decimal number)
is_student = True       # Boolean (True/False)

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height} feet")
print(f"Student: {is_student}")

# 3. Simple Math
a = 10
b = 3
print(f"\\n🧮 Math Operations:")
print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b:.2f}")

# 4. Working with Lists
colors = ["red", "green", "blue", "yellow"]
print(f"\\n🎨 Colors: {colors}")
print(f"First color: {colors[0]}")
print(f"Number of colors: {len(colors)}")

# 5. Simple Loop
print("\\n🔄 Counting:")
for i in range(1, 6):
    print(f"Count: {i}")

# 6. Conditional Statements
score = 85
print(f"\\n📊 Your score: {score}")
if score >= 90:
    print("Grade: A - Excellent! 🌟")
elif score >= 80:
    print("Grade: B - Good job! 👍")
elif score >= 70:
    print("Grade: C - Keep trying! 💪")
else:
    print("Grade: F - Need more practice 📚")

print("\\n🚀 Ready to explore more? Check out the examples below!")
`;

const funExamples = `# 🎮 Fun Python Examples to Try!

def greet(name):
    """A friendly greeting function with emojis"""
    return f"👋 Hello, {name}! Welcome to Python! 🐍"

def create_pattern(size):
    """Create a fun star pattern"""
    print("✨ Star Pattern:")
    for i in range(1, size + 1):
        spaces = " " * (size - i)
        stars = "⭐" * i
        print(f"{spaces}{stars}")

def simple_quiz():
    """A fun Python quiz"""
    print("🧠 Quick Python Quiz!")
    questions = {
        "What symbol is used for comments in Python?": "#",
        "What function is used to display text?": "print",
        "What data type is 'Hello'?": "string"
    }
    
    score = 0
    for question, answer in questions.items():
        print(f"\\nQ: {question}")
        print(f"A: {answer}")
        score += 1
    
    print(f"\\n🎉 Quiz complete! You learned {score} things!")

def fibonacci(n):
    """Generate Fibonacci sequence - a famous math pattern"""
    sequence = []
    a, b = 0, 1
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence

def fun_with_numbers(numbers):
    """Calculate basic statistics for a list of numbers"""
    if not numbers:
        return {}
    
    total = sum(numbers)
    count = len(numbers)
    mean = total / count
    # Calculate median
    sorted_nums = sorted(numbers)
    mid = count // 2
    if count % 2 == 0:
        median = (sorted_nums[mid-1] + sorted_nums[mid]) / 2
    else:
        median = sorted_nums[mid]
    
    return {
        'total_numbers': count,
        'sum': total,
        'mean': mean,
        'median': median,
        'min': min(numbers),
        'max': max(numbers)
    }

# 🚀 Let's run some fun code!
if __name__ == "__main__":
    print("🎪 Welcome to the Python Fun Zone!")
    print("=" * 40)
    
    # Greeting
    print(greet("Future Python Master"))
    
    # Pattern creation
    print("\\n" + "=" * 40)
    create_pattern(5)
    
    # Fibonacci fun
    print("\\n" + "=" * 40)
    print("🔢 Fibonacci Magic (first 8 numbers):")
    fib_numbers = fibonacci(8)
    print("Sequence:", fib_numbers)
    
    # Quiz time
    print("\\n" + "=" * 40)
    simple_quiz()
    
    # Number fun
    print("\\n" + "=" * 40)
    print("📊 Fun with Numbers:")
    test_scores = [95, 87, 92, 78, 88, 91, 85]
    stats = fun_with_numbers(test_scores)
    print(f"Test Scores: {test_scores}")
    print(f"📈 Average: {stats['average']:.1f}")
    print(f"🏆 Highest: {stats['max']}")
    print(f"📉 Lowest: {stats['min']}")
    
    print("\\n🎉 Congratulations! You just ran some awesome Python code!")
    print("💡 Try modifying the code above and see what happens!")
`;

const Playground = () => {
  const { user } = useAuth();
  const [code, setCode] = useState(initialCode);
  const [executionResult, setExecutionResult] = useState({
    output: '',
    error: '',
    executionTime: 0,
    memoryUsage: 0,
    linesOfCode: 0,
    complexity: 0,
    warnings: [],
    suggestions: []
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [executionCount, setExecutionCount] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotMinimized, setChatbotMinimized] = useState(true);

  // Quick start templates
  const quickStartTemplates = [
    {
      name: "👋 Welcome Guide",
      code: welcomeCode,
      description: "Perfect for beginners - learn the basics step by step"
    },
    {
      name: "🎮 Fun Examples",
      code: funExamples,
      description: "Interactive examples with patterns, quizzes, and more"
    },
    {
      name: "🚀 Original Demo",
      code: initialCode,
      description: "The original welcome code with advanced features"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const executeButtonVariants = {
    idle: { 
      scale: 1,
      boxShadow: "0 4px 20px rgba(16, 185, 129, 0.25)"
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 8px 30px rgba(16, 185, 129, 0.4)",
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    executing: {
      scale: [1, 1.02, 1],
      boxShadow: [
        "0 4px 20px rgba(16, 185, 129, 0.25)",
        "0 8px 30px rgba(16, 185, 129, 0.6)",
        "0 4px 20px rgba(16, 185, 129, 0.25)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionResult({
      output: '',
      error: '',
      executionTime: 0,
      memoryUsage: 0,
      linesOfCode: 0,
      complexity: 0,
      warnings: [],
      suggestions: []
    });

    try {
      const result = await executePythonCode(code);
      setExecutionResult(result);
      setExecutionCount(prev => prev + 1);
      
      // Save execution to database
      if (user) {
        await db.executions.create({
          user_id: user.id,
          project_id: null,
          code,
          output: result.output,
          error: result.error,
          execution_time: result.executionTime,
          memory_usage: result.memoryUsage,
          lines_of_code: result.linesOfCode,
          complexity_score: result.complexity,
          success: !result.error
        });
      }
      
      if (result.error) {
        toast.error('Execution failed', {
          icon: '❌',
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #ef4444',
          }
        });
      } else {
        // Show suggestions if any
        if (result.suggestions.length > 0) {
          toast.success(`Code executed! ${result.suggestions.length} suggestions available`, {
            icon: '💡',
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #10b981',
            }
          });
        }
        toast.success('Code executed successfully', {
          icon: '🚀',
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #10b981',
          }
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setExecutionResult(prev => ({ ...prev, error: errorMessage }));
      toast.error('Execution failed: ' + errorMessage);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save projects');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await db.projects.create({
        title: projectTitle,
        description: 'Created in PyCode Pro Playground',
        code,
        language: 'python',
        user_id: user.id,
        is_public: false,
        tags: ['playground'],
      });

      if (error) {
        toast.error('Failed to save project');
      } else {
        toast.success('Project saved successfully', {
          icon: '💾',
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #10b981',
          }
        });
      }
    } catch (err) {
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard', {
        icon: '📋',
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #10b981',
        }
      });
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/\s+/g, '_')}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded', {
      icon: '⬇️',
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid #10b981',
      }
    });
  };

  const handleSelectExample = (exampleCode) => {
    setCode(exampleCode);
    setExecutionResult({
      output: '',
      error: '',
      executionTime: 0,
      memoryUsage: 0,
      linesOfCode: 0,
      complexity: 0,
      warnings: [],
      suggestions: []
    });
    toast.success('Example loaded', {
      icon: '✨',
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid #10b981',
      }
    });
  };

  const handleReset = () => {
    setCode(initialCode);
    setExecutionResult({
      output: '',
      error: '',
      executionTime: 0,
      memoryUsage: 0,
      linesOfCode: 0,
      complexity: 0,
      warnings: [],
      suggestions: []
    });
    toast.success('Code reset to initial state');
  };

  const handleInsertCodeFromAI = (code) => {
    setCode(prevCode => prevCode + '\n\n' + code);
  };

  const toggleChatbot = () => {
    if (chatbotMinimized) {
      setChatbotMinimized(false);
      setShowChatbot(true);
    } else {
      setChatbotMinimized(true);
      setTimeout(() => setShowChatbot(false), 300);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pt-8 pb-16 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="text-2xl lg:text-3xl font-bold text-white bg-transparent border-none outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg px-3 py-2 w-full transition-all duration-300"
                  placeholder="Project Title"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg -z-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-400 mt-2 flex items-center space-x-2 text-sm lg:text-base"
              >
                <Sparkles className="w-4 h-4" />
                <span>Professional Python development environment</span>
              </motion.p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                variants={executeButtonVariants}
                initial="idle"
                whileHover={!isExecuting ? "hover" : undefined}
                whileTap={!isExecuting ? "tap" : undefined}
                animate={isExecuting ? "executing" : "idle"}
                onClick={handleExecute}
                disabled={isExecuting}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  isExecuting
                    ? 'bg-emerald-600/70 cursor-not-allowed text-sm lg:text-lg'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'
                } text-white shadow-2xl`}
              >
                <motion.div
                  animate={isExecuting ? { rotate: 360 } : { rotate: 0 }}
                  transition={isExecuting ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                >
                  <Play className="w-6 h-6" />
                </motion.div>
                <span className="hidden sm:inline">{isExecuting ? 'Executing...' : 'Execute Code'}</span>
                <span className="sm:hidden">{isExecuting ? 'Run...' : 'Run'}</span>
              </motion.button>

                {[
                  { icon: Save, action: handleSave, loading: isSaving, disabled: !user, tooltip: "Save Project" },
                  { icon: Share2, action: handleShare, tooltip: "Copy Code" },
                  { icon: Download, action: handleDownload, tooltip: "Download File" },
                  { icon: RotateCcw, action: handleReset, tooltip: "Reset Code" }
                ].map((btn, index) => (
                  <motion.button
                    key={index}
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={btn.action}
                    disabled={btn.disabled || btn.loading}
                    className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={btn.tooltip}
                  >
                    <btn.icon className="w-5 h-5" />
                  </motion.button>
                ))}
              
              <motion.button
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  setShowChatbot(true);
                  setChatbotMinimized(false);
                }}
                className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-medium transition-all duration-300 shadow-lg"
                title="AI Assistant"
              >
                <Bot className="w-9 h-5" />
                <span className="hidden lg:inline">AI Help</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Start Templates */}
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Quick Start Templates</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStartTemplates.map((template, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCode(template.code);
                    setExecutionResult({
                      output: '',
                      error: '',
                      executionTime: 0,
                      memoryUsage: 0,
                      linesOfCode: 0,
                      complexity: 0,
                      warnings: [],
                      suggestions: []
                    });
                    toast.success(`${template.name} loaded!`);
                  }}
                  className="p-4 bg-slate-700/30 hover:bg-slate-600/30 rounded-xl border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-300 text-left group"
                >
                  <h4 className="font-medium text-white group-hover:text-emerald-300 transition-colors mb-2">{template.name}</h4>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{template.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Examples Section */}
        <AnimatePresence>
          {showExamples && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mb-8"
            >
              <ExampleSelector onSelectExample={handleSelectExample} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          variants={itemVariants}
          className={`grid gap-6 lg:gap-8 transition-all duration-500 ${
            isFullscreen ? 'grid-cols-1' : 'lg:grid-cols-2'
          }`}
        >
          {/* Code Editor */}
          <motion.div
            layout
            className="space-y-3 lg:space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Code Editor</span>
                <span className="text-sm text-slate-400 font-normal hidden sm:inline">
                  ({code.split('\n').length} lines)
                </span>
              </h2>
              <div className="flex items-center space-x-2">
                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-all duration-300"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowExamples(!showExamples)}
                  className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-all duration-300"
                  title="Toggle Examples"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            
            <motion.div
              layout
              className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl relative"
            >
              <MonacoEditor
                value={code}
                onChange={setCode}
                language="python"
                height={isFullscreen ? "70vh" : "400px"}
              />
            </motion.div>
          </motion.div>

          {/* Output Terminal */}
          {!isFullscreen && (
            <motion.div
              layout
              className="space-y-3 lg:space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span>Output</span>
                  {executionResult.executionTime > 0 && (
                    <span className="text-sm text-slate-400 font-normal hidden sm:inline">
                      ({executionResult.executionTime}ms)
                    </span>
                  )}
                </h2>
                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-all duration-300"
                  title="Toggle Analytics"
                >
                  <BarChart3 className="w-4 h-4" />
                </motion.button>
              </div>
              
              {/* Code Stats Overlay */}
              <div className="absolute top-1 right-1 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3py-1 text-xs text-slate-300 border border-slate-600/50">
                <div className="flex items-center space-x-4">
                  <span>Lines: {code.split('\n').length}</span>
                  <span>Chars: {code.length}</span>
                  <span>Words: {code.split(/\s+/).filter(w => w.length > 0).length}</span>
                </div>
              </div>
              
              <motion.div
                layout
                className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl"
              >
                <OutputTerminal
                  result={executionResult}
                  isExecuting={isExecuting}
                />
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Analytics Panel */}
        <AnimatePresence>
          {showAnalytics && executionResult.output && (
            <motion.div
              variants={statsVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-6 lg:mt-8"
            >
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span>Code Analytics</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  icon: Clock, 
                  label: 'Execution Time', 
                  value: `${executionResult.executionTime}ms`,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10',
                  description: 'How fast your code ran'
                },
                { 
                  icon: Brain, 
                  label: 'Memory Usage', 
                  value: `${executionResult.memoryUsage}KB`,
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/10',
                  description: 'Memory consumed'
                },
                { 
                  icon: FileText, 
                  label: 'Lines of Code', 
                  value: executionResult.linesOfCode.toString(),
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/10',
                  description: 'Total code lines'
                },
                { 
                  icon: Target, 
                  label: 'Complexity', 
                  value: executionResult.complexity.toString(),
                  color: 'text-orange-400',
                  bg: 'bg-orange-500/10',
                  description: 'Code complexity score'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`${stat.bg} backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 cursor-help`}
                  title={stat.description}
                >
                  <div className="flex items-center space-x-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <div>
                      <p className="text-slate-400 text-xs lg:text-sm">{stat.label}</p>
                      <p className={`font-semibold ${stat.color}`}>{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
                </div>
                
                {/* Performance Tips */}
                <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span>Performance Tips</span>
                  </h4>
                  <div className="text-sm text-slate-300 space-y-1">
                    {executionResult.executionTime < 100 && (
                      <p className="text-green-400">⚡ Excellent execution speed!</p>
                    )}
                    {executionResult.complexity < 5 && (
                      <p className="text-blue-400">🎯 Clean, simple code structure</p>
                    )}
                    {executionResult.linesOfCode < 50 && (
                      <p className="text-purple-400">📝 Concise and readable code</p>
                    )}
                    {executionResult.suggestions.length === 0 && (
                      <p className="text-emerald-400">✨ No optimization suggestions - great job!</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Helpful Tips Section */}
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span>💡 Python Tips & Tricks</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-emerald-400 font-medium mb-2">🚀 Getting Started</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• Use print() to display output</li>
                <li>• Variables store data: name = "Alice"</li>
                <li>• Use # for comments</li>
                <li>• Indentation matters in Python!</li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">🔧 Common Functions</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• len() - get length of lists/strings</li>
                <li>• range() - create number sequences</li>
                <li>• input() - get user input</li>
                <li>• type() - check data type</li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-purple-400 font-medium mb-2">✨ Pro Tips</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• Use f-strings: f"Hello {name}"</li>
                <li>• List comprehensions are powerful</li>
                <li>• Try the examples above!</li>
                <li>• Practice makes perfect 🎯</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Chatbot */}
      <AnimatePresence>
        {(showChatbot || !chatbotMinimized) && (
          <AIChatbot
            onInsertCode={handleInsertCodeFromAI}
            isMinimized={chatbotMinimized}
            onToggleMinimize={toggleChatbot}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Playground;