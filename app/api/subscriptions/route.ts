import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getStripeClient, PLANS } from '@/lib/stripe/client';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planKey, priceId: directPriceId } = await request.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured. Please add your Stripe keys in Vercel.' }, { status: 500 });
    }

    // Resolve price ID from plan key or direct price ID
    let resolvedPriceId = directPriceId;
    if (planKey && planKey in PLANS) {
      resolvedPriceId = PLANS[planKey as keyof typeof PLANS].priceId;
    }

    if (!resolvedPriceId) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const stripe = getStripeClient();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { userId: session.user.id },
      customer_email: session.user.email,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
