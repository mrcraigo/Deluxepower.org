import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
});

export function formatAmountForStripe(amountAud: number): number {
  return Math.round(amountAud * 100);
}

export function formatAmountFromStripe(amountCents: number): number {
  return amountCents / 100;
}
