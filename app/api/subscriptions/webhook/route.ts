import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sql } from '@/lib/db';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-18.acacia' as Stripe.LatestApiVersion,
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId && session.subscription) {
        const subscriptionResponse = await stripe.subscriptions.retrieve(session.subscription as string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = subscriptionResponse as any;
        const priceId = sub.items?.data?.[0]?.price?.id;

        let tier: 'plus' | 'family_owner' = 'plus';
        if (priceId === process.env.STRIPE_PRICE_FAMILY_MONTHLY || priceId === process.env.STRIPE_PRICE_FAMILY_ANNUAL) {
          tier = 'family_owner';
        }

        const expiresAt = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 86400000).toISOString();

        await sql`UPDATE users SET subscription_tier = ${tier}, subscription_expires_at = ${expiresAt} WHERE id = ${userId}`;
        await sql`UPDATE hearts SET unlimited_until = ${expiresAt} WHERE user_id = ${userId}`;
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;

      if (userId) {
        await sql`UPDATE users SET subscription_tier = 'free', subscription_expires_at = NULL WHERE id = ${userId}`;
        await sql`UPDATE hearts SET unlimited_until = NULL WHERE user_id = ${userId}`;
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
