'use client';

import { useState, useEffect } from 'react';
import {
  Lock, Calendar, Clock, MapPin, Phone, Mail, DollarSign,
  CheckCircle2, PlayCircle, ThumbsUp, AlertCircle, XCircle,
  RefreshCw, ChevronDown, ChevronUp, Zap,
} from 'lucide-react';
import { formatDate, formatTime, formatCurrency, statusLabel, statusColor } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/lib/bookings';

const PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? '1234';

const STATUS_TRANSITIONS: Partial<Record<BookingStatus, { to: BookingStatus; label: string; icon: React.ElementType; color: string }[]>> = {
  confirmed: [
    { to: 'in_progress', label: 'Mark In Progress', icon: PlayCircle, color: 'bg-indigo-600 text-white' },
    { to: 'cancelled', label: 'Cancel', icon: XCircle, color: 'bg-red-100 text-red-700' },
  ],
  in_progress: [
    { to: 'awaiting_approval', label: 'Mark Job Complete (Request Approval)', icon: ThumbsUp, color: 'bg-orange-500 text-white' },
  ],
  awaiting_approval: [
    { to: 'completed', label: 'Release Payment (Customer Approved)', icon: DollarSign, color: 'bg-green-600 text-white' },
    { to: 'disputed', label: 'Mark as Disputed', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  ],
  disputed: [
    { to: 'completed', label: 'Resolve — Release Payment', icon: CheckCircle2, color: 'bg-green-600 text-white' },
    { to: 'cancelled', label: 'Cancel & Refund', icon: XCircle, color: 'bg-red-100 text-red-700' },
  ],
};

function BookingCard({ booking, onStatusChange }: { booking: Booking; onStatusChange: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const transitions = STATUS_TRANSITIONS[booking.status] ?? [];

  async function changeStatus(to: BookingStatus) {
    setLoading(true);
    await fetch('/api/bookings/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: booking.id, status: to, note }),
    });
    setLoading(false);
    setNote('');
    onStatusChange();
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
      <div
        className="flex cursor-pointer items-center justify-between px-5 py-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">{booking.id}</span>
              <span className={`badge ${statusColor(booking.status)}`}>{statusLabel(booking.status)}</span>
            </div>
            <div className="mt-0.5 font-semibold text-navy-900">{booking.serviceName}</div>
            <div className="text-sm text-slate-500">{booking.customerName} · {booking.suburb}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-navy-900">{formatCurrency(booking.quoteTotal)}</div>
            <div className="text-xs text-slate-400">{formatDate(booking.date)}</div>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4 text-electric-500" />
                {formatDate(booking.date)} at {formatTime(booking.timeSlot)}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-electric-500" />
                {booking.address}, {booking.suburb}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-4 w-4 text-electric-500" />
                {booking.customerPhone}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4 text-electric-500" />
                {booking.customerEmail}
              </div>
              {booking.notes && (
                <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 italic">
                  {booking.notes}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="rounded-lg bg-slate-50 p-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Materials deposit</span>
                  <span className="font-medium text-amber-700">{formatCurrency(booking.materialsDeposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Labour (escrow)</span>
                  <span className="font-medium text-blue-700">{formatCurrency(booking.labourBalance)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-slate-200 pt-1.5">
                  <span>Total</span>
                  <span>{formatCurrency(booking.quoteTotal)}</span>
                </div>
              </div>
              {booking.stripePaymentIntentId && (
                <div className="text-xs text-slate-400">
                  Stripe PI: <span className="font-mono">{booking.stripePaymentIntentId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status history */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Status History</h4>
            <div className="space-y-1">
              {booking.statusHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3 shrink-0 text-slate-300" />
                  <span className="font-medium">{statusLabel(h.status)}</span>
                  <span className="text-slate-300">—</span>
                  <span>{new Date(h.at).toLocaleString('en-AU')}</span>
                  {h.note && <span className="italic">({h.note})</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {transitions.length > 0 && (
            <div className="space-y-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note for status change..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-navy-400 focus:outline-none"
              />
              <div className="flex flex-wrap gap-2">
                {transitions.map((t) => (
                  <button
                    key={t.to}
                    onClick={() => changeStatus(t.to)}
                    disabled={loading}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${t.color} disabled:opacity-60`}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pin === PIN) {
      setAuthed(true);
      loadBookings();
    } else {
      setPinError('Incorrect PIN');
    }
  }

  function loadBookings() {
    setLoading(true);
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => { setBookings(data.bookings ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const counts: Record<string, number> = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!authed) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900">
                <Zap className="h-7 w-7 text-electric-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Enter your PIN to continue</p>
          </div>
          <form onSubmit={handleLogin} className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Lock className="mr-1 inline h-3.5 w-3.5" />Admin PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setPinError(''); }}
                placeholder="••••"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-center text-2xl tracking-widest focus:border-navy-500 focus:outline-none"
                maxLength={8}
                autoFocus
              />
              {pinError && <p className="mt-1 text-sm text-red-600">{pinError}</p>}
            </div>
            <button type="submit" className="btn-primary w-full py-3">
              <Lock className="h-4 w-4" /> Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Job Dashboard</h1>
            <p className="text-sm text-slate-500">{bookings.length} total bookings</p>
          </div>
          <button
            onClick={loadBookings}
            disabled={loading}
            className="btn-outline gap-1.5 text-sm py-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
          {[
            { label: 'Pending Payment', status: 'pending_payment', color: 'bg-yellow-50 text-yellow-800' },
            { label: 'Confirmed', status: 'confirmed', color: 'bg-blue-50 text-blue-800' },
            { label: 'In Progress', status: 'in_progress', color: 'bg-indigo-50 text-indigo-800' },
            { label: 'Awaiting Approval', status: 'awaiting_approval', color: 'bg-orange-50 text-orange-800' },
          ].map((s) => (
            <div key={s.status} className={`rounded-xl ${s.color} p-3 text-center`}>
              <div className="text-2xl font-bold">{counts[s.status] ?? 0}</div>
              <div className="text-xs font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {([
            ['all', 'All'],
            ['pending_payment', 'Awaiting Payment'],
            ['confirmed', 'Confirmed'],
            ['in_progress', 'In Progress'],
            ['awaiting_approval', 'Awaiting Approval'],
            ['completed', 'Completed'],
            ['disputed', 'Disputed'],
            ['cancelled', 'Cancelled'],
          ] as [BookingStatus | 'all', string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filter === val ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {label} {val !== 'all' && counts[val] ? `(${counts[val]})` : ''}
            </button>
          ))}
        </div>

        {/* Booking list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-400">
            No bookings to show.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((b) => (
                <BookingCard key={b.id} booking={b} onStatusChange={loadBookings} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
