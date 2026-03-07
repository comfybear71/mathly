import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getUser, getHearts, getStreak, getGems } from '@/lib/db/database';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [user, hearts, streak, gems] = await Promise.all([
      getUser(session.user.id),
      getHearts(session.user.id),
      getStreak(session.user.id),
      getGems(session.user.id),
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user, hearts, streak, gems });
  } catch (error) {
    console.error('Me API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
