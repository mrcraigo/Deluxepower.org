import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBookingPayment, updateBookingStatus } from '@/lib/bookings';
import { stripe, formatAmountForStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();
    if (!bookingId) return NextResponse.json({ error: 'bookingId required' }, { status: 400 });

    const booking = await getBookingById(bookingId);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Create or retrieve Stripe customer
    let stripeCustomerId = booking.stripe_customer_id ?? undefined;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: booking.customer_email,
        name: booking.customer_name,
        phone: booking.customer_phone,
        metadata: { bookingId: booking.id },
      });
      stripeCustomerId = customer.id;
    }

    // Create a single PaymentIntent for the full amount.
    // The escrow model is enforced at the application layer:
    // funds are only released when admin marks job complete + customer approves.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(booking.quote_total),
      currency: 'aud',
      customer: stripeCustomerId,
      description: `DeluxePower - ${booking.service_name} - ${booking.id}`,
      metadata: {
        bookingId: booking.id,
        serviceId: booking.service_id,
        customerName: booking.customer_name,
        materialsDeposit: booking.materials_deposit.toString(),
        labourBalance: booking.labour_balance.toString(),
        jobDate: booking.scheduled_date,
        suburb: booking.suburb,
      },
      receipt_email: booking.customer_email,
      statement_descriptor_suffix: 'DELUXEPOWER',
    });

    await updateBookingPayment(booking.id, paymentIntent.id, stripeCustomerId);
    await updateBookingStatus(booking.id, 'pending_payment');

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('create-intent error:', err);
    return NextResponse.json({ error: 'Payment initialisation failed' }, { status: 500 });
  }
}
