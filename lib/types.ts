export type SubscriptionTier = 'free' | 'plus' | 'family_member' | 'family_owner';
export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';
export type League = 'bronze' | 'silver' | 'gold' | 'sapphire' | 'ruby' | 'emerald' | 'amethyst' | 'pearl' | 'obsidian' | 'diamond';
export type LessonType = 'tutorial' | 'practice' | 'challenge' | 'boss_round' | 'story';
export type QuestionType = 'multiple_choice' | 'fill_in_blank' | 'equation_solver' | 'drag_drop' | 'true_false' | 'word_problem' | 'proof_builder' | 'match_pairs';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type ShopItemType = 'streak_freeze' | 'heart_refill' | 'xp_boost' | 'cosmetic' | 'avatar';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type FamilyRole = 'owner' | 'member';

export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  streak_count: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_xp: number;
  level: number;
  subscription_tier: SubscriptionTier;
  subscription_expires_at: string | null;
  ai_agent_unlocked: boolean;
  daily_goal_xp: number;
  notifications_enabled: boolean;
  timezone: string | null;
  onboarding_completed: boolean;
  placement_test_completed: boolean;
}

export interface CurriculumPath {
  id: string;
  name: string;
  description: string;
  order_index: number;
  icon: string;
  color: string;
  is_locked: boolean;
  prerequisite_path_id: string | null;
}

export interface Unit {
  id: string;
  path_id: string;
  name: string;
  description: string;
  order_index: number;
  xp_reward: number;
  icon: string;
}

export interface Lesson {
  id: string;
  unit_id: string;
  name: string;
  description: string;
  order_index: number;
  lesson_type: LessonType;
  xp_reward: number;
  estimated_minutes: number;
  content: Record<string, unknown>;
}

export interface Question {
  id: string;
  lesson_id: string;
  question_type: QuestionType;
  difficulty: Difficulty;
  question_text: string;
  question_latex: string | null;
  options: QuestionOption[] | null;
  correct_answer: unknown;
  explanation: string;
  hint: string | null;
  xp_value: number;
  order_index: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  latex?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  score: number;
  xp_earned: number;
  hearts_used: number;
  time_spent_seconds: number;
  attempts: number;
}

export interface UserPathProgress {
  id: string;
  user_id: string;
  path_id: string;
  started_at: string;
  completed_at: string | null;
  current_unit_id: string;
  percent_complete: number;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  week_start: string;
  xp_earned_this_week: number;
  league: League;
  rank: number;
  promoted: boolean;
  demoted: boolean;
  user?: User;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  condition_type: string;
  condition_value: number;
  rarity: AchievementRarity;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface Hearts {
  user_id: string;
  current_hearts: number;
  max_hearts: number;
  last_refill_at: string;
  unlimited_until: string | null;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  streak_freeze_count: number;
  last_activity_date: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  data: Record<string, unknown> | null;
}

export interface AIConversation {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  messages: AIMessage[];
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: ShopItemType;
  cost_gems: number;
  cost_real_money: number | null;
  image_url: string | null;
}

export interface Gems {
  user_id: string;
  balance: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  min_xp: number;
  max_xp: number;
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Math Newbie',
  2: 'Number Explorer',
  3: 'Arithmetic Apprentice',
  4: 'Equation Enthusiast',
  5: 'Pattern Seeker',
  6: 'Algebra Adventurer',
  7: 'Geometry Guardian',
  8: 'Function Fanatic',
  9: 'Calculus Challenger',
  10: 'Integral Investigator',
  11: 'Matrix Master',
  12: 'Proof Pioneer',
  13: 'Analysis Ace',
  14: 'Topology Titan',
  15: 'Math Wizard',
  16: 'Theorem Theorist',
  17: 'Grand Mathematician',
  18: 'Math Legend',
  19: 'Euler\'s Apprentice',
  20: 'Infinity Master',
};

export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = 100;
  let accumulated = 0;
  while (accumulated + xpNeeded <= totalXP && level < 20) {
    accumulated += xpNeeded;
    level++;
    xpNeeded = Math.floor(100 * Math.pow(1.5, level - 1));
  }
  return level;
}
