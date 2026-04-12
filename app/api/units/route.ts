import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/units?path_id=<uuid> — returns units for the given path,
// ordered by order_index. Public endpoint (no auth check).
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pathId = searchParams.get('path_id');

    if (!pathId) {
      return NextResponse.json({ error: 'path_id is required' }, { status: 400 });
    }

    const { rows } = await sql`
      SELECT * FROM units
      WHERE path_id = ${pathId}::uuid
      ORDER BY order_index
    `;

    console.log(`[units] path_id=${pathId} → ${rows.length} rows:`, rows.map(r => r.name));

    return NextResponse.json({ units: rows });
  } catch (error) {
    console.error('Units API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
