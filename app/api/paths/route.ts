import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET /api/paths — returns all curriculum paths ordered by order_index.
// Public endpoint (no auth check) — the path list is not user-specific.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM curriculum_paths
      ORDER BY order_index
    `;
    return NextResponse.json(
      { paths: rows },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Paths API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
