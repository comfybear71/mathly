'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const router = useRouter();
  const { darkMode, toggleDarkMode, soundEnabled, toggleSound, user } = useStore();
  const [dailyGoal, setDailyGoal] = useState(user?.daily_goal_xp || 50);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
        animate={{ left: enabled ? '26px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold mb-2">Settings</h1>
      </motion.div>

      {/* Account */}
      <div className="card space-y-4">
        <h2 className="font-extrabold text-lg">Account</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Email</label>
            <input type="email" className="input-field" value={user?.email || ''} readOnly />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Username</label>
            <input type="text" className="input-field" value={user?.username || ''} readOnly />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Display Name</label>
            <input type="text" className="input-field" defaultValue={user?.display_name || ''} />
          </div>
        </div>
      </div>

      {/* Learning */}
      <div className="card space-y-4">
        <h2 className="font-extrabold text-lg">Learning</h2>
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-2">Daily XP Goal</label>
          <div className="grid grid-cols-4 gap-2">
            {[20, 50, 100, 200].map((goal) => (
              <button
                key={goal}
                onClick={() => setDailyGoal(goal)}
                className={`py-2 rounded-xl font-bold text-sm transition-all
                  ${dailyGoal === goal ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'}`}
              >
                {goal} XP
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card space-y-4">
        <h2 className="font-extrabold text-lg">Notifications</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Push Notifications</p>
            <p className="text-sm text-gray-500">Streak reminders and updates</p>
          </div>
          <Toggle enabled={notificationsEnabled} onToggle={() => setNotificationsEnabled(!notificationsEnabled)} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">Reminder Time</label>
          <input
            type="time"
            className="input-field"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
      </div>

      {/* Appearance */}
      <div className="card space-y-4">
        <h2 className="font-extrabold text-lg">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Dark Mode</p>
            <p className="text-sm text-gray-500">Switch between light and dark themes</p>
          </div>
          <Toggle enabled={darkMode} onToggle={toggleDarkMode} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Sound Effects</p>
            <p className="text-sm text-gray-500">Audio feedback for answers</p>
          </div>
          <Toggle enabled={soundEnabled} onToggle={toggleSound} />
        </div>
      </div>

      {/* Subscription */}
      <div className="card space-y-4">
        <h2 className="font-extrabold text-lg">Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold capitalize">{user?.subscription_tier || 'Free'} Plan</p>
            <p className="text-sm text-gray-500">Manage your subscription</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/pricing')}>Manage</Button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="card">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Sign Out
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-error/20 space-y-4">
        <h2 className="font-extrabold text-lg text-error">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Delete Account</p>
            <p className="text-sm text-gray-500">Permanently delete your account and data</p>
          </div>
          <Button variant="danger" size="sm">Delete</Button>
        </div>
      </div>
    </div>
  );
}
