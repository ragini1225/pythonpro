import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import Playground from "./pages/Playground";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import TutorialPlayer from "./components/TutorialPlayer";

// Remove duplicate App and export statements

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Playground />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<Profile />} />
        <Route path="learn" element={<Learn />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
// ...existing code...
