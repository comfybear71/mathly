'use client';

import { motion } from 'framer-motion';

const ALL_ACHIEVEMENTS = [
  { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: '👶', xp: 10, rarity: 'common', earned: true, date: '2024-01-15' },
  { id: 2, name: 'Getting Started', description: 'Complete 5 lessons', icon: '🚶', xp: 25, rarity: 'common', earned: true, date: '2024-01-18' },
  { id: 3, name: 'On a Roll', description: 'Complete 25 lessons', icon: '🏃', xp: 50, rarity: 'common', earned: false },
  { id: 4, name: 'Century Club', description: 'Complete 100 lessons', icon: '💯', xp: 100, rarity: 'rare', earned: false },
  { id: 5, name: 'Streak Starter', description: '3-day streak', icon: '🔥', xp: 15, rarity: 'common', earned: true, date: '2024-01-17' },
  { id: 6, name: 'Week Warrior', description: '7-day streak', icon: '⚡', xp: 30, rarity: 'common', earned: false },
  { id: 7, name: 'Monthly Master', description: '30-day streak', icon: '🌟', xp: 100, rarity: 'rare', earned: false },
  { id: 8, name: 'Streak Legend', description: '100-day streak', icon: '👑', xp: 500, rarity: 'epic', earned: false },
  { id: 9, name: 'Year of Math', description: '365-day streak', icon: '🏆', xp: 2000, rarity: 'legendary', earned: false },
  { id: 10, name: 'XP Hunter', description: 'Earn 1,000 XP', icon: '⭐', xp: 25, rarity: 'common', earned: false },
  { id: 11, name: 'Perfect Score', description: '100% on a lesson', icon: '🎯', xp: 20, rarity: 'common', earned: false },
  { id: 12, name: 'Path Pioneer', description: 'Complete your first path', icon: '🗺️', xp: 200, rarity: 'rare', earned: false },
  { id: 13, name: 'Math Olympian', description: 'Complete 10 paths', icon: '🥇', xp: 1000, rarity: 'epic', earned: false },
  { id: 14, name: 'Infinity Achiever', description: 'Complete all 20 paths', icon: '♾️', xp: 5000, rarity: 'legendary', earned: false },
  { id: 15, name: "Euler's Apprentice", description: 'Unlock the AI Math Agent', icon: '🤖', xp: 10000, rarity: 'legendary', earned: false },
];

const rarityColors: Record<string, string> = {
  common: 'border-gray-300',
  rare: 'border-blue-400',
  epic: 'border-purple-500',
  legendary: 'border-yellow-400',
};

const rarityBg: Record<string, string> = {
  common: 'bg-gray-50 dark:bg-gray-800',
  rare: 'bg-blue-50 dark:bg-blue-900/20',
  epic: 'bg-purple-50 dark:bg-purple-900/20',
  legendary: 'bg-yellow-50 dark:bg-yellow-900/20',
};

export default function AchievementsPage() {
  const earned = ALL_ACHIEVEMENTS.filter((a) => a.earned).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold mb-2">Achievements</h1>
        <p className="text-gray-500">{earned} of {ALL_ACHIEVEMENTS.length} earned</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_ACHIEVEMENTS.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`rounded-2xl border-2 p-4 transition-all
              ${achievement.earned
                ? `${rarityColors[achievement.rarity]} ${rarityBg[achievement.rarity]} shadow-md`
                : 'border-gray-200 dark:border-gray-700 opacity-50 grayscale'
              }`}
          >
            <div className="text-center">
              <span className="text-4xl block mb-2">{achievement.earned ? achievement.icon : '🔒'}</span>
              <h3 className="font-bold">{achievement.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="badge-xp text-xs">+{achievement.xp} XP</span>
                <span className={`text-xs font-bold capitalize px-2 py-0.5 rounded-full
                  ${achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                    achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                    achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'}`}>
                  {achievement.rarity}
                </span>
              </div>
              {achievement.earned && achievement.date && (
                <p className="text-xs text-gray-400 mt-2">Earned {achievement.date}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
