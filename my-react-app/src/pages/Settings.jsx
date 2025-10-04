import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Code,
  Shield,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Globe,
  Lock,
  Zap,
  Database,
  Key,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../lib/auth";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Profile settings
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
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: "dark",
    editor_theme: "pythonDark",
    font_size: 14,
    tab_size: 4,
    auto_save: true,
    line_numbers: true,
    word_wrap: true,
    minimap: false,
    vim_mode: false,
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    project_updates: true,
    community_activity: true,
    achievement_alerts: true,
    weekly_digest: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profile_visibility: "public",
    show_activity: true,
    show_projects: true,
    show_achievements: true,
    allow_collaboration: true,
    data_collection: true,
  });

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = () => {
    if (!user) return;

    setProfileData({
      username: user.user_metadata?.username || user.email?.split("@")[0] || "",
      full_name: user.user_metadata?.full_name || "",
      bio: user.user_metadata?.bio || "",
      location: user.user_metadata?.location || "",
      website: user.user_metadata?.website || "",
      github_username: user.user_metadata?.github_username || "",
      linkedin_url: user.user_metadata?.linkedin_url || "",
      skill_level: user.user_metadata?.skill_level || "beginner",
      public_profile: user.user_metadata?.public_profile ?? true,
    });

    // Load preferences from localStorage or user metadata
    const savedPreferences = localStorage.getItem("pycode_preferences");
    if (savedPreferences) {
      setPreferences({ ...preferences, ...JSON.parse(savedPreferences) });
    }

    const savedNotifications = localStorage.getItem("pycode_notifications");
    if (savedNotifications) {
      setNotifications({ ...notifications, ...JSON.parse(savedNotifications) });
    }

    const savedPrivacy = localStorage.getItem("pycode_privacy");
    if (savedPrivacy) {
      setPrivacy({ ...privacy, ...JSON.parse(savedPrivacy) });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await authService.updateProfile(profileData);
      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem("pycode_preferences", JSON.stringify(preferences));
    toast.success("Preferences saved!");
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("pycode_notifications", JSON.stringify(notifications));
    toast.success("Notification settings saved!");
  };

  const handleSavePrivacy = () => {
    localStorage.setItem("pycode_privacy", JSON.stringify(privacy));
    toast.success("Privacy settings saved!");
  };

  const handleExportData = () => {
    const data = {
      profile: profileData,
      preferences,
      notifications,
      privacy,
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pycode-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Settings exported successfully!");
  };

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);

        if (data.profile) setProfileData({ ...profileData, ...data.profile });
        if (data.preferences)
          setPreferences({ ...preferences, ...data.preferences });
        if (data.notifications)
          setNotifications({ ...notifications, ...data.notifications });
        if (data.privacy) setPrivacy({ ...privacy, ...data.privacy });

        toast.success("Settings imported successfully!");
      } catch (error) {
        toast.error("Failed to import settings");
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "advanced", label: "Advanced", icon: SettingsIcon },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Sign in to access settings
          </h2>
          <p className="text-slate-400">
            Create an account to customize your PyCode Pro experience
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pt-8 pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Customize your PyCode Pro experience</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Profile Settings
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            username: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            full_name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Skill Level
                      </label>
                      <select
                        value={profileData.skill_level}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            skill_level: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? "Saving..." : "Save Profile"}</span>
                  </motion.button>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Preferences
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "light", label: "Light", icon: Sun },
                          { value: "dark", label: "Dark", icon: Moon },
                          { value: "system", label: "System", icon: Monitor },
                        ].map((theme) => {
                          const Icon = theme.icon;
                          return (
                            <motion.button
                              key={theme.value}
                              onClick={() =>
                                setPreferences({
                                  ...preferences,
                                  theme: theme.value,
                                })
                              }
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                                preferences.theme === theme.value
                                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                                  : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{theme.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Font Size
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="20"
                          value={preferences.font_size}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              font_size: parseInt(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                        <div className="text-sm text-slate-400 mt-1">
                          {preferences.font_size}px
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Tab Size
                        </label>
                        <select
                          value={preferences.tab_size}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              tab_size: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <option value={2}>2 spaces</option>
                          <option value={4}>4 spaces</option>
                          <option value={8}>8 spaces</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          key: "auto_save",
                          label: "Auto Save",
                          description: "Automatically save your work",
                        },
                        {
                          key: "line_numbers",
                          label: "Line Numbers",
                          description: "Show line numbers in editor",
                        },
                        {
                          key: "word_wrap",
                          label: "Word Wrap",
                          description: "Wrap long lines",
                        },
                        {
                          key: "minimap",
                          label: "Minimap",
                          description: "Show code minimap",
                        },
                        {
                          key: "vim_mode",
                          label: "Vim Mode",
                          description: "Enable Vim keybindings",
                        },
                      ].map((setting) => (
                        <div
                          key={setting.key}
                          className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-white">
                              {setting.label}
                            </div>
                            <div className="text-sm text-slate-400">
                              {setting.description}
                            </div>
                          </div>
                          <motion.button
                            onClick={() =>
                              setPreferences({
                                ...preferences,
                                [setting.key]: !preferences[setting.key],
                              })
                            }
                            whileTap={{ scale: 0.95 }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              preferences[setting.key]
                                ? "bg-emerald-600"
                                : "bg-slate-600"
                            }`}
                          >
                            <motion.span
                              animate={{
                                x: preferences[setting.key] ? 20 : 4,
                              }}
                              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                            />
                          </motion.button>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      onClick={handleSavePreferences}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Preferences</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Advanced Tab */}
              {activeTab === "advanced" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Advanced Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-slate-700/30 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Data Management
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        <motion.button
                          onClick={handleExportData}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all duration-200"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Settings</span>
                        </motion.button>

                        <motion.label
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Import Settings</span>
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            className="hidden"
                          />
                        </motion.label>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        API Access
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            API Key
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type={showApiKey ? "text" : "password"}
                              value="pk_live_1234567890abcdef"
                              readOnly
                              className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none"
                            />
                            <motion.button
                              onClick={() => setShowApiKey(!showApiKey)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                            >
                              {showApiKey ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-red-400 mb-4">
                        Danger Zone
                      </h3>
                      <div className="space-y-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Account</span>
                        </motion.button>
                        <p className="text-sm text-slate-400">
                          This action cannot be undone. All your data will be
                          permanently deleted.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
