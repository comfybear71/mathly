'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import EulerMascot from '@/components/mascot/EulerMascot';
import Confetti from '@/components/ui/Confetti';

interface PlacementQuestion {
  id: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const placementQuestions: PlacementQuestion[] = [
  // BEGINNER — Basic Arithmetic
  {
    id: 1,
    difficulty: 'beginner',
    category: 'Arithmetic',
    question: 'What is 24 + 38?',
    options: ['52', '62', '72', '58'],
    correctIndex: 1,
    explanation: '24 + 38 = 62. Add the ones (4+8=12, carry 1), then the tens (2+3+1=6).',
  },
  {
    id: 2,
    difficulty: 'beginner',
    category: 'Arithmetic',
    question: 'What is 7 × 8?',
    options: ['54', '48', '56', '64'],
    correctIndex: 2,
    explanation: '7 × 8 = 56. This is a key multiplication fact to remember.',
  },
  {
    id: 3,
    difficulty: 'beginner',
    category: 'Fractions',
    question: 'What is 1/2 + 1/4?',
    options: ['2/6', '1/3', '3/4', '2/4'],
    correctIndex: 2,
    explanation: '1/2 = 2/4, so 2/4 + 1/4 = 3/4.',
  },
  // INTERMEDIATE — Pre-Algebra & Algebra
  {
    id: 4,
    difficulty: 'intermediate',
    category: 'Pre-Algebra',
    question: 'Solve for x: 3x + 7 = 22',
    options: ['x = 3', 'x = 5', 'x = 7', 'x = 4'],
    correctIndex: 1,
    explanation: '3x + 7 = 22 → 3x = 15 → x = 5.',
  },
  {
    id: 5,
    difficulty: 'intermediate',
    category: 'Algebra',
    question: 'Simplify: (2x + 3)(x - 1)',
    options: ['2x² + x - 3', '2x² - x - 3', '2x² + 5x - 3', '2x² - 5x + 3'],
    correctIndex: 0,
    explanation: 'Use FOIL: 2x² - 2x + 3x - 3 = 2x² + x - 3.',
  },
  {
    id: 6,
    difficulty: 'intermediate',
    category: 'Geometry',
    question: 'What is the area of a triangle with base 10 and height 6?',
    options: ['60', '30', '16', '36'],
    correctIndex: 1,
    explanation: 'Area = (1/2) × base × height = (1/2) × 10 × 6 = 30.',
  },
  // ADVANCED — Algebra II & Trigonometry
  {
    id: 7,
    difficulty: 'advanced',
    category: 'Algebra II',
    question: 'What are the solutions to x² - 5x + 6 = 0?',
    options: ['x = 1, x = 6', 'x = 2, x = 3', 'x = -2, x = -3', 'x = -1, x = 6'],
    correctIndex: 1,
    explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3.',
  },
  {
    id: 8,
    difficulty: 'advanced',
    category: 'Trigonometry',
    question: 'What is sin(30°)?',
    options: ['√3/2', '1/2', '√2/2', '1'],
    correctIndex: 1,
    explanation: 'sin(30°) = 1/2. This is one of the standard trig values.',
  },
  {
    id: 9,
    difficulty: 'advanced',
    category: 'Logarithms',
    question: 'What is log₂(32)?',
    options: ['4', '5', '6', '3'],
    correctIndex: 1,
    explanation: 'log₂(32) = 5, because 2⁵ = 32.',
  },
  // EXPERT — Calculus & Beyond
  {
    id: 10,
    difficulty: 'expert',
    category: 'Calculus',
    question: 'What is the derivative of f(x) = 3x² + 2x?',
    options: ['6x + 2', '3x + 2', '6x² + 2', '6x'],
    correctIndex: 0,
    explanation: "Using the power rule: f'(x) = 6x + 2.",
  },
  {
    id: 11,
    difficulty: 'expert',
    category: 'Calculus',
    question: 'What is ∫ 2x dx?',
    options: ['2x + C', 'x² + C', '2x² + C', 'x + C'],
    correctIndex: 1,
    explanation: '∫ 2x dx = x² + C. The antiderivative of 2x is x².',
  },
  {
    id: 12,
    difficulty: 'expert',
    category: 'Linear Algebra',
    question: 'What is the determinant of the matrix [[3, 1], [2, 4]]?',
    options: ['14', '10', '5', '12'],
    correctIndex: 1,
    explanation: 'det = (3)(4) - (1)(2) = 12 - 2 = 10.',
  },
];

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

type MascotState = 'idle' | 'thinking' | 'celebrating' | 'excited' | 'sad';

export default function PlacementTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [testComplete, setTestComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const router = useRouter();
  const { data: session } = useSession();

  const question = placementQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctIndex;

  // Timer per question
  useEffect(() => {
    if (testComplete || showResult) return;
    setTimeLeft(45);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Time's up — mark as skipped
          handleSubmitAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, testComplete]);

  const handleSubmitAnswer = useCallback((timedOut = false) => {
    if (showResult) return;
    const answer = timedOut ? null : selectedAnswer;
    setShowResult(true);
    setAnswers(prev => [...prev, answer]);

    setTimeout(() => {
      if (currentQuestion < placementQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setTestComplete(true);
      }
    }, 1500);
  }, [showResult, selectedAnswer, currentQuestion]);

  const calculateResults = () => {
    let beginnerCorrect = 0, intermediateCorrect = 0, advancedCorrect = 0, expertCorrect = 0;

    answers.forEach((answer, i) => {
      const q = placementQuestions[i];
      if (answer === q.correctIndex) {
        switch (q.difficulty) {
          case 'beginner': beginnerCorrect++; break;
          case 'intermediate': intermediateCorrect++; break;
          case 'advanced': advancedCorrect++; break;
          case 'expert': expertCorrect++; break;
        }
      }
    });

    const totalCorrect = beginnerCorrect + intermediateCorrect + advancedCorrect + expertCorrect;
    const totalQuestions = placementQuestions.length;
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);

    let level: string;
    let startPath: number;
    let message: string;

    if (expertCorrect >= 2 && advancedCorrect >= 2) {
      level = 'Expert';
      startPath = 13;
      message = "Incredible! You have a strong foundation in higher mathematics. We'll start you at the advanced level!";
    } else if (advancedCorrect >= 2 && intermediateCorrect >= 2) {
      level = 'Advanced';
      startPath = 8;
      message = "Excellent! You clearly know your way around algebra and trig. Let's challenge you!";
    } else if (intermediateCorrect >= 2 && beginnerCorrect >= 2) {
      level = 'Intermediate';
      startPath = 3;
      message = "Great job! You have solid fundamentals. Time to level up your algebra skills!";
    } else {
      level = 'Beginner';
      startPath = 1;
      message = "Welcome! We'll start from the foundations and build your skills step by step!";
    }

    return { totalCorrect, totalQuestions, percentage, level, startPath, message, beginnerCorrect, intermediateCorrect, advancedCorrect, expertCorrect };
  };

  const handleFinish = async () => {
    setSaving(true);
    const results = calculateResults();

    try {
      if (session?.user?.id) {
        await fetch('/api/placement-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            level: results.level.toLowerCase(),
            score: results.percentage,
            startPath: results.startPath,
          }),
        });
      }
    } catch {
      // Non-critical — continue anyway
    }

    router.push('/home');
  };

  // Results screen
  if (testComplete) {
    const results = calculateResults();
    const mascotState: MascotState = results.percentage >= 50 ? 'celebrating' : 'excited';

    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
        <Confetti active={results.percentage >= 50} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center"
        >
          <EulerMascot state={mascotState} size="lg" message={results.percentage >= 50 ? 'Amazing work!' : 'Great effort!'} />

          <h1 className="text-3xl font-extrabold mt-6 mb-2">
            Your Level: <span className="text-gradient">{results.level}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{results.message}</p>

          <div className="card mb-6">
            <div className="text-5xl font-extrabold text-primary mb-2">{results.percentage}%</div>
            <p className="text-sm text-gray-500 mb-4">{results.totalCorrect} of {results.totalQuestions} correct</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                <div className="font-bold text-green-700 dark:text-green-400">Basics</div>
                <div className="text-lg font-extrabold">{results.beginnerCorrect}/3</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <div className="font-bold text-blue-700 dark:text-blue-400">Algebra</div>
                <div className="text-lg font-extrabold">{results.intermediateCorrect}/3</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                <div className="font-bold text-purple-700 dark:text-purple-400">Advanced</div>
                <div className="text-lg font-extrabold">{results.advancedCorrect}/3</div>
              </div>
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                <div className="font-bold text-red-700 dark:text-red-400">Expert</div>
                <div className="text-lg font-extrabold">{results.expertCorrect}/3</div>
              </div>
            </div>
          </div>

          <Button variant="primary" size="lg" className="w-full" onClick={handleFinish} loading={saving}>
            Start Learning!
          </Button>
        </motion.div>
      </div>
    );
  }

  const mascotState: MascotState = showResult ? (isCorrect ? 'celebrating' : 'sad') : 'thinking';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyColors[question.difficulty]}`}>
            {question.category}
          </span>
          <span className="text-sm font-bold text-gray-500">
            {currentQuestion + 1} / {placementQuestions.length}
          </span>
        </div>

        {/* Progress */}
        <ProgressBar value={currentQuestion + 1} max={placementQuestions.length} height="h-2" className="mb-6" />

        {/* Timer */}
        <div className="flex justify-center mb-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
            ${timeLeft <= 10 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {timeLeft}s
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            {/* Mascot */}
            <div className="text-center mb-4">
              <EulerMascot state={mascotState} size="sm" />
            </div>

            {/* Question */}
            <div className="card mb-6">
              <h2 className="text-xl font-extrabold text-center">{question.question}</h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, index) => {
                let optionStyle = 'border-gray-200 dark:border-gray-700 hover:border-primary/50';

                if (showResult) {
                  if (index === question.correctIndex) {
                    optionStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20';
                  } else if (index === selectedAnswer && index !== question.correctIndex) {
                    optionStyle = 'border-red-500 bg-red-50 dark:bg-red-900/20';
                  }
                } else if (selectedAnswer === index) {
                  optionStyle = 'border-primary bg-primary/10 shadow-md';
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={!showResult ? { scale: 1.01 } : {}}
                    whileTap={!showResult ? { scale: 0.99 } : {}}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    disabled={showResult}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${optionStyle}`}
                  >
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 font-bold text-sm shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-bold">{option}</span>
                    {showResult && index === question.correctIndex && (
                      <span className="ml-auto text-green-500 text-lg">&#10003;</span>
                    )}
                    {showResult && index === selectedAnswer && index !== question.correctIndex && (
                      <span className="ml-auto text-red-500 text-lg">&#10007;</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation on result */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}
              >
                <span className="font-bold">{isCorrect ? 'Correct! ' : 'Not quite. '}</span>
                {question.explanation}
              </motion.div>
            )}

            {/* Submit button */}
            {!showResult && (
              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleSubmitAnswer(false)}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
