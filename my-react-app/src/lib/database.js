// SQLite database implementation for local storage
const DatabaseConfig = {
  // Placeholder; in JS, we use plain objects
};

class SQLiteDatabase {
  db = null;
  config = null;

  constructor(config) {
    this.config = config;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.name, this.config.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create tables
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('username', 'username', { unique: true });
        }

        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('user_id', 'user_id');
          projectStore.createIndex('is_public', 'is_public');
          projectStore.createIndex('created_at', 'created_at');
        }

        if (!db.objectStoreNames.contains('executions')) {
          const executionStore = db.createObjectStore('executions', { keyPath: 'id' });
          executionStore.createIndex('user_id', 'user_id');
          executionStore.createIndex('project_id', 'project_id');
          executionStore.createIndex('created_at', 'created_at');
        }

        if (!db.objectStoreNames.contains('tutorials')) {
          const tutorialStore = db.createObjectStore('tutorials', { keyPath: 'id' });
          tutorialStore.createIndex('category', 'category');
          tutorialStore.createIndex('difficulty', 'difficulty');
          tutorialStore.createIndex('is_published', 'is_published');
        }

        if (!db.objectStoreNames.contains('achievements')) {
          const achievementStore = db.createObjectStore('achievements', { keyPath: 'id' });
          achievementStore.createIndex('category', 'category');
          achievementStore.createIndex('rarity', 'rarity');
        }

        if (!db.objectStoreNames.contains('user_achievements')) {
          const userAchievementStore = db.createObjectStore('user_achievements', { keyPath: 'id' });
          userAchievementStore.createIndex('user_id', 'user_id');
          userAchievementStore.createIndex('achievement_id', 'achievement_id');
        }

        // Add snippets store (missing in original)
        if (!db.objectStoreNames.contains('snippets')) {
          const snippetStore = db.createObjectStore('snippets', { keyPath: 'id' });
          snippetStore.createIndex('user_id', 'user_id');
          snippetStore.createIndex('is_public', 'is_public');
          snippetStore.createIndex('created_at', 'created_at');
        }
      };
    });
  }

  async query(storeName, operation, data, index) {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], operation === 'get' || operation === 'getAll' ? 'readonly' : 'readwrite');
      const store = transaction.objectStore(storeName);
      
      let request;

      switch (operation) {
        case 'get':
          request = store.get(data);
          break;
        case 'getAll':
          if (index) {
            const indexObj = store.index(index);
            request = data ? indexObj.getAll(data) : indexObj.getAll();
          } else {
            request = store.getAll();
          }
          break;
        case 'add':
          request = store.add(data);
          break;
        case 'put':
          request = store.put(data);
          break;
        case 'delete':
          request = store.delete(data);
          break;
        default:
          reject(new Error('Invalid operation'));
          return;
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Initialize database
const database = new SQLiteDatabase({ name: 'PyCodePro', version: 1 });

// Initialize on first import
database.init().catch(console.error);

// Enhanced database service with better error handling and features
class DatabaseService {
  constructor() {
    this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      await database.init();
      await this.seedInitialData();
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  async seedInitialData() {
    // Only seed if no data exists
    try {
      const existingProjects = await database.query('projects', 'getAll');
      if (!existingProjects || existingProjects.length === 0) {
        await initializeSampleData();
      }
    } catch (error) {
      console.error('Failed to seed initial data:', error);
    }
  }
}

// Initialize enhanced database service
const databaseService = new DatabaseService();

// Database service
const db = {
  // Projects
  projects: {
    async create(project) {
      const newProject = {
        ...project,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        star_count: 0,
        fork_count: 0,
        view_count: 0,
        execution_count: 0
      };
      
      await database.query('projects', 'add', newProject);
      return { data: newProject, error: null };
    },

    async getByUserId(userId) {
      try {
        const projects = await database.query('projects', 'getAll', userId, 'user_id');
        return { data: projects || [], error: null };
      } catch (error) {
        return { data: [], error };
      }
    },

    async getPublic() {
      try {
        const projects = await database.query('projects', 'getAll', true, 'is_public');
        return { data: projects || [], error: null };
      } catch (error) {
        return { data: [], error };
      }
    },

    async update(id, updates) {
      try {
        const existing = await database.query('projects', 'get', id);
        if (!existing) throw new Error('Project not found');
        
        const updated = {
          ...existing,
          ...updates,
          updated_at: new Date().toISOString()
        };
        
        await database.query('projects', 'put', updated);
        return { data: updated, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    async delete(id) {
      try {
        await database.query('projects', 'delete', id);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },

    async fork(projectId, newTitle) {
      try {
        const originalProject = await database.query('projects', 'get', projectId);
        if (!originalProject) throw new Error('Project not found');
        
        const currentUser  = JSON.parse(localStorage.getItem('currentUser ') || '{}');
        if (!currentUser .id) throw new Error('Not authenticated');

        const forkedProject = {
          ...originalProject,
          id: crypto.randomUUID(),
          title: newTitle,
          parent_project_id: projectId,
          user_id: currentUser .id,
          fork_count: 0,
          star_count: 0,
          view_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await database.query('projects', 'add', forkedProject);
        
        // Update original project fork count
        const updatedOriginal = {
          ...originalProject,
          fork_count: originalProject.fork_count + 1
        };
        await database.query('projects', 'put', updatedOriginal);
        
        return { data: forkedProject, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    async star(projectId) {
      try {
        const project = await database.query('projects', 'get', projectId);
        if (!project) throw new Error('Project not found');
        
        const updated = {
          ...project,
          star_count: project.star_count + 1
        };
        
        await database.query('projects', 'put', updated);
        return { data: updated, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  },

  // Code Executions
  executions: {
    async create(execution) {
      const newExecution = {
        ...execution,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };
      
      await database.query('executions', 'add', newExecution);
      return { data: newExecution, error: null };
    },

    async getByProjectId(projectId) {
      try {
        const executions = await database.query('executions', 'getAll', projectId, 'project_id');
        return { data: executions || [], error: null };
      } catch (error) {
        return { data: [], error };
      }
    },

    async getAnalytics(userId) {
      try {
        const executions = await database.query('executions', 'getAll', userId, 'user_id');
        return { data: executions || [], error: null };
      } catch (error) {
        return { data: [], error };
      }
    }
  },

  // Tutorials
  tutorials: {
    async getAll() {
      try {
        const tutorials = await database.query('tutorials', 'getAll', true, 'is_published');
        return { data: tutorials || [], error: null };
      } catch (error) {
        return { data: [], error };
      }
    },

    async getByCategory(category) {
      try {
        const tutorials = await database.query('tutorials', 'getAll', category, 'category');
        return { data: tutorials?.filter(t => t.is_published) || [], error: null };
      } catch (error) {
        return { data: [], error };
      }
    },

    async getById(id) {
      try {
        const tutorial = await database.query('tutorials', 'get', id);
        return { data: tutorial, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  },

  // Code Snippets
  snippets: {
    async getPublic() {
      try {
        const snippets = await database.query('snippets', 'getAll');
        return { data: snippets?.filter(s => s.is_public) || [], error: null };
      } catch (error) {
        return { data: [], error };
      }
    },

    async create(snippet) {
      const newSnippet = {
        ...snippet,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 0,
        usage_count: 0
      };
      
      await database.query('snippets', 'add', newSnippet);
      return { data: newSnippet, error: null };
    }
  },

  // Achievements
  achievements: {
    async getAll() {
      try {
        const achievements = await database.query('achievements', 'getAll');
        return { data: achievements || [], error: null };
      } catch (error) {
        return { data: [], error };
      }
    },

    async getUserAchievements(userId) {
      try {
        const userAchievements = await database.query('user_achievements', 'getAll', userId, 'user_id');
        return { data: userAchievements || [], error: null };
      } catch (error) {
        return { data: [], error };
      }
    }
  }
};

// Initialize sample data
const initializeSampleData = async () => {
  try {
    // Add sample achievements
    const achievements = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Execute your first Python code',
        icon: '🚀',
        category: 'execution',
        points: 10,
        rarity: 'common',
        requirements: { executions: 1 },
        is_active: true
      },
      {
        id: '2',
        name: 'Code Explorer',
        description: 'Execute 10 different code snippets',
        icon: '🔍',
        category: 'execution',
        points: 50,
        rarity: 'common',
        requirements: { executions: 10 }
      },
      {
        id: '3',
        name: 'Python Master',
        description: 'Execute 100 code snippets',
        icon: '🐍',
        category: 'execution',
        points: 200,
        rarity: 'rare',
        requirements: { executions: 100 }
      }
    ];

    for (const achievement of achievements) {
      try {
        await database.query('achievements', 'add', achievement);
      } catch (e) {
        // Achievement already exists
      }
    }

    // Add sample tutorials
    const tutorials = [
      {
        id: '1',
        title: 'Python Fundamentals: Variables & Data Types',
        description: 'Master the building blocks of Python programming',
        content: 'Complete tutorial content...',
        difficulty: 'beginner',
        category: 'fundamentals',
        estimated_time: 45,
        is_published: true,
        view_count: 1250,
        completion_count: 890,
        rating_average: 4.8,
        rating_count: 156,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const tutorial of tutorials) {
      try {
        await database.query('tutorials', 'add', tutorial);
      } catch (e) {
        // Tutorial already exists
      }
    }
  } catch (error) {
    console.error('Failed to initialize sample data:', error);
  }
};

// Initialize sample data on first load
setTimeout(initializeSampleData, 1000);

export { db, initializeSampleData };
