import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBookingPayment, updateBookingStatus } from '@/lib/bookings';
import { stripe, formatAmountForStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();
    if (!bookingId) return NextResponse.json({ error: 'bookingId required' }, { status: 400 });

    const booking = getBookingById(bookingId);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Create or retrieve Stripe customer
    let stripeCustomerId = booking.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: booking.customerEmail,
        name: booking.customerName,
        phone: booking.customerPhone,
        metadata: { bookingId: booking.id },
      });
      stripeCustomerId = customer.id;
    }

    // Create a single PaymentIntent for the full amount
    // The escrow model is enforced at the application layer:
    // - We only pay out (release) when admin marks job complete + customer approves
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(booking.quoteTotal),
      currency: 'aud',
      customer: stripeCustomerId,
      description: `DeluxePower - ${booking.serviceName} - ${booking.id}`,
      metadata: {
        bookingId: booking.id,
        serviceId: booking.serviceId,
        customerName: booking.customerName,
        materialsDeposit: booking.materialsDeposit.toString(),
        labourBalance: booking.labourBalance.toString(),
        jobDate: booking.date,
        suburb: booking.suburb,
      },
      receipt_email: booking.customerEmail,
      statement_descriptor_suffix: 'DELUXEPOWER',
    });

    updateBookingPayment(booking.id, paymentIntent.id, stripeCustomerId);
    updateBookingStatus(booking.id, 'pending_payment', paymentIntent.id);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('create-intent error:', err);
    return NextResponse.json({ error: 'Payment initialisation failed' }, { status: 500 });
  }
}
