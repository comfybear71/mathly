# HANDOFF.md - Mathly Project Status & Handoff

## Project Overview
Mathly is a gamified mathematics learning PWA ("Duolingo for math") covering 20 paths from counting to unsolved problems. Built with Next.js 14.2, Neon Postgres, NextAuth.js, Stripe, and Anthropic Claude AI.

**Repository**: comfybear71/mathly
**Hosting**: Vercel
**Branch**: master

## Commit History (Chronological)

1. **`4a35b96`** — Initial build: full PWA with gamification, 20 curriculum paths, Duolingo-style UI
2. **`d530924`** — Fix Vercel deployment: gracefully handle missing env vars
3. **`2286d2d`** — Trigger redeploy with env var fixes
4. **`77cd73c`** — **Major migration**: Switched from Supabase to Neon (Vercel Postgres) + NextAuth.js
5. **`d78d4b1`** — Added math placement test for new users (adaptive difficulty)
6. **`ef4340c`** — Added data hydration (DataProvider/Zustand), sound effects (Web Audio API), referral system, sign out
7. **`8f7b5f6`** — Wired pricing page buttons to Stripe checkout flow
8. **`7d39800`** — Surfaced actual Stripe error messages to help debug checkout issues

## Current State (What Works)

### Fully Implemented
- Landing page with marketing content, feature showcase, curriculum preview, pricing tiers
- User registration (email/password with bcrypt + Google OAuth)
- Login/logout with NextAuth.js JWT sessions
- Math placement test (4 difficulty tiers, 20 client-side questions)
- Full database schema with 20+ tables (users, curriculum, progress, hearts, streaks, gems, etc.)
- Seed data for 20 curriculum paths, first 2 paths with units, first 3 units with lessons/questions
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

### Partially Implemented
- **Euler's Mind AI chat**: API route works, UI exists, but requires ANTHROPIC_API_KEY and user must have `ai_agent_unlocked = true`
- **Stripe payments**: Checkout flow works, but requires full Stripe configuration (secret key, publishable key, webhook secret, 4 price IDs)
- **Lesson flow**: The lesson page (`/lesson/[id]`) exists but only 3 lessons have seeded questions; remaining paths/units/lessons have no content

## Known Issues & Technical Debt

### Critical
1. **Incomplete curriculum content**: Only 15 questions across 3 lessons are seeded. Paths 3-20 have no units, lessons, or questions. The app will show empty content for most of the curriculum.
2. **No content generation pipeline**: There is no system to auto-generate or bulk-import lesson content and questions for the remaining 17+ paths.

### Moderate
3. **Stripe API version mismatch**: `lib/stripe/client.ts` uses API version `2026-02-25.clover` while `app/api/subscriptions/webhook/route.ts` creates its own Stripe client with `2025-12-18.acacia`. Should use the shared client.
4. **Font variable naming**: Root layout assigns `--font-nunito` and `--font-source-sans` CSS variables to Geist font files — misleading naming.
5. **PWA icons likely missing**: `manifest.json` references 8 icon sizes in `/icons/` but these PNG files may not exist in `public/icons/`.
6. **Legacy Supabase directory**: `supabase/migrations/001_initial_schema.sql` is outdated (references Supabase auth). Active schema is `lib/db/schema.sql`.
7. **No middleware/route protection**: There is no Next.js middleware to redirect unauthenticated users. Auth is checked per-API-route only.
8. **No email verification**: Signup accepts any email without verification.
9. **Footer copyright year**: Landing page shows "2024" — should be dynamic or updated.

### Minor
10. **No tests**: Zero test files. No unit, integration, or e2e tests.
11. **XP boost items**: Shop sells "Double XP" items but there's no logic to actually apply the XP multiplier.
12. **Streak freeze logic**: Streak freezes can be purchased but the auto-application logic when a day is missed is not implemented.
13. **AI unlock trigger**: No code to detect when all 20 paths are completed and set `ai_agent_unlocked = true`.
14. **Leaderboard weekly reset**: No cron/scheduled function to create weekly leaderboard entries or handle promotions/demotions.
15. **Heart refill timer**: Hearts table has `last_refill_at` but no automatic refill logic (e.g., 1 heart per 4 hours).
16. **Notification creation**: Notification table exists and can be read, but no code generates notifications (e.g., friend requests, achievements earned).
17. **Family plan member management**: Database tables exist (`family_subscriptions`, `family_members`) but no UI or API for inviting/managing family members.

## Architecture Decisions

- **Supabase → Neon migration**: Done to simplify deployment on Vercel. Neon is auto-configured when linked in Vercel dashboard. All auth moved to NextAuth.js.
- **JWT sessions**: Chosen over database sessions for simplicity with Vercel serverless.
- **Web Audio API for sounds**: No audio files needed, sounds are synthesized in the browser.
- **Zustand over React Context**: Simpler API, no provider nesting hell, good for cross-component state.
- **Client-side placement test**: Questions are hardcoded in the component — no DB dependency for the placement flow.

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
3. Run `supabase/seed.sql` to populate curriculum paths, units, lessons, questions, achievements, and shop items

## Next Steps (Recommended Priority)

### P0 — Content
1. Generate questions and lessons for all 20 curriculum paths (this is the biggest gap)
2. Build a content management system or script to bulk-import curriculum data

### P1 — Core Features
3. Add Next.js middleware for route protection (redirect to /login if unauthenticated)
4. Implement AI unlock trigger when all paths are completed
5. Add heart refill timer logic (1 heart per 4 hours for free users)
6. Implement streak freeze auto-application
7. Wire up achievement granting when conditions are met

### P2 — Polish
8. Fix Stripe API version mismatch (use shared client everywhere)
9. Add PWA icons to `public/icons/`
10. Create notification generation (friend requests, achievements, streak reminders)
11. Build family plan member management UI
12. Add email verification flow
13. Implement XP boost multiplier logic
14. Add weekly leaderboard reset (Vercel cron or similar)

### P3 — Quality
15. Add tests (at minimum: API route tests, auth flow, progress tracking)
16. Clean up legacy `supabase/` directory
17. Fix font variable naming
18. Add error boundaries and loading states throughout

## Key Files Quick Reference

| Purpose | File |
|---------|------|
| DB schema | `lib/db/schema.sql` |
| All DB queries | `lib/db/database.ts` |
| Auth config | `lib/auth/config.ts` |
| Stripe config | `lib/stripe/client.ts` |
| AI config | `lib/anthropic/client.ts` |
| Types | `lib/types.ts` |
| State store | `store/useStore.ts` |
| Seed data | `supabase/seed.sql` |
| Env vars | `.env.local.example` |
| PWA manifest | `public/manifest.json` |
