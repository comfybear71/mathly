'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Shapes returned by /api/paths, /api/units, /api/lessons
interface DbPath {
  id: string;
  name: string;
  description: string;
  order_index: number;
  icon: string;
  color: string;
  is_locked: boolean;
  prerequisite_path_id: string | null;
}

interface DbUnit {
  id: string;
  path_id: string;
  name: string;
  description: string;
  order_index: number;
  xp_reward: number;
  icon: string;
}

interface DbLesson {
  id: string;
  unit_id: string;
  name: string;
  description: string;
  order_index: number;
  lesson_type: string;
  xp_reward: number;
  estimated_minutes: number;
}

function getLessonTypeIcon(type: string) {
  switch (type) {
    case 'tutorial': return '📖';
    case 'practice': return '✏️';
    case 'challenge': return '⚡';
    case 'boss_round': return '👑';
    case 'story': return '📜';
    default: return '📝';
  }
}

// Current UX model (matches the previous hardcoded behavior): paths 1-5
// are effectively unlocked for free users, paths 6+ are locked until the
// subscription / progress logic lands. Derive this from order_index instead
// of trusting the raw is_locked column so we don't regress the UX against
// the current seed data (where only Foundations has is_locked=false).
function isEffectivelyLocked(path: DbPath): boolean {
  return path.order_index > 5;
}

export default function LearnPage() {
  const [paths, setPaths] = useState<DbPath[] | null>(null);
  const [pathsError, setPathsError] = useState<string | null>(null);

  const [unitsByPath, setUnitsByPath] = useState<Record<string, DbUnit[]>>({});
  const [lessonsByUnit, setLessonsByUnit] = useState<Record<string, DbLesson[]>>({});

  const [loadingUnitsForPath, setLoadingUnitsForPath] = useState<string | null>(null);
  const [loadingLessonsForUnit, setLoadingLessonsForUnit] = useState<string | null>(null);

  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  // Fetch the full path list on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/paths', { cache: 'no-store' });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setPaths(Array.isArray(data?.paths) ? data.paths : []);

        // Auto-expand the first unlocked path so users aren't staring at a
        // blank list on first visit (matches the previous default).
        const firstUnlocked = data.paths?.find((p: DbPath) => !isEffectivelyLocked(p));
        if (firstUnlocked) setExpandedPath(firstUnlocked.id);
      } catch (e) {
        if (cancelled) return;
        setPathsError('Could not load curriculum paths. Please try again.');
        console.error('Failed to fetch paths:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch units for a path on demand, then cache
  const loadUnitsForPath = useCallback(async (pathId: string) => {
    if (unitsByPath[pathId]) return;
    setLoadingUnitsForPath(pathId);
    try {
      const res = await fetch(`/api/units?path_id=${encodeURIComponent(pathId)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      setUnitsByPath((prev) => ({ ...prev, [pathId]: Array.isArray(data?.units) ? data.units : [] }));
    } catch (e) {
      console.error('Failed to fetch units for path', pathId, e);
      setUnitsByPath((prev) => ({ ...prev, [pathId]: [] }));
    } finally {
      setLoadingUnitsForPath(null);
    }
  }, [unitsByPath]);

  // Fetch lessons for a unit on demand, then cache
  const loadLessonsForUnit = useCallback(async (unitId: string) => {
    if (lessonsByUnit[unitId]) return;
    setLoadingLessonsForUnit(unitId);
    try {
      const res = await fetch(`/api/lessons?unit_id=${encodeURIComponent(unitId)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      setLessonsByUnit((prev) => ({ ...prev, [unitId]: Array.isArray(data?.lessons) ? data.lessons : [] }));
    } catch (e) {
      console.error('Failed to fetch lessons for unit', unitId, e);
      setLessonsByUnit((prev) => ({ ...prev, [unitId]: [] }));
    } finally {
      setLoadingLessonsForUnit(null);
    }
  }, [lessonsByUnit]);

  // When a path expands, kick off the units fetch
  useEffect(() => {
    if (expandedPath) loadUnitsForPath(expandedPath);
  }, [expandedPath, loadUnitsForPath]);

  // When a unit expands, kick off the lessons fetch
  useEffect(() => {
    if (expandedUnit) loadLessonsForUnit(expandedUnit);
  }, [expandedUnit, loadLessonsForUnit]);

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

      {/* Initial loading state */}
      {!paths && !pathsError && (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full rounded-2xl p-4 bg-gray-100 dark:bg-gray-800 animate-pulse h-20"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {pathsError && (
        <div className="card text-center text-error">
          <p className="font-bold mb-2">⚠️ {pathsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm underline"
          >
            Reload
          </button>
        </div>
      )}

      {/* Paths list */}
      {paths && (
        <div className="space-y-4">
          {paths.map((path, index) => {
            const locked = isEffectivelyLocked(path);
            const isFree = path.order_index <= 5;
            const units = unitsByPath[path.id];
            const isLoadingUnits = loadingUnitsForPath === path.id && !units;

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Path Card */}
                <button
                  onClick={() => !locked && setExpandedPath(expandedPath === path.id ? null : path.id)}
                  className={`w-full text-left rounded-2xl p-4 transition-all duration-200 border-2 ${
                    locked
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
                      {locked ? '🔒' : path.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Path {path.order_index}</span>
                        {isFree && !locked && (
                          <span className="text-xs bg-success/10 text-success font-bold px-2 py-0.5 rounded-full">FREE</span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg truncate">{path.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{path.description}</p>
                    </div>
                    {!locked && (
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
                  {expandedPath === path.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-8 pt-2 space-y-2">
                        {isLoadingUnits && (
                          <div className="text-sm text-gray-400 p-2">Loading units…</div>
                        )}

                        {units && units.length === 0 && (
                          <div className="text-sm text-gray-400 italic p-2">
                            No units yet for this path. Content coming soon.
                          </div>
                        )}

                        {units && units.map((unit) => {
                          const lessons = lessonsByUnit[unit.id];
                          const isLoadingLessons = loadingLessonsForUnit === unit.id && !lessons;

                          return (
                            <div key={unit.id}>
                              <button
                                onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                                className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                              >
                                <span className="text-xl">{unit.icon}</span>
                                <span className="font-bold flex-1">{unit.name}</span>
                                {lessons && (
                                  <span className="text-xs text-gray-400">{lessons.length} lessons</span>
                                )}
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
                                      {isLoadingLessons && (
                                        <div className="text-sm text-gray-400 p-2">Loading lessons…</div>
                                      )}

                                      {lessons && lessons.length === 0 && (
                                        <div className="text-sm text-gray-400 italic p-2">
                                          No lessons yet for this unit.
                                        </div>
                                      )}

                                      {lessons && lessons.map((lesson, li) => (
                                        <Link
                                          key={lesson.id}
                                          href={`/lesson/${lesson.id}`}
                                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
                                        >
                                          <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all">
                                            {li + 1}
                                          </span>
                                          <span className="text-sm">{getLessonTypeIcon(lesson.lesson_type)}</span>
                                          <span className="text-sm font-medium flex-1">{lesson.name}</span>
                                          <span className="text-xs text-gray-400">+{lesson.xp_reward} XP</span>
                                        </Link>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
