-- Mathly Database Schema for Neon (Vercel Postgres)
-- Run this in your Neon SQL editor to set up the database

-- Users table (no Supabase auth dependency)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  ai_agent_unlocked BOOLEAN DEFAULT FALSE,
  daily_goal_xp INTEGER DEFAULT 50,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  timezone TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  placement_test_completed BOOLEAN DEFAULT FALSE
);

-- Curriculum paths
CREATE TABLE IF NOT EXISTS curriculum_paths (
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
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES curriculum_paths(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  icon TEXT NOT NULL
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  lesson_type TEXT DEFAULT 'practice',
  xp_reward INTEGER DEFAULT 10,
  estimated_minutes INTEGER DEFAULT 5,
  content JSONB DEFAULT '{}'
);

-- Questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL,
  difficulty TEXT DEFAULT 'easy',
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
CREATE TABLE IF NOT EXISTS user_progress (
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
CREATE TABLE IF NOT EXISTS user_path_progress (
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
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard entries
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  xp_earned_this_week INTEGER DEFAULT 0,
  league TEXT DEFAULT 'bronze',
  rank INTEGER DEFAULT 0,
  promoted BOOLEAN DEFAULT FALSE,
  demoted BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, week_start)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  condition_type TEXT NOT NULL,
  condition_value INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common'
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Hearts
CREATE TABLE IF NOT EXISTS hearts (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_hearts INTEGER DEFAULT 5,
  max_hearts INTEGER DEFAULT 5,
  last_refill_at TIMESTAMPTZ DEFAULT NOW(),
  unlimited_until TIMESTAMPTZ
);

-- Streaks
CREATE TABLE IF NOT EXISTS streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  streak_freeze_count INTEGER DEFAULT 0,
  last_activity_date DATE
);

-- Family subscriptions
CREATE TABLE IF NOT EXISTS family_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  max_members INTEGER DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Family members
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_subscription_id UUID NOT NULL REFERENCES family_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  role TEXT DEFAULT 'member'
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
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
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'
);

-- Shop items
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  cost_gems INTEGER NOT NULL,
  cost_real_money DECIMAL,
  image_url TEXT
);

-- User inventory
CREATE TABLE IF NOT EXISTS user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gems
CREATE TABLE IF NOT EXISTS gems (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, completed (referred user finished placement test)
  gems_rewarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referred_id)
);

-- Add referral_code to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Add history/origin fields to lessons (additive, safe migration)
-- Supports the "Story" tab alongside "Practice" in each lesson (Grok content template)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS history_intro JSONB DEFAULT NULL;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS origin_year INTEGER DEFAULT NULL;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS origin_figure TEXT DEFAULT NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_week ON leaderboard_entries(week_start, league);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_lessons_unit ON lessons(unit_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_units_path ON units(path_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
