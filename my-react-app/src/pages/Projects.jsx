import React, { useState, useEffect } from 'react';
import { Motion } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Code, Lock, Globe, Trash2, Edit3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/database';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [publicProjects, setPublicProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('my-projects');

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      if (user) {
        const { data: userProjects, error: userError } = await db.projects.getByUserId(user.id);
        if (userError) throw userError;
        setProjects(userProjects || []);
      }

      const { data: publicData, error: publicError } = await db.projects.getPublic();
      if (publicError) throw publicError;
      setPublicProjects(publicData || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await db.projects.delete(projectId);
      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'private' && !project.is_public) ||
                         (filter === 'public' && project.is_public);
    return matchesSearch && matchesFilter;
  });

  const filteredPublicProjects = publicProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProjectCard = ({ project, showActions = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {project.is_public ? (
            <Globe className="w-4 h-4 text-emerald-400" title="Public" />
          ) : (
            <Lock className="w-4 h-4 text-slate-400" title="Private" />
          )}
          {showActions && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteProject(project.id)}
                className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Code className="w-4 h-4" />
            <span>{project.language}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</span>
          </div>
        </div>
        {project.user && (
          <span className="text-emerald-400">@{project.user.username}</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded-full text-xs bg-slate-700/50 text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to view projects</h2>
          <p className="text-slate-400 mb-6">Create an account to save and manage your Python projects</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all duration-200"
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage your Python projects and explore the community</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-1 mb-6 bg-slate-800/50 rounded-xl p-1"
        >
          {[
            { id: 'my-projects', label: 'My Projects' },
            { id: 'explore', label: 'Explore' },
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
                  layoutId="tab-active"
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
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
            />
          </div>

          {activeTab === 'my-projects' && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                >
                  <option value="all">All Projects</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 animate-pulse"
              >
                <div className="h-6 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeTab === 'my-projects' ? (
              filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    showActions={true}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Code className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                  <p className="text-slate-400 mb-6">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first project to get started'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    Create Project
                  </motion.button>
                </div>
              )
            ) : (
              filteredPublicProjects.length > 0 ? (
                filteredPublicProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    showActions={false}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Globe className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No public projects found</h3>
                  <p className="text-slate-400">Try adjusting your search terms</p>
                </div>
              )
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;