import { supabase, isSupabaseConfigured } from './supabase';

const AuthError = {
  // Placeholder for error structure; in JS, we use plain objects
};

const AuthResponse = {
  // Placeholder for response structure; in JS, we use plain objects
};

// Authentication service
const authService = {
  // Sign up a new user
  async signUp(email, password, username) {
    if (!isSupabaseConfigured()) {
      return {
        error: {
          message: 'Authentication service is not configured. Please set up your Supabase credentials.',
        },
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: username,
          },
        },
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return { user: data.user };
    } catch (error) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  },

  // Sign in an existing user
  async signIn(email, password) {
    if (!isSupabaseConfigured()) {
      return {
        error: {
          message: 'Authentication service is not configured. Please set up your Supabase credentials.',
        },
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return { user: data.user };
    } catch (error) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  },

  // Sign out the current user
  async signOut() {
    if (!isSupabaseConfigured()) {
      return {};
    }

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: { message: error.message } };
      }

      return {};
    } catch (error) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  },

  // Get the current user
  async getCurrentUser () {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser ();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get the current session
  async getCurrentSession() {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  },

  // Reset password
  async resetPassword(email) {
    if (!isSupabaseConfigured()) {
      return {
        error: {
          message: 'Authentication service is not configured. Please set up your Supabase credentials.',
        },
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return { error: { message: error.message } };
      }

      return {};
    } catch (error) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  },

  // Update user profile
  async updateProfile(updates) {
    if (!isSupabaseConfigured()) {
      return {
        error: {
          message: 'Authentication service is not configured. Please set up your Supabase credentials.',
        },
      };
    }

    try {
      const { error } = await supabase.auth.updateUser ({
        data: updates,
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return {};
    } catch (error) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  },
};

export { authService };
