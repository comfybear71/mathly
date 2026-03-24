# CLAUDE.md - Mathly Project Guide

## What is Mathly?
Mathly is a gamified mathematics learning PWA (Progressive Web App) — think "Duolingo for math." It covers 20 curriculum paths from basic counting to topology and unsolved problems, with a Duolingo-style gamification layer (XP, hearts, streaks, leagues, achievements, gems, shop).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript |
| Database | Neon (Vercel Postgres) via `@vercel/postgres` |
| Auth | NextAuth.js v5 beta (JWT strategy, Credentials + Google providers) |
| Payments | Stripe (checkout sessions, webhooks for subscriptions) |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) — powers "Euler's Mind" AI tutor |
| State | Zustand (client-side store) |
| Styling | Tailwind CSS with custom theme |
| Animation | Framer Motion |
| Math rendering | KaTeX |
| PWA | next-pwa (service worker, manifest) |
| Hosting | Vercel |
| Fonts | Geist (local woff files) |

## Project Structure

```
mathly/
├── app/
│   ├── layout.tsx              # Root layout (SessionProvider, fonts, metadata)
│   ├── page.tsx                # Landing page (marketing, pricing preview)
│   ├── globals.css             # Tailwind + custom styles
│   ├── onboarding/page.tsx     # Post-signup onboarding flow
│   ├── placement-test/page.tsx # Math placement test (client-side questions)
│   ├── (auth)/                 # Auth route group
│   │   ├── layout.tsx          # Auth layout (force-dynamic)
│   │   ├── login/page.tsx      # Login form (credentials + Google)
│   │   └── signup/page.tsx     # Signup form (with referral code)
│   ├── (app)/                  # Authenticated app route group
│   │   ├── layout.tsx          # App layout (Navbar, TopBar, DataProvider)
│   │   ├── home/page.tsx       # Dashboard / home screen
│   │   ├── learn/page.tsx      # Curriculum paths view
│   │   ├── lesson/[id]/page.tsx # Individual lesson (questions, progress)
│   │   ├── euler/page.tsx      # AI chat (Euler's Mind)
│   │   ├── leaderboard/page.tsx
│   │   ├── achievements/page.tsx
│   │   ├── friends/page.tsx
│   │   ├── shop/page.tsx
│   │   ├── pricing/page.tsx    # Stripe checkout integration
│   │   ├── settings/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── profile/[username]/page.tsx
│   └── api/
│       ├── auth/callback/route.ts     # Legacy redirect to /home
│       ├── auth/signup/route.ts       # Email/password signup + referral
│       ├── euler/route.ts             # Anthropic Claude AI chat endpoint
│       ├── friends/route.ts           # Friend requests (GET list, POST send/accept/decline)
│       ├── leaderboard/route.ts       # Weekly/all-time leaderboard
│       ├── lessons/route.ts           # GET lesson by id or unit_id (with questions)
│       ├── me/route.ts               # GET current user + hearts + streak + gems
│       ├── notifications/route.ts     # GET list, PATCH read/read_all
│       ├── placement-test/route.ts    # POST save placement results
│       ├── progress/route.ts          # GET/POST user progress (updates XP + streak)
│       ├── referrals/route.ts         # GET code+stats, POST apply referral
│       ├── shop/route.ts             # GET items, POST purchase (gems)
│       ├── subscriptions/route.ts     # POST create Stripe checkout session
│       └── subscriptions/webhook/route.ts # Stripe webhook handler
├── components/
│   ├── mascot/EulerMascot.tsx  # SVG robot mascot with states (happy, sad, thinking, etc.)
│   ├── providers/
│   │   ├── DataProvider.tsx    # Hydrates Zustand store from /api/me on auth
│   │   └── SessionProvider.tsx # NextAuth SessionProvider wrapper
│   ├── shared/
│   │   ├── Navbar.tsx          # Side nav (desktop) / bottom nav (mobile)
│   │   └── TopBar.tsx          # Top bar with hearts, streak, gems, XP
│   └── ui/
│       ├── Button.tsx          # Reusable button (primary, secondary, outline, ghost)
│       ├── Confetti.tsx        # Celebration confetti animation
│       ├── HeartsDisplay.tsx   # Hearts indicator
│       ├── ProgressBar.tsx     # Progress bar with animation
│       └── XPPopup.tsx         # XP earned popup
├── lib/
│   ├── anthropic/client.ts     # Anthropic SDK singleton + Euler system prompt
│   ├── auth/config.ts          # NextAuth config (Credentials + Google, JWT callbacks)
│   ├── db/
│   │   ├── index.ts            # @vercel/postgres query helper
│   │   ├── database.ts         # All DB functions (users, progress, hearts, etc.)
│   │   └── schema.sql          # Full Neon/Postgres schema (run in SQL editor)
│   ├── sounds.ts               # Web Audio API synthesized sounds (no audio files)
│   ├── stripe/client.ts        # Stripe singleton + PLANS pricing config
│   └── types.ts                # TypeScript types, interfaces, level/XP formulas
├── store/
│   └── useStore.ts             # Zustand store (user, hearts, streak, gems, paths, etc.)
├── supabase/
│   ├── migrations/001_initial_schema.sql # Original Supabase schema (legacy)
│   └── seed.sql                # Seed data: 20 paths, units, lessons, questions, achievements, shop
├── public/
│   └── manifest.json           # PWA manifest
├── next.config.mjs             # Next.js config with optional PWA wrapping
├── tailwind.config.ts          # Tailwind with custom colors, animations
├── vercel.json                 # Vercel framework config
├── .env.local.example          # All required environment variables
└── package.json
```

## Database

### Engine
Neon (Vercel Postgres). Originally built on Supabase, migrated to Neon + NextAuth in commit `77cd73c`.

### Schema (lib/db/schema.sql)
Run the full SQL in the Neon SQL editor to initialize. Key tables:
- **users** — profile, XP, level, subscription, referral_code, placement_test_completed
- **curriculum_paths** — 20 ordered math paths with prerequisites (linear chain)
- **units** — sections within paths
- **lessons** — individual lessons (types: tutorial, practice, challenge, boss_round, story)
- **questions** — per-lesson questions (types: multiple_choice, fill_in_blank, equation_solver, true_false, etc.)
- **user_progress** — tracks completion, score, XP, hearts used per lesson
- **user_path_progress** — percent complete per path
- **hearts** — 5 max, refill over time, unlimited for subscribers
- **streaks** — current/longest streak, streak freezes
- **gems** — virtual currency for shop purchases
- **leaderboard_entries** — weekly league system (bronze through diamond)
- **achievements** — 22 seeded achievements (common to legendary)
- **friendships** — friend requests and accepted connections
- **notifications** — in-app notification system
- **ai_conversations** — stored Euler AI chat history
- **shop_items** — 10 seeded items (streak freeze, heart refill, XP boosts, cosmetics)
- **referrals** — referral tracking with gem rewards (100 to referrer, 50 to referred)
- **family_subscriptions / family_members** — family plan support

### Seed Data (supabase/seed.sql)
- 20 curriculum paths (Foundations through Unsolved Problems)
- 15 units across first two paths
- 15 lessons across first three units
- 15 questions across first three lessons
- 22 achievements
- 10 shop items

## Authentication
- NextAuth.js v5 beta with JWT session strategy
- **Providers**: Email/password (bcryptjs hashing, 12 rounds) + Google OAuth
- On Google sign-in, auto-creates user with random username suffix
- `initializeUserRecords()` creates hearts (5), streaks (0), gems (100) for new users
- Session includes `user.id` from the database (mapped in JWT callback)
- Auth secret: `NEXTAUTH_SECRET` or `AUTH_SECRET`

## Payments (Stripe)
- **Plans**: Plus Monthly ($9.99), Plus Annual ($79.99), Family Monthly ($14.99), Family Annual ($119.99)
- POST `/api/subscriptions` creates a Stripe Checkout Session
- Webhook at `/api/subscriptions/webhook` handles `checkout.session.completed` and `customer.subscription.deleted`
- Subscribers get: all 20 paths, unlimited hearts, no ads
- Family plan sets `subscription_tier = 'family_owner'`

## AI (Euler's Mind)
- POST `/api/euler` sends messages to Anthropic Claude (claude-sonnet-4-20250514)
- Euler is unlocked when `user.ai_agent_unlocked = true` (after completing all 20 paths)
- System prompt positions Euler as an advanced math companion for unsolved problems
- Conversations stored in `ai_conversations` table

## Gamification System
- **XP**: Earned per question (5 XP) and per lesson. Level 1-20 with exponential XP curve (`100 * 1.5^(level-1)`)
- **Hearts**: 5 max, lose one on wrong answer, refill over time, unlimited for Plus subscribers
- **Streaks**: Daily activity tracking, streak freezes available in shop
- **Gems**: Virtual currency (start with 100), earn from referrals, spend in shop
- **Leagues**: Bronze through Diamond, weekly leaderboards, promotion/demotion
- **Achievements**: 22 types tracking lessons, streaks, XP, friends, league, AI unlock
- **Sound effects**: Synthesized via Web Audio API (correct ding, wrong buzz, completion fanfare, click)

## Referral System
- Each user gets a unique 6-char uppercase referral code (generated on demand)
- Referral code can be entered at signup or applied post-signup via POST `/api/referrals`
- When referred user completes placement test: referrer gets 100 gems, referred gets 50 gems
- Stats available via GET `/api/referrals`

## Placement Test
- Client-side adaptive test at `/placement-test` with questions across difficulty levels
- Determines starting level: beginner (1), intermediate (4), advanced (7), expert (10)
- Sets `placement_test_completed = true` and `onboarding_completed = true`

## Environment Variables
See `.env.local.example` for the complete list:
- **Database**: `POSTGRES_URL` + related Neon/Vercel vars (auto-configured when linked in Vercel)
- **Auth**: `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Anthropic**: `ANTHROPIC_API_KEY`
- **Stripe**: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, plus 4 price IDs
- **App**: `NEXT_PUBLIC_APP_URL`

## Build & Dev Commands
```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Key Patterns
- API routes use `auth()` from NextAuth for session checking
- All DB operations go through `lib/db/database.ts` — no direct SQL in components
- Client state managed via Zustand (`store/useStore.ts`), hydrated by `DataProvider`
- `(app)` route group provides authenticated layout with Navbar/TopBar
- `(auth)` route group uses minimal layout for login/signup
- Stripe API version mismatch: `client.ts` uses `2026-02-25.clover`, webhook uses `2025-12-18.acacia`
- Landing page (root `/`) is a marketing page; authenticated home is at `/home`

## Notes
- No test files exist in the codebase
- The `supabase/` directory contains legacy migration files from the original Supabase setup; the active schema is `lib/db/schema.sql`
- PWA icons referenced in `manifest.json` may not exist in `public/icons/`
- Only the first 2 paths have units seeded; only the first 3 units have lessons; only the first 3 lessons have questions
- Font variable names (`--font-nunito`, `--font-source-sans`) don't match the actual Geist fonts loaded
