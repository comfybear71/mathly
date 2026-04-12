import { sql } from '@/lib/db';
import type {
  User, CurriculumPath, Unit, Lesson, Question,
  UserProgress, UserPathProgress, LeaderboardEntry,
  Achievement, UserAchievement, Hearts, Streak, Gems,
  Notification, AIConversation, ShopItem
} from '../types';

// User functions
export async function getUser(userId: string): Promise<User | null> {
  const { rows } = await sql`SELECT * FROM users WHERE id::text = ${userId}`;
  return rows[0] as User || null;
}

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string | null }) | null> {
  const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
  return rows[0] as (User & { password_hash: string | null }) || null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
  return rows[0] as User || null;
}

export async function createUser(user: { id?: string; email: string; password_hash?: string; username: string; display_name: string; avatar_url?: string | null }): Promise<User> {
  const { rows } = await sql`
    INSERT INTO users (email, password_hash, username, display_name, avatar_url)
    VALUES (${user.email}, ${user.password_hash || null}, ${user.username}, ${user.display_name}, ${user.avatar_url || null})
    RETURNING *
  `;
  return rows[0] as User;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  const allowedFields = ['display_name', 'avatar_url', 'daily_goal_xp', 'notifications_enabled',
    'timezone', 'onboarding_completed', 'placement_test_completed', 'subscription_tier',
    'subscription_expires_at', 'total_xp', 'level', 'streak_count', 'longest_streak',
    'last_activity_date', 'ai_agent_unlocked'];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      setClauses.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) throw new Error('No valid fields to update');

  values.push(userId);
  const queryText = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  const { rows } = await sql.query(queryText, values);
  return rows[0] as User;
}

// Curriculum functions
export async function getAllPaths(): Promise<CurriculumPath[]> {
  const { rows } = await sql`SELECT * FROM curriculum_paths ORDER BY order_index`;
  return rows as CurriculumPath[];
}

export async function getUnitsForPath(pathId: string): Promise<Unit[]> {
  const { rows } = await sql`SELECT * FROM units WHERE path_id::text = ${pathId} ORDER BY order_index`;
  return rows as Unit[];
}

export async function getLessonsForUnit(unitId: string): Promise<Lesson[]> {
  const { rows } = await sql`SELECT * FROM lessons WHERE unit_id::text = ${unitId} ORDER BY order_index`;
  return rows as Lesson[];
}

export async function getLesson(lessonId: string): Promise<Lesson | null> {
  const { rows } = await sql`SELECT * FROM lessons WHERE id::text = ${lessonId}`;
  return rows[0] as Lesson || null;
}

export async function getQuestionsForLesson(lessonId: string): Promise<Question[]> {
  const { rows } = await sql`SELECT * FROM questions WHERE lesson_id::text = ${lessonId} ORDER BY order_index`;
  return rows as Question[];
}

// Progress functions
export async function getUserProgress(userId: string, lessonId: string): Promise<UserProgress | null> {
  const { rows } = await sql`SELECT * FROM user_progress WHERE user_id::text = ${userId} AND lesson_id::text = ${lessonId}`;
  return rows[0] as UserProgress || null;
}

export async function getAllUserProgress(userId: string): Promise<UserProgress[]> {
  const { rows } = await sql`SELECT * FROM user_progress WHERE user_id::text = ${userId}`;
  return rows as UserProgress[];
}

export async function saveUserProgress(progress: Omit<UserProgress, 'id'>): Promise<UserProgress> {
  const { rows } = await sql`
    INSERT INTO user_progress (user_id, lesson_id, completed, completed_at, score, xp_earned, hearts_used, time_spent_seconds, attempts)
    VALUES (${progress.user_id}, ${progress.lesson_id}, ${progress.completed}, ${progress.completed_at}, ${progress.score}, ${progress.xp_earned}, ${progress.hearts_used}, ${progress.time_spent_seconds}, ${progress.attempts || 1})
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET
      completed = EXCLUDED.completed,
      completed_at = EXCLUDED.completed_at,
      score = EXCLUDED.score,
      xp_earned = EXCLUDED.xp_earned,
      hearts_used = EXCLUDED.hearts_used,
      time_spent_seconds = EXCLUDED.time_spent_seconds,
      attempts = EXCLUDED.attempts
    RETURNING *
  `;
  return rows[0] as UserProgress;
}

export async function getUserPathProgress(userId: string): Promise<UserPathProgress[]> {
  const { rows } = await sql`SELECT * FROM user_path_progress WHERE user_id::text = ${userId}`;
  return rows as UserPathProgress[];
}

export async function updatePathProgress(userId: string, pathId: string, updates: Partial<UserPathProgress>): Promise<UserPathProgress> {
  const { rows } = await sql`
    INSERT INTO user_path_progress (user_id, path_id, current_unit_id, percent_complete)
    VALUES (${userId}, ${pathId}, ${updates.current_unit_id || null}, ${updates.percent_complete || 0})
    ON CONFLICT (user_id, path_id) DO UPDATE SET
      current_unit_id = COALESCE(EXCLUDED.current_unit_id, user_path_progress.current_unit_id),
      percent_complete = COALESCE(EXCLUDED.percent_complete, user_path_progress.percent_complete),
      completed_at = EXCLUDED.completed_at
    RETURNING *
  `;
  return rows[0] as UserPathProgress;
}

// Hearts functions
export async function getHearts(userId: string): Promise<Hearts | null> {
  const { rows } = await sql`SELECT * FROM hearts WHERE user_id::text = ${userId}`;
  return rows[0] as Hearts || null;
}

export async function updateHearts(userId: string, updates: Partial<Hearts>): Promise<Hearts> {
  const { rows } = await sql`
    INSERT INTO hearts (user_id, current_hearts, max_hearts, unlimited_until)
    VALUES (${userId}, ${updates.current_hearts ?? 5}, ${updates.max_hearts ?? 5}, ${updates.unlimited_until || null})
    ON CONFLICT (user_id) DO UPDATE SET
      current_hearts = COALESCE(${updates.current_hearts ?? null}, hearts.current_hearts),
      max_hearts = COALESCE(${updates.max_hearts ?? null}, hearts.max_hearts),
      unlimited_until = COALESCE(${updates.unlimited_until ?? null}, hearts.unlimited_until),
      last_refill_at = NOW()
    RETURNING *
  `;
  return rows[0] as Hearts;
}

// Streak functions
export async function getStreak(userId: string): Promise<Streak | null> {
  const { rows } = await sql`SELECT * FROM streaks WHERE user_id::text = ${userId}`;
  return rows[0] as Streak || null;
}

export async function updateStreak(userId: string, updates: Partial<Streak>): Promise<Streak> {
  const { rows } = await sql`
    INSERT INTO streaks (user_id, current_streak, longest_streak, streak_freeze_count, last_activity_date)
    VALUES (${userId}, ${updates.current_streak ?? 0}, ${updates.longest_streak ?? 0}, ${updates.streak_freeze_count ?? 0}, ${updates.last_activity_date || null})
    ON CONFLICT (user_id) DO UPDATE SET
      current_streak = COALESCE(${updates.current_streak ?? null}, streaks.current_streak),
      longest_streak = COALESCE(${updates.longest_streak ?? null}, streaks.longest_streak),
      streak_freeze_count = COALESCE(${updates.streak_freeze_count ?? null}, streaks.streak_freeze_count),
      last_activity_date = COALESCE(${updates.last_activity_date ?? null}, streaks.last_activity_date)
    RETURNING *
  `;
  return rows[0] as Streak;
}

// Gems functions
export async function getGems(userId: string): Promise<Gems | null> {
  const { rows } = await sql`SELECT * FROM gems WHERE user_id::text = ${userId}`;
  return rows[0] as Gems || null;
}

export async function updateGems(userId: string, balance: number): Promise<Gems> {
  const { rows } = await sql`
    INSERT INTO gems (user_id, balance) VALUES (${userId}, ${balance})
    ON CONFLICT (user_id) DO UPDATE SET balance = ${balance}
    RETURNING *
  `;
  return rows[0] as Gems;
}

// Leaderboard functions
export async function getLeaderboard(league: string, weekStart: string): Promise<LeaderboardEntry[]> {
  const { rows } = await sql`
    SELECT le.*,
      json_build_object('id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url, 'total_xp', u.total_xp) as user
    FROM leaderboard_entries le
    JOIN users u ON u.id = le.user_id
    WHERE le.league = ${league} AND le.week_start = ${weekStart}
    ORDER BY le.xp_earned_this_week DESC
    LIMIT 50
  `;
  return rows as LeaderboardEntry[];
}

// Achievement functions
export async function getAllAchievements(): Promise<Achievement[]> {
  const { rows } = await sql`SELECT * FROM achievements`;
  return rows as Achievement[];
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { rows } = await sql`
    SELECT ua.*, row_to_json(a) as achievement
    FROM user_achievements ua
    JOIN achievements a ON a.id = ua.achievement_id
    WHERE ua.user_id::text = ${userId}
  `;
  return rows as UserAchievement[];
}

export async function grantAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
  const { rows } = await sql`
    INSERT INTO user_achievements (user_id, achievement_id) VALUES (${userId}, ${achievementId})
    RETURNING *
  `;
  return rows[0] as UserAchievement;
}

// Notification functions
export async function getNotifications(userId: string): Promise<Notification[]> {
  const { rows } = await sql`
    SELECT * FROM notifications WHERE user_id::text = ${userId}
    ORDER BY created_at DESC LIMIT 50
  `;
  return rows as Notification[];
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await sql`UPDATE notifications SET read = true WHERE id::text = ${notificationId}`;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await sql`UPDATE notifications SET read = true WHERE user_id::text = ${userId} AND read = false`;
}

// AI Conversation functions
export async function getConversations(userId: string): Promise<AIConversation[]> {
  const { rows } = await sql`
    SELECT * FROM ai_conversations WHERE user_id::text = ${userId}
    ORDER BY created_at DESC
  `;
  return rows as AIConversation[];
}

export async function getConversation(conversationId: string): Promise<AIConversation | null> {
  const { rows } = await sql`SELECT * FROM ai_conversations WHERE id::text = ${conversationId}`;
  return rows[0] as AIConversation || null;
}

export async function saveConversation(conversation: Omit<AIConversation, 'id'>): Promise<AIConversation> {
  const { rows } = await sql`
    INSERT INTO ai_conversations (user_id, title, messages)
    VALUES (${conversation.user_id}, ${conversation.title}, ${JSON.stringify(conversation.messages)})
    RETURNING *
  `;
  return rows[0] as AIConversation;
}

export async function updateConversation(conversationId: string, updates: Partial<AIConversation>): Promise<AIConversation> {
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    setClauses.push(`title = $${paramIndex}`);
    values.push(updates.title);
    paramIndex++;
  }
  if (updates.messages !== undefined) {
    setClauses.push(`messages = $${paramIndex}`);
    values.push(JSON.stringify(updates.messages));
    paramIndex++;
  }

  if (setClauses.length === 0) throw new Error('No valid fields to update');

  values.push(conversationId);
  const queryText = `UPDATE ai_conversations SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  const { rows } = await sql.query(queryText, values);
  return rows[0] as AIConversation;
}

// Shop functions
export async function getShopItems(): Promise<ShopItem[]> {
  const { rows } = await sql`SELECT * FROM shop_items`;
  return rows as ShopItem[];
}

// Friends functions
export async function getFriends(userId: string) {
  const { rows } = await sql`
    SELECT f.*,
      json_build_object('id', req.id, 'username', req.username, 'display_name', req.display_name, 'avatar_url', req.avatar_url, 'total_xp', req.total_xp, 'streak_count', req.streak_count) as requester,
      json_build_object('id', addr.id, 'username', addr.username, 'display_name', addr.display_name, 'avatar_url', addr.avatar_url, 'total_xp', addr.total_xp, 'streak_count', addr.streak_count) as addressee
    FROM friendships f
    JOIN users req ON req.id = f.requester_id
    JOIN users addr ON addr.id = f.addressee_id
    WHERE (f.requester_id::text = ${userId} OR f.addressee_id::text = ${userId}) AND f.status = 'accepted'
  `;
  return rows;
}

export async function getPendingFriendRequests(userId: string) {
  const { rows } = await sql`
    SELECT f.*,
      json_build_object('id', req.id, 'username', req.username, 'display_name', req.display_name, 'avatar_url', req.avatar_url) as requester
    FROM friendships f
    JOIN users req ON req.id = f.requester_id
    WHERE f.addressee_id::text = ${userId} AND f.status = 'pending'
  `;
  return rows;
}

export async function sendFriendRequest(requesterId: string, addresseeId: string) {
  const { rows } = await sql`
    INSERT INTO friendships (requester_id, addressee_id, status)
    VALUES (${requesterId}, ${addresseeId}, 'pending')
    RETURNING *
  `;
  return rows[0];
}

export async function respondToFriendRequest(friendshipId: string, status: 'accepted' | 'blocked') {
  const { rows } = await sql`
    UPDATE friendships SET status = ${status} WHERE id::text = ${friendshipId} RETURNING *
  `;
  return rows[0];
}

// Initialize user records (hearts, streaks, gems)
export async function initializeUserRecords(userId: string): Promise<void> {
  await Promise.all([
    sql`INSERT INTO hearts (user_id) VALUES (${userId}) ON CONFLICT (user_id) DO NOTHING`,
    sql`INSERT INTO streaks (user_id) VALUES (${userId}) ON CONFLICT (user_id) DO NOTHING`,
    sql`INSERT INTO gems (user_id, balance) VALUES (${userId}, 100) ON CONFLICT (user_id) DO NOTHING`,
  ]);
}

// Increment user XP
export async function incrementUserXP(userId: string, xpAmount: number): Promise<void> {
  await sql`UPDATE users SET total_xp = total_xp + ${xpAmount} WHERE id::text = ${userId}`;
}

// Referral functions
export async function getUserReferralCode(userId: string): Promise<string> {
  const { rows } = await sql`SELECT referral_code FROM users WHERE id::text = ${userId}`;
  if (rows[0]?.referral_code) return rows[0].referral_code;

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  await sql`UPDATE users SET referral_code = ${code} WHERE id::text = ${userId}`;
  return code;
}

export async function getUserByReferralCode(code: string): Promise<User | null> {
  const { rows } = await sql`SELECT * FROM users WHERE referral_code = ${code}`;
  return rows[0] as User || null;
}

export async function createReferral(referrerId: string, referredId: string) {
  const { rows } = await sql`
    INSERT INTO referrals (referrer_id, referred_id, status)
    VALUES (${referrerId}, ${referredId}, 'pending')
    ON CONFLICT (referred_id) DO NOTHING
    RETURNING *
  `;
  return rows[0] || null;
}

export async function getReferralStats(userId: string) {
  const { rows: total } = await sql`SELECT COUNT(*) as count FROM referrals WHERE referrer_id::text = ${userId}`;
  const { rows: completed } = await sql`SELECT COUNT(*) as count FROM referrals WHERE referrer_id::text = ${userId} AND status = 'completed'`;
  const { rows: referrals } = await sql`
    SELECT r.*, json_build_object('id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url) as referred_user
    FROM referrals r
    JOIN users u ON u.id = r.referred_id
    WHERE r.referrer_id::text = ${userId}
    ORDER BY r.created_at DESC
    LIMIT 20
  `;
  return {
    total_referrals: parseInt(total[0].count),
    completed_referrals: parseInt(completed[0].count),
    gems_earned: parseInt(completed[0].count) * 100,
    referrals,
  };
}

export async function completeReferral(referredId: string) {
  const { rows } = await sql`
    UPDATE referrals SET status = 'completed' WHERE referred_id::text = ${referredId} AND status = 'pending' RETURNING *
  `;
  if (rows[0] && !rows[0].gems_rewarded) {
    await sql`UPDATE gems SET balance = balance + 100 WHERE user_id::text = ${rows[0].referrer_id}`;
    await sql`UPDATE gems SET balance = balance + 50 WHERE user_id::text = ${referredId}`;
    await sql`UPDATE referrals SET gems_rewarded = true WHERE id::text = ${rows[0].id}`;
  }
  return rows[0] || null;
}
