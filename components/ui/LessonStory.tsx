'use client';

import { motion } from 'framer-motion';
import type { LessonHistoryIntro } from '@/lib/types';

interface LessonStoryProps {
  history: LessonHistoryIntro;
  lessonName: string;
  onContinue: () => void;
  continueLabel?: string;
}

export default function LessonStory({
  history,
  lessonName,
  onContinue,
  continueLabel = 'Start Practice',
}: LessonStoryProps) {
  const {
    hook,
    inventor,
    year_invented,
    etymology,
    story_paragraphs,
    key_contributors,
    real_world_applications,
    image,
  } = history;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">The Story Of</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gradient">{lessonName}</h1>
        {year_invented && (
          <p className="text-sm text-gray-500 mt-2">
            Born {year_invented}
            {inventor?.name && ` • ${inventor.name}`}
          </p>
        )}
      </motion.div>

      {/* Hook */}
      {hook && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card border-l-4 border-primary"
        >
          <p className="text-lg font-semibold italic text-gray-700 dark:text-gray-200 leading-relaxed">
            “{hook}”
          </p>
        </motion.div>
      )}

      {/* Inventor spotlight */}
      {inventor && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl shrink-0">
              👤
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-extrabold">{inventor.name}</h3>
              {(inventor.birth_year || inventor.death_year || inventor.nationality) && (
                <p className="text-xs text-gray-500 mb-2">
                  {inventor.nationality && `${inventor.nationality} • `}
                  {inventor.birth_year}
                  {inventor.death_year && `–${inventor.death_year}`}
                </p>
              )}
              {inventor.bio && (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {inventor.bio}
                </p>
              )}
            </div>
          </div>
          {image?.attribution && (
            <p className="text-[10px] text-gray-400 mt-3 italic">
              Image: {image.attribution}
            </p>
          )}
        </motion.div>
      )}

      {/* Story paragraphs */}
      {story_paragraphs && story_paragraphs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold uppercase text-xs tracking-wider text-gray-500">
            The Story
          </h3>
          {story_paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              {para}
            </p>
          ))}
        </motion.div>
      )}

      {/* Etymology */}
      {etymology && etymology.parts?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-secondary/5"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
            Where the word comes from
          </h3>
          <p className="font-extrabold text-lg mb-2">
            “{etymology.word}”{' '}
            <span className="text-sm font-normal text-gray-500">
              from {etymology.from}
            </span>
          </p>
          <ul className="space-y-1 text-sm">
            {etymology.parts.map((part, i) => (
              <li key={i}>
                <span className="font-bold">{part.root}</span>
                <span className="text-gray-500"> — {part.meaning}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Key contributors */}
      {key_contributors && key_contributors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Others who shaped it
          </h3>
          <div className="space-y-2">
            {key_contributors.map((c, i) => (
              <div
                key={i}
                className="card py-3"
              >
                <p className="font-bold text-sm">{c.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {c.contribution}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Real-world applications */}
      {real_world_applications && real_world_applications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Where you see it today
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {real_world_applications.map((app, i) => (
              <div
                key={i}
                className="card py-3 flex items-start gap-3"
              >
                {app.icon && (
                  <span className="text-2xl shrink-0" aria-hidden="true">
                    {app.icon}
                  </span>
                )}
                <div>
                  <p className="font-bold text-sm">{app.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {app.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="pt-4"
      >
        <button
          onClick={onContinue}
          className="w-full btn-primary text-lg py-4"
        >
          {continueLabel} →
        </button>
      </motion.div>
    </div>
  );
}
