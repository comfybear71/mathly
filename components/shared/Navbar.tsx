'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/learn', label: 'Learn', icon: '📚' },
  { href: '/leaderboard', label: 'Ranks', icon: '🏆' },
  { href: '/shop', label: 'Shop', icon: '🛍️' },
  { href: '/profile/me', label: 'Profile', icon: '👤' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col py-6 z-40">
        <Link href="/home" className="flex items-center justify-center lg:justify-start lg:px-6 mb-8">
          <span className="text-3xl font-heading font-bold text-gradient">∞</span>
          <span className="hidden lg:block ml-2 text-xl font-heading font-bold text-gradient">Mathly</span>
        </Link>

        <div className="flex flex-col gap-2 px-3">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href) || (item.href === '/profile/me' && pathname?.startsWith('/profile'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                           ${isActive
                             ? 'bg-primary/10 text-primary font-bold'
                             : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                           }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="hidden lg:block">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto px-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <span className="text-xl">⚙️</span>
            <span className="hidden lg:block">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40 pb-safe">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href) || (item.href === '/profile/me' && pathname?.startsWith('/profile'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all
                           ${isActive ? 'text-primary' : 'text-gray-400'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-bold">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeMobileNav"
                    className="absolute top-0 w-12 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
