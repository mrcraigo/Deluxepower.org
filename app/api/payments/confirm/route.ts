import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBookingStatus } from '@/lib/bookings';
import { stripe } from '@/lib/stripe';

// Called after Stripe payment succeeds (via webhook or client confirmation)
export async function POST(req: NextRequest) {
  try {
    const { bookingId, paymentIntentId } = await req.json();
    if (!bookingId) return NextResponse.json({ error: 'bookingId required' }, { status: 400 });

    const booking = await getBookingById(bookingId);
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Verify payment succeeded with Stripe
    if (paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== 'succeeded') {
        return NextResponse.json({ error: 'Payment not confirmed' }, { status: 400 });
      }
    }

    const updated = await updateBookingStatus(booking.id, 'confirmed', 'Payment received');
    return NextResponse.json({ booking: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
