import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getUserReferralCode, getReferralStats, createReferral, getUserByReferralCode } from '@/lib/db/database';

// GET: Get referral code + stats
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [referralCode, stats] = await Promise.all([
      getUserReferralCode(session.user.id),
      getReferralStats(session.user.id),
    ]);

    return NextResponse.json({ referralCode, ...stats });
  } catch (error) {
    console.error('Referral API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Apply a referral code
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: 'Referral code required' }, { status: 400 });
    }

    const referrer = await getUserByReferralCode(code.toUpperCase());
    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    if (referrer.id === session.user.id) {
      return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 });
    }

    const referral = await createReferral(referrer.id, session.user.id);
    if (!referral) {
      return NextResponse.json({ error: 'Already referred' }, { status: 409 });
    }

    return NextResponse.json({ success: true, referral });
  } catch (error) {
    console.error('Referral POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
