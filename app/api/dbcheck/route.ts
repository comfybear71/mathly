import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [dbInfo, units] = await Promise.all([
      sql`SELECT current_database() AS db, current_user AS u`,
      sql`SELECT id, name FROM units WHERE path_id = '11111111-0001-0001-0001-000000000005' ORDER BY id`,
    ]);

    const host = (() => {
      const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
      const m = url.match(/@([^/]+)\//);
      return m ? m[1] : 'unknown';
    })();

    return NextResponse.json({
      host,
      db: dbInfo.rows[0],
      algebra_ii_unit_count: units.rows.length,
      algebra_ii_units: units.rows,
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
