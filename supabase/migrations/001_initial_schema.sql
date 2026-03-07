-- Mathly Database Schema

-- Custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'plus', 'family_member', 'family_owner');
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');
CREATE TYPE league_type AS ENUM ('bronze', 'silver', 'gold', 'sapphire', 'ruby', 'emerald', 'amethyst', 'pearl', 'obsidian', 'diamond');
CREATE TYPE lesson_type AS ENUM ('tutorial', 'practice', 'challenge', 'boss_round', 'story');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'fill_in_blank', 'equation_solver', 'drag_drop', 'true_false', 'word_problem', 'proof_builder', 'match_pairs');
CREATE TYPE difficulty_type AS ENUM ('easy', 'medium', 'hard', 'expert');
CREATE TYPE shop_item_type AS ENUM ('streak_freeze', 'heart_refill', 'xp_boost', 'cosmetic', 'avatar');
CREATE TYPE achievement_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE family_role AS ENUM ('owner', 'member');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  ai_agent_unlocked BOOLEAN DEFAULT FALSE,
  daily_goal_xp INTEGER DEFAULT 50,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  timezone TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  placement_test_completed BOOLEAN DEFAULT FALSE
);

-- Curriculum paths
CREATE TABLE curriculum_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  is_locked BOOLEAN DEFAULT TRUE,
  prerequisite_path_id UUID REFERENCES curriculum_paths(id)
);

-- Units
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES curriculum_paths(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  icon TEXT NOT NULL
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  lesson_type lesson_type DEFAULT 'practice',
  xp_reward INTEGER DEFAULT 10,
  estimated_minutes INTEGER DEFAULT 5,
  content JSONB DEFAULT '{}'
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_type question_type NOT NULL,
  difficulty difficulty_type DEFAULT 'easy',
  question_text TEXT NOT NULL,
  question_latex TEXT,
  options JSONB,
  correct_answer JSONB NOT NULL,
  explanation TEXT NOT NULL,
  hint TEXT,
  xp_value INTEGER DEFAULT 5,
  order_index INTEGER NOT NULL
);

-- User progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  hearts_used INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 1,
  UNIQUE(user_id, lesson_id)
);

-- User path progress
CREATE TABLE user_path_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path_id UUID NOT NULL REFERENCES curriculum_paths(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  current_unit_id UUID REFERENCES units(id),
  percent_complete FLOAT DEFAULT 0,
  UNIQUE(user_id, path_id)
);

-- Friendships
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status friendship_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard entries
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  xp_earned_this_week INTEGER DEFAULT 0,
  league league_type DEFAULT 'bronze',
  rank INTEGER DEFAULT 0,
  promoted BOOLEAN DEFAULT FALSE,
  demoted BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, week_start)
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  condition_type TEXT NOT NULL,
  condition_value INTEGER DEFAULT 0,
  rarity achievement_rarity DEFAULT 'common'
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Hearts
CREATE TABLE hearts (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_hearts INTEGER DEFAULT 5,
  max_hearts INTEGER DEFAULT 5,
  last_refill_at TIMESTAMPTZ DEFAULT NOW(),
  unlimited_until TIMESTAMPTZ
);

-- Streaks
CREATE TABLE streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  streak_freeze_count INTEGER DEFAULT 0,
  last_activity_date DATE
);

-- Family subscriptions
CREATE TABLE family_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  max_members INTEGER DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Family members
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_subscription_id UUID NOT NULL REFERENCES family_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  role family_role DEFAULT 'member'
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  data JSONB
);

-- AI conversations
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'
);

-- Shop items
CREATE TABLE shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type shop_item_type NOT NULL,
  cost_gems INTEGER NOT NULL,
  cost_real_money DECIMAL,
  image_url TEXT
);

-- User inventory
CREATE TABLE user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gems
CREATE TABLE gems (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_leaderboard_week ON leaderboard_entries(week_start, league);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_lessons_unit ON lessons(unit_id);
CREATE INDEX idx_questions_lesson ON questions(lesson_id);
CREATE INDEX idx_units_path ON units(path_id);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_path_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearts ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gems ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read any profile but only update their own
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Curriculum is public read
CREATE POLICY "Anyone can view paths" ON curriculum_paths FOR SELECT USING (true);
CREATE POLICY "Anyone can view units" ON units FOR SELECT USING (true);
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view shop items" ON shop_items FOR SELECT USING (true);

-- User-specific data
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own path progress" ON user_path_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own path progress" ON user_path_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own hearts" ON hearts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own hearts" ON hearts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own streak" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own streak" ON streaks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own gems" ON gems FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own gems" ON gems FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own conversations" ON ai_conversations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own inventory" ON user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own inventory" ON user_inventory FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can create friendships" ON friendships FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update friendships" ON friendships FOR UPDATE USING (auth.uid() = addressee_id);

CREATE POLICY "Anyone can view leaderboard" ON leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Users can manage own leaderboard" ON leaderboard_entries FOR ALL USING (auth.uid() = user_id);
