'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface XPPopupProps {
  amount: number;
  visible: boolean;
  onComplete?: () => void;
}

export default function XPPopup({ amount, visible, onComplete }: XPPopupProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.5 }}
          transition={{ duration: 0.8 }}
          onAnimationComplete={() => onComplete?.()}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-accent text-amber-800 font-heading font-bold text-2xl px-6 py-3 rounded-full shadow-lg">
            +{amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
