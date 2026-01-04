/*
  # Comprehensive Python Platform Database Schema

  1. New Tables
    - `users` - Extended user profiles with preferences
    - `projects` - Python projects with version control
    - `code_executions` - Execution history and analytics
    - `tutorials` - Interactive learning content
    - `code_snippets` - Reusable code library
    - `collaborations` - Real-time collaboration sessions
    - `comments` - Code review and feedback system
    - `achievements` - Gamification and progress tracking
    - `deployments` - Project deployment history

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Secure user data and project privacy

  3. Features
    - Version control for projects
    - Real-time collaboration
    - Code analytics and insights
    - Learning progress tracking
    - Achievement system
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with extended profiles
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  website text,
  github_username text,
  linkedin_url text,
  skill_level text DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  preferred_theme text DEFAULT 'dark',
  preferred_language text DEFAULT 'python',
  email_notifications boolean DEFAULT true,
  public_profile boolean DEFAULT true,
  total_projects integer DEFAULT 0,
  total_executions integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_active_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table with version control
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  code text NOT NULL,
  language text DEFAULT 'python',
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  is_public boolean DEFAULT false,
  is_template boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  version integer DEFAULT 1,
  parent_project_id uuid REFERENCES projects(id),
  fork_count integer DEFAULT 0,
  star_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  last_executed_at timestamptz,
  execution_count integer DEFAULT 0,
  file_structure jsonb DEFAULT '{}',
  dependencies text[] DEFAULT '{}',
  readme text,
  license text DEFAULT 'MIT',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Code executions with analytics
CREATE TABLE IF NOT EXISTS code_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  code text NOT NULL,
  output text,
  error text,
  execution_time integer,
  memory_usage integer,
  cpu_usage integer,
  lines_of_code integer,
  complexity_score integer,
  success boolean DEFAULT false,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Interactive tutorials
CREATE TABLE IF NOT EXISTS tutorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content text NOT NULL,
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category text NOT NULL,
  subcategory text,
  estimated_time integer, -- in minutes
  prerequisites text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  code_examples text[] DEFAULT '{}',
  exercises jsonb DEFAULT '[]',
  quiz_questions jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES users(id),
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  completion_count integer DEFAULT 0,
  rating_average decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Code snippets library
CREATE TABLE IF NOT EXISTS code_snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  code text NOT NULL,
  language text DEFAULT 'python',
  category text NOT NULL,
  subcategory text,
  tags text[] DEFAULT '{}',
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  is_public boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  complexity_level text DEFAULT 'beginner',
  performance_notes text,
  related_snippets uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Real-time collaborations
CREATE TABLE IF NOT EXISTS collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  collaborator_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  permissions jsonb DEFAULT '{"read": true, "write": false, "execute": false, "share": false}',
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  last_active_at timestamptz,
  is_active boolean DEFAULT true
);

-- Comments and code reviews
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES comments(id),
  content text NOT NULL,
  line_number integer,
  file_path text,
  comment_type text DEFAULT 'general' CHECK (comment_type IN ('general', 'suggestion', 'issue', 'question')),
  is_resolved boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Achievement system
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  category text NOT NULL,
  points integer DEFAULT 0,
  rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  requirements jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  progress jsonb DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Project deployments
CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  deployment_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'success', 'failed')),
  build_logs text,
  environment_vars jsonb DEFAULT '{}',
  deployment_config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Tutorial progress tracking
CREATE TABLE IF NOT EXISTS tutorial_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tutorial_id uuid REFERENCES tutorials(id) ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0,
  completed_exercises jsonb DEFAULT '[]',
  quiz_scores jsonb DEFAULT '[]',
  time_spent integer DEFAULT 0, -- in minutes
  last_accessed_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, tutorial_id)
);

-- Code analytics
CREATE TABLE IF NOT EXISTS code_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  analysis_type text NOT NULL,
  results jsonb NOT NULL,
  suggestions text[] DEFAULT '{}',
  score integer,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own profile" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Public profiles are viewable" ON users FOR SELECT TO authenticated USING (public_profile = true);

-- Projects policies
CREATE POLICY "Users can manage own projects" ON projects FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Public projects are viewable" ON projects FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "Collaborators can access shared projects" ON projects FOR SELECT TO authenticated 
  USING (id IN (SELECT project_id FROM collaborations WHERE collaborator_id = auth.uid() AND is_active = true));

-- Code executions policies
CREATE POLICY "Users can manage own executions" ON code_executions FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Tutorials policies
CREATE POLICY "Published tutorials are viewable" ON tutorials FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "Authors can manage own tutorials" ON tutorials FOR ALL TO authenticated USING (auth.uid() = author_id);

-- Code snippets policies
CREATE POLICY "Users can manage own snippets" ON code_snippets FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Public snippets are viewable" ON code_snippets FOR SELECT TO authenticated USING (is_public = true);

-- Collaborations policies
CREATE POLICY "Users can view own collaborations" ON collaborations FOR SELECT TO authenticated 
  USING (auth.uid() = owner_id OR auth.uid() = collaborator_id);
CREATE POLICY "Project owners can manage collaborations" ON collaborations FOR ALL TO authenticated USING (auth.uid() = owner_id);

-- Comments policies
CREATE POLICY "Users can manage own comments" ON comments FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Comments on accessible projects are viewable" ON comments FOR SELECT TO authenticated 
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid() OR is_public = true));

-- Achievements policies
CREATE POLICY "Active achievements are viewable" ON achievements FOR SELECT TO authenticated USING (is_active = true);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can earn achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Deployments policies
CREATE POLICY "Users can manage own deployments" ON deployments FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Tutorial progress policies
CREATE POLICY "Users can manage own progress" ON tutorial_progress FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Code analytics policies
CREATE POLICY "Users can view own analytics" ON code_analytics FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO achievements (name, description, icon, category, points, rarity, requirements) VALUES
('First Steps', 'Execute your first Python code', '🚀', 'execution', 10, 'common', '{"executions": 1}'),
('Code Explorer', 'Execute 10 different code snippets', '🔍', 'execution', 50, 'common', '{"executions": 10}'),
('Python Master', 'Execute 100 code snippets', '🐍', 'execution', 200, 'rare', '{"executions": 100}'),
('Project Creator', 'Create your first project', '📁', 'project', 25, 'common', '{"projects": 1}'),
('Collaboration King', 'Collaborate on 5 projects', '👥', 'collaboration', 100, 'rare', '{"collaborations": 5}'),
('Learning Enthusiast', 'Complete your first tutorial', '📚', 'learning', 30, 'common', '{"tutorials_completed": 1}'),
('Knowledge Seeker', 'Complete 10 tutorials', '🎓', 'learning', 150, 'rare', '{"tutorials_completed": 10}'),
('Code Reviewer', 'Leave 25 helpful comments', '💬', 'community', 75, 'common', '{"comments": 25}'),
('Streak Master', 'Code for 7 days in a row', '🔥', 'consistency', 100, 'rare', '{"streak_days": 7}'),
('Algorithm Expert', 'Solve 50 algorithm challenges', '🧮', 'problem_solving', 300, 'epic', '{"algorithms_solved": 50}');

INSERT INTO tutorials (title, description, content, difficulty, category, estimated_time, code_examples, tags, is_published) VALUES
('Python Basics: Variables and Data Types', 'Learn the fundamentals of Python programming', 'Complete tutorial content here...', 'beginner', 'fundamentals', 30, ARRAY['x = 10', 'name = "Python"', 'is_active = True'], ARRAY['basics', 'variables', 'data-types'], true),
('Control Flow: Loops and Conditions', 'Master Python control structures', 'Complete tutorial content here...', 'beginner', 'fundamentals', 45, ARRAY['if x > 5:', 'for i in range(10):', 'while condition:'], ARRAY['control-flow', 'loops', 'conditions'], true),
('Functions and Modules', 'Create reusable code with functions', 'Complete tutorial content here...', 'intermediate', 'functions', 60, ARRAY['def my_function():', 'import math', 'from module import function'], ARRAY['functions', 'modules', 'imports'], true),
('Object-Oriented Programming', 'Learn classes and objects in Python', 'Complete tutorial content here...', 'intermediate', 'oop', 90, ARRAY['class Person:', 'def __init__(self):', 'super().__init__()'], ARRAY['oop', 'classes', 'inheritance'], true),
('Data Structures: Lists and Dictionaries', 'Work with Python data structures', 'Complete tutorial content here...', 'intermediate', 'data-structures', 75, ARRAY['my_list = [1, 2, 3]', 'my_dict = {"key": "value"}', 'list.append(item)'], ARRAY['data-structures', 'lists', 'dictionaries'], true),
('File Handling and I/O', 'Read and write files in Python', 'Complete tutorial content here...', 'intermediate', 'file-io', 50, ARRAY['with open("file.txt") as f:', 'f.read()', 'f.write("content")'], ARRAY['files', 'io', 'reading', 'writing'], true);
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text DEFAULT '',
  bio text DEFAULT '',
  location text DEFAULT '',
  website text DEFAULT '',
  github_username text DEFAULT '',
  linkedin_url text DEFAULT '',
  skill_level text DEFAULT 'beginner',
  public_profile boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'dark',
  editor_theme text DEFAULT 'pythonDark',
  font_size integer DEFAULT 14,
  tab_size integer DEFAULT 4,
  auto_save boolean DEFAULT true,
  line_numbers boolean DEFAULT true,
  word_wrap boolean DEFAULT true,
  minimap boolean DEFAULT false,
  vim_mode boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Create user_notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  project_updates boolean DEFAULT true,
  community_activity boolean DEFAULT true,
  achievement_alerts boolean DEFAULT true,
  weekly_digest boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Create user_privacy table
CREATE TABLE IF NOT EXISTS user_privacy (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_visibility text DEFAULT 'public',
  show_activity boolean DEFAULT true,
  show_projects boolean DEFAULT true,
  show_achievements boolean DEFAULT true,
  allow_collaboration boolean DEFAULT true,
  data_collection boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_privacy ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for user_notifications
CREATE POLICY "Users can view own notifications"
  ON user_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own notifications"
  ON user_notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own notifications"
  ON user_notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for user_privacy
CREATE POLICY "Users can view own privacy settings"
  ON user_privacy FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own privacy settings"
  ON user_privacy FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own privacy settings"
  ON user_privacy FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);