import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('id');
    const unitId = searchParams.get('unit_id');

    
    const supabase = createServerClient();

    if (lessonId) {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');

      return NextResponse.json({ lesson, questions: questions || [] });
    }

    if (unitId) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('unit_id', unitId)
        .order('order_index');

      return NextResponse.json({ lessons: lessons || [] });
    }

    return NextResponse.json({ error: 'Provide id or unit_id' }, { status: 400 });
  } catch (error) {
    console.error('Lessons API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
