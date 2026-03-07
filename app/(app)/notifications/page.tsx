'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const demoNotifications = [
  { id: 1, type: 'streak', title: "Don't break your streak!", body: 'You have 2 hours left to practice today. Keep the fire going!', read: false, time: '2 hours ago', icon: '🔥' },
  { id: 2, type: 'achievement', title: 'Achievement Unlocked!', body: 'You earned "Streak Starter" for a 3-day streak!', read: false, time: '1 day ago', icon: '🏆' },
  { id: 3, type: 'friend', title: 'New Friend Activity', body: 'MathWizard42 just completed Calculus I!', read: true, time: '2 days ago', icon: '👥' },
  { id: 4, type: 'league', title: 'League Update', body: "You're in 6th place in Bronze League. Keep climbing!", read: true, time: '3 days ago', icon: '📊' },
  { id: 5, type: 'challenge', title: 'Daily Challenge Ready!', body: 'Your new daily math challenge is waiting for you.', read: true, time: '3 days ago', icon: '⚡' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-extrabold">Notifications</h1>
          {unread > 0 && <p className="text-sm text-gray-500">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </motion.div>

      <div className="space-y-2">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`card flex items-start gap-3 cursor-pointer hover:shadow-md transition-all
              ${!notif.read ? 'border-l-4 border-primary bg-primary/5' : ''}`}
            onClick={() => {
              setNotifications(notifications.map((n) =>
                n.id === notif.id ? { ...n, read: true } : n
              ));
            }}
          >
            <span className="text-2xl mt-0.5">{notif.icon}</span>
            <div className="flex-1">
              <p className={`font-bold ${!notif.read ? 'text-primary' : ''}`}>{notif.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{notif.body}</p>
              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
            </div>
            {!notif.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
