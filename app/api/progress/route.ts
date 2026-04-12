import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { lesson_id, completed, score, xp_earned, hearts_used, time_spent_seconds } = body;

    const { rows } = await sql`
      INSERT INTO user_progress (user_id, lesson_id, completed, completed_at, score, xp_earned, hearts_used, time_spent_seconds)
      VALUES (${userId}, ${lesson_id}, ${completed}, ${completed ? new Date().toISOString() : null}, ${score}, ${xp_earned}, ${hearts_used}, ${time_spent_seconds})
      ON CONFLICT (user_id, lesson_id) DO UPDATE SET
        completed = EXCLUDED.completed,
        completed_at = EXCLUDED.completed_at,
        score = EXCLUDED.score,
        xp_earned = EXCLUDED.xp_earned,
        hearts_used = EXCLUDED.hearts_used,
        time_spent_seconds = EXCLUDED.time_spent_seconds
      RETURNING *
    `;

    if (xp_earned > 0) {
      await sql`UPDATE users SET total_xp = total_xp + ${xp_earned} WHERE id = ${userId}::uuid`;
    }

    const today = new Date().toISOString().split('T')[0];
    const { rows: streakRows } = await sql`SELECT * FROM streaks WHERE user_id = ${userId}::uuid`;

    if (streakRows[0]) {
      const streak = streakRows[0];
      const lastDate = streak.last_activity_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let newStreak = streak.current_streak;
      if (lastDate === yesterday) {
        newStreak = streak.current_streak + 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }

      await sql`
        UPDATE streaks SET
          current_streak = ${newStreak},
          longest_streak = ${Math.max(newStreak, streak.longest_streak)},
          last_activity_date = ${today}
        WHERE user_id = ${userId}::uuid
      `;
    }

    return NextResponse.json({ progress: rows[0] });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows } = await sql`SELECT * FROM user_progress WHERE user_id = ${session.user.id}::uuid`;
    return NextResponse.json({ progress: rows });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
