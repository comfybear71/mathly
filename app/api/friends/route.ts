import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'friends';

    if (type === 'pending') {
      const { rows } = await sql`
        SELECT f.*,
          json_build_object('id', req.id, 'username', req.username, 'display_name', req.display_name, 'avatar_url', req.avatar_url) as requester
        FROM friendships f
        JOIN users req ON req.id = f.requester_id
        WHERE f.addressee_id = ${userId}::uuid AND f.status = 'pending'
      `;
      return NextResponse.json({ requests: rows });
    }

    const { rows } = await sql`
      SELECT f.*,
        json_build_object('id', req.id, 'username', req.username, 'display_name', req.display_name, 'avatar_url', req.avatar_url, 'total_xp', req.total_xp, 'streak_count', req.streak_count) as requester,
        json_build_object('id', addr.id, 'username', addr.username, 'display_name', addr.display_name, 'avatar_url', addr.avatar_url, 'total_xp', addr.total_xp, 'streak_count', addr.streak_count) as addressee
      FROM friendships f
      JOIN users req ON req.id = f.requester_id
      JOIN users addr ON addr.id = f.addressee_id
      WHERE (f.requester_id = ${userId}::uuid OR f.addressee_id = ${userId}::uuid) AND f.status = 'accepted'
    `;

    return NextResponse.json({ friends: rows });
  } catch (error) {
    console.error('Friends API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { action, friendshipId, username } = await request.json();

    if (action === 'send') {
      const { rows: targetRows } = await sql`SELECT id FROM users WHERE username = ${username}`;
      if (!targetRows[0]) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      await sql`INSERT INTO friendships (requester_id, addressee_id, status) VALUES (${userId}, ${targetRows[0].id}, 'pending')`;
      return NextResponse.json({ success: true });
    }

    if (action === 'accept' || action === 'decline') {
      const status = action === 'accept' ? 'accepted' : 'blocked';
      await sql`UPDATE friendships SET status = ${status} WHERE id = ${friendshipId}::uuid AND addressee_id = ${userId}::uuid`;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Friends API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
