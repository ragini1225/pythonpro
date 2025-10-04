import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  CheckCircle, 
  Circle,
  BookOpen,
  Code,
  Lightbulb,
  Target,
  ArrowRight,
  ArrowLeft,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  Settings,
  Download,
  Share2,
  Clock,
  Award,
  Star
} from 'lucide-react';
import MonacoEditor from './MonacoEditor';
import OutputTerminal from './OutputTerminal';
import { executePythonCode } from "../utils/pythonExecutor.js";
import toast from 'react-hot-toast';

const TutorialPlayer = ({ 
  tutorial, 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock tutorial steps - in real app, this would come from the tutorial data
  const tutorialSteps = [
    {
      id: '1',
      title: 'Introduction to Variables',
      content: 'Variables are containers for storing data values. In Python, you create a variable by assigning a value to it.',
      code: `# Creating variables in Python
name = "Alice"
age = 25
height = 5.6
is_student = True

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height} feet")
print(f"Is student: {is_student}")`,
      explanation: 'Python automatically determines the data type based on the value you assign. No need to declare types explicitly!',
      exercise: {
        instruction: 'Create variables for your own information and print them out.',
        startingCode: `# Create your variables here
# name = 
# age = 
# city = 

# Print them out`,
        solution: `name = "John"
age = 30
city = "New York"

print(f"My name is {name}")
print(f"I am {age} years old")
print(f"I live in {city}")`,
        hints: [
          'Use quotes for text (strings)',
          'Numbers don\'t need quotes',
          'Use f-strings for formatted output'
        ]
      }
    },
    {
      id: '2',
      title: 'Working with Strings',
      content: 'Strings are sequences of characters. Python provides many methods to work with strings.',
      code: `# String operations
message = "Hello, Python!"
name = "world"

# String methods
print(message.upper())
print(message.lower())
print(message.replace("Python", "World"))

# String formatting
greeting = f"Hello, {name}!"
print(greeting)

# String slicing
print(message[0:5])  # First 5 characters`,
      explanation: 'Strings are immutable in Python, meaning you cannot change them in place. String methods return new strings.',
      quiz: {
        question: 'What will `"Python".upper()` return?',
        options: ['python', 'PYTHON', 'Python', 'Error'],
        correctAnswer: 1,
        explanation: 'The upper() method converts all characters to uppercase, so "Python" becomes "PYTHON".'
      }
    },
    {
      id: '3',
      title: 'Numbers and Math',
      content: 'Python supports integers, floating-point numbers, and complex numbers with various mathematical operations.',
      code: `# Different number types
integer_num = 42
float_num = 3.14159
complex_num = 2 + 3j

# Basic math operations
a = 10
b = 3

print(f"Addition: {a + b}")
print(f"Subtraction: {a - b}")
print(f"Multiplication: {a * b}")
print(f"Division: {a / b}")
print(f"Floor division: {a // b}")
print(f"Modulus: {a % b}")
print(f"Exponentiation: {a ** b}")

# Built-in math functions
import math
print(f"Square root of 16: {math.sqrt(16)}")
print(f"Pi: {math.pi}")`,
      explanation: 'Python distinguishes between integer division (//) and float division (/). The modulus operator (%) gives the remainder.',
      exercise: {
        instruction: 'Calculate the area and circumference of a circle with radius 5.',
        startingCode: `import math

radius = 5
# Calculate area: π * r²
# Calculate circumference: 2 * π * r

# Print the results`,
        solution: `import math

radius = 5
area = math.pi * radius ** 2
circumference = 2 * math.pi * radius

print(f"Area: {area:.2f}")
print(f"Circumference: {circumference:.2f}")`,
        hints: [
          'Use math.pi for π',
          'Area formula: π * r²',
          'Circumference formula: 2 * π * r',
          'Use :.2f to round to 2 decimal places'
        ]
      }
    }
  ];

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  useEffect(() => {
    if (currentStepData?.code) {
      setCode(currentStepData.code);
    } else if (currentStepData?.exercise) {
      setCode(currentStepData.exercise.startingCode);
    }
    setOutput('');
    setError('');
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setShowHints(false);
  }, [currentStep, currentStepData]);

  const handleExecute = async () => {
    setIsExecuting(true);
    setOutput('');
    setError('');

    try {
      const result = await executePythonCode(code);
      setOutput(result.output);
      setError(result.error);
      setExecutionTime(result.executionTime);
      
      if (!result.error) {
        toast.success('Code executed successfully!');
      }
    } catch (err) {
      setError('Execution failed');
      toast.error('Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    } else {
      // Tutorial completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      onComplete();
      toast.success('Tutorial completed! 🎉');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer !== null) {
      setQuizSubmitted(true);
      if (selectedQuizAnswer === currentStepData.quiz?.correctAnswer) {
        toast.success('Correct answer! 🎉');
      } else {
        toast.error('Try again!');
      }
    }
  };

  const isStepCompleted = (stepIndex) => completedSteps.has(stepIndex);
  const canProceed = currentStepData?.exercise ? output && !error : true;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className={`bg-slate-900/95 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden ${
            isFullscreen ? 'w-full h-full' : 'w-full max-w-7xl h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{tutorial.title}</h2>
                <p className="text-slate-400 text-sm">
                  Step {currentStep + 1} of {tutorialSteps.length}: {currentStepData?.title}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{tutorial.estimated_time} min</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-3 bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Progress</span>
              <span className="text-sm text-slate-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Left Panel - Tutorial Content */}
              <div className="p-6 overflow-y-auto border-r border-slate-700/50">
                <div className="space-y-6">
                  {/* Step Content */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Concept</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{currentStepData?.content}</p>
                  </div>

                  {/* Code Example */}
                  {currentStepData?.code && (
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                          <Code className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Example</h3>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <pre className="text-emerald-300 text-sm font-mono overflow-x-auto">
                          <code>{currentStepData.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  {currentStepData?.explanation && (
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                          <Target className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Key Point</h3>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                        <p className="text-purple-200">{currentStepData.explanation}</p>
                      </div>
                    </div>
                  )}

                  {/* Exercise */}
                  {currentStepData?.exercise && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                            <Target className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-semibold text-white">Exercise</h3>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowHints(!showHints)}
                          className="px-3 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white text-sm transition-colors"
                        >
                          {showHints ? 'Hide Hints' : 'Show Hints'}
                        </motion.button>
                      </div>
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-4">
                        <p className="text-orange-200">{currentStepData.exercise.instruction}</p>
                      </div>
                      
                      <AnimatePresence>
                        {showHints && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4"
                          >
                            <h4 className="text-yellow-300 font-medium mb-2">💡 Hints:</h4>
                            <ul className="space-y-1">
                              {currentStepData.exercise.hints.map((hint, index) => (
                                <li key={index} className="text-yellow-200 text-sm flex items-start space-x-2">
                                  <span className="text-yellow-400 mt-1">•</span>
                                  <span>{hint}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Quiz */}
                  {currentStepData?.quiz && (
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                          <Award className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Quiz</h3>
                      </div>
                      <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4">
                        <p className="text-pink-200 mb-4">{currentStepData.quiz.question}</p>
                        <div className="space-y-2 mb-4">
                          {currentStepData.quiz.options.map((option, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedQuizAnswer(index)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                                selectedQuizAnswer === index
                                  ? 'bg-pink-500/20 border-pink-500/50 text-pink-200'
                                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/30'
                              } ${
                                quizSubmitted && index === currentStepData.quiz.correctAnswer
                                  ? 'bg-green-500/20 border-green-500/50 text-green-200'
                                  : ''
                              } ${
                                quizSubmitted && selectedQuizAnswer === index && index !== currentStepData.quiz.correctAnswer
                                  ? 'bg-red-500/20 border-red-500/50 text-red-200'
                                  : ''
                              }`}
                            >
                              {option}
                            </motion.button>
                          ))}
                        </div>
                        {!quizSubmitted ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleQuizSubmit}
                            disabled={selectedQuizAnswer === null}
                            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                          >
                            Submit Answer
                          </motion.button>
                        ) : (
                          <div className="bg-slate-700/30 rounded-lg p-3">
                            <p className="text-slate-300 text-sm">{currentStepData.quiz.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Code Editor & Output */}
              <div className="flex flex-col">
                {/* Code Editor */}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExecute}
                      disabled={isExecuting}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white rounded-lg font-medium transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
                    </motion.button>
                  </div>
                  <div className="h-64">
                    <MonacoEditor
                      value={code}
                      onChange={setCode}
                      height="100%"
                    />
                  </div>
                </div>

                {/* Output */}
                <div className="border-t border-slate-700/50 p-6">
                  <OutputTerminal
                    result={{
                      output,
                      error,
                      executionTime,
                      warnings: [],
                      suggestions: []
                    }}
                    isExecuting={isExecuting}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-slate-700/50 bg-slate-800/30">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </motion.button>

            <div className="flex items-center space-x-2">
              {tutorialSteps.map((_, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-emerald-500'
                      : isStepCompleted(index)
                      ? 'bg-green-500'
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextStep}
              disabled={currentStepData?.exercise && !canProceed}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              <span>{currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}</span>
              {currentStep === tutorialSteps.length - 1 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialPlayer;