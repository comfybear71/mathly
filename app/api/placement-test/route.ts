import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, level, score, startPath } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Update user with placement test results
    await sql`
      UPDATE users SET
        placement_test_completed = true,
        level = ${getLevelNumber(level)},
        onboarding_completed = true
      WHERE id::text = ${userId}
    `;

    return NextResponse.json({ success: true, level, score, startPath });
  } catch (error) {
    console.error('Placement test error:', error);
    return NextResponse.json({ error: 'Failed to save placement test results' }, { status: 500 });
  }
}

function getLevelNumber(level: string): number {
  switch (level) {
    case 'expert': return 10;
    case 'advanced': return 7;
    case 'intermediate': return 4;
    default: return 1;
  }
}
