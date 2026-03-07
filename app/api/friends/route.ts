import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'friends';

    if (type === 'pending') {
      const { data } = await supabase
        .from('friendships')
        .select('*, requester:users!requester_id(id, username, display_name, avatar_url)')
        .eq('addressee_id', user.id)
        .eq('status', 'pending');

      return NextResponse.json({ requests: data || [] });
    }

    const { data } = await supabase
      .from('friendships')
      .select('*, requester:users!requester_id(id, username, display_name, avatar_url, total_xp, streak_count), addressee:users!addressee_id(id, username, display_name, avatar_url, total_xp, streak_count)')
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .eq('status', 'accepted');

    return NextResponse.json({ friends: data || [] });
  } catch (error) {
    console.error('Friends API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, friendshipId, username } = await request.json();

    if (action === 'send') {
      const { data: targetUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const { error } = await supabase.from('friendships').insert({
        requester_id: user.id,
        addressee_id: targetUser.id,
        status: 'pending',
      });

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'accept' || action === 'decline') {
      const status = action === 'accept' ? 'accepted' : 'blocked';
      await supabase
        .from('friendships')
        .update({ status })
        .eq('id', friendshipId)
        .eq('addressee_id', user.id);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Friends API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
