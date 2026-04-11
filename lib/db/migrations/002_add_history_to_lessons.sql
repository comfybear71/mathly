-- Migration 002: Add history/origin fields to lessons
-- Date: 2026-04-11
-- Branch: claude/logarithms-pilot-lesson
-- Purpose: Support the "Story" tab alongside "Practice" in lessons
--          (per Grok content template for historical math context)
--
-- Safety: Fully additive. No DROPs. Idempotent via IF NOT EXISTS.
-- Run in Neon SQL editor.

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS history_intro JSONB DEFAULT NULL;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS origin_year INTEGER DEFAULT NULL;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS origin_figure TEXT DEFAULT NULL;

-- history_intro JSONB shape (flexible — not enforced at DB level):
-- {
--   "hook": string,              -- one-line "why it matters"
--   "inventor": {                -- primary figure
--     "name": string,
--     "birth_year": number,
--     "death_year": number,
--     "nationality": string,
--     "bio": string
--   },
--   "year_invented": number,
--   "etymology": {
--     "word": string,
--     "from": string,            -- language
--     "parts": [{ "root": string, "meaning": string }]
--   },
--   "story_paragraphs": string[],
--   "key_contributors": [{ "name": string, "contribution": string }],
--   "real_world_applications": [{ "name": string, "icon": string, "description": string }],
--   "image": {
--     "url": string | null,
--     "alt": string,
--     "attribution": string,
--     "source_url": string
--   }
-- }
