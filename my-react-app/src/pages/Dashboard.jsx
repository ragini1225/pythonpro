import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Code,
  Clock,
  Award,
  Users,
  GitFork,
  Star,
  Activity,
  Calendar,
  Target,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/database";

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [recentExecutions, setRecentExecutions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalExecutions: 0,
    streakDays: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load user projects
      const { data: projectsData } = await db.projects.getByUserId(user.id);
      setProjects(projectsData?.slice(0, 5) || []);

      // Load recent executions
      const { data: executionsData } = await db.executions.getAnalytics(
        user.id
      );
      setRecentExecutions(executionsData?.slice(0, 10) || []);

      // Load user achievements
      const { data: achievementsData } =
        await db.achievements.getUserAchievements(user.id);
      setAchievements(achievementsData || []);

      // Calculate stats
      const totalPoints =
        achievementsData?.reduce(
          (sum, ua) => sum + (ua.achievement?.points || 0),
          0
        ) || 0;
      setStats({
        totalProjects: projectsData?.length || 0,
        totalExecutions: executionsData?.length || 0,
        streakDays: user.user_metadata?.streak_days || 0,
        totalPoints,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 text-center"
    >
      <div
        className={`inline-flex p-3 rounded-xl bg-${color}-500/10 text-${color}-400 mb-3`}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </motion.div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Please sign in to view your dashboard
          </h2>
        </div>
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
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.user_metadata?.username || user.email}! 👋
          </h1>
          <p className="text-slate-400">Here's your coding journey overview</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<Code className="w-6 h-6" />}
            color="emerald"
            trend="+12%"
          />
          <StatCard
            title="Code Executions"
            value={stats.totalExecutions}
            icon={<Zap className="w-6 h-6" />}
            color="blue"
            trend="+8%"
          />
          <StatCard
            title="Streak Days"
            value={stats.streakDays}
            icon={<Activity className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            title="Achievement Points"
            value={stats.totalPoints}
            icon={<Award className="w-6 h-6" />}
            color="purple"
            trend="+25%"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Recent Projects
                </h3>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Code className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {project.title}
                        </h4>
                        <p className="text-sm text-slate-400 line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{project.star_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="w-3 h-3" />
                        <span>{project.fork_count}</span>
                      </div>
                      <span>
                        {formatDistanceToNow(new Date(project.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Recent Achievements
                </h3>
                <Award className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-4">
                {achievements.slice(0, 5).map((userAchievement) => (
                  <motion.div
                    key={userAchievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg"
                  >
                    <div className="text-2xl">
                      {userAchievement.achievement?.icon || "🏆"}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">
                        {userAchievement.achievement?.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {userAchievement.achievement?.points} points
                      </p>
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDistanceToNow(
                        new Date(userAchievement.earned_at),
                        { addSuffix: true }
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Activity</h3>
                <BarChart3 className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">This Week</span>
                  <span className="text-sm font-medium text-white">
                    24 executions
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">This Month</span>
                  <span className="text-sm font-medium text-white">
                    156 executions
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Learning Progress
                  </span>
                  <span className="text-sm font-medium text-white">
                    8/12 tutorials
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "67%" }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Recent Activity
              </h3>
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="space-y-4">
              {recentExecutions.map((execution) => (
                <div
                  key={execution.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        execution.success
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Code Execution</h4>
                      <p className="text-sm text-slate-400">
                        {execution.success ? "Successful" : "Failed"} •{" "}
                        {execution.execution_time}ms
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">
                    {formatDistanceToNow(new Date(execution.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
