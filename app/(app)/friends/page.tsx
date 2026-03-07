'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const demoFriends = [
  { id: 1, name: 'MathWizard42', streak: 15, xpWeek: 850, avatar: '🧙', online: true },
  { id: 2, name: 'AlgebraQueen', streak: 23, xpWeek: 720, avatar: '👸', online: false },
  { id: 3, name: 'PiLover314', streak: 8, xpWeek: 450, avatar: '🥧', online: true },
];

const pendingRequests = [
  { id: 10, name: 'NumberNinja', avatar: '🥷' },
];

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold mb-2">Friends</h1>
        <p className="text-gray-500">Learn together, compete, and stay motivated</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[
          { key: 'friends', label: `Friends (${demoFriends.length})` },
          { key: 'requests', label: `Requests (${pendingRequests.length})` },
          { key: 'search', label: 'Add Friend' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
              ${activeTab === key ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'friends' && (
        <div className="space-y-3">
          {demoFriends.map((friend, i) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card flex items-center gap-4"
            >
              <div className="relative">
                <span className="text-3xl">{friend.avatar}</span>
                {friend.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold">{friend.name}</p>
                <p className="text-xs text-gray-500">🔥 {friend.streak} day streak &middot; {friend.xpWeek} XP this week</p>
              </div>
              <Button variant="outline" size="sm">Challenge</Button>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-3">
          {pendingRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No pending requests</p>
          ) : (
            pendingRequests.map((req) => (
              <div key={req.id} className="card flex items-center gap-4">
                <span className="text-3xl">{req.avatar}</span>
                <div className="flex-1">
                  <p className="font-bold">{req.name}</p>
                  <p className="text-xs text-gray-500">Wants to be your friend</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm">Accept</Button>
                  <Button variant="ghost" size="sm">Decline</Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field mb-4"
            placeholder="Search by username..."
          />
          {searchQuery && (
            <p className="text-center text-gray-500 py-8">
              Search for &quot;{searchQuery}&quot; — connect Supabase to enable search
            </p>
          )}
        </div>
      )}
    </div>
  );
}
