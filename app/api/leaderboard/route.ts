import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || 'bronze';
    const type = searchParams.get('type') || 'weekly';

    
    const supabase = createServerClient();

    // Get current week start (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff)).toISOString().split('T')[0];

    if (type === 'weekly') {
      const { data } = await supabase
        .from('leaderboard_entries')
        .select('*, user:users(id, username, display_name, avatar_url, total_xp)')
        .eq('league', league)
        .eq('week_start', weekStart)
        .order('xp_earned_this_week', { ascending: false })
        .limit(50);

      return NextResponse.json({ leaderboard: data || [] });
    }

    // All-time
    const { data } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url, total_xp')
      .order('total_xp', { ascending: false })
      .limit(50);

    return NextResponse.json({ leaderboard: data || [] });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
