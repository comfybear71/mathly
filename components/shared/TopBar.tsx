'use client';

import Link from 'next/link';
import { useStore } from '@/store/useStore';
import HeartsDisplay from '@/components/ui/HeartsDisplay';

export default function TopBar() {
  const { hearts, streak, gems, user } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 md:ml-20 lg:ml-64">
        <div className="flex items-center gap-4">
          {/* Streak */}
          <Link href="/profile/me" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <span className="text-xl">🔥</span>
            <span className="font-heading font-bold text-primary">
              {streak?.current_streak || user?.streak_count || 0}
            </span>
          </Link>

          {/* Hearts */}
          <div className="flex items-center gap-1.5">
            <HeartsDisplay
              current={hearts?.current_hearts ?? 5}
              max={hearts?.max_hearts ?? 5}
              unlimited={!!hearts?.unlimited_until && new Date(hearts.unlimited_until) > new Date()}
              size="sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Gems */}
          <Link href="/shop" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <span className="text-xl">💎</span>
            <span className="font-heading font-bold text-secondary">
              {gems?.balance || 0}
            </span>
          </Link>

          {/* Notifications */}
          <Link href="/notifications" className="relative hover:opacity-80 transition-opacity">
            <span className="text-xl">🔔</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
