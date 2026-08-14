import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, getBookingById, createBooking } from '@/lib/bookings';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const booking = await getBookingById(id);
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ booking });
  }
  const bookings = await getAllBookings();
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceId, serviceName, customerName, customerEmail, customerPhone,
      address, suburb, date, timeSlot, notes,
      quoteTotal, materialsDeposit, labourBalance,
    } = body;

    if (!serviceId || !customerName || !customerEmail || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await createBooking({
      serviceId,
      serviceName,
      customerName,
      customerEmail,
      customerPhone,
      address,
      suburb,
      date,
      timeSlot,
      notes: notes ?? '',
      quoteTotal,
      materialsDeposit,
      labourBalance,
    });

    return NextResponse.json({ bookingId: booking.id, booking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
