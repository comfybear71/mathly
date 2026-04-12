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
      // Parameterized query
      const { rows: lessons } = await sql`SELECT * FROM lessons WHERE unit_id::text = ${unitId} ORDER BY order_index`;
      // Hardcoded comparison for debugging
      const { rows: allForDebug } = await sql`SELECT id, name, unit_id FROM lessons WHERE unit_id::text = ${unitId} OR unit_id = ${unitId}::uuid ORDER BY order_index`;
      console.log(`[lessons] unitId="${unitId}" len=${unitId.length} paramResult=${lessons.length} debugResult=${allForDebug.length}`);
      if (lessons.length === 0 && allForDebug.length > 0) {
        // Fallback: the ::uuid cast works but ::text doesn't for this value
        const { rows: fallback } = await sql`SELECT * FROM lessons WHERE unit_id = ${unitId}::uuid ORDER BY order_index`;
        return NextResponse.json({ lessons: fallback, _debug: { method: 'uuid_cast_fallback', unitId, paramCount: lessons.length, fallbackCount: fallback.length } });
      }
      return NextResponse.json({ lessons, _debug: { method: 'text_cast', unitId, count: lessons.length, debugCount: allForDebug.length } });
    }

    return NextResponse.json({ error: 'Provide id or unit_id' }, { status: 400 });
  } catch (error) {
    console.error('Lessons API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
