import { supabase, isSupabaseConfigured } from './supabase';

export const supabaseService = {
  users: {
    async getProfile(userId) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },

    async updateProfile(userId, updates) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },

    async incrementStats(userId, stats) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase.rpc('increment_user_stats', {
          user_id: userId,
          execution_increment: stats.executions || 0,
          project_increment: stats.projects || 0
        });

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    }
  },

  projects: {
    async create(project) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .insert([project])
          .select()
          .single();

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },

    async getByUserId(userId) {
      if (!isSupabaseConfigured()) {
        return { data: [], error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            users (
              username,
              full_name,
              avatar_url
            )
          `)
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        return { data: data || [], error };
      } catch (error) {
        return { data: [], error };
      }
    },

    async getPublic(limit = 50) {
      if (!isSupabaseConfigured()) {
        return { data: [], error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            users (
              username,
              full_name,
              avatar_url
            )
          `)
          .eq('is_public', true)
          .order('star_count', { ascending: false })
          .limit(limit);

        return { data: data || [], error };
      } catch (error) {
        return { data: [], error };
      }
    },

    async update(id, updates) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },

    async delete(id) {
      if (!isSupabaseConfigured()) {
        return { error: { message: 'Supabase not configured' } };
      }

      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        return { error };
      } catch (error) {
        return { error };
      }
    },

    async star(projectId, userId) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase.rpc('star_project', {
          project_id: projectId,
          user_id: userId
        });

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },

    async fork(projectId, userId, newTitle) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase.rpc('fork_project', {
          original_project_id: projectId,
          user_id: userId,
          new_title: newTitle
        });

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    }
  },

  executions: {
    async create(execution) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('code_executions')
          .insert([execution])
          .select()
          .single();

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },

    async getByUserId(userId, limit = 50) {
      if (!isSupabaseConfigured()) {
        return { data: [], error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('code_executions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);

        return { data: data || [], error };
      } catch (error) {
        return { data: [], error };
      }
    },

    async getAnalytics(userId) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase.rpc('get_execution_analytics', {
          user_id: userId
        });

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    }
  },

  tutorials: {
    async getAll() {
      if (!isSupabaseConfigured()) {
        return { data: [], error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('tutorials')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        return { data: data || [], error };
      } catch (error) {
        return { data: [], error };
      }
    },

    async getByCategory(category) {
      if (!isSupabaseConfigured()) {
        return { data: [], error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('tutorials')
          .select('*')
          .eq('category', category)
          .eq('is_published', true)
          .order('rating_average', { ascending: false });

        return { data: data || [], error };
      } catch (error) {
        return { data: [], error };
      }
    },

    async updateProgress(userId, tutorialId, progress) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('tutorial_progress')
          .upsert({
            user_id: userId,
            tutorial_id: tutorialId,
            progress_percentage: progress,
            last_accessed_at: new Date().toISOString()
          })
          .select()
          .single();

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    }
  },

  snippets: {
    async getPublic() {
      if (!isSupabaseConfigured()) {
        return { data: [], error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('code_snippets')
          .select(`
            *,
            users (
              username,
              full_name,
              avatar_url
            )
          `)
          .eq('is_public', true)
          .order('likes_count', { ascending: false });

        return { data: data || [], error };
      } catch (error) {
        return { data: [], error };
      }
    },

    async create(snippet) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('code_snippets')
          .insert([snippet])
          .select()
          .single();

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },

    async like(snippetId, userId) {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase.rpc('like_snippet', {
          snippet_id: snippetId,
          user_id: userId
        });

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    }
  },

  achievements: {
    async getAll() {
      if (!isSupabaseConfigured()) {
        return { data: [], error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .eq('is_active', true)
          .order('points', { ascending: false });

        return { data: data || [], error };
      } catch (error) {
        return { data: [], error };
      }
    },

    async getUserAchievements(userId) {
      if (!isSupabaseConfigured()) {
        return { data: [], error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select(`
            *,
            achievements (
              name,
              description,
              icon,
              points,
              rarity
            )
          `)
          .eq('user_id', userId)
          .order('earned_at', { ascending: false });

        return { data: data || [], error };
      } catch (error) {
        return { data: [], error };
      }
    },

    async checkAndAward(userId, achievementType, currentValue) {
      if (!isSupabaseConfigured()) {
        return { data: [], error: { message: 'Supabase not configured' } };
      }

      try {
        const { data, error } = await supabase.rpc('check_and_award_achievements', {
          user_id: userId,
          achievement_type: achievementType,
          current_value: currentValue
        });

        return { data: data || [], error };
      } catch (error) {
        return { data: [], error };
      }
    }
  }
};

const localStorageService = {
  users: {
    async getProfile(userId) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      return { data: users[userId] || null, error: null };
    },

    async updateProfile(userId, updates) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[userId] = { ...users[userId], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      return { data: users[userId], error: null };
    },

    async incrementStats(userId, stats) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[userId]) {
        users[userId].total_executions = (users[userId].total_executions || 0) + (stats.executions || 0);
        users[userId].total_projects = (users[userId].total_projects || 0) + (stats.projects || 0);
        localStorage.setItem('users', JSON.stringify(users));
      }
      return { data: users[userId], error: null };
    }
  },

  projects: {
    async create(project) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const newProject = {
        ...project,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      projects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(projects));
      return { data: newProject, error: null };
    },

    async getByUserId(userId) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const userProjects = projects.filter(p => p.user_id === userId);
      return { data: userProjects, error: null };
    },

    async getPublic(limit = 50) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const publicProjects = projects.filter(p => p.is_public).slice(0, limit);
      return { data: publicProjects, error: null };
    },

    async update(id, updates) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const index = projects.findIndex(p => p.id === id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem('projects', JSON.stringify(projects));
        return { data: projects[index], error: null };
      }
      return { data: null, error: { message: 'Project not found' } };
    },

    async delete(id) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const filtered = projects.filter(p => p.id !== id);
      localStorage.setItem('projects', JSON.stringify(filtered));
      return { error: null };
    },

    async star(projectId, userId) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const project = projects.find(p => p.id === projectId);
      if (project) {
        project.star_count = (project.star_count || 0) + 1;
        localStorage.setItem('projects', JSON.stringify(projects));
      }
      return { data: project, error: null };
    },

    async fork(projectId, userId, newTitle) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const original = projects.find(p => p.id === projectId);
      if (original) {
        const forked = {
          ...original,
          id: Date.now().toString(),
          title: newTitle,
          user_id: userId,
          fork_count: 0,
          star_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        projects.push(forked);
        original.fork_count = (original.fork_count || 0) + 1;
        localStorage.setItem('projects', JSON.stringify(projects));
        return { data: forked, error: null };
      }
      return { data: null, error: { message: 'Project not found' } };
    }
  },

  executions: {
    async create(execution) {
      const executions = JSON.parse(localStorage.getItem('executions') || '[]');
      const newExecution = {
        ...execution,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      executions.push(newExecution);
      localStorage.setItem('executions', JSON.stringify(executions));
      return { data: newExecution, error: null };
    },

    async getByUserId(userId, limit = 50) {
      const executions = JSON.parse(localStorage.getItem('executions') || '[]');
      const userExecutions = executions.filter(e => e.user_id === userId).slice(0, limit);
      return { data: userExecutions, error: null };
    },

    async getAnalytics(userId) {
      const executions = JSON.parse(localStorage.getItem('executions') || '[]');
      const userExecutions = executions.filter(e => e.user_id === userId);
      return {
        data: {
          total: userExecutions.length,
          successful: userExecutions.filter(e => e.success).length,
          failed: userExecutions.filter(e => !e.success).length
        },
        error: null
      };
    }
  },

  tutorials: {
    async getAll() {
      return { data: [], error: null };
    },

    async getByCategory(category) {
      return { data: [], error: null };
    },

    async updateProgress(userId, tutorialId, progress) {
      const progresses = JSON.parse(localStorage.getItem('tutorial_progress') || '{}');
      const key = `${userId}_${tutorialId}`;
      progresses[key] = { progress_percentage: progress, last_accessed_at: new Date().toISOString() };
      localStorage.setItem('tutorial_progress', JSON.stringify(progresses));
      return { data: progresses[key], error: null };
    }
  },

  snippets: {
    async getPublic() {
      const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
      return { data: snippets.filter(s => s.is_public), error: null };
    },

    async create(snippet) {
      const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
      const newSnippet = {
        ...snippet,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      snippets.push(newSnippet);
      localStorage.setItem('snippets', JSON.stringify(snippets));
      return { data: newSnippet, error: null };
    },

    async like(snippetId, userId) {
      const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
      const snippet = snippets.find(s => s.id === snippetId);
      if (snippet) {
        snippet.likes_count = (snippet.likes_count || 0) + 1;
        localStorage.setItem('snippets', JSON.stringify(snippets));
      }
      return { data: snippet, error: null };
    }
  },

  achievements: {
    async getAll() {
      return { data: [], error: null };
    },

    async getUserAchievements(userId) {
      const achievements = JSON.parse(localStorage.getItem('user_achievements') || '{}');
      return { data: achievements[userId] || [], error: null };
    },

    async checkAndAward(userId, achievementType, currentValue) {
      return { data: [], error: null };
    }
  }
};

export const createDatabaseService = () => {
  if (isSupabaseConfigured()) {
    return supabaseService;
  }

  return localStorageService;
};
