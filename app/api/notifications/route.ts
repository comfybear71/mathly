import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows } = await sql`
      SELECT * FROM notifications WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC LIMIT 50
    `;

    return NextResponse.json({ notifications: rows });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, notificationId } = await request.json();

    if (action === 'read_all') {
      await sql`UPDATE notifications SET read = true WHERE user_id = ${session.user.id} AND read = false`;
    } else if (action === 'read' && notificationId) {
      await sql`UPDATE notifications SET read = true WHERE id = ${notificationId} AND user_id = ${session.user.id}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
