import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    
    const supabase = createServerClient();

    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

    if (user) {
      // Check if user profile exists
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        // Create profile for OAuth users
        const username = (user.email?.split('@')[0] || 'user') + Math.floor(Math.random() * 1000);
        await supabase.from('users').insert({
          id: user.id,
          email: user.email!,
          username,
          display_name: user.user_metadata?.full_name || username,
          avatar_url: user.user_metadata?.avatar_url || null,
        });

        await Promise.all([
          supabase.from('hearts').insert({ user_id: user.id }),
          supabase.from('streaks').insert({ user_id: user.id }),
          supabase.from('gems').insert({ user_id: user.id, balance: 100 }),
        ]);

        return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
      }
    }
  }

  return NextResponse.redirect(new URL('/home', requestUrl.origin));
}
