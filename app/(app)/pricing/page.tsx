'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

type PlanKey = 'plus_monthly' | 'plus_annual' | 'family_monthly' | 'family_annual';

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [loading, setLoading] = useState<PlanKey | null>(null);

  const handleSubscribe = async (planKey: PlanKey) => {
    setLoading(planKey);
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout. Check your Stripe configuration.');
      }
    } catch (err) {
      alert('Network error: ' + (err instanceof Error ? err.message : 'Please try again.'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-extrabold mb-2">Choose Your Plan</h1>
        <p className="text-gray-500 text-lg">Unlock the full power of Mathly</p>

        <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 mt-6">
          <button
            onClick={() => setAnnual(false)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!annual ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${annual ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}
          >
            Annual
            <span className="ml-1 text-xs text-success font-bold">Save 33%</span>
          </button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Free */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">Free</h3>
            <p className="text-4xl font-extrabold mt-2">$0</p>
            <p className="text-sm text-gray-500 mt-1">forever</p>
          </div>
          <ul className="space-y-3 mb-8">
            {['First 5 learning paths', '5 hearts (refill over time)', 'Basic leaderboard', 'Up to 10 friends', 'Core lesson types'].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="text-success font-bold">✓</span> {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" disabled>Current Plan</Button>
        </motion.div>

        {/* Plus */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card border-2 border-primary relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">Mathly Plus</h3>
            <p className="text-4xl font-extrabold mt-2">${annual ? '6.67' : '9.99'}</p>
            <p className="text-sm text-gray-500 mt-1">/month {annual && '(billed annually)'}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {['All 20 learning paths', 'Unlimited hearts', 'No ads', 'Offline mode', '2x XP on weekends', 'Streak repair (1x/month)', 'Exclusive avatars', 'Unlimited friends', 'Priority new content'].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="text-success font-bold">✓</span> {f}
              </li>
            ))}
          </ul>
          <Button
            variant="primary"
            className="w-full"
            loading={loading === (annual ? 'plus_annual' : 'plus_monthly')}
            onClick={() => handleSubscribe(annual ? 'plus_annual' : 'plus_monthly')}
          >
            Upgrade to Plus
          </Button>
        </motion.div>

        {/* Family */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">Family</h3>
            <p className="text-4xl font-extrabold mt-2">${annual ? '10.00' : '14.99'}</p>
            <p className="text-sm text-gray-500 mt-1">/month {annual && '(billed annually)'}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {['Up to 6 family members', 'All Plus features for everyone', 'Family leaderboard', 'Parental controls', 'Shared progress dashboard', 'Family achievements'].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="text-success font-bold">✓</span> {f}
              </li>
            ))}
          </ul>
          <Button
            variant="secondary"
            className="w-full"
            loading={loading === (annual ? 'family_annual' : 'family_monthly')}
            onClick={() => handleSubscribe(annual ? 'family_annual' : 'family_monthly')}
          >
            Start Family Plan
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
