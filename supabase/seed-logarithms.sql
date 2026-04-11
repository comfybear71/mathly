-- Seed data: Logarithms pilot lesson
-- Date: 2026-04-11
-- Branch: claude/logarithms-pilot-lesson
--
-- Purpose: End-to-end demo of the "Story + Practice" lesson template
--          proposed by Grok. Uses logarithms as the pilot topic since
--          the history (Napier, 1614) is rich and the applications
--          (Richter, pH, decibels) are concrete.
--
-- Placement: Creates a new unit under path 5 (Algebra II), since
--            logarithms are typically taught at that level and
--            Algebra II currently has no seeded units.
--
-- Run AFTER migration 002 has been applied (needs history_intro,
-- origin_year, origin_figure columns on lessons).
--
-- Safe to re-run: uses ON CONFLICT DO NOTHING on stable UUIDs.

-- Unit: Logarithms (under Algebra II, path 5)
INSERT INTO units (id, path_id, name, description, order_index, xp_reward, icon) VALUES
  ('22222222-0005-0001-0001-000000000001',
   '11111111-0001-0001-0001-000000000005',
   'Logarithms',
   'Turn multiplication into addition — the tool that let Kepler map the planets',
   1, 80, '📊')
ON CONFLICT (id) DO NOTHING;

-- Lesson: Why Logarithms? (tutorial + story)
INSERT INTO lessons (
  id, unit_id, name, description, order_index, lesson_type,
  xp_reward, estimated_minutes, origin_year, origin_figure, history_intro
) VALUES (
  '33333333-0005-0001-0001-000000000001',
  '22222222-0005-0001-0001-000000000001',
  'Why Logarithms?',
  'Meet John Napier, understand the problem logs solved, and learn to read a log curve',
  1,
  'tutorial',
  25,
  8,
  1614,
  'John Napier',
  '{
    "hook": "Before calculators, astronomers spent weeks multiplying huge numbers. Logarithms turned that work into simple addition — and unlocked the space age three centuries before rockets.",
    "inventor": {
      "name": "John Napier",
      "birth_year": 1550,
      "death_year": 1617,
      "nationality": "Scottish",
      "bio": "A Scottish nobleman, theologian, and self-taught mathematician who spent roughly 20 years developing logarithms to simplify the brutal calculations required by astronomers of his era. He published Mirifici Logarithmorum Canonis Descriptio (Description of the Wonderful Canon of Logarithms) in 1614."
    },
    "year_invented": 1614,
    "etymology": {
      "word": "logarithm",
      "from": "Greek",
      "parts": [
        { "root": "logos", "meaning": "ratio or proportion" },
        { "root": "arithmos", "meaning": "number" }
      ]
    },
    "story_paragraphs": [
      "In the early 1600s, astronomy was in crisis. Kepler was working out the laws of planetary motion, and doing so meant multiplying numbers with ten or fifteen digits — by hand — over and over. A single mistake could send an entire calculation back to the beginning. Astronomers were burning out.",
      "John Napier, a Scottish nobleman with a day job running his family estate, spent twenty years on a quiet side project: a way to turn multiplication into addition. His insight was that if you could match every number to a special exponent, you could replace slow multiplication with fast addition — then look up the answer in a table.",
      "When Napier published his tables in 1614, the reaction was seismic. Henry Briggs, England''s leading mathematician, walked to Edinburgh to meet him. Briggs later refined the idea into base-10 (common) logarithms, and for the next 350 years — until electronic calculators arrived in the 1970s — logarithm tables and slide rules were how humans did hard math.",
      "Today we rarely compute logs by hand, but the concept is everywhere: the Richter scale for earthquakes, the pH scale in chemistry, decibels for sound, and even the way computers measure algorithm speed. Whenever something spans many orders of magnitude, logarithms are how we make it human-readable."
    ],
    "key_contributors": [
      { "name": "Henry Briggs", "contribution": "Created common (base-10) logarithms in 1624, making them practical for everyday calculation" },
      { "name": "Jost Bürgi", "contribution": "Independently invented logarithms around the same time as Napier, but published later" },
      { "name": "Leonhard Euler", "contribution": "Formalized the natural logarithm (base e) and connected it to calculus" }
    ],
    "real_world_applications": [
      { "name": "Richter Scale", "icon": "🌍", "description": "Earthquake magnitude is measured logarithmically — a magnitude 7 quake releases 10x more energy than a magnitude 6" },
      { "name": "pH Scale", "icon": "🧪", "description": "Acidity is measured on a log scale — pH 4 is 10x more acidic than pH 5" },
      { "name": "Decibels", "icon": "🔊", "description": "Sound intensity uses decibels (a log scale) because human hearing spans 12+ orders of magnitude" },
      { "name": "Algorithm Complexity", "icon": "💻", "description": "Binary search runs in O(log n) — doubling the input only adds one more step" },
      { "name": "Compound Interest", "icon": "💰", "description": "Logs let you solve for time: how long until my investment doubles?" }
    ],
    "image": {
      "url": null,
      "alt": "Portrait of John Napier (1550-1617)",
      "attribution": "Wikimedia Commons, public domain",
      "source_url": "https://commons.wikimedia.org/wiki/File:John_Napier.jpg"
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Questions for the lesson (5 questions, tutorial-level)
INSERT INTO questions (
  id, lesson_id, question_type, difficulty, question_text, question_latex,
  options, correct_answer, explanation, hint, xp_value, order_index
) VALUES
  ('44444444-0005-0001-0001-000000000001',
   '33333333-0005-0001-0001-000000000001',
   'multiple_choice', 'easy',
   'What problem did John Napier invent logarithms to solve?',
   NULL,
   '[{"id":"a","text":"Counting sheep"},{"id":"b","text":"Turning slow multiplication into fast addition"},{"id":"c","text":"Measuring the size of triangles"},{"id":"d","text":"Predicting the weather"}]'::jsonb,
   '"b"'::jsonb,
   'Exactly! Napier wanted to replace huge, error-prone multiplications with simple additions — a breakthrough that saved astronomers years of work.',
   'Think about what astronomers in 1600 were complaining about',
   5, 1),

  ('44444444-0005-0001-0001-000000000002',
   '33333333-0005-0001-0001-000000000001',
   'multiple_choice', 'easy',
   'Using the rule log(a × b) = log(a) + log(b), what is log(10 × 100)?',
   'log(10 \times 100) = ?',
   '[{"id":"a","text":"log(10) + log(100) = 1 + 2 = 3"},{"id":"b","text":"log(10) × log(100) = 1 × 2 = 2"},{"id":"c","text":"log(10) - log(100) = 1 - 2 = -1"},{"id":"d","text":"log(1000) cannot be computed"}]'::jsonb,
   '"a"'::jsonb,
   'Right! log(10) = 1 and log(100) = 2, so log(10 × 100) = 1 + 2 = 3. And 10^3 = 1000, which is 10 × 100. The log rule turned multiplication into addition.',
   'Logs replace multiplication with addition',
   5, 2),

  ('44444444-0005-0001-0001-000000000003',
   '33333333-0005-0001-0001-000000000001',
   'true_false', 'easy',
   'True or False: A magnitude 7 earthquake releases 10 times more energy than a magnitude 6 earthquake.',
   NULL,
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]'::jsonb,
   '"true"'::jsonb,
   'True! The Richter scale is logarithmic — each whole number represents a 10x increase in amplitude. That is why logs are so useful for things that span huge ranges.',
   'Each step on the Richter scale is a power of 10',
   5, 3),

  ('44444444-0005-0001-0001-000000000004',
   '33333333-0005-0001-0001-000000000001',
   'fill_in_blank', 'easy',
   'What is log₁₀(1000)? (Type just the number)',
   'log_{10}(1000) = ?',
   NULL,
   '"3"'::jsonb,
   'Correct! log₁₀(1000) = 3 because 10³ = 1000. A logarithm asks "what power do I raise the base to?"',
   '10 to what power equals 1000?',
   5, 4),

  ('44444444-0005-0001-0001-000000000005',
   '33333333-0005-0001-0001-000000000001',
   'multiple_choice', 'easy',
   'Why are logarithms still useful today, even with calculators?',
   NULL,
   '[{"id":"a","text":"They are a tradition mathematicians are reluctant to give up"},{"id":"b","text":"They compress huge ranges into readable scales (Richter, pH, decibels)"},{"id":"c","text":"They are faster than a calculator"},{"id":"d","text":"Calculators cannot compute them"}]'::jsonb,
   '"b"'::jsonb,
   'Exactly! Logs let us measure things that span many orders of magnitude on a single human-friendly scale. Earthquakes, sound, acidity, and algorithm speed all use log scales.',
   'Think about what "orders of magnitude" means',
   5, 5)
ON CONFLICT (id) DO NOTHING;
