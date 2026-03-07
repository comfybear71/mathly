'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import ProgressBar from '@/components/ui/ProgressBar';
import { LEVEL_TITLES, getXPForLevel } from '@/lib/types';

const recentActivity = [
  { id: 1, text: 'Completed "Welcome to Numbers!"', xp: 10, time: '2 hours ago' },
  { id: 2, text: 'Achieved 3-day streak!', xp: 15, time: '1 day ago' },
  { id: 3, text: 'Completed "Counting Practice"', xp: 10, time: '1 day ago' },
];

const sampleAchievements = [
  { id: 1, name: 'First Steps', icon: '👶', earned: true },
  { id: 2, name: 'Streak Starter', icon: '🔥', earned: true },
  { id: 3, name: 'XP Hunter', icon: '⭐', earned: false },
  { id: 4, name: 'Perfect Score', icon: '🎯', earned: false },
  { id: 5, name: 'Path Pioneer', icon: '🗺️', earned: false },
  { id: 6, name: 'Diamond Status', icon: '💠', earned: false },
];

export default function ProfilePage() {
  const { user, streak, gems } = useStore();
  const level = user?.level || 1;
  const xpForNext = getXPForLevel(level + 1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center text-4xl text-white font-extrabold mb-4">
          {user?.display_name?.[0]?.toUpperCase() || '?'}
        </div>
        <h1 className="text-2xl font-extrabold">{user?.display_name || 'Mathly User'}</h1>
        <p className="text-gray-500">@{user?.username || 'user'}</p>
        <div className="mt-2">
          <span className="badge-xp">Level {level} &middot; {LEVEL_TITLES[level] || 'Mathematician'}</span>
        </div>

        <div className="mt-4">
          <ProgressBar value={user?.total_xp || 0} max={xpForNext} color="bg-secondary" showLabel />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Day Streak', value: streak?.current_streak || 0, icon: '🔥' },
          { label: 'Total XP', value: user?.total_xp || 0, icon: '⭐' },
          { label: 'Gems', value: gems?.balance || 0, icon: '💎' },
          { label: 'Longest Streak', value: streak?.longest_streak || 0, icon: '📈' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card text-center"
          >
            <span className="text-xl">{stat.icon}</span>
            <p className="text-xl font-extrabold mt-1">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-extrabold mb-4">Achievements</h2>
        <div className="grid grid-cols-3 gap-3">
          {sampleAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`card text-center py-4 ${!achievement.earned ? 'opacity-40 grayscale' : ''}`}
            >
              <span className="text-3xl">{achievement.earned ? achievement.icon : '🔒'}</span>
              <p className="text-xs font-bold mt-1">{achievement.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-xl font-extrabold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="card flex items-center gap-3 py-3">
              <div className="flex-1">
                <p className="font-bold text-sm">{activity.text}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span className="badge-xp text-xs">+{activity.xp} XP</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
