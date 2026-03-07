'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import HeartsDisplay from '@/components/ui/HeartsDisplay';
import XPPopup from '@/components/ui/XPPopup';
import Confetti from '@/components/ui/Confetti';
import EulerMascot from '@/components/mascot/EulerMascot';

type QuestionTypeVal = 'multiple_choice' | 'fill_in_blank' | 'equation_solver' | 'drag_drop' | 'true_false' | 'word_problem' | 'proof_builder' | 'match_pairs';

interface DemoQuestion {
  id: string;
  question_type: QuestionTypeVal;
  difficulty: string;
  question_text: string;
  options: { id: string; text: string }[] | null;
  correct_answer: string;
  explanation: string;
  hint: string;
  xp_value: number;
}

// Demo questions - would come from DB
const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: '1', question_type: 'multiple_choice', difficulty: 'easy',
    question_text: 'How many apples are shown? 🍎🍎🍎',
    options: [{ id: 'a', text: '2' }, { id: 'b', text: '3' }, { id: 'c', text: '4' }, { id: 'd', text: '5' }],
    correct_answer: 'b', explanation: 'There are 3 apples! Count each one: 1, 2, 3.',
    hint: 'Try counting each apple one by one', xp_value: 5,
  },
  {
    id: '2', question_type: 'multiple_choice' , difficulty: 'easy',
    question_text: 'Which number comes after 5?',
    options: [{ id: 'a', text: '4' }, { id: 'b', text: '5' }, { id: 'c', text: '6' }, { id: 'd', text: '7' }],
    correct_answer: 'c', explanation: 'The number after 5 is 6!',
    hint: 'Count from 1 and listen for what comes after 5', xp_value: 5,
  },
  {
    id: '3', question_type: 'fill_in_blank' , difficulty: 'easy',
    question_text: 'Fill in the missing number: 1, 2, ___, 4, 5',
    options: null, correct_answer: '3',
    explanation: 'The missing number is 3! The sequence goes 1, 2, 3, 4, 5.',
    hint: 'What number comes between 2 and 4?', xp_value: 5,
  },
  {
    id: '4', question_type: 'true_false' , difficulty: 'easy',
    question_text: 'True or False: 7 is greater than 9',
    options: [{ id: 'true', text: 'True' }, { id: 'false', text: 'False' }],
    correct_answer: 'false', explanation: '7 is less than 9, not greater.',
    hint: 'Think about which number is bigger', xp_value: 5,
  },
  {
    id: '5', question_type: 'multiple_choice' , difficulty: 'easy',
    question_text: 'What is 2 + 3?',
    options: [{ id: 'a', text: '4' }, { id: 'b', text: '5' }, { id: 'c', text: '6' }, { id: 'd', text: '7' }],
    correct_answer: 'b', explanation: '2 + 3 = 5! If you have 2 apples and get 3 more, you have 5.',
    hint: 'Count 2, then count 3 more', xp_value: 5,
  },
];

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function LessonPage() {
  const router = useRouter();
  const { hearts, loseHeart, addXP } = useStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [fillAnswer, setFillAnswer] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const questions = DEMO_QUESTIONS;
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + (answerState !== 'idle' ? 1 : 0)) / questions.length) * 100;

  const checkAnswer = useCallback(() => {
    const answer = question.question_type === 'fill_in_blank' ? fillAnswer.trim() : selectedAnswer;
    const isCorrect = answer.toLowerCase() === String(question.correct_answer).toLowerCase();

    if (isCorrect) {
      setAnswerState('correct');
      setCorrectCount((c) => c + 1);
      setTotalXP((xp) => xp + question.xp_value);
      setXpAmount(question.xp_value);
      setShowXPPopup(true);
      addXP(question.xp_value);
    } else {
      setAnswerState('wrong');
      loseHeart();
    }
    setShowExplanation(true);
  }, [question, fillAnswer, selectedAnswer, addXP, loseHeart]);

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer('');
      setFillAnswer('');
      setAnswerState('idle');
      setShowExplanation(false);
      setShowHint(false);
    } else {
      setShowComplete(true);
      setShowConfetti(true);
    }
  };

  if (showComplete) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Confetti active={showConfetti} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <EulerMascot
            state={score >= 80 ? 'celebrating' : score >= 50 ? 'happy' : 'thinking'}
            size="lg"
            message={score === 100 ? 'Perfect score! Amazing!' : score >= 80 ? 'Great job!' : 'Keep practicing!'}
          />

          <h1 className="text-3xl font-extrabold mt-6 mb-2">Lesson Complete!</h1>

          <div className="grid grid-cols-3 gap-4 my-8">
            <div className="card text-center">
              <p className="text-2xl font-extrabold text-primary">{totalXP}</p>
              <p className="text-xs text-gray-500">XP Earned</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-extrabold text-success">{score}%</p>
              <p className="text-xs text-gray-500">Score</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-extrabold text-secondary">{correctCount}/{questions.length}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={() => router.push('/learn')}>
              Continue Learning
            </Button>
            <Button variant="outline" className="w-full" onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer('');
              setFillAnswer('');
              setAnswerState('idle');
              setShowExplanation(false);
              setTotalXP(0);
              setCorrectCount(0);
              setShowComplete(false);
            }}>
              Practice Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setShowExitModal(true)} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1">
          <ProgressBar value={progress} max={100} color="bg-primary" height="h-2.5" />
        </div>
        <HeartsDisplay
          current={hearts?.current_hearts ?? 5}
          max={hearts?.max_hearts ?? 5}
          size="sm"
        />
      </div>

      {/* XP Popup */}
      <XPPopup amount={xpAmount} visible={showXPPopup} onComplete={() => setShowXPPopup(false)} />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="space-y-6"
        >
          {/* Question Text */}
          <div className={`text-center ${answerState === 'correct' ? 'animate-correct' : answerState === 'wrong' ? 'animate-wrong' : ''}`}>
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <h2 className="text-2xl font-extrabold leading-relaxed">
              {question.question_text}
            </h2>
          </div>

          {/* Answer Area */}
          <div className="space-y-3">
            {question.question_type === 'fill_in_blank' || question.question_type === 'equation_solver' ? (
              <div>
                <input
                  type="text"
                  value={fillAnswer}
                  onChange={(e) => setFillAnswer(e.target.value)}
                  disabled={answerState !== 'idle'}
                  className="input-field text-center text-2xl font-bold"
                  placeholder="Type your answer..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && fillAnswer && answerState === 'idle' && checkAnswer()}
                />
              </div>
            ) : (
              question.options?.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = answerState !== 'idle' && option.id === String(question.correct_answer);
                const isWrong = answerState === 'wrong' && isSelected;

                return (
                  <button
                    key={option.id}
                    onClick={() => answerState === 'idle' && setSelectedAnswer(option.id)}
                    disabled={answerState !== 'idle'}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-bold text-lg
                      ${isCorrect
                        ? 'border-success bg-success/10 text-success'
                        : isWrong
                          ? 'border-error bg-error/10 text-error'
                          : isSelected
                            ? 'border-primary bg-primary/10 text-primary shadow-md'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm
                        ${isCorrect ? 'border-success bg-success text-white' : isWrong ? 'border-error bg-error text-white' : isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                        {isCorrect ? '✓' : isWrong ? '✗' : option.id.toUpperCase()}
                      </span>
                      <span>{option.text}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Hint */}
          {!showHint && answerState === 'idle' && question.hint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-secondary font-bold hover:underline"
            >
              💡 Need a hint?
            </button>
          )}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/10 rounded-xl p-4 text-sm"
            >
              <span className="font-bold text-secondary">💡 Hint: </span>
              {question.hint}
            </motion.div>
          )}

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 ${
                  answerState === 'correct' ? 'bg-success/10 border-2 border-success' : 'bg-error/10 border-2 border-error'
                }`}
              >
                <p className={`font-bold mb-1 ${answerState === 'correct' ? 'text-success' : 'text-error'}`}>
                  {answerState === 'correct' ? '🎉 Correct!' : '❌ Not quite!'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div className="pt-4">
            {answerState === 'idle' ? (
              <Button
                variant="primary"
                className="w-full"
                onClick={checkAnswer}
                disabled={!selectedAnswer && !fillAnswer.trim()}
              >
                Check Answer
              </Button>
            ) : (
              <Button variant={answerState === 'correct' ? 'secondary' : 'primary'} className="w-full" onClick={nextQuestion}>
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Lesson'}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Exit Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <EulerMascot state="sad" size="sm" message="Are you sure?" />
              <h3 className="text-xl font-extrabold text-center mt-4 mb-2">Leave Lesson?</h3>
              <p className="text-center text-gray-500 mb-6">Your progress on this lesson won&apos;t be saved.</p>
              <div className="space-y-3">
                <Button variant="primary" className="w-full" onClick={() => setShowExitModal(false)}>
                  Keep Learning
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push('/learn')}>
                  Leave Lesson
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
