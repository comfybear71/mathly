'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import ProgressBar from '@/components/ui/ProgressBar';
import EulerMascot from '@/components/mascot/EulerMascot';
import Button from '@/components/ui/Button';
import { LEVEL_TITLES, getXPForLevel } from '@/lib/types';

const dailyChallenges = [
  { id: 1, title: 'Speed Round', description: 'Answer 10 questions in 2 minutes', xp: 50, icon: '⚡' },
  { id: 2, title: 'Perfect Practice', description: 'Complete a lesson with no mistakes', xp: 30, icon: '🎯' },
  { id: 3, title: 'Explorer', description: 'Try a lesson in a new unit', xp: 25, icon: '🗺️' },
];

export default function HomePage() {
  const { user, streak, gems } = useStore();
  const currentXP = user?.total_xp || 0;
  const level = user?.level || 1;
  const dailyGoal = user?.daily_goal_xp || 50;
  const todayXP = 0; // Would come from today's progress
  const xpForNextLevel = getXPForLevel(level + 1);
  const streakCount = streak?.current_streak || user?.streak_count || 0;

  const getMascotState = () => {
    if (streakCount >= 7) return 'celebrating';
    if (streakCount >= 3) return 'excited';
    if (todayXP >= dailyGoal) return 'happy';
    return 'happy';
  };

  const getMascotMessage = () => {
    if (todayXP >= dailyGoal) return "You've hit your daily goal! Amazing!";
    if (streakCount > 0) return `${streakCount}-day streak! Keep it up!`;
    return "Ready to learn? Let's go!";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-extrabold mb-1">
            Welcome back{user?.display_name ? `, ${user.display_name}` : ''}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Level {level} &middot; {LEVEL_TITLES[level] || 'Mathematician'}
          </p>
        </div>
        <EulerMascot state={getMascotState()} size="sm" message={getMascotMessage()} />
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <span className="text-2xl">🔥</span>
          <p className="text-2xl font-extrabold text-primary mt-1">{streakCount}</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card text-center"
        >
          <span className="text-2xl">⭐</span>
          <p className="text-2xl font-extrabold text-accent-500 mt-1">{currentXP}</p>
          <p className="text-xs text-gray-500">Total XP</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <span className="text-2xl">💎</span>
          <p className="text-2xl font-extrabold text-secondary mt-1">{gems?.balance || 0}</p>
          <p className="text-xs text-gray-500">Gems</p>
        </motion.div>
      </div>

      {/* Daily Goal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Daily Goal</h3>
          <span className="text-sm text-gray-500">{todayXP} / {dailyGoal} XP</span>
        </div>
        <ProgressBar value={todayXP} max={dailyGoal} color="bg-accent" animated />
      </motion.div>

      {/* Continue Learning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-gradient-to-r from-primary to-primary-300 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Continue Learning</h3>
            <p className="text-white/80 text-sm mt-1">Foundations &middot; Counting & Numbers</p>
          </div>
          <Link href="/learn">
            <Button variant="secondary" size="sm">Continue</Button>
          </Link>
        </div>
      </motion.div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Level {level} Progress</h3>
          <span className="text-sm text-gray-500">{currentXP} / {xpForNextLevel} XP</span>
        </div>
        <ProgressBar value={currentXP} max={xpForNextLevel} color="bg-secondary" animated showLabel />
      </motion.div>

      {/* Daily Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-extrabold mb-4">Daily Challenges</h2>
        <div className="space-y-3">
          {dailyChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="card-hover flex items-center gap-4"
            >
              <span className="text-3xl">{challenge.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold">{challenge.title}</h4>
                <p className="text-sm text-gray-500">{challenge.description}</p>
              </div>
              <span className="badge-xp">+{challenge.xp} XP</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
