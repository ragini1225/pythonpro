import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Star,
  GitFork,
  Eye,
  MessageCircle,
  Heart,
  Filter,
  Search,
  TrendingUp,
  Code,
  Globe,
  Lock,
  Plus,
  Zap,
  Play,
  Copy,
  Download,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/database";

const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("trending");
  const [projects, setProjects] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  const mockProjects = [
    {
      id: "1",
      title: "AI-Powered Weather Predictor",
      description:
        "Machine learning model that predicts weather patterns using historical data and real-time APIs",
      code: `# AI Weather Predictor
import random
import datetime

class WeatherPredictor:
    def __init__(self):
        self.models = ['neural_network', 'random_forest', 'svm']
        self.accuracy = 0.89

    def predict(self, location, days=7):
        predictions = []
        for day in range(days):
            temp = random.randint(15, 35)
            condition = random.choice(['sunny', 'cloudy', 'rainy', 'stormy'])
            confidence = random.uniform(0.7, 0.95)
            predictions.append({
                'day': day + 1,
                'temperature': temp,
                'condition': condition,
                'confidence': confidence
            })
        return predictions

predictor = WeatherPredictor()
forecast = predictor.predict("New York", 5)

print("AI Weather Forecast for New York")
print("=" * 40)
for day_data in forecast:
    print(f"Day {day_data['day']}: {day_data['temperature']}°C, {day_data['condition']}")
    print(f"   Confidence: {day_data['confidence']:.1%}")
print(f"\\nModel Accuracy: {predictor.accuracy:.1%}")`,
      language: "python",
      user: { username: "ai_enthusiast", avatar: "🤖" },
      tags: ["ai", "machine-learning", "weather", "api"],
      star_count: 234,
      fork_count: 67,
      view_count: 1520,
      comment_count: 23,
      is_public: true,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Cryptocurrency Portfolio Tracker",
      description:
        "Real-time crypto portfolio management with profit/loss calculations and market analysis",
      code: `# Crypto Portfolio Tracker
import random
from datetime import datetime

class CryptoPortfolio:
    def __init__(self):
        self.holdings = {}
        self.transactions = []

    def add_coin(self, symbol, amount, price):
        if symbol in self.holdings:
            old_amount = self.holdings[symbol]['amount']
            old_avg = self.holdings[symbol]['avg_price']
            self.holdings[symbol]['amount'] += amount
            self.holdings[symbol]['avg_price'] = (
                (old_avg * old_amount + price * amount) / (old_amount + amount)
            )
        else:
            self.holdings[symbol] = {'amount': amount, 'avg_price': price}

    def get_portfolio_value(self, current_prices):
        total_value = 0
        for symbol, holding in self.holdings.items():
            current_price = current_prices.get(symbol, holding['avg_price'])
            total_value += holding['amount'] * current_price
        return total_value

portfolio = CryptoPortfolio()
portfolio.add_coin('BTC', 0.5, 45000)
portfolio.add_coin('ETH', 2.0, 3000)

current_prices = {'BTC': 47000, 'ETH': 3200}

print("Crypto Portfolio Dashboard")
for symbol, holding in portfolio.holdings.items():
    current_price = current_prices[symbol]
    value = holding['amount'] * current_price
    profit = (current_price - holding['avg_price']) * holding['amount']
    print(symbol + ": " + str(holding['amount']) + " coins")
    print("   Value: $" + str(value))
    print("   P&L: $" + str(profit))

total = portfolio.get_portfolio_value(current_prices)
print("Total Portfolio Value: $" + str(total))`,
      language: "python",
      user: { username: "crypto_dev", avatar: "₿" },
      tags: ["cryptocurrency", "finance", "portfolio", "trading"],
      star_count: 189,
      fork_count: 45,
      view_count: 890,
      comment_count: 31,
      is_public: true,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Social Media Analytics Dashboard",
      description:
        "Analyze social media engagement, track hashtags, and generate insights for content creators",
      code: `# Social Media Analytics
import random
from datetime import datetime, timedelta

class SocialMediaAnalytics:
    def __init__(self):
        self.posts = []
        self.hashtags = {}

    def add_post(self, content, likes, shares, comments):
        post = {
            'content': content,
            'likes': likes,
            'shares': shares,
            'comments': comments,
            'engagement': likes + shares + comments
        }
        self.posts.append(post)

        hashtags = [word for word in content.split() if word.startswith('#')]
        for tag in hashtags:
            self.hashtags[tag] = self.hashtags.get(tag, 0) + post['engagement']

    def get_top_posts(self, limit=5):
        return sorted(self.posts, key=lambda x: x['engagement'], reverse=True)[:limit]

analytics = SocialMediaAnalytics()
analytics.add_post("New Python project! #Python #coding", 156, 23, 45)
analytics.add_post("Learning ML #MachineLearning #AI", 89, 12, 34)

print("Social Media Analytics")
print("Top Posts:")
for post in analytics.get_top_posts(2):
    content = post['content'][:40]
    engagement = post['engagement']
    print("  " + content + "... (" + str(engagement) + " engagement)")`,
      language: "python",
      user: { username: "social_guru", avatar: "📱" },
      tags: ["social-media", "analytics", "dashboard", "data-analysis"],
      star_count: 156,
      fork_count: 32,
      view_count: 678,
      comment_count: 18,
      is_public: true,
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      title: "Personal Finance Budget Tracker",
      description:
        "Track expenses, set budgets, and get financial insights with beautiful visualizations",
      code: `# Budget Tracker
class BudgetTracker:
    def __init__(self):
        self.income = 0
        self.expenses = []
        self.budgets = {}

    def set_monthly_income(self, amount):
        self.income = amount

    def add_expense(self, category, amount, description):
        self.expenses.append({
            'category': category,
            'amount': amount,
            'description': description
        })

    def get_category_spending(self):
        spending = {}
        for expense in self.expenses:
            category = expense['category']
            spending[category] = spending.get(category, 0) + expense['amount']
        return spending

tracker = BudgetTracker()
tracker.set_monthly_income(5000)
tracker.add_expense('Food', 45.50, 'Grocery shopping')
tracker.add_expense('Transportation', 120.00, 'Monthly bus pass')

print("Personal Finance Dashboard")
print("Monthly Income: $5000.00")
spending = tracker.get_category_spending()
total_expenses = sum(spending.values())
print("Total Expenses: $" + str(total_expenses))
print("Remaining: $" + str(5000 - total_expenses))`,
      language: "python",
      user: { username: "finance_pro", avatar: "💰" },
      tags: ["finance", "budgeting", "personal", "tracker"],
      star_count: 298,
      fork_count: 78,
      view_count: 1890,
      comment_count: 42,
      is_public: true,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      title: "Password Security Analyzer",
      description:
        "Analyze password strength and generate secure passwords with entropy calculations",
      code: `# Password Security Analyzer
import random
import string
import math

class PasswordAnalyzer:
    def __init__(self):
        self.common_passwords = ['password', '123456', 'qwerty']
        self.character_sets = {
            'lowercase': string.ascii_lowercase,
            'uppercase': string.ascii_uppercase,
            'digits': string.digits,
            'symbols': '!@#$%^&*()_+-='
        }

    def analyze_strength(self, password):
        score = 0
        if len(password) >= 12:
            score += 25
        if any(c.islower() for c in password):
            score += 15
        if any(c.isupper() for c in password):
            score += 15
        if any(c.isdigit() for c in password):
            score += 15
        if password.lower() in self.common_passwords:
            score -= 30
        return max(0, min(100, score))

    def generate_secure_password(self, length=16):
        chars = ''.join(self.character_sets.values())
        return ''.join(random.choice(chars) for _ in range(length))

analyzer = PasswordAnalyzer()
test_passwords = ["password123", "MySecureP@ssw0rd!"]

print("Password Security Analyzer")
for pwd in test_passwords:
    score = analyzer.analyze_strength(pwd)
    stars = '*' * len(pwd)
    print("Password: " + stars + " - Score: " + str(score) + "/100")

secure_pwd = analyzer.generate_secure_password(16)
print("Generated: " + secure_pwd)`,
      language: "python",
      user: { username: "security_expert", avatar: "🔐" },
      tags: ["security", "password", "encryption", "cybersecurity"],
      star_count: 167,
      fork_count: 29,
      view_count: 543,
      comment_count: 15,
      is_public: true,
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const mockSnippets = [
    {
      id: "1",
      title: "Quick Sort Algorithm",
      description:
        "Efficient sorting algorithm with O(n log n) average complexity",
      code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
      user: { username: "algo_master", avatar: "⚡" },
      tags: ["algorithm", "sorting", "recursion"],
      likes_count: 89,
      usage_count: 234,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Email Validator",
      description: "Validate email addresses using regex patterns",
      code: `import re

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None`,
      user: { username: "regex_ninja", avatar: "🥷" },
      tags: ["validation", "regex", "email"],
      likes_count: 67,
      usage_count: 156,
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      setProjects(mockProjects);
      setSnippets(mockSnippets);
    } catch (error) {
      toast.error("Failed to load community data");
    }
  };

  const handleStarProject = async (projectId) => {
    try {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, star_count: p.star_count + 1 } : p
        )
      );
      toast.success("Project starred!");
    } catch (error) {
      toast.error("Failed to star project");
    }
  };

  const handleForkProject = async (projectId) => {
    if (!user) {
      toast.error("Please sign in to fork projects");
      return;
    }

    try {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        const forkedTitle = `${project.title} (Fork)`;
        await db.projects.fork(projectId, forkedTitle);
        toast.success("Project forked successfully!");
      }
    } catch (error) {
      toast.error("Failed to fork project");
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || project.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const tabs = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "projects", label: "Projects", icon: Code },
    { id: "snippets", label: "Code Snippets", icon: Zap },
    { id: "discussions", label: "Discussions", icon: MessageCircle },
  ];

  const categories = [
    "all",
    "ai",
    "web-dev",
    "data-science",
    "algorithms",
    "finance",
    "games",
    "automation",
  ];

  const ProjectCard = ({ project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer"
      onClick={() => setSelectedProject(project)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">
            {project.user.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-slate-400">
              by @{project.user.username}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {project.is_public ? (
            <Globe className="w-4 h-4 text-emerald-400" />
          ) : (
            <Lock className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded-full text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="px-2 py-1 rounded-full text-xs bg-slate-700/50 text-slate-400">
            +{project.tags.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{project.star_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span>{project.fork_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{project.view_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{project.comment_count}</span>
          </div>
        </div>
        <span>
          {formatDistanceToNow(new Date(project.updated_at), {
            addSuffix: true,
          })}
        </span>
      </div>
    </motion.div>
  );

  const SnippetCard = ({ snippet }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-emerald-500/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-white group-hover:text-emerald-300 transition-colors">
            {snippet.title}
          </h4>
          <p className="text-xs text-slate-400">by @{snippet.user.username}</p>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleCopyCode(snippet.code);
            }}
            className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded text-slate-400 hover:text-pink-400 transition-colors"
          >
            <Heart className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-3 line-clamp-2">
        {snippet.description}
      </p>

      <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
        <pre className="text-xs text-emerald-300 font-mono overflow-x-auto line-clamp-3">
          {snippet.code}
        </pre>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3" />
            <span>{snippet.likes_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-3 h-3" />
            <span>{snippet.usage_count}</span>
          </div>
        </div>
        <span>
          {formatDistanceToNow(new Date(snippet.created_at), {
            addSuffix: true,
          })}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-8 pb-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Python Community
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover amazing Python projects, share your code, and learn from
            fellow developers around the world
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Active Projects", value: "2.4k", icon: Code },
            { label: "Code Snippets", value: "8.7k", icon: Zap },
            { label: "Community Members", value: "15.2k", icon: Users },
            { label: "Daily Executions", value: "45k", icon: Play },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 text-center"
            >
              <div className="inline-flex p-2 rounded-lg bg-slate-700/50 mb-2">
                <stat.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 mb-6 bg-slate-800/50 rounded-xl p-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "text-white bg-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, snippets, or discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 md:px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Share Project</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          )}

          {activeTab === "snippets" && (
            <motion.div
              key="snippets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredSnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </motion.div>
          )}

          {activeTab === "trending" && (
            <motion.div
              key="trending"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span>Trending Projects</span>
                  </h3>
                  {filteredProjects.slice(0, 3).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <span>Popular Snippets</span>
                  </h3>
                  {filteredSnippets.map((snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "discussions" && (
            <motion.div
              key="discussions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-12"
            >
              <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Discussions Coming Soon
              </h3>
              <p className="text-slate-400 mb-6">
                Connect with other developers, ask questions, and share
                knowledge
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-200"
              >
                Join Beta
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {selectedProject.user.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedProject.title}
                      </h2>
                      <p className="text-slate-400">
                        by @{selectedProject.user.username}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <p className="text-slate-300 mb-6">
                  {selectedProject.description}
                </p>

                <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                  <pre className="text-sm text-emerald-300 font-mono overflow-x-auto">
                    {selectedProject.code}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-6 text-sm text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{selectedProject.star_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-4 h-4" />
                      <span>{selectedProject.fork_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedProject.view_count}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopyCode(selectedProject.code)}
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStarProject(selectedProject.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      <span>Star</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleForkProject(selectedProject.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                    >
                      <GitFork className="w-4 h-4" />
                      <span>Fork</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Community;
