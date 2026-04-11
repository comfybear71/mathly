import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET /api/units?path_id=<uuid> — returns units for the given path,
// ordered by order_index. Public endpoint (no auth check).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pathId = searchParams.get('path_id');

    if (!pathId) {
      return NextResponse.json({ error: 'path_id is required' }, { status: 400 });
    }

    const { rows } = await sql`
      SELECT * FROM units
      WHERE path_id = ${pathId}
      ORDER BY order_index
    `;

    return NextResponse.json(
      { units: rows },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Units API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
