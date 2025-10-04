import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  Edit3,
  Save,
  X,
  Award,
  Code,
  Calendar,
  TrendingUp,
  Star,
  GitFork,
  Activity,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/database";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    username: "",
    full_name: "",
    bio: "",
    location: "",
    website: "",
    github_username: "",
    linkedin_url: "",
    skill_level: "beginner",
    public_profile: true,
    email_notifications: true,
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      // Load user projects
      const { data: projectsData } = await db.projects.getByUserId(user.id);
      setProjects(projectsData || []);

      // Load user achievements
      const { data: achievementsData } =
        await db.achievements.getUserAchievements(user.id);
      setAchievements(achievementsData || []);

      // Set profile data from user metadata
      setProfileData({
        username:
          user.user_metadata?.username || user.email?.split("@")[0] || "",
        full_name: user.user_metadata?.full_name || "",
        bio: user.user_metadata?.bio || "",
        location: user.user_metadata?.location || "",
        website: user.user_metadata?.website || "",
        github_username: user.user_metadata?.github_username || "",
        linkedin_url: user.user_metadata?.linkedin_url || "",
        skill_level: user.user_metadata?.skill_level || "beginner",
        public_profile: user.user_metadata?.public_profile ?? true,
        email_notifications: user.user_metadata?.email_notifications ?? true,
      });
    } catch (error) {
      console.error("Failed to load profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: profileData,
      });

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "advanced":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "expert":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common":
        return "text-gray-400";
      case "rare":
        return "text-blue-400";
      case "epic":
        return "text-purple-400";
      case "legendary":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Please sign in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalStars = projects.reduce(
    (sum, project) => sum + project.star_count,
    0
  );
  const totalForks = projects.reduce(
    (sum, project) => sum + project.fork_count,
    0
  );
  const totalPoints = achievements.reduce(
    (sum, ua) => sum + (ua.achievement?.points || 0),
    0
  );

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          username: e.target.value,
                        })
                      }
                      className="text-2xl font-bold bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white w-full"
                      placeholder="Username"
                    />
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          full_name: e.target.value,
                        })
                      }
                      className="text-lg bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-300 w-full"
                      placeholder="Full Name"
                    />
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-400 w-full resize-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {profileData.full_name || profileData.username}
                    </h1>
                    <p className="text-slate-400 mb-4">
                      @{profileData.username}
                    </p>
                    {profileData.bio && (
                      <p className="text-slate-300 mb-4 max-w-2xl">
                        {profileData.bio}
                      </p>
                    )}
                  </>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {profileData.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.website && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="w-4 h-4" />
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-400 transition-colors"
                      >
                        {profileData.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined{" "}
                      {formatDistanceToNow(new Date(user.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm border capitalize ${getSkillLevelColor(
                      profileData.skill_level
                    )}`}
                  >
                    {profileData.skill_level}
                  </span>
                  {profileData.github_username && (
                    <a
                      href={`https://github.com/${profileData.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-200"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {profileData.linkedin_url && (
                    <a
                      href={profileData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-200"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={handleSaveProfile}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              label: "Projects",
              value: projects.length,
              icon: Code,
              color: "emerald",
            },
            {
              label: "Total Stars",
              value: totalStars,
              icon: Star,
              color: "yellow",
            },
            {
              label: "Total Forks",
              value: totalForks,
              icon: GitFork,
              color: "blue",
            },
            {
              label: "Achievement Points",
              value: totalPoints,
              icon: Award,
              color: "purple",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 text-center"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 mb-3`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
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
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
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

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Achievements
                </h3>
                <Award className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-4">
                {achievements.slice(0, 8).map((userAchievement) => (
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
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400">
                          {userAchievement.achievement?.points} points
                        </span>
                        <span
                          className={`text-xs capitalize ${getRarityColor(
                            userAchievement.achievement?.rarity || "common"
                          )}`}
                        >
                          {userAchievement.achievement?.rarity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {achievements.length === 0 && (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No achievements yet</p>
                  <p className="text-sm text-slate-500">
                    Start coding to earn your first achievement!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
