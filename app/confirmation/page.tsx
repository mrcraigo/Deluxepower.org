'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Calendar, Phone, Mail, MapPin, Clock, Lock, ArrowRight } from 'lucide-react';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import type { Booking } from '@/lib/bookings';
import { BUSINESS_INFO } from '@/lib/data';

function ConfirmationContent() {
  const params = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const bookingId = params.get('booking');

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/bookings?id=${bookingId}`)
      .then((r) => r.json())
      .then((data) => { if (data.booking) setBooking(data.booking); });
  }, [bookingId]);

  if (!booking) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-navy-900">Booking Confirmed!</h1>
        <p className="mt-2 text-slate-500">
          Thanks {booking.customer_name.split(' ')[0]}! Your booking is confirmed and payment received. We&apos;ll see you soon.
        </p>

        <div className="mt-8 card text-left">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-navy-900">Booking Details</h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Confirmed
            </span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-slate-400 text-xs mt-0.5">REF</span>
              <span className="font-mono font-semibold text-navy-900">{booking.booking_ref ?? booking.id}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="h-4 w-4 text-electric-500 shrink-0" />
              {formatDate(booking.scheduled_date)} at {formatTime(booking.scheduled_time)}
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="h-4 w-4 text-electric-500 shrink-0" />
              {booking.street_address}, {booking.suburb}, ACT
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="h-4 w-4 text-electric-500 shrink-0" />
              Confirmation sent to {booking.customer_email}
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Materials deposit paid</span>
                <span className="font-semibold text-slate-800">{formatCurrency(booking.materials_deposit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Labour balance (escrow)</span>
                <span className="font-semibold text-slate-800">{formatCurrency(booking.labour_balance)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                <span>Total paid</span>
                <span>{formatCurrency(booking.quote_total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="mt-6 card text-left">
          <h2 className="font-semibold text-navy-900 mb-3">What Happens Next</h2>
          <ol className="space-y-3">
            {[
              { icon: Mail, text: 'You\'ll receive a confirmation email with all booking details.' },
              { icon: Phone, text: `We'll call you at ${booking.customer_phone} to confirm any specific requirements.` },
              { icon: Clock, text: `Your electrician will arrive on ${formatDate(booking.scheduled_date)} at ${formatTime(booking.scheduled_time)}.` },
              { icon: CheckCircle2, text: 'After the job is done, you\'ll receive an email to approve the work and release payment.' },
            ].map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white text-xs font-bold">
                  {i + 1}
                </div>
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-electric-500" />
                  {text}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={`tel:${BUSINESS_INFO.phone}`} className="btn-outline px-8 py-3">
            <Phone className="h-4 w-4" /> {BUSINESS_INFO.phone}
          </a>
          <Link href="/" className="btn-primary px-8 py-3">
            Back to Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
