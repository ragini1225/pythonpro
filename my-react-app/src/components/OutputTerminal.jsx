import React, { useEffect, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertCircle, CheckCircle, Clock, Copy, Maximize2, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

const OutputTerminal = ({ result, isExecuting }) => {
  const { output, error, warnings = [], suggestions = [], executionTime = 0 } = result || {};
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (output && !isExecuting) {
      setDisplayedOutput('');
      setCurrentIndex(0);
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < output.length) {
            setDisplayedOutput(output.slice(0, prev + 1));
            return prev + 1;
          }
          clearInterval(timer);
          return prev;
        });
      }, 8);

      return () => clearInterval(timer);
    }
  }, [output, isExecuting]);

  const handleCopyOutput = async () => {
    const textToCopy = error || output || 'No output to copy';
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Output copied to clipboard', {
        icon: '📋',
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #10b981',
        }
      });
    } catch (err) {
      toast.error('Failed to copy output');
    }
  };

  const containerVariants = {
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

  const headerVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 }
  };

  const loadingVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className="bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl hover:border-emerald-500/30 transition-all duration-500"
    >
      <motion.div
        variants={headerVariants}
        whileHover="hover"
        className="flex items-center justify-between px-8 py-6 bg-slate-800/50 border-b border-slate-700/50"
      >
        <div className="flex items-center space-x-4">
          <motion.div
            animate={isExecuting ? {
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            } : {}}
            transition={isExecuting ? {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            } : {}}
            className="p-2 rounded-xl bg-emerald-500/10"
          >
            <Terminal className="w-6 h-6 text-emerald-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">Output Terminal</h3>
            {executionTime > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 text-slate-400 text-sm mt-1"
              >
                <Clock className="w-3 h-3" />
                <span>{executionTime}ms execution time</span>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <AnimatePresence>
            {isExecuting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-2 text-yellow-400"
              >
                <motion.div
                  variants={loadingVariants}
                  animate="animate"
                  className="w-2 h-2 bg-yellow-400 rounded-full"
                />
                <span className="text-sm font-medium">Processing...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-2 text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Error</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {output && !error && !isExecuting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-2 text-emerald-400"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Success</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopyOutput}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-200"
              title="Copy Output"
            >
              <Copy className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-200"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              <Maximize2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ height: isExpanded ? "600px" : "300px" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-auto"
      >
        <div className="p-8">
          <AnimatePresence mode="wait">
            {isExecuting && (
              <motion.div
                key="executing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center space-x-4 text-slate-400"
              >
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                      className="w-3 h-3 bg-emerald-400 rounded-full"
                    />
                  ))}
                </div>
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg"
                >
                  Executing your Python code...
                </motion.span>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="text-red-400 font-mono text-sm whitespace-pre-wrap bg-red-500/10 p-6 rounded-2xl border border-red-500/20 backdrop-blur-sm">
                  <motion.div
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                </div>
                
                {/* Error Help Section */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-yellow-300 font-semibold">Need Help?</h4>
                  </div>
                  <div className="text-yellow-200 text-sm space-y-2">
                    <p>• Check the error message above for specific details</p>
                    <p>• Make sure your syntax is correct (colons, quotes, indentation)</p>
                    <p>• Verify all variables are defined before use</p>
                    <p>• Try the basic examples to learn Python fundamentals</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {displayedOutput && !error && (
              <motion.div
                key="output"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="text-emerald-300 font-mono text-sm whitespace-pre-wrap bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
                  <motion.div
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {displayedOutput}
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-emerald-400"
                    >
                      |
                    </motion.span>
                  </motion.div>
                </div>
                
                {/* Warnings Section */}
                {warnings.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      <h4 className="text-orange-300 font-semibold">Warnings</h4>
                    </div>
                    <div className="space-y-2">
                      {warnings.map((warning, index) => (
                        <p key={index} className="text-orange-200 text-sm">• {warning}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Suggestions Section */}
                {suggestions.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-blue-400" />
                      <h4 className="text-blue-300 font-semibold">Suggestions</h4>
                    </div>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <p key={index} className="text-blue-200 text-sm">💡 {suggestion}</p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {!output && !error && !isExecuting && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
               >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="mb-6"
                >
                  <Terminal className="w-8 h-8 text-slate-500" />
                </motion.div>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-slate-500 italic text-lg"
                >
                  Click "Execute Code" to run your Python script and see the magic happen...
                </motion.p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                  className="mt-4 text-slate-600 text-sm space-y-2"
                >
                  <p>✨ Your output will appear here with beautiful animations</p>
                  <p>🐛 Errors will be explained with helpful tips</p>
                  <p>💡 Get suggestions to improve your code</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OutputTerminal;