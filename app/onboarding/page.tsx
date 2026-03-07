'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import EulerMascot from '@/components/mascot/EulerMascot';
import Confetti from '@/components/ui/Confetti';

const steps = [
  {
    title: 'Why do you want to learn math?',
    options: [
      { id: 'school', label: 'School & Academics', icon: '🎓' },
      { id: 'career', label: 'Career Growth', icon: '💼' },
      { id: 'curiosity', label: 'Pure Curiosity', icon: '🔬' },
      { id: 'challenge', label: 'Love a Challenge', icon: '🏆' },
    ],
  },
  {
    title: 'How much time per day?',
    options: [
      { id: '5', label: '5 min / day', icon: '🌱', xp: 20 },
      { id: '10', label: '10 min / day', icon: '🌿', xp: 50 },
      { id: '15', label: '15 min / day', icon: '🌳', xp: 100 },
      { id: '30', label: '30 min / day', icon: '🏔️', xp: 200 },
    ],
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  const handleSelect = (optionId: string) => {
    setSelections({ ...selections, [currentStep]: optionId });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowWelcome(true);
      setTimeout(() => router.push('/placement-test'), 3000);
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Confetti active={true} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <EulerMascot state="celebrating" size="xl" message="Almost there!" />
          <h1 className="text-4xl font-extrabold mt-8 mb-4">
            Welcome to <span className="text-gradient">Mathly</span>!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Let&apos;s find out your math level with a quick test...
          </p>
        </motion.div>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="text-center mb-4">
              <EulerMascot state="thinking" size="sm" />
            </div>
            <h2 className="text-2xl font-extrabold text-center mb-8">{step.title}</h2>

            <div className="grid grid-cols-1 gap-3">
              {step.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                    ${selections[currentStep] === option.id
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span className="font-bold text-lg">{option.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!selections[currentStep]}
              >
                {currentStep === steps.length - 1 ? 'Take Placement Test' : 'Continue'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
