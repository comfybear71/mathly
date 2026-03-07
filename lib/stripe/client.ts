import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover' as Stripe.LatestApiVersion,
    });
  }
  return stripe;
}

export const PLANS = {
  plus_monthly: {
    name: 'Mathly Plus Monthly',
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_PLUS_MONTHLY,
    interval: 'month' as const,
  },
  plus_annual: {
    name: 'Mathly Plus Annual',
    price: 79.99,
    priceId: process.env.STRIPE_PRICE_PLUS_ANNUAL,
    interval: 'year' as const,
  },
  family_monthly: {
    name: 'Family Plan Monthly',
    price: 14.99,
    priceId: process.env.STRIPE_PRICE_FAMILY_MONTHLY,
    interval: 'month' as const,
  },
  family_annual: {
    name: 'Family Plan Annual',
    price: 119.99,
    priceId: process.env.STRIPE_PRICE_FAMILY_ANNUAL,
    interval: 'year' as const,
  },
};
