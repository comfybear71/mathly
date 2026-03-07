'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const LEAGUES = [
  { name: 'Bronze', icon: '🥉', color: '#CD7F32' },
  { name: 'Silver', icon: '🥈', color: '#C0C0C0' },
  { name: 'Gold', icon: '🥇', color: '#FFD700' },
  { name: 'Sapphire', icon: '💎', color: '#0F52BA' },
  { name: 'Ruby', icon: '🔴', color: '#E0115F' },
  { name: 'Emerald', icon: '💚', color: '#50C878' },
  { name: 'Amethyst', icon: '🟣', color: '#9966CC' },
  { name: 'Pearl', icon: '⚪', color: '#FDEEF4' },
  { name: 'Obsidian', icon: '⚫', color: '#3D3635' },
  { name: 'Diamond', icon: '💠', color: '#B9F2FF' },
];

const demoLeaderboard = [
  { rank: 1, name: 'MathWizard42', xp: 2450, avatar: '🧙' },
  { rank: 2, name: 'CalculusKing', xp: 2180, avatar: '👑' },
  { rank: 3, name: 'AlgebraQueen', xp: 1920, avatar: '👸' },
  { rank: 4, name: 'NumberNinja', xp: 1740, avatar: '🥷' },
  { rank: 5, name: 'PiLover314', xp: 1650, avatar: '🥧' },
  { rank: 6, name: 'You', xp: 1200, avatar: '😊', isUser: true },
  { rank: 7, name: 'MathNewbie', xp: 980, avatar: '🌱' },
  { rank: 8, name: 'GraphGuru', xp: 870, avatar: '📊' },
  { rank: 9, name: 'FractionFan', xp: 750, avatar: '🍕' },
  { rank: 10, name: 'CountingPro', xp: 620, avatar: '🔢' },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'weekly' | 'alltime' | 'friends'>('weekly');
  const currentLeague = LEAGUES[0]; // Bronze by default

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* League Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <span className="text-5xl">{currentLeague.icon}</span>
        <h1 className="text-2xl font-extrabold mt-2">{currentLeague.name} League</h1>
        <p className="text-sm text-gray-500 mt-1">Top 10 promote to {LEAGUES[1]?.name || 'next'} league</p>

        <div className="flex justify-center gap-2 mt-4">
          {LEAGUES.map((league, i) => (
            <div
              key={league.name}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                ${i === 0 ? 'ring-2 ring-primary' : 'opacity-30'}`}
              style={{ backgroundColor: league.color + '30' }}
              title={league.name}
            >
              {league.icon}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[
          { key: 'weekly', label: 'This Week' },
          { key: 'alltime', label: 'All Time' },
          { key: 'friends', label: 'Friends' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
              ${tab === key ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {demoLeaderboard.map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all
              ${entry.isUser
                ? 'bg-primary/10 border-2 border-primary'
                : entry.rank <= 3
                  ? 'bg-accent/5 border border-accent/20'
                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
              }`}
          >
            <span className="w-8 text-center font-extrabold text-lg">
              {getRankBadge(entry.rank)}
            </span>
            <span className="text-2xl">{entry.avatar}</span>
            <div className="flex-1">
              <p className={`font-bold ${entry.isUser ? 'text-primary' : ''}`}>{entry.name}</p>
            </div>
            <span className="badge-xp">{entry.xp.toLocaleString()} XP</span>
          </motion.div>
        ))}
      </div>

      {/* Promotion Zone Info */}
      <div className="card bg-success/5 border-2 border-success/20 text-center">
        <p className="text-sm font-bold text-success">🎉 Top 5 get promoted!</p>
        <p className="text-xs text-gray-500 mt-1">Bottom 5 get demoted. Keep earning XP!</p>
      </div>
    </div>
  );
}
