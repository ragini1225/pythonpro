// src/contexts/AuthContext.jsx (converted to pure JS/JSX - no TypeScript)
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Local storage based authentication
class LocalAuthService {
  users = [];
  currentUser  = null;

  constructor() {
    this.loadUsers();
    this.loadCurrentUser ();
  }

  loadUsers() {
    const stored = localStorage.getItem('pycode_users');
    if (stored) {
      this.users = JSON.parse(stored);
    }
  }

  saveUsers() {
    localStorage.setItem('pycode_users', JSON.stringify(this.users));
  }

  loadCurrentUser () {
    const stored = localStorage.getItem('pycode_current_user');
    if (stored) {
      this.currentUser  = JSON.parse(stored);
    }
  }

  saveCurrentUser (user) {
    if (user) {
      localStorage.setItem('pycode_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pycode_current_user');
    }
    this.currentUser  = user;
  }

  async signUp(email, password, username) {
    // Check if user already exists
    if (this.users.find(u => u.email === email || u.username === username)) {
      return { error: { message: 'User  already exists' } };
    }

    const newUser  = {
      id: crypto.randomUUID(),
      email,
      username,
      full_name: username,
      created_at: new Date().toISOString(),
      user_metadata: {
        username,
        full_name: username,
        skill_level: 'beginner',
        public_profile: true,
        email_notifications: true
      }
    };

    this.users.push(newUser );
    this.saveUsers();
    this.saveCurrentUser (newUser );

    return { user: newUser  };
  }

  async signIn(email, password) {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return { error: { message: 'Invalid credentials' } };
    }

    this.saveCurrentUser (user);
    return { user };
  }

  async signOut() {
    this.saveCurrentUser (null);
  }

  getCurrentUser () {
    return this.currentUser ;
  }

  async updateUser (updates) {
    if (!this.currentUser ) {
      return { error: { message: 'Not authenticated' } };
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser .id);
    if (userIndex === -1) {
      return { error: { message: 'User  not found' } };
    }

    const updatedUser  = { ...this.currentUser , ...updates };
    this.users[userIndex] = updatedUser ;
    this.saveUsers();
    this.saveCurrentUser (updatedUser );

    return {};
  }
}

const authService = new LocalAuthService();

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const currentUser  = authService.getCurrentUser ();
    setUser (currentUser );
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const result = await authService.signIn(email, password);
    if (result.user) {
      setUser (result.user);
    }
    return { error: result.error };
  };

  const signUp = async (email, password, username) => {
    const result = await authService.signUp(email, password, username);
    if (result.user) {
      setUser (result.user);
    }
    return { error: result.error };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser (null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export auth service for direct access
export { authService };
