'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/useStore';

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { setUser, setHearts, setStreak, setGems, user } = useStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !user) {
      fetch('/api/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
          if (data.hearts) setHearts(data.hearts);
          if (data.streak) setStreak(data.streak);
          if (data.gems) setGems(data.gems);

          // Apply saved referral code from Google signup
          const savedRef = localStorage.getItem('mathly_referral');
          if (savedRef) {
            localStorage.removeItem('mathly_referral');
            fetch('/api/referrals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: savedRef }),
            }).catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, [status, session, user, setUser, setHearts, setStreak, setGems]);

  return <>{children}</>;
}
