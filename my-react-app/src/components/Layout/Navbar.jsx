import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  BookOpen, 
  FolderOpen, 
  User, 
  LogOut, 
  Menu, 
  X,
  Zap,
  Settings,
  BarChart3,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Playground', href: '/', icon: Code2 },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Learn', href: '/learn', icon: BookOpen },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                PyCode Pro
              </h1>
              <p className="text-xs text-slate-400">Advanced Python Playground</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute inset-0 bg-emerald-500/20 rounded-lg border border-emerald-500/30"
                      layoutId="navbar-active"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Supabase Connection Status */}
            {!user && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400">Supabase Ready</span>
              </div>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">
                    {user.user_metadata?.username || user.email}
                  </p>
                  <p className="text-xs text-emerald-400">Python Developer</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/settings')}
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={signOut}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-emerald-500/25"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-700/50 py-4"
          >
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;