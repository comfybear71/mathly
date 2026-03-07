import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || 'bronze';
    const type = searchParams.get('type') || 'weekly';

    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff)).toISOString().split('T')[0];

    if (type === 'weekly') {
      const { rows } = await sql`
        SELECT le.*,
          json_build_object('id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url, 'total_xp', u.total_xp) as user
        FROM leaderboard_entries le
        JOIN users u ON u.id = le.user_id
        WHERE le.league = ${league} AND le.week_start = ${weekStart}
        ORDER BY le.xp_earned_this_week DESC
        LIMIT 50
      `;
      return NextResponse.json({ leaderboard: rows });
    }

    const { rows } = await sql`
      SELECT id, username, display_name, avatar_url, total_xp
      FROM users ORDER BY total_xp DESC LIMIT 50
    `;
    return NextResponse.json({ leaderboard: rows });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
