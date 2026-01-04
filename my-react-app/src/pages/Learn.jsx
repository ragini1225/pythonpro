import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  Target, 
  Star, 
  Users, 
  TrendingUp,
  Filter,
  Search,
  Code,
  Lightbulb,
  Brain,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Download,
  Share2,
  Heart,
  Eye,
  MessageCircle,
  Trophy,
  Flame,
  Calendar,
  BarChart3
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import TutorialPlayer from '../components/TutorialPlayer';

const Learn = () => {
  const { user } = useAuth();
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showTutorialPlayer, setShowTutorialPlayer] = useState(false);
  const [userProgress, setUserProgress] = useState({
    totalCompleted: 0,
    totalTime: 0,
    currentStreak: 0,
    level: 'Beginner'
  });

  const tutorials = [
    {
      id: 1,
      title: "Python Fundamentals: Variables & Data Types",
      description: "Master the building blocks of Python programming with hands-on exercises and real-world examples",
      duration: 45,
      difficulty: "Beginner",
      category: "Fundamentals",
      icon: <BookOpen className="w-6 h-6" />,
      rating: 4.8,
      students: 1250,
      lessons: [
        "Understanding Variables",
        "Numbers and Strings", 
        "Booleans and None",
        "Type Conversion",
        "Practice Exercises"
      ],
      prerequisites: [],
      learningObjectives: [
        "Create and use variables effectively",
        "Understand different data types",
        "Convert between data types",
        "Apply best practices for naming"
      ],
      tags: ['variables', 'data-types', 'basics'],
      estimatedTime: 45,
      completionRate: 89,
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      author: 'Python Foundation',
      isNew: false,
      isFeatured: true
    },
    {
      id: 2,
      title: "Control Flow: Loops and Conditions",
      description: "Learn to control program flow with if statements, loops, and logical operators",
      duration: 60,
      difficulty: "Beginner",
      category: "Control Flow",
      icon: <Target className="w-6 h-6" />,
      rating: 4.7,
      students: 980,
      lessons: [
        "If, Elif, Else Statements",
        "Comparison Operators",
        "For Loops and Range",
        "While Loops",
        "Nested Structures",
        "Break and Continue"
      ],
      prerequisites: ["Python Fundamentals"],
      learningObjectives: [
        "Write conditional statements",
        "Create efficient loops",
        "Handle complex logic",
        "Avoid infinite loops"
      ],
      tags: ['conditions', 'loops', 'logic'],
      estimatedTime: 60,
      completionRate: 85,
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      author: 'Code Academy',
      isNew: false,
      isFeatured: true
    },
    {
      id: 3,
      title: "Functions and Modules",
      description: "Create reusable code with functions, understand scope, and work with Python modules",
      duration: 75,
      difficulty: "Intermediate",
      category: "Functions",
      icon: <Code className="w-6 h-6" />,
      rating: 4.9,
      students: 756,
      lessons: [
        "Function Basics",
        "Parameters and Arguments",
        "Return Values",
        "Scope and Local Variables",
        "Lambda Functions",
        "Modules and Imports"
      ],
      prerequisites: ["Control Flow"],
      learningObjectives: [
        "Write clean, reusable functions",
        "Understand variable scope",
        "Use built-in and custom modules",
        "Apply functional programming concepts"
      ],
      tags: ['functions', 'modules', 'scope'],
      estimatedTime: 75,
      completionRate: 78,
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      author: 'Advanced Python',
      isNew: false,
      isFeatured: false
    },
    {
      id: 4,
      title: "Object-Oriented Programming Mastery",
      description: "Deep dive into OOP concepts: classes, inheritance, polymorphism, and design patterns",
      duration: 120,
      difficulty: "Advanced",
      category: "OOP",
      icon: <Brain className="w-6 h-6" />,
      rating: 4.6,
      students: 432,
      lessons: [
        "Classes and Objects",
        "Attributes and Methods",
        "Inheritance",
        "Polymorphism",
        "Encapsulation",
        "Design Patterns"
      ],
      prerequisites: ["Functions and Modules"],
      learningObjectives: [
        "Design object-oriented solutions",
        "Implement inheritance hierarchies",
        "Apply design patterns",
        "Write maintainable code"
      ],
      tags: ['oop', 'classes', 'inheritance'],
      estimatedTime: 120,
      completionRate: 72,
      lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      author: 'OOP Expert',
      isNew: false,
      isFeatured: false
    },
    {
      id: 5,
      title: "Data Science with Python",
      description: "Analyze data, create visualizations, and build machine learning models",
      duration: 180,
      difficulty: "Advanced",
      category: "Data Science",
      icon: <BarChart3 className="w-6 h-6" />,
      rating: 4.9,
      students: 1890,
      lessons: [
        "NumPy Fundamentals",
        "Pandas Data Manipulation",
        "Data Visualization",
        "Statistical Analysis",
        "Machine Learning Basics",
        "Real-world Projects"
      ],
      prerequisites: ["OOP", "Functions"],
      learningObjectives: [
        "Manipulate data with Pandas",
        "Create stunning visualizations",
        "Build ML models",
        "Analyze real datasets"
      ],
      tags: ['data-science', 'pandas', 'numpy', 'ml'],
      estimatedTime: 180,
      completionRate: 68,
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      author: 'Data Science Pro',
      isNew: true,
      isFeatured: true
    },
    {
      id: 6,
      title: "Web Development with Flask",
      description: "Build modern web applications using Flask framework with databases and authentication",
      duration: 150,
      difficulty: "Intermediate",
      category: "Web Development",
      icon: <Globe className="w-6 h-6" />,
      rating: 4.5,
      students: 567,
      lessons: [
        "Flask Basics",
        "Routing and Templates",
        "Forms and Validation",
        "Database Integration",
        "User Authentication",
        "Deployment"
      ],
      prerequisites: ["Functions and Modules"],
      learningObjectives: [
        "Build web applications",
        "Handle user input securely",
        "Integrate databases",
        "Deploy to production"
      ],
      tags: ['web-dev', 'flask', 'backend'],
      estimatedTime: 150,
      completionRate: 75,
      lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      author: 'Web Dev Master',
      isNew: false,
      isFeatured: false
    }
  ];

  const learningPaths = [
    {
      id: 'beginner',
      title: 'Complete Beginner',
      description: 'Start your Python journey from zero to hero',
      duration: '8-12 weeks',
      tutorials: [1, 2, 3],
      color: 'emerald',
      icon: <Lightbulb className="w-8 h-8" />
    },
    {
      id: 'data-science',
      title: 'Data Science Track',
      description: 'Become a data scientist with Python',
      duration: '12-16 weeks',
      tutorials: [1, 2, 3, 4, 5],
      color: 'blue',
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      id: 'web-dev',
      title: 'Web Development',
      description: 'Build modern web applications',
      duration: '10-14 weeks',
      tutorials: [1, 2, 3, 6],
      color: 'purple',
      icon: <Globe className="w-8 h-8" />
    }
  ];

  useEffect(() => {
    loadUserProgress();
  }, [user]);

  const loadUserProgress = () => {
    // Load user progress from localStorage or database
    const saved = localStorage.getItem('tutorial_progress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedTutorials(progress.completed || []);
      setUserProgress(progress.stats || userProgress);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'advanced':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const handleStartTutorial = (tutorial) => {
    setSelectedTutorial(tutorial);
    setShowTutorialPlayer(true);
    toast.success(`Starting: ${tutorial.title}`, { icon: '🚀' });
  };

  const handleCompleteTutorial = (tutorialId) => {
    const newCompleted = [...completedTutorials, tutorialId];
    setCompletedTutorials(newCompleted);
    
    const newProgress = {
      ...userProgress,
      totalCompleted: newCompleted.length,
      totalTime: userProgress.totalTime + (selectedTutorial?.duration || 0)
    };
    setUserProgress(newProgress);
    
    // Save progress
    localStorage.setItem('tutorial_progress', JSON.stringify({
      completed: newCompleted,
      stats: newProgress
    }));
    
    setShowTutorialPlayer(false);
    setSelectedTutorial(null);
    toast.success('Tutorial completed! 🎉', { icon: '🏆' });
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty.toLowerCase() === selectedDifficulty;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'completed' && completedTutorials.includes(tutorial.id)) ||
                      (activeTab === 'featured' && tutorial.isFeatured) ||
                      (activeTab === 'new' && tutorial.isNew);
    return matchesSearch && matchesDifficulty && matchesTab;
  });

  const TutorialCard = ({ tutorial }) => {
    const isCompleted = completedTutorials.includes(tutorial.id);
    const progress = isCompleted ? 100 : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-all duration-300 group relative overflow-hidden"
      >
        {tutorial.isNew && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
            NEW
          </div>
        )}
        
        {tutorial.isFeatured && (
          <div className="absolute top-4 left-4 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-all duration-300"
            >
              {tutorial.icon}
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">
                {tutorial.title}
              </h3>
              <p className="text-sm text-slate-400">by {tutorial.author}</p>
            </div>
          </div>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-2 rounded-full bg-green-500/20 text-green-400"
            >
              <CheckCircle className="w-5 h-5" />
            </motion.div>
          )}
        </div>

        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          {tutorial.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{tutorial.duration} min</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400">
                <Users className="w-4 h-4" />
                <span>{tutorial.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>{tutorial.rating}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs border capitalize ${getDifficultyColor(tutorial.difficulty)}`}>
              {tutorial.difficulty}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">What you'll learn:</h4>
          <ul className="space-y-1">
            {tutorial.lessons.slice(0, 3).map((lesson, index) => (
              <li key={index} className="text-sm text-slate-400 flex items-center">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" />
                {lesson}
              </li>
            ))}
            {tutorial.lessons.length > 3 && (
              <li className="text-sm text-slate-500">
                +{tutorial.lessons.length - 3} more lessons
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tutorial.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Updated {formatDistanceToNow(tutorial.lastUpdated, { addSuffix: true })}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStartTutorial(tutorial)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isCompleted
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Review</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Learning</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const LearningPathCard = ({ path }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-all duration-300 group"
    >
      <div className="flex items-center space-x-4 mb-4">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={`p-4 rounded-2xl bg-${path.color}-500/10 text-${path.color}-400`}
        >
          {path.icon}
        </motion.div>
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {path.title}
          </h3>
          <p className="text-slate-400 text-sm">{path.duration}</p>
        </div>
      </div>

      <p className="text-slate-300 mb-4">{path.description}</p>

      <div className="space-y-2 mb-4">
        {path.tutorials.map((tutorialId, index) => {
          const tutorial = tutorials.find(t => t.id === tutorialId);
          const isCompleted = completedTutorials.includes(tutorialId);
          return (
            <div key={tutorialId} className="flex items-center space-x-3 text-sm">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isCompleted ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {index + 1}
              </div>
              <span className={isCompleted ? 'text-green-400' : 'text-slate-300'}>
                {tutorial?.title}
              </span>
              {isCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
            </div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 bg-${path.color}-600 hover:bg-${path.color}-500 text-white`}
      >
        Start Learning Path
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Learn Python Programming 🐍
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Master Python through interactive tutorials, hands-on projects, and real-world examples. 
            From beginner to expert, we've got you covered.
          </p>
        </motion.div>

        {/* User Progress Dashboard */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-emerald-400" />
                <span>Your Learning Journey</span>
              </h2>
              <div className="flex items-center space-x-2 text-emerald-400">
                <Flame className="w-5 h-5" />
                <span className="font-bold">{userProgress.currentStreak} day streak</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Completed', value: userProgress.totalCompleted, icon: CheckCircle, color: 'green' },
                { label: 'Hours Learned', value: Math.floor(userProgress.totalTime / 60), icon: Clock, color: 'blue' },
                { label: 'Current Level', value: userProgress.level, icon: Award, color: 'purple' },
                { label: 'Streak Days', value: userProgress.currentStreak, icon: Flame, color: 'orange' }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`inline-flex p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400 mb-2`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Target className="w-6 h-6 text-emerald-400" />
            <span>Learning Paths</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-1 mb-6 bg-slate-800/50 rounded-xl p-1"
        >
          {[
            { id: 'all', label: 'All Tutorials' },
            { id: 'featured', label: 'Featured' },
            { id: 'new', label: 'New' },
            { id: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-white bg-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 bg-slate-700 rounded-lg"
                  layoutId="learn-tab-active"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </motion.div>

        {/* Tutorials Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </motion.div>

        {filteredTutorials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tutorials found</h3>
            <p className="text-slate-400">Try adjusting your search terms or filters</p>
          </motion.div>
        )}

        {/* Tutorial Player Modal */}
        {showTutorialPlayer && selectedTutorial && (
          <TutorialPlayer
            tutorial={selectedTutorial}
            isOpen={showTutorialPlayer}
            onClose={() => {
              setShowTutorialPlayer(false);
              setSelectedTutorial(null);
            }}
            onComplete={() => handleCompleteTutorial(selectedTutorial.id)}
          />
        )}
      </div>
    </div>
  );
};

export default Learn;