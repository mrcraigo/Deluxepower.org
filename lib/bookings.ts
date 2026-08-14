import fs from 'fs';
import path from 'path';

export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'in_progress'
  | 'awaiting_approval'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  suburb: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "08:00"
  notes: string;
  quoteTotal: number;
  materialsDeposit: number;
  labourBalance: number;
  status: BookingStatus;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: { status: BookingStatus; at: string; note?: string }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(BOOKINGS_FILE)) fs.writeFileSync(BOOKINGS_FILE, '[]', 'utf-8');
}

export function getAllBookings(): Booking[] {
  ensureDataDir();
  const raw = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
  return JSON.parse(raw) as Booking[];
}

export function getBookingById(id: string): Booking | null {
  const bookings = getAllBookings();
  return bookings.find((b) => b.id === id) ?? null;
}

export function getBookingsByDate(date: string): Booking[] {
  return getAllBookings().filter((b) => b.date === date && b.status !== 'cancelled');
}

export function createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Booking {
  ensureDataDir();
  const bookings = getAllBookings();
  const now = new Date().toISOString();
  const booking: Booking = {
    ...data,
    id: `BK-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    createdAt: now,
    updatedAt: now,
    statusHistory: [{ status: data.status, at: now }],
  };
  bookings.push(booking);
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  return booking;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  stripePaymentIntentId?: string,
  note?: string,
): Booking | null {
  ensureDataDir();
  const bookings = getAllBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  bookings[idx] = {
    ...bookings[idx],
    status,
    updatedAt: now,
    ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}),
    statusHistory: [...bookings[idx].statusHistory, { status, at: now, note }],
  };
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  return bookings[idx];
}

export function updateBookingPayment(
  id: string,
  stripePaymentIntentId: string,
  stripeCustomerId: string,
): Booking | null {
  ensureDataDir();
  const bookings = getAllBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = {
    ...bookings[idx],
    stripePaymentIntentId,
    stripeCustomerId,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  return bookings[idx];
}

// Returns booked time slots for a given date (YYYY-MM-DD)
export function getBookedSlots(date: string): string[] {
  return getBookingsByDate(date).map((b) => b.timeSlot);
}

// Business hours slots (Mon–Fri 07:00–17:00, Sat 08:00–13:00)
export function getAvailableSlots(dateStr: string): string[] {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay(); // 0=Sun, 6=Sat
  if (day === 0) return []; // Sunday closed

  const allSlots =
    day === 6
      ? ['08:00', '09:00', '10:00', '11:00', '12:00']
      : ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];

  const booked = getBookedSlots(dateStr);
  return allSlots.filter((slot) => !booked.includes(slot));
}
