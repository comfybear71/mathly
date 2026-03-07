'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Static curriculum data (would normally come from DB)
const CURRICULUM_DATA = [
  {
    id: '11111111-0001-0001-0001-000000000001', name: 'Foundations', icon: '🔢', color: '#FF6B35',
    description: 'Master the basics: counting, arithmetic, fractions, and more', order: 1, locked: false,
    units: [
      { id: 'u1', name: 'Counting & Numbers', icon: '🔢', lessons: [
        { id: '33333333-0001-0001-0001-000000000001', name: 'Welcome to Numbers!', type: 'tutorial', xp: 10 },
        { id: '33333333-0001-0001-0001-000000000002', name: 'Counting Practice', type: 'practice', xp: 10 },
        { id: '33333333-0001-0001-0001-000000000003', name: 'Number Recognition', type: 'practice', xp: 10 },
        { id: '33333333-0001-0001-0001-000000000004', name: 'Comparing Numbers', type: 'practice', xp: 15 },
        { id: '33333333-0001-0001-0001-000000000005', name: 'Counting Challenge', type: 'boss_round', xp: 25 },
      ]},
      { id: 'u2', name: 'Addition & Subtraction', icon: '➕', lessons: [
        { id: '33333333-0002-0001-0001-000000000001', name: 'What is Addition?', type: 'tutorial', xp: 10 },
        { id: '33333333-0002-0001-0001-000000000002', name: 'Addition Practice', type: 'practice', xp: 10 },
        { id: '33333333-0002-0001-0001-000000000003', name: 'What is Subtraction?', type: 'tutorial', xp: 10 },
        { id: '33333333-0002-0001-0001-000000000004', name: 'Subtraction Practice', type: 'practice', xp: 10 },
        { id: '33333333-0002-0001-0001-000000000005', name: 'Add & Subtract Boss', type: 'boss_round', xp: 25 },
      ]},
      { id: 'u3', name: 'Multiplication & Division', icon: '✖️', lessons: [
        { id: '33333333-0003-0001-0001-000000000001', name: 'Intro to Multiplication', type: 'tutorial', xp: 10 },
        { id: '33333333-0003-0001-0001-000000000002', name: 'Times Tables', type: 'practice', xp: 15 },
        { id: '33333333-0003-0001-0001-000000000003', name: 'Intro to Division', type: 'tutorial', xp: 10 },
        { id: '33333333-0003-0001-0001-000000000004', name: 'Division Practice', type: 'practice', xp: 15 },
        { id: '33333333-0003-0001-0001-000000000005', name: 'Multiply & Divide Boss', type: 'boss_round', xp: 25 },
      ]},
    ],
  },
  { id: '11111111-0001-0001-0001-000000000002', name: 'Pre-Algebra', icon: '📐', color: '#4ECDC4', description: 'Variables, equations, and the language of mathematics', order: 2, locked: false, units: [] },
  { id: '11111111-0001-0001-0001-000000000003', name: 'Algebra I', icon: '🔡', color: '#FFE66D', description: 'Linear equations, polynomials, and functions', order: 3, locked: false, units: [] },
  { id: '11111111-0001-0001-0001-000000000004', name: 'Geometry', icon: '📏', color: '#06D6A0', description: 'Shapes, proofs, and spatial reasoning', order: 4, locked: false, units: [] },
  { id: '11111111-0001-0001-0001-000000000005', name: 'Algebra II', icon: '📊', color: '#EF476F', description: 'Complex numbers, polynomials, and advanced functions', order: 5, locked: false, units: [] },
  { id: '11111111-0001-0001-0001-000000000006', name: 'Trigonometry', icon: '🌊', color: '#9B59B6', description: 'Angles, waves, and the unit circle', order: 6, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000007', name: 'Pre-Calculus', icon: '🚀', color: '#3498DB', description: 'Limits, vectors, and preparing for calculus', order: 7, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000008', name: 'Calculus I', icon: '🧮', color: '#E74C3C', description: 'Derivatives, integrals, and the fundamental theorem', order: 8, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000009', name: 'Calculus II', icon: '🌀', color: '#1ABC9C', description: 'Advanced integration, series, and differential equations', order: 9, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000010', name: 'Multivariable Calculus', icon: '🗺️', color: '#F39C12', description: 'Vectors, partial derivatives, and multiple integrals', order: 10, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000011', name: 'Linear Algebra', icon: '🔷', color: '#2980B9', description: 'Matrices, vectors, and transformations', order: 11, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000012', name: 'Differential Equations', icon: '⚡', color: '#8E44AD', description: 'ODEs, PDEs, and Laplace transforms', order: 12, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000013', name: 'Discrete Mathematics', icon: '🕸️', color: '#27AE60', description: 'Logic, graphs, combinatorics, and algorithms', order: 13, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000014', name: 'Number Theory', icon: '🔑', color: '#D35400', description: 'Primes, modular arithmetic, and cryptography', order: 14, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000015', name: 'Set Theory', icon: '🧩', color: '#C0392B', description: 'Infinity, axioms, and foundations of math', order: 15, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000016', name: 'Abstract Algebra', icon: '🏛️', color: '#7F8C8D', description: 'Groups, rings, fields, and Galois theory', order: 16, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000017', name: 'Real Analysis', icon: '📡', color: '#2C3E50', description: 'Rigorous calculus, metric spaces, and measure theory', order: 17, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000018', name: 'Complex Analysis', icon: '✨', color: '#16A085', description: 'Analytic functions, contour integration, and residues', order: 18, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000019', name: 'Topology', icon: '🍩', color: '#E67E22', description: 'Topological spaces, manifolds, and fundamental groups', order: 19, locked: true, units: [] },
  { id: '11111111-0001-0001-0001-000000000020', name: 'Advanced Topics & Unsolved Problems', icon: '🏆', color: '#FFD700', description: 'The frontiers of mathematics', order: 20, locked: true, units: [] },
];

export default function LearnPage() {
  const [expandedPath, setExpandedPath] = useState<string | null>(CURRICULUM_DATA[0].id);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return '📖';
      case 'practice': return '✏️';
      case 'challenge': return '⚡';
      case 'boss_round': return '👑';
      case 'story': return '📜';
      default: return '📝';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold mb-2">Learning Path</h1>
        <p className="text-gray-500 dark:text-gray-400">Your journey from zero to infinity</p>
      </motion.div>

      <div className="space-y-4">
        {CURRICULUM_DATA.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Path Card */}
            <button
              onClick={() => !path.locked && setExpandedPath(expandedPath === path.id ? null : path.id)}
              className={`w-full text-left rounded-2xl p-4 transition-all duration-200 border-2 ${
                path.locked
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  : expandedPath === path.id
                    ? 'bg-white dark:bg-gray-800 shadow-lg border-primary'
                    : 'bg-white dark:bg-gray-800 shadow hover:shadow-lg border-transparent hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${path.color}20` }}
                >
                  {path.locked ? '🔒' : path.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Path {path.order}</span>
                    {path.order <= 5 && !path.locked && (
                      <span className="text-xs bg-success/10 text-success font-bold px-2 py-0.5 rounded-full">FREE</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg truncate">{path.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{path.description}</p>
                </div>
                {!path.locked && (
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedPath === path.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </button>

            {/* Expanded Units */}
            <AnimatePresence>
              {expandedPath === path.id && path.units.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pl-8 pt-2 space-y-2">
                    {path.units.map((unit) => (
                      <div key={unit.id}>
                        <button
                          onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                          className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                          <span className="text-xl">{unit.icon}</span>
                          <span className="font-bold flex-1">{unit.name}</span>
                          <span className="text-xs text-gray-400">{unit.lessons.length} lessons</span>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              expandedUnit === unit.id ? 'rotate-180' : ''
                            }`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        <AnimatePresence>
                          {expandedUnit === unit.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-10 pb-2 space-y-1">
                                {unit.lessons.map((lesson, li) => (
                                  <Link
                                    key={lesson.id}
                                    href={`/lesson/${lesson.id}`}
                                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
                                  >
                                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all">
                                      {li + 1}
                                    </span>
                                    <span className="text-sm">{getLessonTypeIcon(lesson.type)}</span>
                                    <span className="text-sm font-medium flex-1">{lesson.name}</span>
                                    <span className="text-xs text-gray-400">+{lesson.xp} XP</span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
