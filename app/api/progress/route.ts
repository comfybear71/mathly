import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lesson_id, completed, score, xp_earned, hearts_used, time_spent_seconds } = body;

    // Save progress
    const { data: progress, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        score,
        xp_earned,
        hearts_used,
        time_spent_seconds,
      }, { onConflict: 'user_id,lesson_id' })
      .select()
      .single();

    if (error) throw error;

    // Update user XP
    if (xp_earned > 0) {
      await supabase.rpc('increment_xp', { user_id: user.id, xp_amount: xp_earned });
    }

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const { data: streak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (streak) {
      const lastDate = streak.last_activity_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let newStreak = streak.current_streak;
      if (lastDate === yesterday) {
        newStreak = streak.current_streak + 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }

      await supabase
        .from('streaks')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streak.longest_streak),
          last_activity_date: today,
        })
        .eq('user_id', user.id);
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id);

    return NextResponse.json({ progress: progress || [] });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
