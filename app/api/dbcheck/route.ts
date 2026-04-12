import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test 1: Algebra II units (known working)
    const algebraUnits = await sql`SELECT id, name FROM units WHERE path_id::text = '11111111-0001-0001-0001-000000000005' ORDER BY id`;

    // Test 2: Pre-Algebra units
    const preAlgUnits = await sql`SELECT id, name FROM units WHERE path_id::text = '11111111-0001-0001-0001-000000000002' ORDER BY order_index`;

    // Test 3: Lessons for Pre-Algebra Unit 1 (NOT working via /api/lessons)
    const unit1Lessons = await sql`SELECT id, name, unit_id FROM lessons WHERE unit_id::text = '22222222-0002-0001-0001-000000000001' ORDER BY order_index`;

    // Test 4: Lessons for Pre-Algebra Unit 4 (WORKING via /api/lessons)
    const unit4Lessons = await sql`SELECT id, name, unit_id FROM lessons WHERE unit_id::text = '22222222-0002-0001-0001-000000000004' ORDER BY order_index`;

    // Test 5: ALL lessons in Pre-Algebra (any unit under path 2)
    const allPreAlgLessons = await sql`SELECT l.id, l.name, l.unit_id, u.name AS unit_name FROM lessons l JOIN units u ON u.id::text = l.unit_id::text WHERE u.path_id::text = '11111111-0001-0001-0001-000000000002' ORDER BY u.order_index, l.order_index`;

    // Test 6: Total lesson count in DB
    const totalLessons = await sql`SELECT COUNT(*)::int AS count FROM lessons`;

    return NextResponse.json({
      algebra_ii_units: algebraUnits.rows,
      pre_algebra_units: preAlgUnits.rows,
      pre_algebra_unit1_lessons: { count: unit1Lessons.rows.length, lessons: unit1Lessons.rows },
      pre_algebra_unit4_lessons: { count: unit4Lessons.rows.length, lessons: unit4Lessons.rows },
      all_pre_algebra_lessons: { count: allPreAlgLessons.rows.length, lessons: allPreAlgLessons.rows },
      total_lessons_in_db: totalLessons.rows[0]?.count,
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
