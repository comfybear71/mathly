'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface Path {
  id: string;
  name: string;
  order_index: number;
  icon: string;
}

interface GenerateResult {
  sql: string;
  lesson_name: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
}

const LESSON_TYPES = ['tutorial', 'practice', 'challenge', 'boss_round', 'story'] as const;

export default function AdminGenerateLessonPage() {
  const { status } = useSession();

  // Form state
  const [paths, setPaths] = useState<Path[]>([]);
  const [pathId, setPathId] = useState('');
  const [unitName, setUnitName] = useState('');
  const [unitDescription, setUnitDescription] = useState('');
  const [unitOrderIndex, setUnitOrderIndex] = useState('1');
  const [unitIcon, setUnitIcon] = useState('📖');
  const [lessonName, setLessonName] = useState('');
  const [lessonType, setLessonType] = useState<string>('tutorial');
  const [questionCount, setQuestionCount] = useState('5');
  const [brief, setBrief] = useState('');

  // Submit state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorRaw, setErrorRaw] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch the path list so the dropdown is populated from DB
  useEffect(() => {
    fetch('/api/paths')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.paths)) setPaths(data.paths);
      })
      .catch((e) => console.error('Failed to load paths:', e));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrorRaw(null);
    setResult(null);
    setCopied(false);

    const path = paths.find((p) => p.id === pathId);
    if (!path) {
      setError('Please select a path');
      setLoading(false);
      return;
    }

    if (brief.trim().length < 50) {
      setError('Brief is too short — aim for at least a paragraph describing the topic, historical figures, dates, and applications you want covered');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path_name: path.name,
          path_id: path.id,
          unit_name: unitName,
          unit_description: unitDescription || undefined,
          unit_order_index: unitOrderIndex ? Number(unitOrderIndex) : undefined,
          unit_icon: unitIcon || undefined,
          unit_id: null,
          lesson_name: lessonName,
          lesson_type: lessonType,
          question_count: Number(questionCount),
          brief,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || `Request failed with status ${res.status}`);
        if (data?.raw) setErrorRaw(data.raw);
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setError('Could not copy to clipboard. Select the text manually.');
    }
  };

  // Loading while session resolves
  if (status === 'loading') {
    return <div className="max-w-2xl mx-auto p-6 text-center text-gray-500">Loading...</div>;
  }

  // Not logged in at all
  if (status !== 'authenticated') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-extrabold mb-2">Admin area</h1>
        <p className="text-gray-500 mb-6">You must be signed in as an admin to use this page.</p>
        <a href="/login" className="btn-primary inline-block">Sign in</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase text-gray-400">Admin</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Generate Lesson</h1>
        <p className="text-gray-500 mb-6">
          Fill in the outline, click Generate, review the SQL, copy it, then paste into the Neon SQL editor.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {/* Path dropdown */}
        <div>
          <label className="block text-sm font-bold mb-1">Path *</label>
          <select
            value={pathId}
            onChange={(e) => setPathId(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Select a path...</option>
            {paths.map((p) => (
              <option key={p.id} value={p.id}>
                {p.icon} Path {p.order_index}: {p.name}
              </option>
            ))}
          </select>
          {paths.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">Loading paths from database...</p>
          )}
        </div>

        {/* Unit row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold mb-1">Unit name *</label>
            <input
              type="text"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              required
              placeholder="e.g., Exponents & Radicals"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Unit icon</label>
            <input
              type="text"
              value={unitIcon}
              onChange={(e) => setUnitIcon(e.target.value)}
              placeholder="📖"
              maxLength={4}
              className="input-field text-center text-xl"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Unit description (optional)</label>
          <input
            type="text"
            value={unitDescription}
            onChange={(e) => setUnitDescription(e.target.value)}
            placeholder="Short tagline shown under the unit title"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Unit order (optional)</label>
          <input
            type="number"
            value={unitOrderIndex}
            onChange={(e) => setUnitOrderIndex(e.target.value)}
            min={1}
            className="input-field"
          />
        </div>

        {/* Lesson row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Lesson name *</label>
            <input
              type="text"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              required
              placeholder="e.g., Rules of Exponents"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Lesson type</label>
            <select
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value)}
              className="input-field"
            >
              {LESSON_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Number of questions</label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            min={1}
            max={20}
            className="input-field"
          />
          <p className="text-xs text-gray-400 mt-1">Between 1 and 20. 5 is a good default.</p>
        </div>

        {/* Brief */}
        <div>
          <label className="block text-sm font-bold mb-1">Brief *</label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            required
            rows={10}
            placeholder="Describe the topic, historical figures (with dates and publications), specific rules to teach, applications, and any question ideas. The more specific the brief, the less Claude has to invent."
            className="input-field font-mono text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            {brief.length} characters (aim for 200+ for good results)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-lg"
        >
          {loading ? 'Generating... (this takes 20–40 seconds)' : 'Generate Lesson'}
        </button>
      </form>

      {/* Error panel */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card border-2 border-error bg-error/5 mb-6"
        >
          <p className="font-bold text-error mb-1">❌ Generation failed</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{error}</p>
          {errorRaw && (
            <details className="mt-3">
              <summary className="text-xs text-gray-500 cursor-pointer">Show raw response</summary>
              <pre className="mt-2 text-xs bg-gray-900 text-gray-100 rounded-lg p-3 overflow-auto max-h-60 whitespace-pre-wrap">
                {errorRaw}
              </pre>
            </details>
          )}
        </motion.div>
      )}

      {/* Result panel */}
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card border-2 border-success"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-extrabold truncate">✅ Generated: {result.lesson_name}</h2>
              {result.usage && (
                <p className="text-xs text-gray-500">
                  Tokens — in: {result.usage.input_tokens ?? '?'}, out: {result.usage.output_tokens ?? '?'}
                </p>
              )}
            </div>
            <button
              onClick={handleCopy}
              className={copied ? 'btn-secondary' : 'btn-primary'}
            >
              {copied ? '✅ Copied!' : '📋 Copy SQL'}
            </button>
          </div>

          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-96 font-mono whitespace-pre-wrap">
            {result.sql}
          </pre>

          <div className="mt-4 p-3 bg-secondary/10 rounded-lg text-sm">
            <p className="font-bold mb-2">Next steps:</p>
            <ol className="list-decimal ml-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Review the SQL above for accuracy (dates, names, question answers)</li>
              <li>Tap <strong>📋 Copy SQL</strong></li>
              <li>
                Open{' '}
                <a
                  href="https://console.neon.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Neon Console
                </a>{' '}
                → SQL Editor
              </li>
              <li>Paste and run</li>
              <li>
                Refresh{' '}
                <a href="/learn" className="underline text-primary">
                  /learn
                </a>{' '}
                to see the new lesson
              </li>
            </ol>
          </div>
        </motion.div>
      )}
    </div>
  );
}
