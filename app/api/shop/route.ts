import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM shop_items`;
    return NextResponse.json({ items: rows });
  } catch (error) {
    console.error('Shop API error:', error);
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
    const { item_id } = await request.json();

    const { rows: itemRows } = await sql`SELECT * FROM shop_items WHERE id = ${item_id}::uuid`;
    if (!itemRows[0]) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    const item = itemRows[0];

    const { rows: gemsRows } = await sql`SELECT balance FROM gems WHERE user_id = ${userId}::uuid`;
    if (!gemsRows[0] || gemsRows[0].balance < item.cost_gems) {
      return NextResponse.json({ error: 'Insufficient gems' }, { status: 400 });
    }

    await sql`UPDATE gems SET balance = balance - ${item.cost_gems} WHERE user_id = ${userId}::uuid`;

    const { rows: inventoryRows } = await sql`
      INSERT INTO user_inventory (user_id, item_id) VALUES (${userId}, ${item_id}) RETURNING *
    `;

    if (item.type === 'heart_refill') {
      await sql`UPDATE hearts SET current_hearts = 5 WHERE user_id = ${userId}::uuid`;
    } else if (item.type === 'streak_freeze') {
      await sql`UPDATE streaks SET streak_freeze_count = streak_freeze_count + 1 WHERE user_id = ${userId}::uuid`;
    }

    return NextResponse.json({ success: true, item: inventoryRows[0] });
  } catch (error) {
    console.error('Shop purchase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
