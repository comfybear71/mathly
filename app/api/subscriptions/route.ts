import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await request.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-18.acacia' as Stripe.LatestApiVersion,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
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
