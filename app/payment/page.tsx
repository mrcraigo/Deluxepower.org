'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, CreditCard, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import type { Booking } from '@/lib/bookings';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1E293B',
      fontFamily: '"Inter", system-ui, sans-serif',
      '::placeholder': { color: '#94A3B8' },
    },
    invalid: { color: '#DC2626' },
  },
};

function CheckoutForm({ booking }: { booking: Booking }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent on mount
    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setError('Could not initialise payment. Please try again.');
      })
      .catch(() => setError('Could not initialise payment. Please try again.'));
  }, [booking.id]);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    setError('');

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: booking.customerName,
          email: booking.customerEmail,
          phone: booking.customerPhone,
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed. Please try again.');
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      router.push(`/confirmation?booking=${booking.id}`);
    } else {
      setError('Payment did not complete. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-5">
      {!clientSecret ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Card Details
            </label>
            <div className="rounded-lg border border-slate-300 bg-white px-4 py-3.5 focus-within:border-navy-500 focus-within:ring-1 focus-within:ring-navy-500">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Secured by Stripe — your card details are never stored on our servers.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="btn-primary w-full py-4 text-base disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock className="h-4 w-4" />
                Pay {formatCurrency(booking.quoteTotal)} Securely
              </span>
            )}
          </button>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <Shield className="h-3.5 w-3.5" />
            <span>256-bit SSL encryption</span>
            <span>·</span>
            <span>PCI DSS Compliant</span>
            <span>·</span>
            <CreditCard className="h-3.5 w-3.5" />
            <span>Visa / Mastercard / AMEX</span>
          </div>
        </>
      )}
    </form>
  );
}

function PaymentContent() {
  const params = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bookingId = params.get('booking');

  useEffect(() => {
    if (!bookingId) { setError('No booking found.'); setLoading(false); return; }
    fetch(`/api/bookings?id=${bookingId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.booking) setBooking(data.booking);
        else setError('Booking not found.');
        setLoading(false);
      })
      .catch(() => { setError('Could not load booking.'); setLoading(false); });
  }, [bookingId]);

  if (loading) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
    </div>
  );

  if (error || !booking) return (
    <div className="py-20 text-center text-slate-500">{error || 'Booking not found.'}</div>
  );

  return (
    <div className="py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <a href="/book" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to booking
          </a>
        </div>
        <h1 className="section-heading">Secure Payment</h1>
        <p className="mt-2 text-slate-500">
          Your materials deposit is charged now. The labour balance is held in escrow until you approve the completed work.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Order summary */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="font-semibold text-navy-900 mb-4">Booking Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference</span>
                  <span className="font-mono font-medium text-slate-800">{booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service</span>
                  <span className="text-right font-medium text-slate-800">{booking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="text-slate-800">{formatDate(booking.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time</span>
                  <span className="text-slate-800">{formatTime(booking.timeSlot)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address</span>
                  <span className="text-right text-slate-800">{booking.address}, {booking.suburb}</span>
                </div>
              </div>
            </div>

            <div className="card border border-electric-500/20 bg-electric-500/5">
              <h2 className="font-semibold text-navy-900 mb-3">Payment Breakdown</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between rounded-lg bg-amber-50 px-3 py-2.5">
                  <div>
                    <div className="font-medium text-amber-900">Materials Deposit</div>
                    <div className="text-xs text-amber-700">Charged today</div>
                  </div>
                  <span className="font-bold text-amber-900">{formatCurrency(booking.materialsDeposit)}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-blue-50 px-3 py-2.5">
                  <div>
                    <div className="font-medium text-blue-900 flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" /> Labour Balance
                    </div>
                    <div className="text-xs text-blue-700">Held in escrow — released on your approval</div>
                  </div>
                  <span className="font-bold text-blue-900">{formatCurrency(booking.labourBalance)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-800">
                  <span>Total charged today</span>
                  <span>{formatCurrency(booking.quoteTotal)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-green-50 p-4 text-sm">
              <h3 className="font-semibold text-green-800 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="h-4 w-4" /> Your money is protected
              </h3>
              <ul className="space-y-1 text-green-700">
                <li>• Labour funds held until you approve the completed work</li>
                <li>• 7-day dispute window after job completion</li>
                <li>• Full refund if job is not completed</li>
              </ul>
            </div>
          </div>

          {/* Payment form */}
          <div>
            <div className="card">
              <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-electric-500" />
                Pay by Card
              </h2>
              <Elements stripe={stripePromise}>
                <CheckoutForm booking={booking} />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
