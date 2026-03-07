import { createServerClient as createSupabaseSSRClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function createServerClient() {
  const cookieStore = cookies();
  return createSupabaseSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
