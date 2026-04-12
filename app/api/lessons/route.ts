import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('id');
    const unitId = searchParams.get('unit_id');

    if (lessonId) {
      const { rows: lessons } = await sql`SELECT * FROM lessons WHERE id::text = ${lessonId}`;
      const { rows: questions } = await sql`SELECT * FROM questions WHERE lesson_id::text = ${lessonId} ORDER BY order_index`;
      return NextResponse.json({ lesson: lessons[0] || null, questions });
    }

    if (unitId) {
      const { rows: lessons } = await sql`SELECT * FROM lessons WHERE unit_id::text = ${unitId} ORDER BY order_index`;
      return NextResponse.json({ lessons });
    }

    return NextResponse.json({ error: 'Provide id or unit_id' }, { status: 400 });
  } catch (error) {
    console.error('Lessons API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
