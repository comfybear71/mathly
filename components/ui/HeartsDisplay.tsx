'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface HeartsDisplayProps {
  current: number;
  max: number;
  unlimited?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
};

export default function HeartsDisplay({ current, max, unlimited = false, size = 'md' }: HeartsDisplayProps) {
  if (unlimited) {
    return (
      <div className="flex items-center gap-1">
        <span className={`${sizeMap[size]}`}>❤️</span>
        <span className="text-sm font-bold text-primary">∞</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <AnimatePresence>
        {Array.from({ length: max }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 1 }}
            animate={{ scale: i < current ? 1 : 0.8, opacity: i < current ? 1 : 0.3 }}
            exit={{ scale: 0, transition: { duration: 0.3 } }}
            className={sizeMap[size]}
          >
            {i < current ? '❤️' : '🖤'}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
