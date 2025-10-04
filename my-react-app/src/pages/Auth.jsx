import React, { useState } from "react";

import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      toast.error(
        "Authentication is not configured. Please set up Supabase credentials."
      );
      return;
    }

    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isSignUp && !username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, username);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created successfully! Welcome to PyCode Pro!");
          navigate("/");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show configuration warning if Supabase is not set up
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              🔗 Connect Supabase
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Connect your Supabase project to unlock authentication, project
              saving, and community features.
            </p>

            <div className="bg-slate-900/50 rounded-lg p-4 text-left text-sm mb-6">
              <p className="text-slate-300 mb-3 font-medium">🚀 Quick Setup:</p>
              <ol className="text-slate-400 space-y-2 list-decimal list-inside">
                <li>
                  Visit{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    supabase.com
                  </a>{" "}
                  and create a project
                </li>
                <li>Copy your Project URL and anon key from Settings → API</li>
                <li>Replace values in the .env file</li>
                <li>Refresh this page</li>
              </ol>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-left text-sm mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <p className="text-emerald-300 font-medium">
                  ✨ Features you'll unlock:
                </p>
              </div>
              <ul className="text-emerald-200 space-y-1 text-xs">
                <li>• Save and manage your Python projects</li>
                <li>• Track your coding progress and achievements</li>
                <li>• Share projects with the community</li>
                <li>• Real-time collaboration and code reviews</li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-200 mb-6">
              <strong>💡 Pro Tip:</strong> Your .env file should look like this:
              <br />
              <code className="text-blue-300">
                VITE_SUPABASE_URL=https://xxx.supabase.co
                <br />
                VITE_SUPABASE_ANON_KEY=eyJ...
              </code>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-200"
              >
                🎮 Continue to Playground
              </motion.button>
              <motion.a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-200 text-center"
              >
                🚀 Setup Supabase
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">
            {isSignUp ? "Join PyCode Pro" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-slate-400">
            {isSignUp
              ? "Create your account and start coding"
              : "Sign in to continue your Python journey"}
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required={isSignUp}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                    placeholder="Username"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                  placeholder="Password (min. 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/25"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </motion.button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </motion.form>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-400 text-sm mb-4">
            Join the Python community
          </p>
          <div className="flex justify-center space-x-6 text-xs text-slate-500">
            <span>✓ Free forever</span>
            <span>✓ No credit card</span>
            <span>✓ Instant setup</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
