'use client';

import { motion } from 'framer-motion';

type MascotState = 'happy' | 'sad' | 'excited' | 'sleeping' | 'thinking' | 'celebrating';

interface EulerMascotProps {
  state?: MascotState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

const stateColors: Record<MascotState, string> = {
  happy: '#4ECDC4',
  sad: '#6B7280',
  excited: '#FFE66D',
  sleeping: '#9CA3AF',
  thinking: '#4ECDC4',
  celebrating: '#FF6B35',
};

export default function EulerMascot({ state = 'happy', size = 'md', message, className = '' }: EulerMascotProps) {
  const dimensions = sizeMap[size];
  const color = stateColors[state];

  const getEyeExpression = () => {
    switch (state) {
      case 'happy':
      case 'celebrating':
        return { leftEye: '◠', rightEye: '◠' };
      case 'sad':
        return { leftEye: '◡', rightEye: '◡' };
      case 'excited':
        return { leftEye: '★', rightEye: '★' };
      case 'sleeping':
        return { leftEye: '—', rightEye: '—' };
      case 'thinking':
        return { leftEye: '◉', rightEye: '◉' };
      default:
        return { leftEye: '●', rightEye: '●' };
    }
  };

  const getMouth = () => {
    switch (state) {
      case 'happy':
      case 'excited':
      case 'celebrating':
        return '‿';
      case 'sad':
        return '︵';
      case 'sleeping':
        return '～';
      case 'thinking':
        return '•';
      default:
        return '‿';
    }
  };

  const getAnimation = () => {
    switch (state) {
      case 'excited':
      case 'celebrating':
        return {
          animate: { y: [0, -8, 0], rotate: [0, 5, -5, 0] },
          transition: { duration: 0.8, repeat: Infinity, repeatType: 'loop' as const },
        };
      case 'sleeping':
        return {
          animate: { scale: [1, 1.03, 1] },
          transition: { duration: 2, repeat: Infinity, repeatType: 'loop' as const },
        };
      case 'thinking':
        return {
          animate: { rotate: [0, 3, -3, 0] },
          transition: { duration: 2, repeat: Infinity, repeatType: 'loop' as const },
        };
      case 'sad':
        return {
          animate: { y: [0, 2, 0] },
          transition: { duration: 2, repeat: Infinity, repeatType: 'loop' as const },
        };
      default:
        return {
          animate: { y: [0, -4, 0] },
          transition: { duration: 3, repeat: Infinity, repeatType: 'loop' as const },
        };
    }
  };

  const eyes = getEyeExpression();
  const mouth = getMouth();
  const anim = getAnimation();

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        {...anim}
        className={`${dimensions} relative`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Body - round robot */}
          <circle cx="50" cy="55" r="35" fill={color} opacity="0.2" />
          <circle cx="50" cy="55" r="32" fill={color} opacity="0.4" />
          <circle cx="50" cy="55" r="28" fill="white" stroke={color} strokeWidth="3" />

          {/* Antenna - sqrt symbol */}
          <line x1="50" y1="27" x2="50" y2="15" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <path d="M42 8 L46 15 L50 5 L58 5" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Cheek blush */}
          {(state === 'happy' || state === 'celebrating' || state === 'excited') && (
            <>
              <circle cx="32" cy="60" r="5" fill="#FFB6C1" opacity="0.5" />
              <circle cx="68" cy="60" r="5" fill="#FFB6C1" opacity="0.5" />
            </>
          )}

          {/* Eyes */}
          <text x="38" y="55" textAnchor="middle" fontSize="12" fill="#333">{eyes.leftEye}</text>
          <text x="62" y="55" textAnchor="middle" fontSize="12" fill="#333">{eyes.rightEye}</text>

          {/* Mouth */}
          <text x="50" y="68" textAnchor="middle" fontSize="14" fill="#333">{mouth}</text>

          {/* Sleeping Z's */}
          {state === 'sleeping' && (
            <>
              <text x="72" y="35" fontSize="8" fill={color} opacity="0.6">z</text>
              <text x="78" y="25" fontSize="10" fill={color} opacity="0.4">z</text>
              <text x="84" y="15" fontSize="12" fill={color} opacity="0.3">z</text>
            </>
          )}

          {/* Celebration sparkles */}
          {state === 'celebrating' && (
            <>
              <text x="20" y="25" fontSize="10">✨</text>
              <text x="75" y="20" fontSize="8">⭐</text>
              <text x="15" y="75" fontSize="8">🎉</text>
              <text x="80" y="70" fontSize="10">✨</text>
            </>
          )}

          {/* Thinking bubble */}
          {state === 'thinking' && (
            <>
              <circle cx="75" cy="35" r="3" fill={color} opacity="0.3" />
              <circle cx="80" cy="25" r="4" fill={color} opacity="0.3" />
              <circle cx="85" cy="14" r="6" fill={color} opacity="0.2" />
            </>
          )}
        </svg>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl px-4 py-2 text-sm text-center max-w-xs
                     border-2 border-gray-100 dark:border-gray-700 relative"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-l-2 border-t-2 border-gray-100 dark:border-gray-700 rotate-45" />
          <span className="relative">{message}</span>
        </motion.div>
      )}
    </div>
  );
}
