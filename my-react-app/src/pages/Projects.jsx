import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Code,
  Lock,
  Globe,
  Trash2,
  Edit3,
  Star,
  Eye,
  GitFork,
  TrendingUp,
  Zap,
  Award,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/database';
import CreateProjectModal from '../components/CreateProjectModal';
import EditProjectModal from '../components/EditProjectModal';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [publicProjects, setPublicProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('my-projects');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      if (user) {
        const { data: userProjects, error: userError } =
          await db.projects.getByUserId(user.id);
        if (userError) {
          console.error('Error loading user projects:', userError);
          setProjects([]);
        } else {
          setProjects(userProjects || []);
        }
      }

      const { data: publicData, error: publicError } =
        await db.projects.getPublic();
      if (publicError) {
        console.error('Error loading public projects:', publicError);
        setPublicProjects([]);
      } else {
        setPublicProjects(publicData || []);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const { data, error } = await db.projects.create({
        ...projectData,
        user_id: user.id,
      });

      if (error) throw error;

      setProjects([data, ...projects]);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Failed to create project');
      throw error;
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (projectData) => {
    if (!selectedProject) return;

    try {
      const { data, error } = await db.projects.update(selectedProject.id, projectData);

      if (error) throw error;

      setProjects(projects.map(p => p.id === selectedProject.id ? data : p));
      toast.success('Project updated successfully!');
    } catch (error) {
      toast.error('Failed to update project');
      throw error;
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      const { error } = await db.projects.delete(projectId);
      if (error) throw error;

      setProjects(projects.filter((p) => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'private' && !project.is_public) ||
      (filter === 'public' && project.is_public);
    return matchesSearch && matchesFilter;
  });

  const filteredPublicProjects = publicProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProjectCard = ({ project, showActions = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative h-full bg-gradient-to-br from-slate-800/80 via-slate-800/40 to-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 p-6 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <Code className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                {project.title}
              </h3>
            </div>
            <p className="text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {project.is_public ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Public</span>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1 px-2.5 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">Private</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400 mb-4 pb-4 border-b border-slate-700/30">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 hover:text-emerald-400 transition-colors">
              <Code className="w-4 h-4" />
              <span className="font-medium">{project.language}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-slate-300 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDistanceToNow(new Date(project.updated_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-default"
              >
                {tag}
              </motion.span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-3 py-1 rounded-full text-xs text-slate-400">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center space-x-1 cursor-pointer hover:text-yellow-400 transition-colors"
            >
              <Star className="w-4 h-4 fill-current" />
              <span>{project.star_count || 0}</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center space-x-1 cursor-pointer hover:text-blue-400 transition-colors"
            >
              <GitFork className="w-4 h-4" />
              <span>{project.fork_count || 0}</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center space-x-1 cursor-pointer hover:text-cyan-400 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{project.view_count || 0}</span>
            </motion.div>
          </div>

          {showActions && (
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditProject(project)}
                className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteProject(project.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full"></div>
            <div className="relative p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50">
              <Zap className="w-20 h-20 text-emerald-400 mx-auto" />
            </div>
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Start Coding
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Sign in to create and manage your Python projects in the cloud
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/30"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Projects
                </h1>
              </div>
              <p className="text-slate-400 text-lg">
                Build, explore, and collaborate on amazing Python projects
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
            >
              <Zap className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm text-slate-400">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-2 mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1.5 border border-slate-700/50 w-fit"
        >
          {[
            { id: 'my-projects', label: 'My Projects', icon: Code },
            { id: 'explore', label: 'Explore Community', icon: Globe },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-white bg-slate-700/80 shadow-lg shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          <motion.div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Search projects by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
            />
          </motion.div>

          {activeTab === 'my-projects' && (
            <div className="flex items-center space-x-3">
              <motion.div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-11 pr-10 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer hover:border-slate-600 transition-all"
                >
                  <option value="all">All Projects</option>
                  <option value="private">Private Only</option>
                  <option value="public">Public Only</option>
                </select>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/30"
              >
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </motion.button>
            </div>
          )}
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6"
              >
                <div className="h-6 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-3"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3 mb-6"></div>
                <div className="flex space-x-3">
                  <div className="h-8 bg-slate-700 rounded flex-1"></div>
                  <div className="h-8 bg-slate-700 rounded flex-1"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <div className="max-w-md mx-auto">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mb-6 relative inline-block"
                    >
                      <div className="absolute inset-0 bg-slate-700/20 blur-3xl rounded-full"></div>
                      <div className="relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50">
                        <Code className="w-16 h-16 text-slate-600" />
                      </div>
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {searchTerm ? 'No projects found' : 'No projects yet'}
                    </h3>
                    <p className="text-slate-400 mb-8 text-lg">
                      {searchTerm
                        ? 'Try adjusting your search terms'
                        : 'Create your first project to start coding'}
                    </p>
                    {!searchTerm && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/30"
                      >
                        Create Your First Project
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            ) : filteredPublicProjects.length > 0 ? (
              filteredPublicProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showActions={false}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mb-6 relative inline-block"
                  >
                    <div className="absolute inset-0 bg-slate-700/20 blur-3xl rounded-full"></div>
                    <div className="relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50">
                      <Globe className="w-16 h-16 text-slate-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    No public projects found
                  </h3>
                  <p className="text-slate-400 text-lg">
                    Try adjusting your search or check back later
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        project={selectedProject}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        onUpdateProject={handleUpdateProject}
      />
    </div>
  );
};

export default Projects;
