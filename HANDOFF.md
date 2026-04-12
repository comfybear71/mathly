# HANDOFF.md - Mathly Project Status & Handoff

> **Last updated**: 2026-04-12 (UUID fix finalized with `::uuid` param cast, Pre-Algebra content shipped, Foundations complete)
> **Read before** starting any new session, alongside CLAUDE.md and SAFETY-RULES.md.

## ⚠️ CRITICAL: Developer environment is iPad-only

**The project owner works exclusively from an iPad with no terminal access.** This shapes every design decision. Before proposing any tooling in a new session, read the "Developer Environment" section at the top of CLAUDE.md.

Quick summary:
- ✅ Can use: GitHub web UI, Vercel dashboard, Neon SQL editor, Safari/Chrome on iPad, copy/paste
- ❌ Cannot use: terminal, npm/node commands, local dev server, git CLI, local env vars, SSH, local editors
- 🚫 **Never propose local CLI scripts.** Redesign every workflow as: server-side API route + browser UI inside the Mathly app, or GitHub Actions triggered from the web UI.

**Known violation (resolved)**: `scripts/generate-lesson.mjs` (shipped in v0.5) requires a local terminal. Replaced by `/admin/generate-lesson` page + `/api/admin/generate-lesson` route (shipped v0.6, PR #11). CLI script remains in repo as alternative for contributors with terminals.

## Project Overview
Mathly is a gamified mathematics learning PWA ("Duolingo for math") covering 20 paths from counting to unsolved problems. Built with Next.js 14.2, Neon Postgres, NextAuth.js, Stripe, and Anthropic Claude AI.

**Repository**: comfybear71/mathly
**Hosting**: Vercel
**Default branch**: `master` (protected — ruleset "Protect Master": 0 approvals, dismiss stale, linear history, no force pushes, no deletions)
**Branch workflow**: `claude/<feature-name>` → PR → squash-merge → delete branch → tag release

## Sacred files (NEVER delete)
- `CLAUDE.md` — project brain (tech stack, architecture, patterns)
- `HANDOFF.md` — project memory (this file, updated each session)
- `SAFETY-RULES.md` — mandatory safety protocol (branch rules, fix spiral prevention, DB safety)
- `README.md` — bootstrapped Next.js readme

## Release & Tag History

| Tag | Date | Summary |
|---|---|---|
| `v0.1-2026-04-10` | 2026-04-10 | Early-stage snapshot — initial build + Supabase→Neon migration + placement test + Stripe wiring |
| `v0.2-2026-04-11` | 2026-04-11 | Safety protocol documentation — SAFETY-RULES.md + CLAUDE.md safety preamble |
| `v0.3-2026-04-11` | 2026-04-11 | Logarithms pilot lesson — Story + Practice content template |
| `v0.3.1-2026-04-11` | 2026-04-11 | HANDOFF post-pilot refresh (docs-only) |
| `v0.3.2-2026-04-11` | 2026-04-11 | Footer year fix + Vercel redeploy trigger |
| `v0.4-2026-04-11` | 2026-04-11 | Learn page DB integration — /api/paths + /api/units + dynamic Learn page |
| `v0.5-2026-04-11` | 2026-04-11 | Content generation pipeline (CLI — kept for contributors with terminals) |
| `v0.5.1-2026-04-11` | 2026-04-11 | iPad environment constraint documented |
| `v0.6-2026-04-11` | 2026-04-11 | iPad-friendly admin content generation page |
| `v0.7-2026-04-12` | 2026-04-12 | Fix DATABASE_URL env var mismatch (Neon uses DATABASE_URL, not POSTGRES_URL) |
| `v0.7.1-2026-04-12` | 2026-04-12 | Diagnostic endpoint /api/dbcheck + logging |
| `v0.7.2-2026-04-12` | 2026-04-12 | Fix UUID parameterized query bug in /api/units |
| `v0.8-2026-04-12` | 2026-04-12 | Global UUID fix (::text on all routes) + full curriculum plan |
| `v0.9.1-2026-04-12` | 2026-04-12 | Pre-Algebra content (32 lessons, 160 questions) |
| `v1.0-2026-04-12` | 2026-04-12 | Final UUID fix: switch from column::text to param::uuid across all routes |

## Pull Request History

| PR | Branch | Status |
|---|---|---|
| #1 | `claude/build-mathly-app-1myxK` → master | ✅ merged — initial build |
| #2 | `claude/update-docs-ASh8v` → master | ✅ merged — CLAUDE.md + HANDOFF.md initial docs |
| #3 | (docs update) | ✅ merged — safety protocol added to CLAUDE.md |
| #4 | `claude/add-safety-rules` | ✅ merged — SAFETY-RULES.md |
| #5 | `claude/logarithms-pilot-lesson` | ✅ merged — logarithms pilot + schema migration 002 |
| #6 | `claude/update-handoff-post-pilot` | ✅ merged — HANDOFF refresh |
| #7 | `claude/fix-footer-year` | ✅ merged — footer 2024→2026 + Vercel redeploy trigger |
| #8 | `claude/learn-page-db-integration` | ✅ merged — /api/paths + /api/units + DB-driven Learn page |
| #9 | `claude/content-generation-pipeline` | ✅ merged — CLI generator (kept for terminal users) |
| #10 | `claude/ipad-constraint-docs` | ✅ merged — iPad-only constraint documented |
| #11 | `claude/ipad-admin-content-page` | ✅ merged — browser-based admin page for lesson generation |
| #12 | `claude/use-database-url` | ✅ merged — fix DATABASE_URL env var mismatch |
| #13 | `claude/db-diagnostic` | ✅ merged — /api/dbcheck diagnostic endpoint |
| #15 | `claude/fix-units-uuid` | ✅ merged — first UUID fix (column::text) |
| #16 | `claude/post-fix-docs` | ✅ merged — documented DATABASE_URL + UUID bugs |
| #17 | `claude/uuid-fix-and-curriculum-plan` | ✅ merged — global ::text cast + curriculum plan |
| #18 | `claude/foundations-content` | ✅ merged — Foundations units 4-8 (25 lessons) |
| #19-20 | `claude/pre-algebra-content` | ✅ merged — Pre-Algebra all 7 units (32 lessons) |
| #21-22 | `claude/fix-lessons-api` | ✅ merged — dbcheck expansion + debug lessons API |
| #23 | `claude/fix-lessons-api` | ✅ merged — **FINAL UUID fix**: switch ALL from column::text to param::uuid |

## Commit History (Chronological)

1. **`4a35b96`** — Initial build: full PWA with gamification, 20 curriculum paths, Duolingo-style UI
2. **`d530924`** — Fix Vercel deployment: gracefully handle missing env vars
3. **`2286d2d`** — Trigger redeploy with env var fixes
4. **`77cd73c`** — **Major migration**: Switched from Supabase to Neon (Vercel Postgres) + NextAuth.js
5. **`d78d4b1`** — Added math placement test for new users (adaptive difficulty)
6. **`ef4340c`** — Added data hydration (DataProvider/Zustand), sound effects (Web Audio API), referral system, sign out
7. **`8f7b5f6`** — Wired pricing page buttons to Stripe checkout flow
8. **`7d39800`** — Surfaced actual Stripe error messages to help debug checkout issues
9. **PR #2 merge** — Added CLAUDE.md + HANDOFF.md initial documentation
10. **PR #3 merge** — Added safety protocol and session workflow to CLAUDE.md
11. **PR #4 merge** — Added SAFETY-RULES.md with mandatory safety protocol
12. **PR #5 merge** — Logarithms pilot lesson (schema migration 002 + seed + LessonStory component + lesson page integration)

## Current State (What Works)

### Fully Implemented
- Landing page with marketing content, feature showcase, curriculum preview, pricing tiers
- User registration (email/password with bcrypt + Google OAuth)
- Login/logout with NextAuth.js JWT sessions
- Math placement test (4 difficulty tiers, 20 client-side questions)
- Full database schema with 20+ tables (users, curriculum, progress, hearts, streaks, gems, etc.) plus migration 002 (history fields on lessons)
- Seed data for 20 curriculum paths, first 2 paths with units, first 3 units with lessons/questions, **plus the new Logarithms unit under Algebra II**
- Zustand state management with DataProvider hydration on auth
- Euler mascot (animated SVG robot with 6 emotional states)
- Sound effects via Web Audio API (correct, wrong, complete, click)
- Referral system (code generation, signup tracking, gem rewards)
- Stripe subscription checkout (Plus and Family plans, monthly/annual)
- Stripe webhook handling (subscription activated/canceled)
- API routes for: auth, me, progress, lessons, leaderboard, friends, notifications, shop, referrals, subscriptions, euler AI
- Gamification: XP/level system, hearts, streaks, gems, achievements, leagues, shop
- PWA manifest and service worker configuration
- Responsive design with Navbar (sidebar on desktop, bottom bar on mobile)
- TopBar showing hearts, streak, gems, XP
- Dark mode support (toggle in Zustand store)
- **Lesson page now fetches from DB** (via `/api/lessons?id=<id>`) with silent fallback to hardcoded DEMO_QUESTIONS
- **Story + Practice content template** shipped as a pilot (logarithms lesson with inventor spotlight, etymology, multi-paragraph story, key contributors, real-world applications)

### Partially Implemented
- **Euler's Mind AI chat**: API route works, UI exists, but requires ANTHROPIC_API_KEY and user must have `ai_agent_unlocked = true`
- **Stripe payments**: Checkout flow works, but requires full Stripe configuration (secret key, publishable key, webhook secret, 4 price IDs)
- **Lesson content**: The lesson page (`/lesson/[id]`) now works with real DB content. 5 lessons seeded (3 Foundations + 1 Logarithms + 1 Rules of Exponents). Most paths still need content generated via the admin page.
- **Content generation (iPad)**: `/admin/generate-lesson` page works end-to-end — fill form → Claude generates → copy SQL → paste in Neon → lesson appears on /learn. Auth gated by `ADMIN_EMAILS` env var.
- **Learn page**: Now fully DB-driven (PR #8). All seeded units/lessons appear automatically. No hardcoded curriculum data.

## Content Model (after pilot)

### Lesson "Story + Practice" template (NEW)
Every lesson can now optionally carry a `history_intro` JSONB blob that drives the Story tab. Shape:
```
{
  hook: string,
  inventor: { name, birth_year, death_year, nationality, bio },
  year_invented: number,
  etymology: { word, from, parts: [{root, meaning}] },
  story_paragraphs: string[],
  key_contributors: [{name, contribution}],
  real_world_applications: [{name, icon, description}],
  image: { url, alt, attribution, source_url }
}
```
Lessons without `history_intro` skip straight to the Practice view — no regression for legacy content.

**Reference lesson**: `/lesson/33333333-0005-0001-0001-000000000001` (Why Logarithms?)

### New schema columns on `lessons`
- `history_intro JSONB` — flexible blob (see above)
- `origin_year INT` — quick-sort/display year
- `origin_figure TEXT` — quick-display primary mathematician name

Migration: `lib/db/migrations/002_add_history_to_lessons.sql` — additive, `IF NOT EXISTS`, safe to re-run.

### New reusable component
- `components/ui/LessonStory.tsx` — pure presentational component that renders `history_intro` JSONB with staggered Framer Motion animations. Zero side effects, zero state, zero DB access.

## Known Issues & Technical Debt

### Critical
1. **Curriculum content progress**: Path 1 (Foundations) fully seeded — 35 lessons. Path 2 (Pre-Algebra) fully seeded — 32 lessons. Path 5 (Algebra II) has 2 lessons (Logarithms + Exponents). Paths 3, 4, 6–20 are next. Full checklist at `/docs/curriculum-plan.md` (128 units, 572 lessons total, ~67 done).

### Resolved bugs (2026-04-12 — document for prevention)

**Bug 1: DATABASE_URL vs POSTGRES_URL mismatch** (PR #12)
- **Symptom**: Newly seeded data sometimes invisible to the API despite existing in Neon
- **Root cause**: Neon's Vercel integration sets `DATABASE_URL`. `@vercel/postgres` expects `POSTGRES_URL`.
- **Fix**: `lib/db/env.ts` maps `DATABASE_URL → POSTGRES_URL` before `@vercel/postgres` loads. ALL files import `sql` from `@/lib/db` (centralized).
- **Prevention rule**: NEVER import from `@vercel/postgres` directly. Always use `@/lib/db`.

**Bug 2: UUID parameterized query — TWO rounds of fixing** (PRs #15, #17, #23)
- **Symptom**: Parameterized UUID comparisons silently returned incomplete results or empty arrays despite data existing in the DB.
- **Round 1 (PR #15)**: Tried `WHERE column::text = ${param}` — worked for `/api/units` but FAILED for `/api/lessons`. The `::text` cast on the column was unreliable across different queries.
- **Round 2 / FINAL FIX (PR #23)**: Switched to `WHERE column = ${param}::uuid` — cast the PARAMETER to UUID instead of the COLUMN to text. Proven by `/api/dbcheck` debug endpoint: `::text` returned 0 rows, `::uuid` returned 5 rows for identical data.
- **Why `::uuid` on the parameter works**: Keeps the column in native UUID type (enables index usage). Explicitly converts the incoming TEXT parameter to UUID for type-safe comparison.
- **Prevention rule**: ALWAYS use `column = ${param}::uuid` for UUID WHERE clauses. NEVER use `column::text = ${param}` (unreliable). NEVER use bare `column = ${param}` (also unreliable). See CLAUDE.md "Database Connection Rules" for the definitive pattern.
- **Diagnostic tool**: `/api/dbcheck` endpoint (PRs #13, #21) was essential for confirming data existed in the DB when the API couldn't see it. Keep it until the app is stable.

### Moderate
3. **Stripe API version mismatch**: `lib/stripe/client.ts` uses API version `2026-02-25.clover` while `app/api/subscriptions/webhook/route.ts` creates its own Stripe client with `2025-12-18.acacia`. Should use the shared client.
4. **Font variable naming**: Root layout assigns `--font-nunito` and `--font-source-sans` CSS variables to Geist font files — misleading naming.
5. **PWA icons likely missing**: `manifest.json` references 8 icon sizes in `/icons/` but these PNG files may not exist in `public/icons/`.
6. **Legacy Supabase directory**: `supabase/migrations/001_initial_schema.sql` is outdated (references Supabase auth). Active schema is `lib/db/schema.sql`. The `supabase/` directory is kept for seed files only (`seed.sql`, `seed-logarithms.sql`).
7. **No middleware/route protection**: There is no Next.js middleware to redirect unauthenticated users. Auth is checked per-API-route only.
8. **No email verification**: Signup accepts any email without verification.
9. ~~**Footer copyright year**~~: Fixed in PR #7 (2024 → 2026).
10. ~~**Learn page navigation**~~: Fixed in PR #8 — Learn page is now fully DB-driven. All seeded content appears automatically.

### Minor
11. **No tests**: Zero test files. No unit, integration, or e2e tests.
12. **XP boost items**: Shop sells "Double XP" items but there's no logic to actually apply the XP multiplier.
13. **Streak freeze logic**: Streak freezes can be purchased but the auto-application logic when a day is missed is not implemented.
14. **AI unlock trigger**: No code to detect when all 20 paths are completed and set `ai_agent_unlocked = true`.
15. **Leaderboard weekly reset**: No cron/scheduled function to create weekly leaderboard entries or handle promotions/demotions.
16. **Heart refill timer**: Hearts table has `last_refill_at` but no automatic refill logic (e.g., 1 heart per 4 hours).
17. **Notification creation**: Notification table exists and can be read, but no code generates notifications (e.g., friend requests, achievements earned).
18. **Family plan member management**: Database tables exist (`family_subscriptions`, `family_members`) but no UI or API for inviting/managing family members.
19. **No image hosting policy**: Pilot lesson has `image.url: null` with attribution only. Need to decide: `public/history/` in repo, Vercel Blob, or external CDN, before scaling historical images.
20. **No content attribution UI**: If we embed MacTutor / Wikimedia images, we need a consistent attribution footer/caption pattern.

### Deliberately deferred (YAGNI for now)
- **Age-tiered content (kids / young-adult / adult)** — Grok proposed this. Decision: skip for now, use existing `difficulty` field on questions.
- **Dedicated "History of Mathematics" path #21** — Decision: weave history into existing lessons via `history_intro`, don't create a whole new path.
- **`mathematicians` table** — Not normalized yet. Using free-text `origin_figure` + JSONB `inventor` until we see if the pattern scales.
- **Three depth modes per lesson** — overbuilding before we have one template proven.

## Architecture Decisions

- **Supabase → Neon migration**: Done to simplify deployment on Vercel. Neon is auto-configured when linked in Vercel dashboard. All auth moved to NextAuth.js.
- **JWT sessions**: Chosen over database sessions for simplicity with Vercel serverless.
- **Web Audio API for sounds**: No audio files needed, sounds are synthesized in the browser.
- **Zustand over React Context**: Simpler API, no provider nesting hell, good for cross-component state.
- **Client-side placement test**: Questions are hardcoded in the component — no DB dependency for the placement flow.
- **History content as JSONB blob, not normalized tables**: Flexibility over structure. Normalize later if the pattern proves out and we need to query across mathematicians or applications.
- **Silent fallback to demo questions**: The lesson page preserves the hardcoded `DEMO_QUESTIONS` as a fallback, so any non-UUID id (e.g., `/lesson/1`) still works as a demo. Zero regression when real DB content is missing.
- **"Story first, then Practice" flow**: Lessons with `history_intro` render the story as the landing view. Clicking "Start Practice →" switches to the question flow. This preserves the Grok template while leaving the practice UI untouched.

## Environment Setup

### Required for basic functionality
```
POSTGRES_URL=<neon-connection-string>
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Required for Google login
```
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>
```

### Required for AI (Euler's Mind)
```
ANTHROPIC_API_KEY=<from-anthropic-console>
```

### Required for payments
```
STRIPE_SECRET_KEY=<from-stripe-dashboard>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from-stripe-dashboard>
STRIPE_WEBHOOK_SECRET=<from-stripe-webhook-config>
STRIPE_PRICE_PLUS_MONTHLY=<stripe-price-id>
STRIPE_PRICE_PLUS_ANNUAL=<stripe-price-id>
STRIPE_PRICE_FAMILY_MONTHLY=<stripe-price-id>
STRIPE_PRICE_FAMILY_ANNUAL=<stripe-price-id>
```

## Database Initialization
1. Create a Neon database (or link one via Vercel dashboard)
2. Run `lib/db/schema.sql` in the Neon SQL editor to create all tables
3. Run `lib/db/migrations/002_add_history_to_lessons.sql` to add history columns (safe, additive)
4. Run `supabase/seed.sql` to populate curriculum paths, units, lessons, questions, achievements, and shop items
5. Run `supabase/seed-logarithms.sql` to insert the pilot Logarithms unit + lesson + questions

## Next Steps (Recommended Priority)

### P0 — Content scaling (admin page is shipped and working)
1. **Generate more lessons** — Use `/admin/generate-lesson` to fill out Algebra II (remaining units: complex numbers, polynomials, advanced functions), then expand to other paths. The pipeline is: fill form → generate → copy SQL → paste in Neon → lesson appears on /learn.
2. **Apply UUID text-cast fix to other API routes** — The `path_id::text = ${param}` fix was applied to `/api/units` (PR #15). Other routes that filter by UUID columns (`/api/lessons`, `/api/progress`, `/api/friends`, etc.) should be audited and fixed the same way to prevent the same bug.
3. **Remove diagnostic endpoint** — `/api/dbcheck` was built for debugging. Remove it once stable.
4. **`claude/content-policy`** — Add `CONTENT-POLICY.md` documenting approved image sources (Wikimedia, Pexels, Pixabay, Library of Congress, NASA), attribution rules, and a "link don't copy" rule for MacTutor/Mathigon.

### P1 — Core features
4. Add Next.js middleware for route protection (redirect to /login if unauthenticated)
5. Implement AI unlock trigger when all paths are completed
6. Add heart refill timer logic (1 heart per 4 hours for free users)
7. Implement streak freeze auto-application
8. Wire up achievement granting when conditions are met
9. Mathematician spotlight navigation — click the inventor card in Story view to see more lessons by that figure

### P2 — Polish
10. Fix Stripe API version mismatch (use shared client everywhere)
11. Add PWA icons to `public/icons/`
12. Create notification generation (friend requests, achievements, streak reminders)
13. Build family plan member management UI
14. Add email verification flow
15. Implement XP boost multiplier logic
16. Add weekly leaderboard reset (Vercel cron or similar)
17. Decide image hosting: `public/history/` in repo vs. Vercel Blob vs. external CDN

### P3 — Quality
18. Add tests (at minimum: API route tests, auth flow, progress tracking, LessonStory render)
19. Clean up legacy `supabase/migrations/001_initial_schema.sql`
20. Fix font variable naming
21. Add error boundaries and loading states throughout

## Key Files Quick Reference

| Purpose | File |
|---|---|
| Project guide | `CLAUDE.md` |
| Session memory (this file) | `HANDOFF.md` |
| Safety protocol | `SAFETY-RULES.md` |
| DB env var bridge (MUST import) | `lib/db/env.ts` |
| Central DB export (import sql from here) | `lib/db/index.ts` |
| All DB query functions | `lib/db/database.ts` |
| DB schema | `lib/db/schema.sql` |
| DB migrations | `lib/db/migrations/` |
| Auth config | `lib/auth/config.ts` |
| Stripe config | `lib/stripe/client.ts` |
| AI config | `lib/anthropic/client.ts` |
| Content generator prompt | `lib/content-generator/system-prompt.ts` |
| Types | `lib/types.ts` |
| State store | `store/useStore.ts` |
| Base seed data | `supabase/seed.sql` |
| Logarithms pilot seed | `supabase/seed-logarithms.sql` |
| Generated seeds | `supabase/generated/` |
| Admin content page | `app/(app)/admin/generate-lesson/page.tsx` |
| Admin content API | `app/api/admin/generate-lesson/route.ts` |
| Diagnostic endpoint | `app/api/dbcheck/route.ts` (temporary — remove when stable) |
| Lesson page (Story + Practice) | `app/(app)/lesson/[id]/page.tsx` |
| Learn page (DB-driven) | `app/(app)/learn/page.tsx` |
| Story view component | `components/ui/LessonStory.tsx` |
| Curriculum checklist | `docs/curriculum-plan.md` |
| Env vars | `.env.local.example` |
| PWA manifest | `public/manifest.json` |

## Session Log

### 2026-04-11 — Logarithms pilot session
- Added `SAFETY-RULES.md` (PR #4, v0.2-2026-04-11)
- Added safety protocol preamble to `CLAUDE.md` (PR #3)
- Built Grok research report — analyzed Grok's content strategy prompt and proposed 5 candidate work items
- Shipped `claude/logarithms-pilot-lesson` (PR #5, v0.3-2026-04-11):
  - Schema migration 002 (3 new additive columns on `lessons`)
  - New `LessonHistoryIntro` TypeScript interface
  - New `supabase/seed-logarithms.sql` with 1 unit + 1 lesson + 5 questions + full history_intro
  - New `components/ui/LessonStory.tsx` presentational component
  - Lesson page now fetches real DB content with silent fallback to demo
- Established mandatory tag-release format for every session's PR
- Deferred: age-tiered content, dedicated history path, normalized mathematicians table

### 2026-04-11/12 — Content pipeline + DB fix session
- Documented iPad-only developer environment constraint (PR #10)
- Shipped DB-driven Learn page (PR #8) — replaces 55-line hardcoded array with /api/paths + /api/units fetches
- Shipped CLI content generation pipeline (PR #9) — kept for terminal users
- Shipped iPad-friendly admin page (PR #11) — `/admin/generate-lesson` with form + Claude API + Copy SQL button
- Fixed Vercel Git integration (reconnected after branch rename broke webhook)
- Fixed footer year 2024→2026 (PR #7)
- **MAJOR BUG FIX**: DATABASE_URL vs POSTGRES_URL mismatch (PR #12):
  - Neon's Vercel integration sets `DATABASE_URL`
  - `@vercel/postgres` expects `POSTGRES_URL`
  - Fix: `lib/db/env.ts` bridges the gap; all imports centralized to `@/lib/db`
- **MAJOR BUG FIX (Round 1)**: UUID parameterized query bug (PR #15):
  - `SELECT ... WHERE path_id = ${pathId}` silently returned incomplete results
  - Initial fix: `WHERE path_id::text = ${pathId}` — worked for /api/units
- Successfully generated "Rules of Exponents" lesson via admin page
- Admin env var `ADMIN_EMAILS=sfrench71@gmail.com` configured in Vercel
- Created full curriculum plan at `/docs/curriculum-plan.md` — 128 units, 572 lessons (PR #17)
- Generated Foundations units 4-8 content: 25 lessons, 125 questions (PR #18)
- Generated Pre-Algebra all 7 units: 32 lessons, 160 questions (PRs #19-20)
- **MAJOR BUG FIX (Round 2)**: `column::text` approach proved unreliable (PR #23):
  - `/api/lessons` returned empty despite data existing — confirmed by `/api/dbcheck` showing 5 rows
  - Debug endpoint proved: `column::text = ${param}` returned 0 rows, `column = ${param}::uuid` returned 5 rows for identical data
  - **FINAL FIX**: Switched ALL queries from `column::text = ${param}` to `column = ${param}::uuid`
  - This bug took PRs #12–#23 to fully resolve. Two false fixes (no cast, then ::text) before the correct approach (::uuid on parameter) was found
  - Prevention rules updated in CLAUDE.md with the definitive pattern
