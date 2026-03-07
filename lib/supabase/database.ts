import { createClient } from './client';
import type {
  User, CurriculumPath, Unit, Lesson, Question,
  UserProgress, UserPathProgress, LeaderboardEntry,
  Achievement, UserAchievement, Hearts, Streak, Gems,
  Notification, AIConversation, ShopItem
} from '../types';

const supabase = () => createClient();

// User functions
export async function getUser(userId: string): Promise<User | null> {
  const { data } = await supabase().from('users').select('*').eq('id', userId).single();
  return data;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase().from('users').update(updates).eq('id', userId).select().single();
  if (error) throw error;
  return data;
}

// Curriculum functions
export async function getAllPaths(): Promise<CurriculumPath[]> {
  const { data } = await supabase().from('curriculum_paths').select('*').order('order_index');
  return data || [];
}

export async function getUnitsForPath(pathId: string): Promise<Unit[]> {
  const { data } = await supabase().from('units').select('*').eq('path_id', pathId).order('order_index');
  return data || [];
}

export async function getLessonsForUnit(unitId: string): Promise<Lesson[]> {
  const { data } = await supabase().from('lessons').select('*').eq('unit_id', unitId).order('order_index');
  return data || [];
}

export async function getLesson(lessonId: string): Promise<Lesson | null> {
  const { data } = await supabase().from('lessons').select('*').eq('id', lessonId).single();
  return data;
}

export async function getQuestionsForLesson(lessonId: string): Promise<Question[]> {
  const { data } = await supabase().from('questions').select('*').eq('lesson_id', lessonId).order('order_index');
  return data || [];
}

// Progress functions
export async function getUserProgress(userId: string, lessonId: string): Promise<UserProgress | null> {
  const { data } = await supabase().from('user_progress').select('*').eq('user_id', userId).eq('lesson_id', lessonId).single();
  return data;
}

export async function getAllUserProgress(userId: string): Promise<UserProgress[]> {
  const { data } = await supabase().from('user_progress').select('*').eq('user_id', userId);
  return data || [];
}

export async function saveUserProgress(progress: Omit<UserProgress, 'id'>) {
  const { data, error } = await supabase().from('user_progress').upsert(progress, { onConflict: 'user_id,lesson_id' }).select().single();
  if (error) throw error;
  return data;
}

export async function getUserPathProgress(userId: string): Promise<UserPathProgress[]> {
  const { data } = await supabase().from('user_path_progress').select('*').eq('user_id', userId);
  return data || [];
}

export async function updatePathProgress(userId: string, pathId: string, updates: Partial<UserPathProgress>) {
  const { data, error } = await supabase().from('user_path_progress').upsert({ user_id: userId, path_id: pathId, ...updates }, { onConflict: 'user_id,path_id' }).select().single();
  if (error) throw error;
  return data;
}

// Hearts functions
export async function getHearts(userId: string): Promise<Hearts | null> {
  const { data } = await supabase().from('hearts').select('*').eq('user_id', userId).single();
  return data;
}

export async function updateHearts(userId: string, updates: Partial<Hearts>) {
  const { data, error } = await supabase().from('hearts').upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' }).select().single();
  if (error) throw error;
  return data;
}

// Streak functions
export async function getStreak(userId: string): Promise<Streak | null> {
  const { data } = await supabase().from('streaks').select('*').eq('user_id', userId).single();
  return data;
}

export async function updateStreak(userId: string, updates: Partial<Streak>) {
  const { data, error } = await supabase().from('streaks').upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' }).select().single();
  if (error) throw error;
  return data;
}

// Gems functions
export async function getGems(userId: string): Promise<Gems | null> {
  const { data } = await supabase().from('gems').select('*').eq('user_id', userId).single();
  return data;
}

export async function updateGems(userId: string, balance: number) {
  const { data, error } = await supabase().from('gems').upsert({ user_id: userId, balance }, { onConflict: 'user_id' }).select().single();
  if (error) throw error;
  return data;
}

// Leaderboard functions
export async function getLeaderboard(league: string, weekStart: string): Promise<LeaderboardEntry[]> {
  const { data } = await supabase()
    .from('leaderboard_entries')
    .select('*, user:users(id, username, display_name, avatar_url, total_xp)')
    .eq('league', league)
    .eq('week_start', weekStart)
    .order('xp_earned_this_week', { ascending: false })
    .limit(50);
  return data || [];
}

// Achievement functions
export async function getAllAchievements(): Promise<Achievement[]> {
  const { data } = await supabase().from('achievements').select('*');
  return data || [];
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data } = await supabase().from('user_achievements').select('*, achievement:achievements(*)').eq('user_id', userId);
  return data || [];
}

export async function grantAchievement(userId: string, achievementId: string) {
  const { data, error } = await supabase().from('user_achievements').insert({ user_id: userId, achievement_id: achievementId, earned_at: new Date().toISOString() }).select().single();
  if (error) throw error;
  return data;
}

// Notification functions
export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data } = await supabase().from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50);
  return data || [];
}

export async function markNotificationRead(notificationId: string) {
  await supabase().from('notifications').update({ read: true }).eq('id', notificationId);
}

export async function markAllNotificationsRead(userId: string) {
  await supabase().from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
}

// AI Conversation functions
export async function getConversations(userId: string): Promise<AIConversation[]> {
  const { data } = await supabase().from('ai_conversations').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return data || [];
}

export async function getConversation(conversationId: string): Promise<AIConversation | null> {
  const { data } = await supabase().from('ai_conversations').select('*').eq('id', conversationId).single();
  return data;
}

export async function saveConversation(conversation: Omit<AIConversation, 'id'>) {
  const { data, error } = await supabase().from('ai_conversations').insert(conversation).select().single();
  if (error) throw error;
  return data;
}

export async function updateConversation(conversationId: string, updates: Partial<AIConversation>) {
  const { data, error } = await supabase().from('ai_conversations').update(updates).eq('id', conversationId).select().single();
  if (error) throw error;
  return data;
}

// Shop functions
export async function getShopItems(): Promise<ShopItem[]> {
  const { data } = await supabase().from('shop_items').select('*');
  return data || [];
}

// Friends functions
export async function getFriends(userId: string) {
  const { data } = await supabase()
    .from('friendships')
    .select('*, requester:users!requester_id(*), addressee:users!addressee_id(*)')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .eq('status', 'accepted');
  return data || [];
}

export async function getPendingFriendRequests(userId: string) {
  const { data } = await supabase()
    .from('friendships')
    .select('*, requester:users!requester_id(*)')
    .eq('addressee_id', userId)
    .eq('status', 'pending');
  return data || [];
}

export async function sendFriendRequest(requesterId: string, addresseeId: string) {
  const { data, error } = await supabase()
    .from('friendships')
    .insert({ requester_id: requesterId, addressee_id: addresseeId, status: 'pending' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function respondToFriendRequest(friendshipId: string, status: 'accepted' | 'blocked') {
  const { data, error } = await supabase()
    .from('friendships')
    .update({ status })
    .eq('id', friendshipId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
