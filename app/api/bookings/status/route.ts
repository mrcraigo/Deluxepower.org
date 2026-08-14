import { NextRequest, NextResponse } from 'next/server';
import { updateBookingStatus, type BookingStatus } from '@/lib/bookings';

export async function PUT(req: NextRequest) {
  try {
    const { id, status, note } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    }
    const booking = await updateBookingStatus(id, status as BookingStatus, note);
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // If releasing payment (status = completed), trigger Stripe capture
    if (status === 'completed' && booking.stripe_payment_intent_id) {
      try {
        const { stripe } = await import('@/lib/stripe');
        const pi = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id);
        if (pi.status === 'requires_capture') {
          await stripe.paymentIntents.capture(booking.stripe_payment_intent_id);
        }
      } catch (stripeErr) {
        console.warn('Stripe capture skipped (already captured or manual):', stripeErr);
      }
    }

    return NextResponse.json({ booking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
