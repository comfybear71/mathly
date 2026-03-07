'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Button from '@/components/ui/Button';

const SHOP_ITEMS = [
  {
    category: 'Power-Ups',
    items: [
      { id: 1, name: 'Streak Freeze', description: 'Protect your streak for one day', icon: '🧊', cost: 200, type: 'streak_freeze' },
      { id: 2, name: 'Heart Refill', description: 'Refill all hearts instantly', icon: '❤️‍🩹', cost: 350, type: 'heart_refill' },
      { id: 3, name: 'Double XP (1hr)', description: 'Earn double XP for 1 hour', icon: '⚡', cost: 300, type: 'xp_boost' },
      { id: 4, name: 'Double XP (24hr)', description: 'Earn double XP for 24 hours', icon: '🔥', cost: 500, type: 'xp_boost' },
    ],
  },
  {
    category: 'Avatars',
    items: [
      { id: 5, name: 'Robot Avatar', description: 'A cute robot explorer', icon: '🤖', cost: 500, type: 'avatar' },
      { id: 6, name: 'Astronaut', description: 'Explore math space', icon: '👨‍🚀', cost: 500, type: 'avatar' },
      { id: 7, name: 'Wizard', description: 'A math wizard', icon: '🧙', cost: 750, type: 'avatar' },
    ],
  },
  {
    category: 'Cosmetics',
    items: [
      { id: 8, name: 'Gold Crown', description: 'Show off your status', icon: '👑', cost: 1000, type: 'cosmetic' },
      { id: 9, name: 'Rainbow Trail', description: 'Rainbow on leaderboard', icon: '🌈', cost: 800, type: 'cosmetic' },
      { id: 10, name: "Euler's Hat", description: 'A legendary mathematician hat', icon: '🎩', cost: 1500, type: 'cosmetic' },
    ],
  },
];

export default function ShopPage() {
  const { gems, spendGems } = useStore();
  const [purchaseMessage, setPurchaseMessage] = useState('');

  const handlePurchase = (item: { name: string; cost: number }) => {
    if (spendGems(item.cost)) {
      setPurchaseMessage(`Purchased ${item.name}!`);
      setTimeout(() => setPurchaseMessage(''), 2000);
    } else {
      setPurchaseMessage('Not enough gems!');
      setTimeout(() => setPurchaseMessage(''), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Shop</h1>
          <p className="text-gray-500">Spend your gems on power-ups and cosmetics</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full">
          <span className="text-xl">💎</span>
          <span className="font-extrabold text-secondary text-lg">{gems?.balance || 0}</span>
        </div>
      </motion.div>

      {purchaseMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl px-4 py-3 text-center font-bold ${
            purchaseMessage.includes('Not enough') ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
          }`}
        >
          {purchaseMessage}
        </motion.div>
      )}

      {SHOP_ITEMS.map((category) => (
        <motion.div key={category.category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-extrabold mb-4">{category.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.items.map((item) => (
              <div key={item.id} className="card-hover">
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{item.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span>💎</span>
                    <span className="font-extrabold text-secondary">{item.cost}</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePurchase(item)}
                    disabled={(gems?.balance || 0) < item.cost}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
