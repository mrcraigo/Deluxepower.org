/**
 * Bookings data layer — backed by Supabase (PostgreSQL).
 *
 * All functions use the service-role admin client so they can run from
 * Next.js API routes without being blocked by Row Level Security.
 */

import { getAdminClient } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'in_progress'
  | 'awaiting_approval'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface StatusHistoryEntry {
  status: BookingStatus;
  note?: string;
  changed_at: string;
}

export interface Booking {
  id: string;
  booking_ref: string;
  client_id?: string | null;
  service_id: string;
  service_name: string;
  customer_name: string;   // kept on booking row for quick display
  customer_email: string;
  customer_phone?: string;
  street_address: string;
  suburb: string;
  scheduled_date: string;   // YYYY-MM-DD
  scheduled_time: string;   // HH:MM
  notes?: string;
  quote_total: number;
  materials_deposit: number;
  labour_balance: number;
  status: BookingStatus;
  stripe_payment_intent_id?: string | null;
  stripe_customer_id?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  status_history?: StatusHistoryEntry[];
}

// The DB row shape (customer_* fields stored on bookings table for simplicity)
type BookingRow = {
  id: string;
  booking_ref: string;
  client_id: string | null;
  service_id: string;
  service_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  street_address: string;
  suburb: string;
  scheduled_date: string;
  scheduled_time: string;
  notes: string | null;
  quote_total: number;
  materials_deposit: number;
  labour_balance: number;
  status: BookingStatus;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToBooking(row: BookingRow, history: StatusHistoryEntry[] = []): Booking {
  return {
    id: row.id,
    booking_ref: row.booking_ref,
    client_id: row.client_id,
    service_id: row.service_id,
    service_name: row.service_name,
    customer_name: row.customer_name,
    customer_email: row.customer_email,
    customer_phone: row.customer_phone ?? undefined,
    street_address: row.street_address,
    suburb: row.suburb,
    scheduled_date: row.scheduled_date,
    scheduled_time: row.scheduled_time,
    notes: row.notes ?? undefined,
    quote_total: Number(row.quote_total),
    materials_deposit: Number(row.materials_deposit),
    labour_balance: Number(row.labour_balance),
    status: row.status,
    stripe_payment_intent_id: row.stripe_payment_intent_id,
    stripe_customer_id: row.stripe_customer_id,
    completed_at: row.completed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    status_history: history,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getAllBookings(): Promise<Booking[]> {
  const db = getAdminClient();
  const { data, error } = await db
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as BookingRow[]).map((r) => rowToBooking(r));
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const db = getAdminClient();

  const [{ data: row, error: rowErr }, { data: history, error: histErr }] = await Promise.all([
    db.from('bookings').select('*').eq('id', id).single(),
    db
      .from('booking_status_history')
      .select('status, note, changed_at')
      .eq('booking_id', id)
      .order('changed_at', { ascending: true }),
  ]);

  if (rowErr || !row) return null;
  if (histErr) throw new Error(histErr.message);

  return rowToBooking(row as BookingRow, (history ?? []) as StatusHistoryEntry[]);
}

export async function createBooking(input: {
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  suburb: string;
  date: string;
  timeSlot: string;
  notes?: string;
  quoteTotal: number;
  materialsDeposit: number;
  labourBalance: number;
}): Promise<Booking> {
  const db = getAdminClient();

  // Upsert client record
  let clientId: string | null = null;
  if (input.customerEmail) {
    const { data: existingClient } = await db
      .from('clients')
      .select('id')
      .eq('email', input.customerEmail)
      .single();

    if (existingClient) {
      clientId = existingClient.id;
      // Update name/phone if we have newer info
      await db
        .from('clients')
        .update({ name: input.customerName, phone: input.customerPhone ?? null })
        .eq('id', clientId);
    } else {
      const { data: newClient, error: clientErr } = await db
        .from('clients')
        .insert({
          name: input.customerName,
          email: input.customerEmail,
          phone: input.customerPhone ?? null,
          street_address: input.address,
          suburb: input.suburb,
        })
        .select('id')
        .single();

      if (clientErr) throw new Error(clientErr.message);
      clientId = newClient!.id;
    }
  }

  const { data, error } = await db
    .from('bookings')
    .insert({
      client_id: clientId,
      service_id: input.serviceId,
      service_name: input.serviceName,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone ?? null,
      street_address: input.address,
      suburb: input.suburb,
      scheduled_date: input.date,
      scheduled_time: input.timeSlot,
      notes: input.notes ?? null,
      quote_total: input.quoteTotal,
      materials_deposit: input.materialsDeposit,
      labour_balance: input.labourBalance,
      status: 'pending_payment' as BookingStatus,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  // Write initial status history entry
  await db.from('booking_status_history').insert({
    booking_id: data.id,
    status: 'pending_payment',
    note: 'Booking created, awaiting payment',
  });

  return rowToBooking(data as BookingRow, [
    { status: 'pending_payment', note: 'Booking created, awaiting payment', changed_at: data.created_at },
  ]);
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  note?: string,
): Promise<Booking | null> {
  const db = getAdminClient();

  const updateData = status === 'completed'
    ? { status, completed_at: new Date().toISOString() }
    : { status };

  const { error: updateErr } = await db.from('bookings').update(updateData).eq('id', id);
  if (updateErr) throw new Error(updateErr.message);

  await db.from('booking_status_history').insert({ booking_id: id, status, note: note ?? null });

  return getBookingById(id);
}

export async function updateBookingPayment(
  id: string,
  stripePaymentIntentId: string,
  stripeCustomerId?: string,
): Promise<void> {
  const db = getAdminClient();
  const { error } = await db
    .from('bookings')
    .update({
      stripe_payment_intent_id: stripePaymentIntentId,
      stripe_customer_id: stripeCustomerId ?? null,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ─── Availability ─────────────────────────────────────────────────────────────

const WEEKDAY_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
const SATURDAY_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00'];

export async function getBookedSlots(date: string): Promise<string[]> {
  const db = getAdminClient();
  const { data, error } = await db
    .from('bookings')
    .select('scheduled_time')
    .eq('scheduled_date', date)
    .not('status', 'in', '("cancelled","pending_payment")');

  if (error) throw new Error(error.message);
  return (data ?? []).map((r: { scheduled_time: string }) => r.scheduled_time);
}

export async function getAvailableSlots(date: string): Promise<string[]> {
  const d = new Date(date + 'T00:00:00');
  const dow = d.getDay(); // 0=Sun, 6=Sat
  if (dow === 0) return [];

  const allSlots = dow === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
  const booked = await getBookedSlots(date);
  return allSlots.filter((s) => !booked.includes(s));
}
