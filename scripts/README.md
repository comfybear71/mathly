# Mathly content generation pipeline

Scripts for generating draft lessons using the Claude API. Runs locally, outputs reviewable SQL, and never touches live data directly.

## Workflow at a glance

```
outlines/<slug>.json   →   generate-lesson.mjs   →   supabase/generated/<slug>.sql   →   (you review)   →   Neon SQL editor
```

1. Write a lesson outline as a JSON file in `outlines/`
2. Run `npm run generate-lesson outlines/<slug>.json`
3. Script calls Claude, gets back structured JSON, converts it to SQL seed
4. Script writes the SQL to `supabase/generated/<slug>.sql`
5. **You review the generated SQL in git diff** before running it
6. When you're satisfied, paste it into the Neon SQL editor and run it
7. Commit the generated SQL file so future sessions can see what was shipped

No live DB writes. No admin UI. No staging table. No runtime feature in the app. The pipeline is a code-generation tool that turns a short brief into a reviewable seed file.

## Prerequisites

- `ANTHROPIC_API_KEY` environment variable must be set (same key used by `/api/euler`)
- Node.js 18+ (already required by Next.js 14)
- Migration 002 already applied to Neon (the `history_intro` column must exist)
- The target path must already exist in `curriculum_paths` (use the UUID from the seed files)

## Outline file format

Create a JSON file at `outlines/<slug>.json` with this shape:

```json
{
  "path_name": "Algebra II",
  "path_id": "11111111-0001-0001-0001-000000000005",
  "unit_name": "Exponents & Radicals",
  "unit_description": "Master powers, roots, and notation",
  "unit_order_index": 2,
  "unit_icon": "💪",
  "unit_id": null,
  "lesson_name": "Rules of Exponents",
  "lesson_type": "tutorial",
  "brief": "Plain-language description of what the lesson should teach, including the historical story you want Claude to tell. Be specific: name the mathematicians, dates, and applications you want covered. The more context you give, the less Claude has to invent.",
  "question_count": 5
}
```

Field notes:
- `path_id` — must match an existing row in `curriculum_paths`. Find it in `supabase/seed.sql`.
- `unit_id` — set to `null` to have the script create a new unit. Or paste an existing unit UUID to add a lesson under it.
- `unit_description`, `unit_order_index`, `unit_icon` — only used when `unit_id` is null (new unit).
- `lesson_type` — one of `tutorial`, `practice`, `challenge`, `boss_round`, `story`.
- `brief` — the most important field. Claude will write what you ask for. Reference specific mathematicians, dates, and applications.
- `question_count` — how many questions to generate (3–10 recommended).

## Running the script

```bash
# Set your Anthropic key
export ANTHROPIC_API_KEY=sk-ant-...

# Generate one lesson
npm run generate-lesson outlines/rules-of-exponents.json

# Output: supabase/generated/rules-of-exponents.sql
```

The script prints the path to the generated file. Open it, read every line, and decide whether it's good enough to ship.

## Reviewing generated output

Before you run the SQL in Neon, check:

1. **Historical accuracy** — Claude sometimes invents dates or attributions. Spot-check names and years against Wikipedia.
2. **Question correctness** — verify each `correct_answer` is actually right. This is the #1 failure mode.
3. **Tone and voice** — the hook should have stakes, the story should be specific, the explanations should teach.
4. **SQL validity** — the script escapes quotes and uses `::jsonb` casts, but skim for anything weird.
5. **UUIDs** — the script generates random UUIDs. Make sure they don't collide with existing seeds (very unlikely, but check).

If the output is bad, delete the file, tweak your `brief`, and run again. Each run is a few cents of API credit.

## Promoting to live

Once you're happy with the generated SQL:

1. Open the Neon SQL editor (Vercel dashboard → Storage → Neon → Open in Console)
2. Paste the contents of the generated `.sql` file
3. Run it
4. Expected output: `INSERT 0 1` for unit (if new), `INSERT 0 1` for lesson, `INSERT 0 N` for questions
5. Refresh the live site — the lesson should appear in the Learn page under its path/unit
6. Tap through it to verify the Story view renders and the questions work

## Cost expectations

Rough estimate at Sonnet pricing:
- Single lesson (5 questions, full history_intro) ≈ 5,000 input + 5,000 output tokens ≈ a few cents per run
- One path (10 lessons) ≈ $0.50
- Full 20-path curriculum ≈ $10

Cheap. The bottleneck is human review time, not API cost.

## Safety rules

- **Never run the generated SQL in Neon without reading it first.** This is a hard rule.
- **Never pipe the script output directly to `psql`.** The whole point of the file intermediate is the review step.
- **Never commit `ANTHROPIC_API_KEY` to the repo.** The script reads it from env only.
- **Never edit `supabase/seed.sql` or `supabase/seed-logarithms.sql` via the pipeline.** Those are hand-authored canonical seeds.

## Directory structure

```
scripts/
├── README.md                          (this file)
├── generate-lesson.mjs                (the script, added in the next commit)
└── prompts/
    └── generate-lesson-system.md      (system prompt for Claude)
outlines/                              (JSON input files — you create these)
└── .gitkeep
supabase/
└── generated/                         (generated SQL output — commit these)
    └── .gitkeep
```

## Future improvements (not in this PR)

- Batch mode: `npm run generate-unit outlines/<path>.json` generates every lesson in a unit
- Dry-run mode: skip the Claude call, show the prompt that would be sent
- Automatic Wikimedia image lookup via the Commons API
- A `lesson_drafts` staging table for review inside the app instead of via git
- Cost tracking: write the token usage to a log file

All of the above are nice-to-have. For now the minimum viable pipeline is one lesson at a time, file in, file out, humans in the loop.
