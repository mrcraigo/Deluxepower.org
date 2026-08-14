import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/bookings';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }
  const slots = getAvailableSlots(date);
  return NextResponse.json({ date, slots });
}
