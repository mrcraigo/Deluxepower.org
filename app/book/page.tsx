'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowLeft, MapPin, User, Phone, Mail, FileText, CheckCircle2, Info } from 'lucide-react';
import BookingCalendar from '@/components/BookingCalendar';
import { SERVICES, ACT_SUBURBS, type Service } from '@/lib/data';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [estimate, setEstimate] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    suburb: '',
    notes: '',
  });

  useEffect(() => {
    const serviceId = params.get('service');
    if (serviceId) {
      const svc = SERVICES.find((s) => s.id === serviceId);
      if (svc) setSelectedService(svc);
    }
  }, [params]);

  useEffect(() => {
    if (selectedService) {
      const mid = selectedService.priceMax
        ? (selectedService.priceMin + selectedService.priceMax) / 2
        : selectedService.priceMin * (selectedService.duration || 2);
      setEstimate(Math.round(mid));
    }
  }, [selectedService]);

  const materialsDeposit = selectedService
    ? Math.round(estimate * selectedService.materialsDepositPct)
    : 0;
  const labourBalance = estimate - materialsDeposit;

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function canProceedStep1() {
    return selectedService && selectedDate && selectedTime;
  }
  function canProceedStep2() {
    return form.name && form.email && form.phone && form.address && form.suburb;
  }

  async function handleSubmit() {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          address: form.address,
          suburb: form.suburb,
          date: selectedDate,
          timeSlot: selectedTime,
          notes: form.notes,
          quoteTotal: estimate,
          materialsDeposit,
          labourBalance,
        }),
      });
      if (!res.ok) throw new Error('Booking failed');
      const { bookingId } = await res.json();
      router.push(`/payment?booking=${bookingId}`);
    } catch {
      setError('Something went wrong. Please try again or call us.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="section-heading">Book a Job</h1>
        <p className="mt-2 text-slate-500">Select your service, choose a time, and pay securely online.</p>

        {/* Steps indicator */}
        <div className="mt-8 flex items-center gap-2">
          {[
            { n: 1, label: 'Service & Time' },
            { n: 2, label: 'Your Details' },
            { n: 3, label: 'Review & Pay' },
          ].map((s, i, arr) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
                step > s.n ? 'bg-green-500 text-white' :
                step === s.n ? 'bg-navy-900 text-white' :
                'bg-slate-200 text-slate-500'
              }`}>
                {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
              </div>
              <span className={`hidden text-sm sm:block ${step === s.n ? 'font-semibold text-navy-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
              {i < arr.length - 1 && <div className="mx-1 h-px w-8 bg-slate-200" />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Main panel */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Service & Time */}
            {step === 1 && (
              <>
                {/* Service selector */}
                <div className="card">
                  <h2 className="font-semibold text-navy-900 mb-4">1. Select a Service</h2>
                  <select
                    value={selectedService?.id ?? ''}
                    onChange={(e) => {
                      const svc = SERVICES.find((s) => s.id === e.target.value);
                      setSelectedService(svc ?? null);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                  >
                    <option value="">— Choose a service —</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.priceType === 'hourly' ? `$${s.priceMin}/hr` : `$${s.priceMin}${s.priceMax ? `–$${s.priceMax}` : ''}`}
                      </option>
                    ))}
                  </select>
                  {selectedService && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                      {selectedService.description}
                    </div>
                  )}
                </div>

                {/* Calendar */}
                <div>
                  <h2 className="font-semibold text-navy-900 mb-4">2. Pick a Date &amp; Time</h2>
                  <BookingCalendar
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateSelect={setSelectedDate}
                    onTimeSelect={setSelectedTime}
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1()}
                  className="btn-primary w-full py-3 disabled:opacity-50"
                >
                  Continue to Details <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Step 2: Customer Details */}
            {step === 2 && (
              <>
                <div className="card space-y-4">
                  <h2 className="font-semibold text-navy-900">Your Details</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        <User className="mr-1 inline h-3.5 w-3.5" />Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleField}
                        placeholder="Jane Smith"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        <Phone className="mr-1 inline h-3.5 w-3.5" />Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleField}
                        placeholder="04XX XXX XXX"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      <Mail className="mr-1 inline h-3.5 w-3.5" />Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleField}
                      placeholder="jane@example.com"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      <MapPin className="mr-1 inline h-3.5 w-3.5" />Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleField}
                      placeholder="12 Example St"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Suburb *</label>
                    <select
                      name="suburb"
                      value={form.suburb}
                      onChange={handleField}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                    >
                      <option value="">— Select suburb —</option>
                      {ACT_SUBURBS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      <FileText className="mr-1 inline h-3.5 w-3.5" />Job Notes (optional)
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleField}
                      rows={3}
                      placeholder="Any details about the job, access instructions, or questions..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2()}
                    className="btn-primary flex-1 py-3 disabled:opacity-50"
                  >
                    Review Booking <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <>
                <div className="card space-y-4">
                  <h2 className="font-semibold text-navy-900">Review Your Booking</h2>

                  <div className="space-y-3 divide-y divide-slate-100">
                    {[
                      { label: 'Service', value: selectedService?.name ?? '' },
                      { label: 'Date', value: selectedDate ? formatDate(selectedDate) : '' },
                      { label: 'Time', value: selectedTime ? formatTime(selectedTime) : '' },
                      { label: 'Address', value: `${form.address}, ${form.suburb}, ACT` },
                      { label: 'Contact', value: `${form.name} · ${form.phone} · ${form.email}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between pt-3 text-sm first:pt-0">
                        <span className="font-medium text-slate-500">{label}</span>
                        <span className="text-right text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment breakdown */}
                <div className="card border-2 border-electric-500/20">
                  <h3 className="font-semibold text-navy-900 mb-3">Payment Breakdown</h3>
                  <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 flex items-start gap-2 mb-4">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                    Quote is indicative — your fixed price will be confirmed before work starts.
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Indicative quote total</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(estimate)}</span>
                    </div>
                    <div className="flex justify-between rounded-lg bg-amber-50 px-3 py-2 text-sm">
                      <span className="text-amber-800">Materials deposit (charged now)</span>
                      <span className="font-bold text-amber-900">{formatCurrency(materialsDeposit)}</span>
                    </div>
                    <div className="flex justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm">
                      <span className="text-blue-800">🔒 Labour balance (held in escrow)</span>
                      <span className="font-bold text-blue-900">{formatCurrency(labourBalance)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-semibold">
                      <span>Total charged at payment</span>
                      <span>{formatCurrency(estimate)}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline flex-1 py-3">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex-1 py-3 disabled:opacity-50"
                  >
                    {loading ? 'Creating booking...' : 'Proceed to Payment'} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar summary */}
          <div className="space-y-4">
            {selectedService && (
              <div className="card sticky top-24">
                <h3 className="font-semibold text-navy-900 mb-3">Booking Summary</h3>
                <div className="space-y-2.5 text-sm">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Service</div>
                    <div className="mt-1 font-medium text-slate-800">{selectedService.name}</div>
                  </div>
                  {selectedDate && (
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Date</div>
                      <div className="mt-1 text-slate-800">{formatDate(selectedDate)}</div>
                    </div>
                  )}
                  {selectedTime && (
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Time</div>
                      <div className="mt-1 text-slate-800">{formatTime(selectedTime)}</div>
                    </div>
                  )}
                  {estimate > 0 && (
                    <>
                      <div className="border-t border-slate-100 pt-2.5">
                        <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Indicative Quote</div>
                        <div className="mt-1 text-xl font-bold text-navy-900">{formatCurrency(estimate)}</div>
                      </div>
                      {materialsDeposit > 0 && (
                        <div className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
                          <strong>Deposit due now:</strong> {formatCurrency(materialsDeposit)}<br />
                          <strong>Escrow held:</strong> {formatCurrency(labourBalance)}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />Licensed ACT Electrician</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />Certificate of Compliance included</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />Secure escrow payment</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
