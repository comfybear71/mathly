'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  color = 'bg-primary',
  height = 'h-3',
  showLabel = false,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">{value} / {max}</span>
          <span className="font-bold text-gray-700 dark:text-gray-300">{Math.round(percent)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${height}`}>
        <motion.div
          className={`${height} ${color} rounded-full`}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
