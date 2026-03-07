'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Button from '@/components/ui/Button';
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

interface ReferralData {
  referralCode: string;
  total_referrals: number;
  completed_referrals: number;
  gems_earned: number;
  referrals: Array<{
    id: string;
    status: string;
    created_at: string;
    referred_user: { display_name: string; username: string };
  }>;
}

export default function ProfilePage() {
  const { user, streak, gems } = useStore();
  const level = user?.level || 1;
  const xpForNext = getXPForLevel(level + 1);

  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [referralInput, setReferralInput] = useState('');
  const [referralMessage, setReferralMessage] = useState('');

  useEffect(() => {
    fetch('/api/referrals')
      .then((r) => r.json())
      .then((data) => { if (data.referralCode) setReferralData(data); })
      .catch(console.error);
  }, []);

  const copyReferralLink = useCallback(() => {
    if (!referralData) return;
    const link = `${window.location.origin}/signup?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [referralData]);

  const applyReferralCode = useCallback(async () => {
    if (!referralInput.trim()) return;
    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: referralInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setReferralMessage('Referral applied! You\'ll earn 50 gems when you complete the placement test.');
        setReferralInput('');
      } else {
        setReferralMessage(data.error || 'Failed to apply code');
      }
    } catch {
      setReferralMessage('Something went wrong');
    }
    setTimeout(() => setReferralMessage(''), 3000);
  }, [referralInput]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center text-4xl text-white font-extrabold mb-4">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            user?.display_name?.[0]?.toUpperCase() || '?'
          )}
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

      {/* Referral Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className="text-xl font-extrabold mb-4">Refer Friends</h2>
        <div className="card space-y-4">
          <p className="text-sm text-gray-500">
            Share your referral link and earn <span className="font-bold text-secondary">100 gems</span> for each friend who joins!
            Your friend gets <span className="font-bold text-secondary">50 gems</span> too.
          </p>

          {referralData && (
            <>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 font-mono text-sm truncate">
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${referralData.referralCode}`}
                </div>
                <Button variant="secondary" size="sm" onClick={copyReferralLink}>
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-extrabold">{referralData.total_referrals}</p>
                  <p className="text-xs text-gray-500">Invited</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-success">{referralData.completed_referrals}</p>
                  <p className="text-xs text-gray-500">Joined</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-secondary">{referralData.gems_earned}</p>
                  <p className="text-xs text-gray-500">Gems Earned</p>
                </div>
              </div>

              {referralData.referrals.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-500">Your Referrals</p>
                  {referralData.referrals.map((ref) => (
                    <div key={ref.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                      <span className="text-sm font-bold">{ref.referred_user.display_name}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        ref.status === 'completed' ? 'bg-success/10 text-success' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {ref.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm font-bold text-gray-500 mb-2">Have a referral code?</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="input-field flex-1 text-center font-mono uppercase"
                maxLength={8}
              />
              <Button variant="outline" size="sm" onClick={applyReferralCode} disabled={!referralInput.trim()}>
                Apply
              </Button>
            </div>
            {referralMessage && (
              <p className={`text-sm mt-2 font-bold ${referralMessage.includes('earn') ? 'text-success' : 'text-error'}`}>
                {referralMessage}
              </p>
            )}
          </div>
        </div>
      </motion.div>

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
