import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { auth } from '@/lib/auth/config';

// GET /api/admin/debug-dbinfo — diagnostic endpoint that reports
// exactly what the Vercel-side database connection sees.
//
// Gated by the ADMIN_EMAILS allowlist (same pattern as
// /api/admin/generate-lesson). Returns no secrets — only metadata
// about the DB connection and row counts for the curriculum tables.
//
// Intended purpose: when the Neon SQL editor shows one thing and
// /api/units shows another, this endpoint tells us what Vercel
// actually sees so we can compare side-by-side.
//
// Safe to merge and leave in place — read-only, no side effects.

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ALGEBRA_II_PATH_ID = '11111111-0001-0001-0001-000000000005';

export async function GET() {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes(session.user.email.toLowerCase())) {
    return NextResponse.json(
      { error: 'Forbidden — not in admin allowlist' },
      { status: 403 }
    );
  }

  // 2. Collect diagnostic info from the live DB connection
  try {
    const [
      dbInfo,
      totalPaths,
      totalUnits,
      totalLessons,
      totalQuestions,
      algebraIIUnits,
      algebraIILessons,
    ] = await Promise.all([
      sql`SELECT current_database() AS db_name, current_user AS db_user, current_schema() AS db_schema, version() AS pg_version`,
      sql`SELECT COUNT(*)::int AS count FROM curriculum_paths`,
      sql`SELECT COUNT(*)::int AS count FROM units`,
      sql`SELECT COUNT(*)::int AS count FROM lessons`,
      sql`SELECT COUNT(*)::int AS count FROM questions`,
      sql`SELECT id, name, order_index, icon FROM units WHERE path_id = ${ALGEBRA_II_PATH_ID} ORDER BY order_index, id`,
      sql`SELECT l.id, l.name, l.unit_id, u.name AS unit_name FROM lessons l JOIN units u ON u.id = l.unit_id WHERE u.path_id = ${ALGEBRA_II_PATH_ID} ORDER BY u.order_index, l.order_index`,
    ]);

    return NextResponse.json({
      server_time: new Date().toISOString(),
      connection: {
        db_name: dbInfo.rows[0]?.db_name ?? null,
        db_user: dbInfo.rows[0]?.db_user ?? null,
        db_schema: dbInfo.rows[0]?.db_schema ?? null,
        pg_version: dbInfo.rows[0]?.pg_version ?? null,
        postgres_host_env_hint:
          // Only expose the host part of POSTGRES_URL, never the password
          (() => {
            const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
            try {
              const match = url.match(/@([^/]+)\//);
              return match ? match[1] : null;
            } catch {
              return null;
            }
          })(),
      },
      totals: {
        paths: totalPaths.rows[0]?.count ?? 0,
        units: totalUnits.rows[0]?.count ?? 0,
        lessons: totalLessons.rows[0]?.count ?? 0,
        questions: totalQuestions.rows[0]?.count ?? 0,
      },
      algebra_ii: {
        path_id: ALGEBRA_II_PATH_ID,
        unit_count: algebraIIUnits.rows.length,
        units: algebraIIUnits.rows,
        lesson_count: algebraIILessons.rows.length,
        lessons: algebraIILessons.rows,
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('debug-dbinfo error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
